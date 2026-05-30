// src/app/api/verify-payment/route.ts
// Ethio Machinery Link (EML) — Manual Bank Payment Reference Verification Handler
// Accepts offline payment inputs (CBE transfer, Telebirr), logs to public.transactions,
// updates escrow flags on public.deals, and writes audit payloads to public.eml_events.

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Admin Supabase Client — Service Role (bypasses RLS for server-side writes)
// ---------------------------------------------------------------------------
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Request Body Type
// ---------------------------------------------------------------------------
interface VerifyPaymentRequestBody {
  deal_id: string;           // UUID of the deal being funded
  amount: number;            // Transferred amount in ETB
  payment_method: 'cbe_transfer' | 'telebirr' | 'other';
  payment_reference: string; // Bank receipt / Telebirr reference code
  verified_by: string;       // UUID of the actor (admin or counterparty) submitting verification
}

// ---------------------------------------------------------------------------
// POST /api/verify-payment
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // --- 1. Parse & Validate Request Body -----------------------------------
    let body: VerifyPaymentRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed request body. Expected valid JSON.' },
        { status: 400 }
      );
    }

    const { deal_id, amount, payment_method, payment_reference, verified_by } = body;

    const missingFields: string[] = [];
    if (!deal_id)            missingFields.push('deal_id');
    if (!amount)             missingFields.push('amount');
    if (!payment_method)     missingFields.push('payment_method');
    if (!payment_reference)  missingFields.push('payment_reference');
    if (!verified_by)        missingFields.push('verified_by');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: must be a positive number (ETB).' },
        { status: 400 }
      );
    }

    const validMethods = ['cbe_transfer', 'telebirr', 'other'];
    if (!validMethods.includes(payment_method)) {
      return NextResponse.json(
        { error: `Invalid payment_method. Accepted values: ${validMethods.join(', ')}` },
        { status: 400 }
      );
    }

    // Sanitize reference number — strip whitespace, enforce minimum length
    const sanitizedReference = payment_reference.trim();
    if (sanitizedReference.length < 6) {
      return NextResponse.json(
        { error: 'payment_reference is too short. Minimum 6 characters required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // --- 2. Confirm Deal Exists & Is Not Already Verified -------------------
    const { data: deal, error: dealFetchError } = await supabaseAdmin
      .from('deals')
      .select('id, payment_verified')
      .eq('id', deal_id)
      .single();

    if (dealFetchError || !deal) {
      return NextResponse.json(
        {
          error: 'Deal not found. Verify the deal_id is correct.',
          details: dealFetchError?.message ?? null,
        },
        { status: 404 }
      );
    }

    if (deal.payment_verified === true) {
      return NextResponse.json(
        { error: 'Conflict: payment has already been verified for this deal.' },
        { status: 409 }
      );
    }

    // --- 3. Log Transaction to public.transactions --------------------------
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        deal_id,
        amount,
        payment_method,
        payment_reference:  sanitizedReference,
        verified_by,
        verified_at:        now,
        status:             'verified',
        created_at:         now,
      })
      .select('id')
      .single();

    if (transactionError || !transaction) {
      console.error('[verify-payment] transactions insert failed:', transactionError?.message);
      return NextResponse.json(
        {
          error: 'Failed to log transaction record.',
          details: transactionError?.message ?? 'No data returned from insert.',
        },
        { status: 500 }
      );
    }

    // --- 4. Update Escrow Flags on public.deals -----------------------------
    const { error: dealUpdateError } = await supabaseAdmin
      .from('deals')
      .update({
        payment_verified: true,
        updated_at:       now,
      })
      .eq('id', deal_id);

    if (dealUpdateError) {
      // Transaction is already written — log clearly for manual reconciliation.
      console.error(
        `[verify-payment] RECONCILIATION REQUIRED — transaction ${transaction.id} logged ` +
        `but deals update failed for deal ${deal_id}:`,
        dealUpdateError.message
      );
      return NextResponse.json(
        {
          error: 'Transaction logged but escrow status update failed. Manual reconciliation required.',
          transaction_id: transaction.id,
          details:        dealUpdateError.message,
        },
        { status: 500 }
      );
    }

    // --- 5. Write Audit Payload to public.eml_events ------------------------
    const { error: eventError } = await supabaseAdmin
      .from('eml_events')
      .insert({
        deal_id,
        event_name: 'PAYMENT_VERIFIED',
        actor_id:   verified_by,
        severity:   'INFO',
        payload: {
          transaction_id:   transaction.id,
          payment_reference: sanitizedReference,
          payment_method,
          amount,
          verified_at:      now,
        },
        created_at: now,
      });

    if (eventError) {
      // Non-fatal: core operations succeeded. Log for observability only.
      console.error(
        `[verify-payment] Non-fatal — eml_events audit write failed for deal ${deal_id}:`,
        eventError.message
      );
    }

    // --- 6. Success Response ------------------------------------------------
    return NextResponse.json(
      {
        success:        true,
        message:        'Payment verified successfully. Escrow status updated.',
        transaction_id: transaction.id,
        deal_id,
        verified_at:    now,
      },
      { status: 200 }
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    console.error('[verify-payment] Unhandled exception:', message);
    return NextResponse.json(
      { error: 'Internal server error.', details: message },
      { status: 500 }
    );
  }
}
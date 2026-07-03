import { logEvent } from "@/core/logEvent";
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { getSession } from '@/lib/auth/getSession';

/**
 * TM WALLET SECURITY SCHEMA
 */
const WalletActionSchema = z.object({
  action: z.enum(['DEPOSIT_PROOFS', 'WITHDRAW_REQUEST', 'ESCROW_PAYMENT']),
  amount: z.number().positive("Amount must be greater than zero"),
  currency: z.string().length(3).default('ETB'),
  reference: z.string().min(5, "Reference/Receipt ID is required"),
});

/**
 * GET /api/wallet
 * Fetches the user's current balance and full transaction ledger.
 */
export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);

    // 1. Get Balance
    const { data: wallet, error: wError } = await supabaseAdmin
      .from('wallets')
      .select('balance, currency, frozen_balance')
      .eq('user_id', session.userId)
      .single();

    if (wError) return errorResponse("Wallet not initialized", 404);

    // 2. Get Ledger (Last 20 transactions)
    const { data: ledger } = await supabaseAdmin
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return successResponse({
      balance: wallet.balance,
      frozen: wallet.frozen_balance,
      currency: wallet.currency,
      ledger: ledger || []
    });
  } catch (err) {
    return internalError(err, 'GET /api/wallet');
  }
}

/**
 * POST /api/wallet
 * Handles secure ledger entries.
 */
export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    const body = await request.json();
    const val = WalletActionSchema.safeParse(body);

    if (!val.success) return errorResponse(val.error.errors[0].message, 400);
    const { action, amount, currency, reference } = val.data;

    // 3. SECURE TRANSACTION LOGIC
    // We use a "Pending" state for the ledger. 
    // Money is only added to the balance after Admin/AI verifies the reference.
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        user_id: session.userId,
        type: action,
        amount: amount,
        currency: currency,
        status: 'pending',
        reference_id: reference,
        metadata: { ip: request.ip, user_agent: request.headers.get('user-agent') }
      })
      .select()
      .single();

    if (txError) return errorResponse("Ledger entry failed", 500);

    // 4. TELEMETRY: Alert the CEO War Room of a high-value movement
    if (amount > 100000) {
      await supabaseAdmin.from('eml_events').insert({
        event_name: 'HIGH_VALUE_WALLET_ACTIVITY',
        severity: 'WARNING',
        actor_id: session.userId,
        payload: { amount, action, tx_id: transaction.id }
      });
    }

    return successResponse({ 
      message: "Transaction logged and awaiting verification.",
      transaction_id: transaction.id 
    }, 201);

  } catch (err) {
    return internalError(err, 'POST /api/wallet');
  }
}
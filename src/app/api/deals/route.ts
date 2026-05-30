// src/app/api/deals/route.ts
// EML — Deals API
// GET: Fetch deals for the authenticated user
// POST: Initiate a new escrowed deal (buyer only)

import { type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError, validateRequired } from '@/lib/api/response';
import { getSession, requireRole } from '@/lib/auth/getSession';

// ---------------------------------------------------------------------------
// GET /api/deals
// Returns all deals where the authenticated user is the buyer or seller.
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);

    const { data, error } = await supabaseAdmin
      .from('deals')
      .select(`
        id, deal_code, deal_type, status, gross_amount, currency,
        commission_rate, commission_amount, seller_receives,
        escrow_enabled, payment_verified, created_at, updated_at,
        machinery:machinery_id (id, title, category, city, image_url),
        buyer:buyer_id (full_name, phone),
        seller:seller_id (full_name, phone)
      `)
      .or(`buyer_id.eq.${session.userId},seller_id.eq.${session.userId}`)
      .order('created_at', { ascending: false });

    if (error) return errorResponse(error.message, 500, 'DB_ERROR');

    return successResponse(data);

  } catch (err) {
    return internalError(err, 'GET /api/deals');
  }
}

// ---------------------------------------------------------------------------
// POST /api/deals
// Initiates a new escrowed deal. Only buyers can initiate.
// Seller and admin roles cannot initiate deals on behalf of others.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated session
    const session = getSession(request);

    // 2. Only buyers and admins can initiate deals
    const denied = requireRole(session, ['buyer', 'admin']);
    if (denied) return errorResponse(denied, 403, 'FORBIDDEN');

    // 3. Parse and validate body
    const body = await request.json();

    const validationError = validateRequired(body, [
      'machinery_id',
      'seller_id',
      'gross_amount',
    ]);
    if (validationError) return validationError;

    const { machinery_id, seller_id, gross_amount, deal_type, currency } = body;

    // 4. Prevent a user from initiating a deal with themselves
    if (session.userId === seller_id) {
      return errorResponse(
        'You cannot initiate a deal with yourself.',
        400,
        'VALIDATION_ERROR'
      );
    }

    // 5. Validate gross_amount
    if (typeof gross_amount !== 'number' || gross_amount <= 0) {
      return errorResponse(
        'gross_amount must be a positive number in ETB.',
        400,
        'VALIDATION_ERROR'
      );
    }

    // 6. Confirm the machinery listing exists and is active
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('machinery')
      .select('id, title, status, user_id')
      .eq('id', machinery_id)
      .single();

    if (listingError || !listing) {
      return errorResponse('Machinery listing not found.', 404, 'NOT_FOUND');
    }

    if (listing.status !== 'active') {
      return errorResponse(
        'This machinery listing is no longer active.',
        409,
        'STATE_ERROR'
      );
    }

    // 7. Confirm the seller_id matches the listing owner
    if (listing.user_id !== seller_id) {
      return errorResponse(
        'seller_id does not match the owner of this listing.',
        400,
        'VALIDATION_ERROR'
      );
    }

    // 8. Calculate commission from commission_settings or apply defaults
    const resolvedDealType = deal_type ?? 'PURCHASE';
    const { data: commissionSetting } = await supabaseAdmin
      .from('commission_settings')
      .select('rate')
      .eq('deal_type', resolvedDealType)
      .single();

    const rate = commissionSetting?.rate ?? (resolvedDealType === 'RENTAL' ? 5.00 : 2.50);
    const commission_amount = Math.ceil((gross_amount * rate) / 100);
    const seller_receives   = gross_amount - commission_amount;

    // 9. Generate a unique deal code
    const deal_code = `EML-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    const now = new Date().toISOString();

    // 10. Insert the deal
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .insert({
        deal_code,
        deal_type:         resolvedDealType,
        machinery_id,
        buyer_id:          session.userId,
        seller_id,
        gross_amount,
        commission_rate:   rate,
        commission_amount,
        seller_receives,
        currency:          currency ?? 'ETB',
        escrow_enabled:    true,
        payment_verified:  false,
        status:            'pending',
        created_at:        now,
        updated_at:        now,
      })
      .select('id, deal_code, deal_type, status, gross_amount, commission_amount, seller_receives, currency')
      .single();

    if (dealError) return errorResponse(dealError.message, 500, 'DB_ERROR');

    // 11. Audit log
    await supabaseAdmin.from('eml_events').insert({
      event_name: 'DEAL_INITIATED',
      actor_id:   session.userId,
      deal_id:    deal.id,
      severity:   'INFO',
      payload: {
        deal_code,
        machinery_id,
        gross_amount,
        commission_amount,
        seller_receives,
      },
      created_at: now,
    });

    return successResponse(deal, 201);

  } catch (err) {
    return internalError(err, 'POST /api/deals');
  }
}
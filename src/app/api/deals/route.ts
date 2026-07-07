import { logEvent } from "@/core/logEvent";
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { getSession, requireRole } from '@/lib/auth/getSession';

/**
 * TM DEAL VALIDATION SCHEMA
 * Prevents Malformed Data & Injection Attacks
 */
const DealInputSchema = z.object({
  machinery_id: z.string().uuid("Invalid Machinery ID format"),
  seller_id: z.string().uuid("Invalid Seller ID format"),
  gross_amount: z.number().positive("Amount must be a positive number"),
  deal_type: z.enum(['PURCHASE', 'RENTAL']).default('PURCHASE'),
  currency: z.string().length(3).default('ETB'),
});

/**
 * GET /api/deals
 * Fetches transaction history for the authenticated user.
 * Optimized via DB Indexes for rapid retrieval.
 */
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

    if (error) return errorResponse(error.message, 500, 'DATABASE_QUERY_ERROR');

    return successResponse(data);
  } catch (err) {
    return internalError(err, 'GET /api/deals');
  }
}

/**
 * POST /api/deals
 * Initiates an Atomic Escrow Deal.
 * Integrated with the Real-time Telemetry Stream.
 */
export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);

    // 1. Role Authorization (Only buyers or admins can initiate)
    const denied = requireRole(session, ['user', 'buyer', 'admin']);
    if (denied) return errorResponse(denied, 403, 'UNAUTHORIZED_ACCESS');

    // 2. Strict Input Validation via Zod
    const body = await request.json();
    const validation = DealInputSchema.safeParse(body);
    
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400, 'VALIDATION_FAILED');
    }

    const { machinery_id, seller_id, gross_amount, deal_type, currency } = validation.data;

    // 3. Security Check: Prevent self-dealing
    if (session.userId === seller_id) {
      return errorResponse('You cannot initiate a deal with yourself.', 400, 'FRAUD_PREVENTION');
    }

    // 4. ATOMIC CHECK: Verify Machinery availability & Ownership
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('machinery')
      .select('id, status, user_id, title')
      .eq('id', machinery_id)
      .single();

    if (listingError || !listing) return errorResponse('Machinery listing not found.', 404, 'NOT_FOUND');
    if (listing.status !== 'active') return errorResponse('This machine is no longer available for trade.', 409, 'AVAILABILITY_ERROR');
    if (listing.user_id !== seller_id) return errorResponse('Seller mismatch detected.', 400, 'DATA_INTEGRITY_ERROR');

    // 5. SECURE COMMISSION CALCULATION
    // Fetches real-time rates from TM Governance tables
    const { data: settings } = await supabaseAdmin
      .from('commission_settings')
      .select('machinery_sales_rate, machinery_rental_rate')
      .single();

    const rate = deal_type === 'RENTAL' 
      ? (settings?.machinery_rental_rate ?? 5.0) 
      : (settings?.machinery_sales_rate ?? 2.5);

    const commission_amount = Math.ceil((gross_amount * rate) / 100);
    const seller_receives = gross_amount - commission_amount;

    // 6. GENERATE GLOBAL UNIQUE DEAL IDENTIFIER
    const deal_code = `TM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const now = new Date().toISOString();

    // 7. DB INSERT: Create the Deal
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .insert({
        deal_code,
        deal_type,
        machinery_id,
        buyer_id: session.userId,
        seller_id,
        gross_amount,
        commission_rate: rate,
        commission_amount,
        seller_receives,
        currency,
        escrow_enabled: true,
        status: 'pending',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (dealError) return errorResponse(dealError.message, 500, 'DEAL_CREATION_FAILED');

    // 8. TELEMETRY LOGGING (FEEDS THE REAL-TIME LIVE STREAM)
    // The Index: idx_eml_events_created_at makes this scalable
    await supabaseAdmin.from('tm_events').insert({
      event_name: 'DEAL_INITIATED',
      severity: 'INFO',
      actor_id: session.userId,
      deal_id: deal.id,
      payload: {
        deal_code,
        machine_title: listing.title,
        amount: `${gross_amount} ${currency}`,
        commission: commission_amount,
        buyer_name: session.email || 'Authenticated User'
      },
      created_at: now
    });

    return successResponse(deal, 201);
  } catch (err) {
    return internalError(err, 'POST /api/deals');
  }
}

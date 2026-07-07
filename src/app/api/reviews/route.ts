import { logEvent } from "@/core/logEvent";
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { getSession } from '@/lib/auth/getSession';

const ReviewSchema = z.object({
  deal_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    const body = await request.json();
    const val = ReviewSchema.safeParse(body);

    if (!val.success) return errorResponse("Invalid review data", 400);

    // 1. SECURITY CHECK: Verify deal status
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('deals')
      .select('id, seller_id, status, buyer_id, machinery:machinery_id(title)')
      .eq('id', val.data.deal_id)
      .single();

    if (dealError || !deal) return errorResponse("Deal not found", 404);
    if (deal.status !== 'completed_payout') return errorResponse("Review locked: Complete escrow first", 403);
    if (deal.buyer_id !== session.userId) return errorResponse("Unauthorized", 401);

    // 2. INSERT REVIEW
    const { error: revError } = await supabaseAdmin
      .from('reviews')
      .insert([{
        deal_id: val.data.deal_id,
        buyer_id: session.userId,
        seller_id: deal.seller_id,
        rating: val.data.rating,
        comment: val.data.comment,
        is_verified_purchase: true
      }]);

    if (revError) return errorResponse("Duplicate review detected", 409);

    // 3. INTEGRATION: Send Telegram Notification to Seller
    // We call our internal API to keep logic decoupled
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auto-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_user_id: deal.seller_id,
        type: 'REVIEW',
        data: {
          buyer: session.email?.split('@')[0] || "Buyer",
          rating: val.data.rating,
          comment: val.data.comment
        }
      })
    }).catch(e => console.error("Notification trigger failed", e));

    // 4. TELEMETRY
    await supabaseAdmin.from('tm_events').insert({
      event_name: 'USER_REVIEW_POSTED',
      severity: 'INFO',
      payload: { rating: val.data.rating, deal_id: deal.id }
    });

    return successResponse({ success: true }, 201);
  } catch (err) {
    return internalError(err, 'POST /api/reviews');
  }
}

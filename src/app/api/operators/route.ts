import { logEvent } from "@/core/logEvent";
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse } from '@/lib/api/response';

const OperatorRatingSchema = z.object({
  operator_id: z.string().uuid(),
  safety_score: z.number().min(1).max(100),
  efficiency_rating: z.number().min(1).max(100),
  review_text: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const val = OperatorRatingSchema.safeParse(body);
    if (!val.success) return errorResponse("Invalid rating data", 400);

    // Update the operator's public trust_score
    // Trust Score = (Safety + Efficiency) / 2
    const newTrustScore = (val.data.safety_score + val.data.efficiency_rating) / 2;

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        trust_score: newTrustScore,
        verified: newTrustScore > 80 // Auto-verify if performance is elite
      })
      .eq('id', val.data.operator_id);

    if (error) throw error;

    return successResponse({ new_trust_score: newTrustScore });
  } catch (err) {
    return errorResponse("Rating update failed", 500);
  }
}

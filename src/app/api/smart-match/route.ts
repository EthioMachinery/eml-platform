import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { getSession } from '@/lib/auth/getSession';
import { TMCore } from '@/core/tmCore';
import { MatchingEngine } from '@/core/matchingEngine';
import { LearningEngine } from '@/core/learningEngine';
import { logEvent } from '@/core/logEvent';

/**
 * SMART-MATCH PARAMETERS
 * Strictly typed for industrial precision.
 */
const MatchRequestSchema = z.object({
  category: z.string().min(2),
  max_budget: z.number().positive(),
  duration_days: z.number().int().min(1),
  location_region: z.string().optional(),
  required_condition: z.enum(['new', 'excellent', 'good', 'fair']).default('good'),
});

/**
 * POST /api/smart-match
 * The "Brain" of the Marketplace.
 */
export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    const body = await request.json();
    const validation = MatchRequestSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400, 'INPUT_INVALID');
    }

    const req = validation.data;

    // 1. QUERY: Fetch candidate machines from the fleet
    // We fetch more than we need to let the AI score them locally
    let query = supabaseAdmin
      .from('machinery')
      .select(`
        *,
        profiles(full_name, company_name, trust_score, verified)
      `)
      .eq('status', 'active')
      .eq('category', req.category)
      .lte('price', req.max_budget);

    if (req.location_region) {
      query = query.eq('region', req.location_region);
    }

    const { data: candidates, error: dbError } = await query.limit(50);

    if (dbError) return errorResponse(dbError.message, 500, 'FLEET_QUERY_ERROR');
    if (!candidates || candidates.length === 0) {
      return successResponse([], 200); // No matches found
    }

    // 2. SCORING ENGINE: Calculate the "Industrial Compatibility Index" (ICI)
    const matches = candidates.map(machine => {
      let matchScore = 100;

      // Deduct for condition mismatch
      const conditionWeights: Record<string, number> = { 'new': 4, 'excellent': 3, 'good': 2, 'fair': 1 };
      const reqWeight = conditionWeights[req.required_condition];
      const actualWeight = conditionWeights[machine.condition] || 2;
      
      if (actualWeight < reqWeight) matchScore -= 20;

      // Boost for Seller Trust (Crucial for Top 10 status)
      const sellerTrust = machine.profiles?.trust_score || 50;
      matchScore += (sellerTrust - 50) / 2;

      // Price Efficiency Bonus
      const budgetUtilization = machine.price / req.max_budget;
      if (budgetUtilization < 0.7) matchScore += 10; // "High Value" match

      // Core AI Verification check
      const aiAnalysis = TMCore.getScore(machine);
      if (aiAnalysis.risk === 'DANGEROUS') matchScore = 0;

      return {
        ...machine,
        match_score: Math.min(100, Math.round(matchScore)),
        ai_recommendation: matchScore > 85 ? "PREMIUM_MATCH" : "STANDARD_MATCH",
        reasoning: matchScore > 85 
          ? `High trust seller and ${Math.round((1 - budgetUtilization) * 100)}% under budget.`
          : "Meets basic technical requirements."
      };
    });

    // 3. SORT & FILTER: Only return high-probability matches
    const finalResults = matches
      .filter(m => m.match_score > 40)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);

    // 4. LEARNING: record match outcome for continuous improvement
    if (finalResults.length > 0) {
      await LearningEngine.learnFromDeal(
        { id: finalResults[0].id, price: finalResults[0].price, category: req.category },
        "MARKET_AVERAGE",
        "PENDING"
      );
    }

    // 5. TELEMETRY: structured event log (replaces raw insert)
    await logEvent({
      id: crypto.randomUUID(),
      type: "SYSTEM_ALERT",
      title: "Smart Match Executed",
      userId: session.userId,
      metadata: {
        category: req.category,
        results_count: finalResults.length,
        highest_score: finalResults[0]?.match_score || 0,
        budget: req.max_budget,
      },
      timestamp: new Date().toISOString(),
    });

    return successResponse({
      matches: finalResults,
      metadata: {
        engine_version: "TM-MATCH-AI-V2",
        timestamp: new Date().toISOString(),
        total_candidates_analyzed: candidates.length
      }
    });

  } catch (err) {
    return internalError(err, 'POST /api/smart-match');
  }
}
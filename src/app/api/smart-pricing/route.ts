import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { TMCore } from '@/core/tmCore';
import { PricingEngine } from '@/core/pricingEngine';
import { LearningEngine } from '@/core/learningEngine';
import { logEvent } from '@/core/logEvent';
import { Observability } from '@/core/observability';

/**
 * SMART PRICING SCHEMA
 */
const PricingAnalysisSchema = z.object({
  category: z.string(),
  proposed_price: z.number().positive(),
  year: z.number().min(1980).max(new Date().getFullYear() + 1),
  condition: z.enum(['new', 'excellent', 'good', 'fair']),
  region: z.string().optional(),
});

/**
 * POST /api/smart-pricing
 * Analyzes market data to provide a competitive pricing strategy.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = PricingAnalysisSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400, 'INVALID_PARAMS');
    }

    const { category, proposed_price, year, condition, region } = validation.data;

    // 1. DATA AGGREGATION: Fetch similar active listings
    const { data: marketData, error: marketError } = await supabaseAdmin
      .from('machinery')
      .select('price, condition, year')
      .eq('category', category)
      .eq('status', 'active')
      .limit(100);

    if (marketError) return errorResponse("Market data unavailable", 500);

    // 2. AI CALCULATION: Market Benchmark
    const prices = marketData?.map(m => Number(m.price)) || [];
    const avgMarketPrice = prices.length > 0 
      ? prices.reduce((a, b) => a + b, 0) / prices.length 
      : proposed_price; // Fallback to user price if no data

    // 3. LOGIC: Competitive Index (CI)
    // 1.0 = Fair Market Value | < 1.0 = Deal | > 1.0 = Premium/Overpriced
    const competitiveIndex = proposed_price / avgMarketPrice;

    // 4. INTELLIGENCE: Predicted Days to Sell (DTS)
    // Base DTS is 15 days. Every 10% above market adds 7 days.
    let predictedDTS = 15;
    if (competitiveIndex > 1) {
      predictedDTS += Math.round((competitiveIndex - 1) * 70);
    } else {
      predictedDTS -= Math.round((1 - competitiveIndex) * 10);
    }

    // 5. FINAL RECOMMENDATION ENGINE
    let recommendation = "MARKET_AVERAGE";
    let actionTip = "Your price is aligned with the current market average.";

    if (competitiveIndex < 0.85) {
      recommendation = "FAST_SALE";
      actionTip = "Price is highly competitive. Expect rapid inquiries.";
    } else if (competitiveIndex > 1.2) {
      recommendation = "OVERPRICED";
      actionTip = "Price is 20%+ above average. Consider lowering to increase visibility.";
    }

    // 6. AI PRICING ENGINE: enriched recommendation
    const aiPricing = await PricingEngine.calculatePrice({
      id: crypto.randomUUID(),
      price: proposed_price,
      category,
    });

    // 7. LEARNING: record this pricing decision for continuous improvement
    await LearningEngine.learnFromDeal(
      { id: crypto.randomUUID(), price: proposed_price, category },
      recommendation,
      "PENDING"
    );

    // 8. TELEMETRY: structured event log (replaces raw insert)
    await logEvent({
      id: crypto.randomUUID(),
      type: "SYSTEM_ALERT",
      title: "AI Pricing Analysis",
      metadata: {
        category,
        proposed: proposed_price,
        market_avg: Math.round(avgMarketPrice),
        index: competitiveIndex.toFixed(2),
        predicted_dts: Math.max(2, predictedDTS),
        ai_signal: aiPricing.signal,
      },
      timestamp: new Date().toISOString(),
    });

    // Also trace via observability for structured debugging
    await Observability.trace({
      type: "AI_PRICING_ANALYSIS",
      level: competitiveIndex > 1.5 ? "WARN" : "INFO",
      message: `Pricing analysis: ${recommendation}`,
      metadata: { category, proposed_price, competitiveIndex },
    });

    return successResponse({
      analysis: {
        market_average: Math.round(avgMarketPrice),
        competitive_index: parseFloat(competitiveIndex.toFixed(2)),
        predicted_days_to_sell: Math.max(2, predictedDTS),
        price_status: recommendation,
        ai_signal: aiPricing.signal,
        ai_confidence: aiPricing.confidence,
        adjusted_price: aiPricing.adjustedPrice,
      },
      recommendation: actionTip,
      metadata: {
        engine: "TM-PRICE-AI-V2",
        sample_size: prices.length
      }
    });

  } catch (err) {
    return internalError(err, 'POST /api/smart-pricing');
  }
}

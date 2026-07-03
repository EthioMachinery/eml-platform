import { Deal } from "@/core/tmCore";
import { LearningEngine } from "@/core/learningEngine";
import { calculateEscrowSplits } from "@/lib/escrow/stateMachine";
import { supabaseAdmin } from "@/lib/supabase/adminClient";

/**
 * ============================================================
 * TM REVENUE & FORECASTING ENGINE — V2.0
 * Deep Intelligence for Global Machinery Liquidity
 * ============================================================
 */

export type DealRevenueScore = {
  dealId: string;
  grossAmount: number;      // Total deal value
  projectedNetProfit: number; // TM's actual cut
  closingProbability: number; // % chance this deal finishes
  riskAdjustedRevenue: number; // NetProfit * Probability
  liquidityScore: number;     // How "hot" this machine is (1-100)
  currency: string;
};

export const RevenueEngine = {
  /**
   * Evaluates a deal's financial value and probability of success.
   */
  async evaluateDeal(deal: Deal): Promise<DealRevenueScore> {
    // 1. Fetch current platform rates from DB
    const { data: settings } = await supabaseAdmin
      .from('commission_settings')
      .select('*')
      .single();

    const config = {
      salesRate: settings?.machinery_sales_rate ?? 2.5,
      inspectionRate: settings?.escrow_fee_rate ?? 1.5,
      logisticsRate: settings?.transport_matching_rate ?? 2.5,
      includeInspection: deal.requiresInspection ?? false,
      includeLogistics: deal.requiresLogistics ?? false,
    };

    // 2. Calculate Real Platform Revenue (The "TM Cut")
    const splits = calculateEscrowSplits(Number(deal.price || 0), config, deal.currency || 'ETB');
    const netProfit = splits.emlCommission;

    // 3. AI Intelligence: Determine Closing Probability
    // adjustRiskBias now factors in trust_score and listing age
    const closingProbability = await LearningEngine.adjustRiskBias(
      deal.status === 'active' ? 85 : 40,
      deal.sellerTrustScore > 80 ? "SAFE" : "RISKY"
    );

    // 4. Calculate Risk-Adjusted Revenue (RAR)
    const rar = Math.round(netProfit * (closingProbability / 100));

    // 5. Calculate Liquidity Score (How fast do these sell?)
    // This uses the view_count logic we added to the SQL audit
    const liquidityScore = Math.min(100, (deal.views || 0) / 10);

    return {
      dealId: deal.id,
      grossAmount: splits.totalAmount,
      projectedNetProfit: netProfit,
      closingProbability,
      riskAdjustedRevenue: rar,
      liquidityScore,
      currency: splits.currency
    };
  },

  /**
   * Ranks deals based on Risk-Adjusted Revenue and Liquidity.
   * Helps the CEO Autopilot focus on high-value, high-certainty deals.
   */
  async rankDeals(deals: Deal[]): Promise<DealRevenueScore[]> {
    const scored = await Promise.all(
      deals.map((deal) => this.evaluateDeal(deal))
    );

    // Sort by Risk Adjusted Revenue (The most "realistic" money)
    return scored.sort((a, b) => b.riskAdjustedRevenue - a.riskAdjustedRevenue);
  },

  /**
   * Market Analysis: Provides a roadmap for TM's financial health.
   */
  async marketOpportunity(deals: Deal[]) {
    const ranked = await this.rankDeals(deals);

    const totalProjectedNet = ranked.reduce((sum, item) => sum + item.projectedNetProfit, 0);
    const totalRAR = ranked.reduce((sum, item) => sum + item.riskAdjustedRevenue, 0);

    return {
      activeDeals: deals.length,
      pipelineGrossValue: ranked.reduce((sum, item) => sum + item.grossAmount, 0),
      potentialPlatformRevenue: totalProjectedNet,
      totalRAR, // This is what the bank/investors want to see
      highLiquidityDeals: ranked.filter(d => d.liquidityScore > 75).length,
      topFinancialOpportunities: ranked.slice(0, 5),
    };
  },
};

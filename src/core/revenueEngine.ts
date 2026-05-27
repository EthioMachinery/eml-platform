import { Deal } from "@/core/emlCore";
import { LearningEngine } from "@/core/learningEngine";

/**
 * =========================
 * REVENUE ENGINE
 * =========================
 */

export type DealRevenueScore = {
  dealId: string;
  revenue: number;
  confidence: number;
};

export const RevenueEngine = {
  async evaluateDeal(
    deal: Deal
  ): Promise<DealRevenueScore> {
    const base =
      Number(
        deal.price || 0
      );

    const confidence =
      await LearningEngine.adjustRiskBias(
        70,
        "SAFE"
      );

    const revenue =
      Math.round(
        base *
          (confidence /
            100)
      );

    return {
      dealId:
        deal.id,
      revenue,
      confidence,
    };
  },

  async rankDeals(
    deals: Deal[]
  ) {
    const scored =
      await Promise.all(
        deals.map(
          (deal) =>
            this.evaluateDeal(
              deal
            )
        )
      );

    return scored.sort(
      (a, b) =>
        b.revenue -
        a.revenue
    );
  },

  async marketOpportunity(
    deals: Deal[]
  ) {
    const ranked =
      await this.rankDeals(
        deals
      );

    return {
      totalDeals:
        deals.length,
      projectedRevenue:
        ranked.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.revenue,
          0
        ),
      topDeals:
        ranked.slice(
          0,
          5
        ),
    };
  },
};
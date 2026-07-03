import { Deal, TMCore } from "@/core/tmCore";
import { LearningEngine } from "@/core/learningEngine";

export type PricingDecision = {
  basePrice: number;
  adjustedPrice: number;
  confidence: number;
  signal: "BUY" | "SELL" | "HOLD";
};

export const PricingEngine = {
  async calculatePrice(
    deal: Deal
  ): Promise<PricingDecision> {
    const score =
      TMCore.ai.scoreDeal(
        deal
      );

    const bias =
      await LearningEngine.adjustRiskBias(
        score.score,
        score.risk
      );

    const basePrice =
      Number(
        deal.price || 0
      );

    const multiplier =
      bias / 100;

    const adjustedPrice =
      Math.round(
        basePrice *
          (1 + multiplier / 10)
      );

    let signal:
      | "BUY"
      | "SELL"
      | "HOLD" = "HOLD";

    if (
      score.risk ===
      "SAFE"
    ) {
      signal = "BUY";
    } else if (
      score.risk ===
      "DANGEROUS"
    ) {
      signal = "SELL";
    }

    return {
      basePrice,
      adjustedPrice,
      confidence: bias,
      signal,
    };
  },

  async batchPricing(
    deals: Deal[]
  ) {
    return Promise.all(
      deals.map((deal) =>
        this.calculatePrice(
          deal
        )
      )
    );
  },

  async marketSignals(
    deals: Deal[]
  ) {
    const priced =
      await this.batchPricing(
        deals
      );

    return {
      buySignals:
        priced.filter(
          (p) =>
            p.signal ===
            "BUY"
        ).length,
      sellSignals:
        priced.filter(
          (p) =>
            p.signal ===
            "SELL"
        ).length,
      holdSignals:
        priced.filter(
          (p) =>
            p.signal ===
            "HOLD"
        ).length,
      averageAdjustedPrice:
        priced.length > 0
          ? Math.round(
              priced.reduce(
                (
                  a,
                  b
                ) =>
                  a +
                  b.adjustedPrice,
                0
              ) /
                priced.length
            )
          : 0,
    };
  },
};
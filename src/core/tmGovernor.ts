import { Deal, TMCore } from "@/core/tmCore";

/**
 * =========================
 * TM GOVERNOR
 * Global safety + scoring controller
 * =========================
 */

export const TMGovernor = {
  evaluate(deal: Deal) {
    const result =
      TMCore.ai.scoreDeal(
        deal
      );

    let status:
      | "APPROVED"
      | "REVIEW"
      | "BLOCKED" =
      "APPROVED";

    if (
      result.risk ===
      "DANGEROUS"
    ) {
      status =
        "BLOCKED";
    } else if (
      result.risk ===
      "RISKY"
    ) {
      status =
        "REVIEW";
    }

    return {
      dealId: deal.id,
      score:
        result.score,
      risk:
        result.risk,
      status,
      timestamp:
        Date.now(),
    };
  },

  batch(
    deals: Deal[]
  ) {
    return deals.map(
      (deal) =>
        this.evaluate(
          deal
        )
    );
  },
};
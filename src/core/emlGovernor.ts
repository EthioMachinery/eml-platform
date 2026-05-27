import { Deal, EMLCore } from "@/core/emlCore";

/**
 * =========================
 * EML GOVERNOR
 * Global safety + scoring controller
 * =========================
 */

export const EMLGovernor = {
  evaluate(deal: Deal) {
    const result =
      EMLCore.ai.scoreDeal(
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
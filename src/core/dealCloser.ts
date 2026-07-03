import { supabase } from "@/lib/supabaseClient";
import { Deal, TMCore } from "@/core/tmCore";
import { PricingEngine } from "@/core/pricingEngine";
import { LearningEngine } from "@/core/learningEngine";

export class DealCloser {
  static async process(
    deal: Deal
  ) {
    const score =
      TMCore.ai.scoreDeal(
        deal
      );

    const pricing =
      await PricingEngine.calculatePrice(
        deal
      );

    const decision =
      score.risk ===
      "DANGEROUS"
        ? "BLOCKED"
        : "APPROVED";

    const learning =
      await LearningEngine.learnFromDeal(
        deal,
        decision,
        "PENDING"
      );

    const result = {
      dealId: deal.id,
      score,
      pricing,
      learning,
      closed:
        score.risk !==
        "DANGEROUS",
      timestamp:
        Date.now(),
    };

    await supabase
      .from("eml_events")
      .insert([
        {
          type:
            "DEAL_CLOSER",
          title:
            "Deal Processed",
          description:
            result.closed
              ? "Closed"
              : "Blocked",
          entity_id:
            deal.id,
          metadata:
            result,
        },
      ]);

    return result;
  }
}
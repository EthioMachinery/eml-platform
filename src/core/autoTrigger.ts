import { supabase } from "@/lib/supabaseClient";
import {
  TMCore,
  Deal,
  RiskLevel,
} from "@/core/tmCore";

export type AutoAction =
  | "APPROVE"
  | "REVIEW"
  | "REJECT";

export type AutomationEvent = {
  dealId: string;
  risk: RiskLevel;
  score: number;
  action: AutoAction;
  timestamp: number;
};

export class AutoTrigger {
  static async processDeal(
    deal: Deal
  ): Promise<AutomationEvent> {
    const result =
      TMCore.ai.scoreDeal(
        deal
      );

    let action: AutoAction =
      "APPROVE";

    if (
      result.risk ===
      "RISKY"
    ) {
      action = "REVIEW";
    }

    if (
      result.risk ===
      "DANGEROUS"
    ) {
      action = "REJECT";
    }

    const event: AutomationEvent =
      {
        dealId:
          deal.id || "",
        risk: result.risk,
        score:
          result.score,
        action,
        timestamp:
          Date.now(),
      };

    await supabase
      .from("eml_events")
      .insert([
        {
          type:
            "AUTO_TRIGGER",
          title:
            "Automation Decision",
          description:
            action,
          entity_id:
            deal.id,
          metadata:
            event,
        },
      ]);

    return event;
  }

  static async processBatch(
    deals: Deal[]
  ) {
    const results = [];

    for (const deal of deals) {
      results.push(
        await this.processDeal(
          deal
        )
      );
    }

    return results;
  }

  static async handleRealtimeInsert(
    payload: any
  ) {
    return this.processDeal(
      payload.new as Deal
    );
  }
}
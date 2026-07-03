import { supabase } from "@/lib/supabaseClient";
import { TMCore, Deal } from "@/core/tmCore";
import { AutoTrigger } from "@/core/autoTrigger";

type ExecutionMode =
  | "LIVE"
  | "SAFE_MODE";

export class AutonomousEngine {
  static mode: ExecutionMode =
    "SAFE_MODE";

  static setMode(
    mode: ExecutionMode
  ) {
    this.mode = mode;
  }

  static getMode() {
    return this.mode;
  }

  static async run() {
    const { data } =
      await supabase
        .from("deals")
        .select("*");

    const deals =
      (data || []) as Deal[];

    const ranked =
      deals.map((deal) => ({
        deal,
        score:
          TMCore.ai.scoreDeal(
            deal
          ),
      }));

    for (const item of ranked) {
      await this.execute(
        item.deal
      );
    }

    return ranked;
  }

  static async execute(
    deal: Deal
  ) {
    if (
      this.mode ===
      "SAFE_MODE"
    ) {
      return {
        dealId: deal.id,
        status: "simulated",
      };
    }

    return AutoTrigger.processDeal(
      deal
    );
  }
}
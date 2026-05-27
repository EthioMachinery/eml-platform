import { Deal, EMLCore } from "@/core/emlCore";
import { AutonomousEngine } from "@/core/autonomousEngine";
import { RevenueEngine } from "@/core/revenueEngine";

export type AutopilotMode =
  | "SAFE"
  | "LIVE";

export const CEOAutopilot = {
  mode: "SAFE" as AutopilotMode,

  setMode(
    newMode: AutopilotMode
  ) {
    this.mode = newMode;
    AutonomousEngine.setMode(
      newMode === "LIVE"
        ? "LIVE"
        : "SAFE_MODE"
    );
  },

  getMode() {
    return this.mode;
  },

  async process(
    deal: Deal
  ) {
    const score =
      EMLCore.ai.scoreDeal(
        deal
      );

    const revenue =
      await RevenueEngine.evaluateDeal(
        deal
      );

    const execution =
      await AutonomousEngine.execute(
        deal
      );

    let action:
      | "BLOCK"
      | "MONITOR"
      | "EXECUTE" =
      "EXECUTE";

    if (
      score.risk ===
      "DANGEROUS"
    ) {
      action = "BLOCK";
    } else if (
      score.risk ===
      "RISKY"
    ) {
      action = "MONITOR";
    }

    return {
      dealId: deal.id,
      risk: score.risk,
      score: score.score,
      revenue,
      action,
      execution,
    };
  },

  async runBatch(
    deals: Deal[]
  ) {
    const results = [];

    for (const deal of deals) {
      results.push(
        await this.process(
          deal
        )
      );
    }

    return results;
  },

  async startLiveLoop(
    fetchDeals: () => Promise<
      Deal[]
    >
  ) {
    const deals =
      await fetchDeals();

    return this.runBatch(
      deals
    );
  },
};
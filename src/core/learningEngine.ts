import { supabase } from "@/lib/supabaseClient";
import { Deal } from "@/core/emlCore";

/**
 * =========================
 * LEARNING OUTCOME TYPES
 * =========================
 */
type Outcome = "SUCCESS" | "FAILURE" | "PENDING";

type DecisionRecord = {
  deal_id: string;
  decision: string;
  risk: string;
  score: number;
  outcome: Outcome;
  timestamp: number;
};

/**
 * =========================
 * AI SELF-LEARNING ENGINE
 * =========================
 */

export const LearningEngine = {
  /**
   * STORE DECISION FOR LEARNING
   */
  async recordDecision(record: DecisionRecord) {
    await supabase.from("ai_decision_memory").insert(record);
  },

  /**
   * UPDATE OUTCOME AFTER REAL WORLD RESULT
   */
  async updateOutcome(dealId: string, outcome: Outcome) {
    await supabase
      .from("ai_decision_memory")
      .update({ outcome })
      .eq("deal_id", dealId);
  },

  /**
   * GET LEARNING INSIGHTS
   */
  async getInsights() {
    const { data } = await supabase
      .from("ai_decision_memory")
      .select("*");

    const records = data || [];

    const successRate =
      records.length > 0
        ? records.filter((r) => r.outcome === "SUCCESS").length /
          records.length
        : 0;

    const riskySuccess =
      records.filter(
        (r) =>
          r.risk === "RISKY" &&
          r.outcome === "SUCCESS"
      ).length;

    const riskyTotal =
      records.filter(
        (r) => r.risk === "RISKY"
      ).length;

    return {
      totalDecisions:
        records.length,
      successRate,
      riskyAccuracy:
        riskyTotal > 0
          ? riskySuccess /
            riskyTotal
          : 0,
    };
  },

  /**
   * ADAPTIVE SCORING ADJUSTMENT
   */
  async adjustRiskBias(
    baseScore: number,
    risk: string
  ) {
    const insights =
      await this.getInsights();

    let adjusted =
      baseScore;

    if (
      insights.successRate >
        0.7 &&
      risk === "SAFE"
    ) {
      adjusted += 5;
    }

    if (
      insights.riskyAccuracy >
        0.6 &&
      risk === "RISKY"
    ) {
      adjusted += 10;
    }

    if (
      insights.successRate <
      0.4
    ) {
      adjusted -= 10;
    }

    return Math.max(
      0,
      Math.min(
        100,
        adjusted
      )
    );
  },

  /**
   * LEARN FROM DEAL AFTER EXECUTION
   */
  async learnFromDeal(
    deal: Deal,
    decision: string,
    outcome: Outcome
  ) {
    await this.recordDecision({
      deal_id:
        deal.id,
      decision,
      risk: "UNKNOWN",
      score: 0,
      outcome,
      timestamp:
        Date.now(),
    });
  },
};
import { Deal, TMCore } from "@/core/tmCore";
import { AutonomousEngine } from "@/core/autonomousEngine";
import { RevenueEngine } from "@/core/revenueEngine";
import { supabaseAdmin } from "@/lib/supabase/adminClient";

export type AutopilotMode = "SAFE" | "LIVE";

export const CEOAutopilot = {
  mode: "SAFE" as AutopilotMode,

  setMode(newMode: AutopilotMode) {
    this.mode = newMode;
    AutonomousEngine.setMode(newMode === "LIVE" ? "LIVE" : "SAFE_MODE");
  },

  getMode() {
    return this.mode;
  },

  /**
   * Processes a single deal through the AI Score, Revenue, and Execution layers.
   * Persists the decision to the database for historical auditing.
   */
  async process(deal: Deal) {
    try {
      // 1. Scoring & Intelligence
      const score = TMCore.ai.scoreDeal(deal);
      const revenue = await RevenueEngine.evaluateDeal(deal);

      // 2. Logic Matrix: Determine action based on Risk/Revenue
      let action: "BLOCK" | "MONITOR" | "EXECUTE" = "EXECUTE";

      if (score.risk === "DANGEROUS" || revenue.status === "REJECTED") {
        action = "BLOCK";
      } else if (score.risk === "RISKY") {
        action = "MONITOR";
      }

      // 3. Autonomous Execution (Only if safe)
      const execution = action === "EXECUTE" 
        ? await AutonomousEngine.execute(deal) 
        : { status: "SKIPPED", reason: `Mode set to ${action}` };

      // 4. PERSISTENCE: Save to ai_decision_memory (Critical for World-Class Audit)
      await supabaseAdmin.from("ai_decision_memory").insert({
        engine_name: "CEO_AUTOPILOT_V2",
        context_type: "DEAL_AUTO_PROCESS",
        reference_id: deal.id,
        inputs: { deal, score, mode: this.mode },
        outputs: { action, execution },
        confidence_score: score.score,
        decision: action,
        outcome: execution.status,
      });

      return {
        dealId: deal.id,
        risk: score.risk,
        score: score.score,
        revenue,
        action,
        execution,
      };
    } catch (error) {
      console.error(`[CEOAutopilot] Critical failure on deal ${deal.id}:`, error);
      return { dealId: deal.id, action: "ERROR", error: String(error) };
    }
  },

  /**
   * Modernized Batch Processor: Processes all deals in parallel using 
   * non-blocking architecture.
   */
  async runBatch(deals: Deal[]) {
    if (!deals || deals.length === 0) return [];
    
    // Using settled promises to ensure one failed deal doesn't stop the whole system
    const results = await Promise.allSettled(
      deals.map((deal) => this.process(deal))
    );

    return results.map((res) => (res.status === "fulfilled" ? res.value : res.reason));
  },

  async startLiveLoop(fetchDeals: () => Promise<Deal[]>) {
    const deals = await fetchDeals();
    return this.runBatch(deals);
  },
};
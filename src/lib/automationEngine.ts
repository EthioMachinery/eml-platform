import { supabase } from "./supabaseClient";
import { TMCore, Deal } from "@/core/tmCore";

/**
 * =========================
 * TYPES
 * =========================
 */

export type AutomationAction =
  | "APPROVE"
  | "REJECT"
  | "REVIEW"
  | "AUTO_LIST"
  | "NOTIFY";

/**
 * =========================
 * AUTOMATION ENGINE
 * =========================
 */

export const AutomationEngine = {
  /**
   * Main entry point
   */
  async processDeal(deal: Deal) {
    if (!deal) return null;

    const analysis = TMCore.ai.scoreDeal(deal);

    const risk = analysis.risk;

    let action: AutomationAction = "REVIEW";

    if (risk === "SAFE") action = "APPROVE";
    if (risk === "RISKY") action = "REVIEW";
    if (risk === "DANGEROUS") action = "REJECT";

    // Save automation event (optional safe logging)
    await supabase.from("automation_logs").insert({
      deal_id: deal.id,
      risk,
      action,
      created_at: new Date().toISOString(),
    });

    return {
      dealId: deal.id,
      risk,
      action,
      score: analysis.score,
      isHighValue: analysis.isInstitutionalGrade,
    };
  },

  /**
   * Batch processing
   */
  async processDeals(deals: Deal[]) {
    const results = [];

    for (const deal of deals) {
      const result = await this.processDeal(deal);
      if (result) results.push(result);
    }

    return results;
  },
};
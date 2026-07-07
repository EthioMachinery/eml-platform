import { TMCore, Deal, RiskLevel } from "./tmCore";

/**
 * ================================
 * DEAL INTELLIGENCE LAYER v1
 * ================================
 *
 * Converts raw deals → structured intelligence
 * for CEO dashboard, automation, and AI agents.
 */

export type DealRank = {
  id?: string;
  score: number;
  risk: RiskLevel;
  isHighValue: boolean;
  label: "LOW" | "MEDIUM" | "HIGH";
  reason: string[];
};

export const DealIntelligence = {
  /**
   * MAIN SCORING ENGINE
   */
  rankDeal(deal: Deal): DealRank {
    const { level: risk } = TMCore.ai.detectFraud(deal);

    let score = 50; // base score
    const reason: string[] = [];

    // -------------------------
    // PRICE SIGNALS
    // -------------------------
    if (deal.price) {
      if (deal.price > 1_000_000) {
        score += 25;
        reason.push("High value deal");
      } else if (deal.price > 200_000) {
        score += 15;
        reason.push("Mid-high value deal");
      } else {
        score -= 10;
        reason.push("Low value deal");
      }
    }

    // -------------------------
    // RISK PENALTY SYSTEM
    // -------------------------
    if (risk === "DANGEROUS") {
      score -= 40;
      reason.push("High fraud risk detected");
    } else if (risk === "RISKY") {
      score -= 20;
      reason.push("Moderate risk detected");
    } else {
      score += 10;
      reason.push("Safe transaction profile");
    }

    // -------------------------
    // COMPLETENESS BONUS
    // -------------------------
    if (deal.buyer_id && deal.seller_id) {
      score += 10;
      reason.push("Verified parties present");
    }

    // clamp score
    score = Math.max(0, Math.min(100, score));

    // classification
    let label: DealRank["label"] = "MEDIUM";

    if (score >= 75) label = "HIGH";
    else if (score <= 40) label = "LOW";

    return {
      id: deal.id,
      score,
      risk,
      isHighValue: (deal.price || 0) > 500_000,
      label,
      reason,
    };
  },

  /**
   * BULK ANALYSIS ENGINE
   */
  analyzeDeals(deals: Deal[]) {
    const ranked = deals.map((d) => this.rankDeal(d));

    const total = ranked.length;
    const high = ranked.filter((r) => r.label === "HIGH").length;
    const risky = ranked.filter((r) => r.risk !== "SAFE").length;

    return {
      total,
      highValue: high,
      risky,
      safe: total - risky,
      avgScore:
        ranked.reduce((sum, r) => sum + r.score, 0) / (total || 1),
      topDeals: ranked
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    };
  },

  /**
   * OPPORTUNITY ENGINE
   */
  detectOpportunities(deals: Deal[]) {
    return deals
      .map((d) => this.rankDeal(d))
      .filter(
        (d) =>
          d.risk === "SAFE" &&
          d.score > 70 &&
          d.isHighValue === true
      );
  },
};
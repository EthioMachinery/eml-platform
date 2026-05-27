import { supabase } from "@/lib/supabaseClient";

/**
 * =========================
 * TYPES (UNIFIED DEAL MODEL)
 * =========================
 */

export type RiskLevel = "SAFE" | "RISKY" | "DANGEROUS";

export type Deal = {
  id: string;
  title?: string;
  price?: number;
  created_at?: string;

  // marketplace relations
  buyer_id?: string;
  seller_id?: string;

  // lifecycle
  status?: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED";
};

/**
 * =========================
 * AI ENGINE LAYER
 * =========================
 */

const AIEngine = {
  detectFraud(deal: Deal): RiskLevel {
    if (!deal) return "SAFE";

    const price = deal.price || 0;

    if (price > 1000000) return "DANGEROUS";
    if (price > 250000) return "RISKY";

    return "SAFE";
  },

  scoreDeal(deal: Deal) {
    const risk = this.detectFraud(deal);

    let score = 50;

    if (risk === "SAFE") score += 30;
    if (risk === "RISKY") score += 0;
    if (risk === "DANGEROUS") score -= 40;

    if ((deal.price || 0) > 500000) score += 10;

    if (deal.buyer_id && deal.seller_id) score += 10;

    return {
      risk,
      score,
      isHighValue: (deal.price || 0) > 500000,
    };
  },

  analyzeDeals(deals: Deal[]) {
    const total = deals.length;

    const risky = deals.filter(
      (d) => this.detectFraud(d) !== "SAFE"
    ).length;

    return {
      total,
      risky,
      safe: total - risky,
    };
  },

  async processDeal(deal: Deal) {
    const risk = this.detectFraud(deal);

    return {
      dealId: deal.id,
      risk,
      processed: true,
    };
  },
};

/**
 * =========================
 * CEO LAYER
 * =========================
 */

const CEOLayer = {
  marketPulse(deals: Deal[]) {
    return {
      totalDeals: deals.length,
      avgPrice:
        deals.reduce((sum, d) => sum + (d.price || 0), 0) /
        (deals.length || 1),
    };
  },

  topDeals(deals: Deal[], limit = 5) {
    return [...deals]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, limit)
      .map((d) => ({
        id: d.id,
        title: d.title,
        score: AIEngine.scoreDeal(d).score,
      }));
  },

  opportunities(deals: Deal[]) {
    return deals
      .filter((d) => (d.price || 0) < 100000)
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        title: d.title,
        reason: "Low price acquisition opportunity",
      }));
  },

  analyzeRisk(deals: Deal[]) {
    return AIEngine.analyzeDeals(deals);
  },
};

/**
 * =========================
 * UNIFIED CORE EXPORT (MAIN SYSTEM API)
 * =========================
 */

export const EMLCore = {
  ai: AIEngine,
  ceo: CEOLayer,

  // AI shortcuts (legacy compatibility)
  detectFraud: AIEngine.detectFraud,
  scoreDeal: AIEngine.scoreDeal,
  analyzeDeals: AIEngine.analyzeDeals,
  processDeal: AIEngine.processDeal,

  // CEO shortcuts
  analyzeRisk: CEOLayer.analyzeRisk,
  marketPulse: CEOLayer.marketPulse,
  topDeals: CEOLayer.topDeals,
  opportunities: CEOLayer.opportunities,
};
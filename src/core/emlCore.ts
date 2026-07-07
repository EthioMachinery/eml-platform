import { supabase } from "@/lib/supabaseClient";

/**
 * ============================================================
 * EML CORE KERNEL — V3.0
 * The Central Nervous System for Global Machinery Trade.
 * ============================================================
 */

export type RiskLevel = "SAFE" | "RISKY" | "DANGEROUS" | "CRITICAL";

export type Deal = {
  id: string;
  title?: string;
  price?: number;
  created_at?: string;
  category?: string;
  status?: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED";
  
  // Intelligence Metrics
  buyer_id?: string;
  seller_id?: string;
  seller_trust_score?: number;
  is_verified?: boolean;
  views?: number;
  currency?: string;
};

/**
 * =========================
 * AI ENGINE LAYER (EML-AI)
 * =========================
 */
const AIEngine = {
  /**
   * Advanced Fraud Detection
   * Evaluates the relationship between price, verification, and history.
   */
  detectFraud(deal: Deal): { level: RiskLevel; reason: string } {
    if (!deal) return { level: "SAFE", reason: "NO_DATA" };

    const price = Number(deal.price) || 0;
    const trust = deal.seller_trust_score ?? 50;

    // RULE 1: Unverified high-value deals are "Risky"
    if (price > 2000000 && !deal.is_verified) {
      return { level: "DANGEROUS", reason: "HIGH_VALUE_UNVERIFIED" };
    }

    // RULE 2: Suspiciously low prices (Scam bait)
    if (price > 0 && price < 50000 && deal.category === 'Excavator') {
      return { level: "CRITICAL", reason: "ANOMALY_LOW_PRICE" };
    }

    // RULE 3: Low trust score
    if (trust < 30) {
      return { level: "RISKY", reason: "LOW_SELLER_TRUST" };
    }

    return { level: "SAFE", reason: "VALIDATED" };
  },

  /**
   * Generates a 0-100 score for a deal's viability.
   */
  scoreDeal(deal: Deal) {
    const { level, reason } = this.detectFraud(deal);
    let score = 50;

    // Weighting Logic
    if (deal.is_verified) score += 25;
    if ((deal.seller_trust_score || 0) > 80) score += 15;
    if ((deal.views || 0) > 100) score += 10; // High interest

    // Risk Deductions
    if (level === "DANGEROUS") score -= 40;
    if (level === "CRITICAL") score = 0;

    return {
      risk: level,
      riskReason: reason,
      score: Math.min(100, Math.max(0, score)),
      isInstitutionalGrade: score > 85
    };
  },

  /**
   * Batch Analysis for the CEO Dashboard
   */
  analyzeMarketHealth(deals: Deal[]) {
    const total = deals.length;
    const scored = deals.map(d => this.scoreDeal(d));
    
    return {
      inventoryVolume: total,
      riskRatio: (scored.filter(s => s.score < 40).length / total) * 100,
      verifiedDensity: (deals.filter(d => d.is_verified).length / total) * 100,
      marketSentiment: total > 0 ? "STABLE" : "LOW_LIQUIDITY"
    };
  }
};

/**
 * =========================
 * CEO LAYER (EML-EXECUTIVE)
 * =========================
 */
const CEOLayer = {
  /**
   * Measures how "alive" the marketplace is.
   */
  marketPulse(deals: Deal[]) {
    const avgPrice = deals.reduce((sum, d) => sum + (Number(d.price) || 0), 0) / (deals.length || 1);
    const totalViews = deals.reduce((sum, d) => sum + (d.views || 0), 0);

    return {
      averageTransactionValue: avgPrice,
      platformEngagement: totalViews,
      growthIndex: (totalViews / (deals.length || 1)).toFixed(2)
    };
  },

  /**
   * Identifies "Whale" deals that need manual CEO oversight.
   */
  topDeals(deals: Deal[], limit = 5) {
    return [...deals]
      .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
      .slice(0, limit)
      .map((d) => {
        const ai = AIEngine.scoreDeal(d);
        return {
          id: d.id,
          title: d.title,
          price: d.price,
          aiScore: ai.score,
          risk: ai.risk
        };
      });
  },

  /**
   * Predictive Opportunities (Supply vs Demand)
   */
  getStrategicInsights(deals: Deal[]) {
    const categories = deals.map(d => d.category);
    const demandMap = categories.reduce((acc: any, curr: any) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(demandMap)
      .map(([category, count]) => ({
        category,
        availability: count,
        recommendation: (count as number) < 3 ? "URGENT_ACQUISITION" : "MONITOR"
      }))
      .sort((a, b) => (a.availability as number) - (b.availability as number));
  }
};

/**
 * ============================================================
 * UNIFIED SYSTEM EXPORT (THE EML KERNEL)
 * ============================================================
 */
export const EMLCore = {
  // Engines
  ai: AIEngine,
  ceo: CEOLayer,

  // Direct High-Performance Accessors
  getScore: (deal: Deal) => AIEngine.scoreDeal(deal),
  getMarketHealth: (deals: Deal[]) => AIEngine.analyzeMarketHealth(deals),
  getPulse: (deals: Deal[]) => CEOLayer.marketPulse(deals),
  
  // Global Metadata
  version: "3.0.4-PRO",
  node: "EML-ETH-ADDIS",
  lastHeal: new Date().toISOString()
};
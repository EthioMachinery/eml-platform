import { TMCore, Deal } from "./tmCore";

/**
 * =========================
 * CEO INTELLIGENCE ENGINE
 * CLEAN ARCHITECTURE VERSION
 * =========================
 */

export const CEOIntelligence = {
  /**
   * Risk overview
   */
  riskSummary(deals: Deal[]) {
    const risky = deals.filter(
      (d) => TMCore.ai.detectFraud(d).level !== "SAFE"
    ).length;

    const highValue = deals.filter(
      (d) => (d.price || 0) > 1000000
    ).length;

    return {
      total: deals.length,
      risky,
      highValue,
      riskRatio: deals.length
        ? risky / deals.length
        : 0,
    };
  },

  /**
   * Market heat index
   */
  marketHeat(deals: Deal[]) {
    const avg =
      deals.reduce((sum, d) => sum + (d.price || 0), 0) /
      (deals.length || 1);

    return {
      averageDealValue: avg,
      heat:
        avg > 800000
          ? "HOT"
          : avg > 300000
          ? "WARM"
          : "COLD",
    };
  },

  /**
   * Fraud cluster detection
   */
  fraudClusters(deals: Deal[]) {
    return deals
      .filter(
        (d) => TMCore.ai.detectFraud(d).level === "DANGEROUS"
      )
      .map((d) => ({
        id: d.id,
        reason: "High risk pattern detected",
      }));
  },

  /**
   * Growth opportunities
   */
  growthSignals(deals: Deal[]) {
    return deals.filter((d) => {
      const risk = TMCore.ai.detectFraud(d);
      return risk.level === "SAFE" && (d.price || 0) > 250000;
    });
  },
};
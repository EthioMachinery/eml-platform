import { AIEngine } from "./aiEngine";

export const AICEO = {
  // =========================
  // REVENUE ANALYSIS
  // =========================
  analyzeRevenue: (deals: any[]) => {
    let total = 0;

    deals.forEach((d) => {
      if (d.status === "completed") {
        total += d.price || 0;
      }
    });

    if (total < 100000) {
      return "⚠ Low revenue. Increase marketing and machine listings.";
    }

    if (total < 500000) {
      return "📈 Growing revenue. Optimize conversion rates.";
    }

    return "🚀 Strong revenue performance. Scale operations.";
  },

  // =========================
  // CONVERSION ANALYSIS
  // =========================
  analyzeConversion: (deals: any[]) => {
    const total = deals.length;
    const completed = deals.filter((d) => d.status === "completed").length;

    if (total === 0) return "No data yet.";

    const rate = (completed / total) * 100;

    if (rate < 20) return "❌ Low conversion rate. Improve trust and pricing.";
    if (rate < 50) return "⚖ Moderate conversion. Optimize UX and speed.";

    return "✅ High conversion rate. System is efficient.";
  },

  // =========================
  // FRAUD INSIGHT
  // =========================
  analyzeRisk: (deals: any[]) => {
    const risky = deals.filter(
      (d) => AIEngine.detectFraud(d) === "HIGH RISK"
    );

    if (risky.length > 0) {
      return `🚨 ${risky.length} high-risk deals detected. Immediate review required.`;
    }

    return "🟢 System safe. No major fraud detected.";
  },

  // =========================
  // GROWTH STRATEGY
  // =========================
  growthStrategy: (machines: any[], deals: any[]) => {
    if (machines.length < 10) {
      return "📢 Add more machines to increase supply.";
    }

    if (deals.length < machines.length) {
      return "🎯 Increase demand through marketing.";
    }

    return "⚡ Balance supply-demand. Scale platform.";
  },
};
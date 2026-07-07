import { EMLCore, Deal } from "./emlCore";

/**
 * =========================
 * LIVE INTELLIGENCE ENGINE
 * REAL-TIME EVENT STREAM
 * =========================
 */

type LiveCallback = (data: any) => void;

export const LiveEngine = {
  /**
   * Subscribe to real-time deal intelligence stream
   */
  subscribe(callback: LiveCallback) {
    console.log("LiveEngine started...");

    const interval = setInterval(async () => {
      const { supabase } = await import("@/lib/supabaseClient");

      const { data } = await supabase
        .from("machinery")
        .select("*")
        .limit(5);

      const deals: Deal[] = data || [];

      deals.forEach((deal) => {
        // FIX: use ai layer
        const risk = EMLCore.ai.detectFraud(deal);

        const score = EMLCore.ai.scoreDeal(deal);

        callback({
          event: "deal_update",
          deal,
          risk,
          score,
          timestamp: new Date().toISOString(),
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  },

  /**
   * Single deal real-time analysis
   */
  analyzeDeal(deal: Deal) {
    const risk = EMLCore.ai.detectFraud(deal);
    const score = EMLCore.ai.scoreDeal(deal);

    return {
      deal,
      risk,
      score,
    };
  },
};
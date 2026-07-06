import { TMCore, type Deal } from "./tmCore";

/**
 * =========================
 * LIVE INTELLIGENCE ENGINE
 * REAL-TIME EVENT STREAM
 * =========================
 */

type LiveCallback = (data: unknown) => void;

export const LiveEngine = {
  /**
   * Subscribe to real-time deal intelligence stream
   */
  subscribe(callback: LiveCallback) {
    let inFlight = false;

    const interval = setInterval(async () => {
      if (inFlight) return;
      inFlight = true;

      try {
        const { supabase } = await import("@/lib/supabaseClient");

        const { data, error } = await supabase
          .from("machinery")
          .select("*")
          .limit(5);

        if (error) {
          callback({
            event: "live_engine_error",
            message: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const deals: Deal[] = data || [];

        deals.forEach((deal) => {
          const risk = TMCore.ai.detectFraud(deal);
          const score = TMCore.ai.scoreDeal(deal);

          callback({
            event: "deal_update",
            deal,
            risk,
            score,
            timestamp: new Date().toISOString(),
          });
        });
      } catch (err) {
        callback({
          event: "live_engine_error",
          message: err instanceof Error ? err.message : "Unknown live engine error",
          timestamp: new Date().toISOString(),
        });
      } finally {
        inFlight = false;
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  /**
   * Single deal real-time analysis
   */
  analyzeDeal(deal: Deal) {
    const risk = TMCore.ai.detectFraud(deal);
    const score = TMCore.ai.scoreDeal(deal);

    return {
      deal,
      risk,
      score,
    };
  },
};

import { supabase } from "@/lib/supabaseClient";
import { CEOAutopilot } from "@/core/ceoAutopilot";
import { Deal } from "@/core/emlCore";

/**
 * =========================
 * MARKET STREAM ENGINE
 * =========================
 */

export const MarketStream = {
  channel: null as any,

  async init() {
    this.channel = supabase
      .channel("market-stream")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
        },
        async (payload) => {
          await this.handleEvent(
            payload.new
          );
        }
      )
      .subscribe();

    return {
      active: true,
    };
  },

  async handleEvent(
    deal: Deal
  ) {
    if (
      CEOAutopilot?.process
    ) {
      await CEOAutopilot.process(
        deal
      );
    }

    return true;
  },

  stop() {
    if (
      this.channel
    ) {
      supabase.removeChannel(
        this.channel
      );
    }
  },
};
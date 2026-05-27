import { EMLKernel } from "@/core/emlKernel";
import { EMLGovernor } from "@/core/emlGovernor";
import { supabase } from "@/lib/supabaseClient";
import { Deal } from "@/core/emlCore";

export const EMLServer = {
  running: false,

  async start() {
    this.running = true;

    await EMLKernel.start();

    await supabase
      .from("eml_events")
      .insert([
        {
          type: "SERVER",
          title: "EML Server Started",
          description: "Core services online",
        },
      ]);

    return true;
  },

  async processDeal(
    deal: Deal
  ) {
    return EMLGovernor.evaluate(
      deal
    );
  },

  status() {
    return {
      running:
        this.running,
      timestamp:
        Date.now(),
    };
  },

  stop() {
    this.running = false;
  },
};
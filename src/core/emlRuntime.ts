import { EMLServer } from "@/core/emlServer";
import { supabase } from "@/lib/supabaseClient";

export const EMLRuntime = {
  running: false,

  async boot() {
    this.running = true;

    if (EMLServer?.start) {
      await EMLServer.start();
    }

    await supabase
      .from("eml_events")
      .insert([
        {
          type: "RUNTIME",
          title: "EML Runtime Started",
          description: "System boot successful",
        },
      ]);

    return true;
  },

  status() {
    return {
      running: this.running,
      timestamp: Date.now(),
    };
  },

  stop() {
    this.running = false;
  },
};
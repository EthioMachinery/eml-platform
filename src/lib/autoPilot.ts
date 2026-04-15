import { supabase } from "./supabaseClient";
import { AIEngine } from "./aiEngine";

export const AutoPilot = {
  // =========================
  // AUTO PRICE OPTIMIZATION
  // =========================
  optimizePrices: async () => {
    const { data: machines } = await supabase
      .from("machines")
      .select("*");

    if (!machines) return;

    for (const m of machines) {
      const suggested = AIEngine.suggestPrice(m, machines);

      // Only update if big difference
      if (Math.abs((m.price || 0) - suggested) > 1000) {
        await supabase
          .from("machines")
          .update({ price: suggested })
          .eq("id", m.id);
      }
    }
  },

  // =========================
  // PROMOTE LOW-DEMAND MACHINES
  // =========================
  promoteMachines: async () => {
    const { data: machines } = await supabase
      .from("machines")
      .select("*");

    const { data: deals } = await supabase
      .from("deals")
      .select("*");

    if (!machines || !deals) return;

    for (const m of machines) {
      const demand = deals.filter(
        (d) => d.machine_id === m.id
      ).length;

      if (demand < 2) {
        await supabase
          .from("machines")
          .update({ promoted: true })
          .eq("id", m.id);
      }
    }
  },

  // =========================
  // AUTO FLAG HIGH DEMAND
  // =========================
  highlightHotMachines: async () => {
    const { data: machines } = await supabase
      .from("machines")
      .select("*");

    const { data: deals } = await supabase
      .from("deals")
      .select("*");

    if (!machines || !deals) return;

    for (const m of machines) {
      const demand = deals.filter(
        (d) => d.machine_id === m.id
      ).length;

      if (demand > 5) {
        await supabase
          .from("machines")
          .update({ trending: true })
          .eq("id", m.id);
      }
    }
  },

  // =========================
  // RUN FULL AUTOPILOT
  // =========================
  run: async () => {
    await AutoPilot.optimizePrices();
    await AutoPilot.promoteMachines();
    await AutoPilot.highlightHotMachines();
  },
};
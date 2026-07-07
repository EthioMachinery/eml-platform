import { supabase } from "@/lib/supabaseClient";
import { Deal } from "@/core/emlCore";
import { DealCloser } from "@/core/dealCloser";
import { PricingEngine } from "@/core/pricingEngine";

export const EventBus = {
  async emit(
    type: string,
    payload: any
  ) {
    await supabase
      .from("eml_events")
      .insert([
        {
          type,
          title: type,
          description:
            "System event",
          metadata:
            payload,
        },
      ]);

    return true;
  },

  async processDeal(
    deal: Deal
  ) {
    const pricing =
      await PricingEngine.calculatePrice(
        deal
      );

    const closed =
      await DealCloser.process(
        deal
      );

    await this.emit(
      "DEAL_EVENT",
      {
        pricing,
        closed,
      }
    );

    return {
      pricing,
      closed,
    };
  },
};
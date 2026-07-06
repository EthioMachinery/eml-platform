import { supabase } from "@/lib/supabaseClient";
import { Deal } from "@/core/tmCore";

export type LiveEvent = {
  id?: string;
  type: string;
  title: string;
  description?: string;
  metadata?: any;
  timestamp: number;
};

export const EventStream = {
  async emit(
    type: string,
    title: string,
    description?: string,
    metadata?: any
  ) {
    const event: LiveEvent = {
      type,
      title,
      description,
      metadata,
      timestamp: Date.now(),
    };

    await supabase
      .from("tm_events")
      .insert([event]);

    return event;
  },

  async dealCreated(
    deal: Deal
  ) {
    return this.emit(
      "DEAL_CREATED",
      "New Deal Created",
      deal.title || "Untitled deal",
      deal
    );
  },

  async getRecent(
    limit = 20
  ) {
    const { data } =
      await supabase
        .from("tm_events")
        .select("*")
        .order(
          "timestamp",
          {
            ascending: false,
          }
        )
        .limit(limit);

    return data || [];
  },
};
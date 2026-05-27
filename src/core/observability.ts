import { supabase } from "@/lib/supabaseClient";
import { Deal } from "@/core/emlCore";

/**
 * =========================
 * OBSERVABILITY ENGINE
 * Logs + tracing + metrics
 * =========================
 */

export type TraceLevel =
  | "INFO"
  | "WARN"
  | "ERROR";

export type TraceEvent = {
  id?: string;
  type: string;
  level: TraceLevel;
  message: string;
  metadata?: any;
  timestamp?: number;
};

export const Observability = {
  async trace(
    event: TraceEvent
  ) {
    const payload = {
      ...event,
      timestamp:
        Date.now(),
    };

    await supabase
      .from("eml_events")
      .insert([
        {
          type:
            payload.type,
          title:
            payload.level,
          description:
            payload.message,
          metadata:
            payload,
        },
      ]);

    return payload;
  },

  async traceDecision(
    deal: Deal,
    decision: any
  ) {
    return this.trace({
      type:
        "AI_DECISION",
      level:
        "INFO",
      message:
        "Deal evaluated",
      metadata: {
        deal,
        decision,
      },
    });
  },

  async health() {
    return {
      ok: true,
      timestamp:
        Date.now(),
    };
  },

  async stream(
    limit = 20
  ) {
    const { data } =
      await supabase
        .from("eml_events")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(limit);

    return data || [];
  },
};
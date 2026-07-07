import { supabase } from "@/lib/supabaseClient";
import { liveEventBus } from "./liveEventBus";
import { TMActivityEvent } from "./eventTypes";

export async function logEvent(event: TMActivityEvent) {
  // 1. Save to database (SOURCE OF TRUTH)
  const { error } = await supabase.from("tm_events").insert({
    id: event.id,
    type: event.type,
    title: event.title,
    description: event.description,
    user_id: event.userId,
    entity_id: event.entityId,
    metadata: event.metadata,
    created_at: event.timestamp,
  });

  if (error) {
    console.error("Event DB error:", error.message);
  }

  // 2. Emit locally for instant UI response
  liveEventBus.emit(event);

  console.log("[TM EVENT SAVED]", event.type);
}
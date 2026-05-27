import { supabase } from "@/lib/supabaseClient";

export type AutomationEventType =
  | "DEAL_CREATED"
  | "DEAL_RISK_ANALYZED"
  | "DEAL_SCORED"
  | "OPPORTUNITY_DETECTED"
  | "FRAUD_ALERT"
  | "AUTO_MATCH";

export async function emitAutomationEvent(
  event_type: AutomationEventType,
  payload: any
) {
  try {
    await supabase.from("automation_events").insert({
      event_type,
      payload,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Automation event failed:", err);
  }
}
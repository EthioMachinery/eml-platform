import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("provider_notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Structured event log — feeds CEO live stream
    await logEvent({ id: crypto.randomUUID(), type: 'REQUEST_POSTED', title: 'Provider Lead', timestamp: new Date().toISOString() }).catch(() => {});
    await logEvent({ id: crypto.randomUUID(), type: "SYSTEM_ALERT", title: "Provider Lead", timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json({
      success: false
    });
  }

  return NextResponse.json({
    success: true,
    leads: data
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const leadId = body.id;

    // 1. update lead status
    const { data: lead } = await supabase
      .from("provider_notifications")
      .update({
        status: "accepted"
      })
      .eq("id", leadId)
      .select()
      .single();

    // 2. create deal
    await supabase
      .from("deals")
      .insert({
        request_id: lead.request_id,
        provider_id: lead.provider_id,
        provider_user_id: lead.provider_user_id,
        status: "pending",
        amount: 0
      });

    return NextResponse.json({
      success: true
    });
  } catch {
    return NextResponse.json({
      success: false
    });
  }
}

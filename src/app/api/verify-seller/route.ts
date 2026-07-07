import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {

  try {

    const body =
      await req.json();

    const { user_id } = body;

    const { data, error } =
      await supabase
        .from("profiles")
        .update({
          verified: true,
        })
        .eq("id", user_id)
        .select()
        .single();

    if (error) {
      await logEvent({ id: crypto.randomUUID(), type: "SYSTEM_ALERT", title: "Seller Verified", timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Structured event log — feeds CEO live stream
    await logEvent({ id: crypto.randomUUID(), type: 'USER_REGISTERED', title: 'Seller Verified', timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json(data);

  } catch (err) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

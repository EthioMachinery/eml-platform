import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      user_id,
      plan,
      price,
    } = body;

    const expires =
      new Date();

    expires.setMonth(
      expires.getMonth() + 1
    );

    const { data, error } =
      await supabase
        .from("subscriptions")
        .insert([
          {
            user_id,
            plan,
            price,
            status: "active",
            expires_at:
              expires.toISOString(),
          },
        ])
        .select()
        .single();

    if (error) {
      await logEvent({ id: crypto.randomUUID(), type: "SYSTEM_ALERT", title: "Subscription Event", timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Structured event log — feeds CEO live stream
    await logEvent({ id: crypto.randomUUID(), type: 'PAYMENT_COMPLETED', title: 'Subscription Created', timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json(data);

  } catch (err) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
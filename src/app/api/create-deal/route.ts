import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    machine_id,
    requester_id,
    provider_id,
    deal_type,
    price,
  } = body;

  const commissionRate = 0.1; // 10%
  const commission = price * commissionRate;

  const { data, error } = await supabase
    .from("deals")
    .insert([
      {
        machine_id,
        requester_id,
        provider_id,
        deal_type,
        price,
        commission,
      },
    ])
    .select()
    .single();

  if (error) {
    // Structured event log — feeds CEO live stream
    await logEvent({ id: crypto.randomUUID(), type: 'DEAL_CREATED', title: 'Deal Created', timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json({ error });
  }

  return NextResponse.json(data);
}
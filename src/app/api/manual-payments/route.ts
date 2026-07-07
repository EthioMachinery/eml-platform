import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data } = await supabase
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    success: true,
    payments: data || []
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (
    !body?.payer_name ||
    !body?.reference_no ||
    !body?.amount ||
    !body?.payment_method
  ) {
    // Structured event log — feeds CEO live stream
    await logEvent({ id: crypto.randomUUID(), type: 'PAYMENT_INITIATED', title: 'Manual Payment', timestamp: new Date().toISOString() }).catch(() => {});
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  await supabase
    .from("payment_requests")
    .insert({
      payer_name: body.payer_name,
      reference_no: body.reference_no,
      amount: Number(body.amount),
      payment_method: body.payment_method,
      status: "pending"
    });

  return NextResponse.json({
    success: true
  });
}

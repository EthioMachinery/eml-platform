import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    success: true,
    payments: data || []
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = Number(body.amount || 0);
    const dealId = body.deal_id;
    const payerId = body.payer_id;
    const idempotencyKey =
      String(body.idempotency_key || "");

    const commission =
      Math.round(amount * 0.05 * 100) / 100;

    const providerAmount =
      amount - commission;

    if (!dealId || !payerId || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from("payments")
      .insert({
        deal_id: dealId,
        payer_id: payerId,
        user_id: payerId,
        idempotency_key:
          idempotencyKey ||
          `${dealId}:${payerId}:${amount}:${Date.now()}`,
        amount,
        commission,
        status: "paid"
      })
      .select()
      .single();

    await supabase
      .from("deals")
      .update({
        status: "paid",
        amount
      })
      .eq("id", dealId);

    return NextResponse.json({
      success: true,
      payment: data,
      providerReceives: providerAmount
    });
  } catch {
    return NextResponse.json({
      success: false
    });
  }
}
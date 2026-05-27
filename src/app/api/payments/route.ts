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

    const commission =
      Math.round(amount * 0.05 * 100) / 100;

    const providerAmount =
      amount - commission;

    const { data } = await supabase
      .from("payments")
      .insert({
        deal_id: body.deal_id,
        payer_id: body.payer_id,
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
      .eq("id", body.deal_id);

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
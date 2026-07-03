import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { emitAutomationEvent } from "@/core/automationEmitter";
import { logEvent } from "@/core/logEvent";
import { calculateCommission } from "@/lib/finance/commission";

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

    // Commission from DB-backed engine (falls back to deal-type defaults if unconfigured)
    const commissionBreakdown = await calculateCommission(amount, 'PURCHASE');
    const commission = commissionBreakdown.commission_amount;
    const providerAmount = commissionBreakdown.seller_receives;

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

    // Emit automation event and log payment completion
    await emitAutomationEvent("PAYMENT_COMPLETED", {
      dealId,
      payerId,
      amount,
      commission,
    });

    await logEvent({
      id: crypto.randomUUID(),
      type: "PAYMENT_COMPLETED",
      title: "Payment Completed",
      userId: payerId,
      entityId: dealId,
      metadata: { amount, commission, providerAmount },
      timestamp: new Date().toISOString(),
    });

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
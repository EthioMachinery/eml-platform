import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { DealCloser } from "@/core/dealCloser";
import { emitAutomationEvent } from "@/core/automationEmitter";
import { logEvent } from "@/core/logEvent";
import { calculateCommission } from "@/lib/finance/commission";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const {
      buyer_id,
      seller_id,
      amount,
      machine_id,
      request_id,
    } = body;

    const commissionBreakdown = await calculateCommission(Number(amount), 'PURCHASE');
    const fee = commissionBreakdown.commission_amount;

    const { data, error } =
      await supabase
        .from("deals")
        .insert([
          {
            buyer_id,
            seller_id,
            amount,
            fee,
            machine_id,
            request_id,
            status: "funded",
            payment_status:
              "held_in_escrow",
          },
        ] as any)
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Run deal through intelligence pipeline
    const closer = await DealCloser.process({
      id: data.id,
      price: Number(amount),
      status: "ACTIVE",
    });

    // Emit automation event
    await emitAutomationEvent("DEAL_CREATED", { dealId: data.id, amount, closer });

    // Structured event log
    await logEvent({
      id: crypto.randomUUID(),
      type: "DEAL_CREATED",
      title: "Escrow Deal Created",
      entityId: data.id,
      metadata: { amount, buyer_id, seller_id, machine_id },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ...data, intelligence: closer });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

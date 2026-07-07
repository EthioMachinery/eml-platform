import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { AutomationEngine } from "@/core/automationEngine";
import { AutoTrigger } from "@/core/autoTrigger";
import { TMGovernor } from "@/core/tmGovernor";
import { logEvent } from "@/core/logEvent";
import { Deal } from "@/core/tmCore";

/**
 * Create new deal + trigger automation
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const deal: Deal = body;

    const { data, error } = await supabase
      .from("deals")
      .insert(deal)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 1. Governor gates the deal on risk
    const govResult = TMGovernor.evaluate(data);
    if (govResult.status === "BLOCKED") {
      return NextResponse.json(
        { error: "Deal blocked by risk engine", risk: govResult.risk },
        { status: 422 }
      );
    }

    // 2. Automation engine scores and flags
    const automationEvent = {
      id: crypto.randomUUID(),
      type: "DEAL_CREATED" as const,
      title: "New Deal Created",
      entityId: data.id,
      metadata: { price: data.amount, risk: govResult.risk, score: govResult.score },
      timestamp: new Date().toISOString(),
    };
    const automation = await AutomationEngine.process(automationEvent);

    // 3. Auto-trigger records decision to DB
    const trigger = await AutoTrigger.processDeal(data);

    // 4. Structured event log
    await logEvent(automationEvent);

    return NextResponse.json({
      success: true,
      deal: data,
      automation,
      trigger,
      governor: govResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Deal creation failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

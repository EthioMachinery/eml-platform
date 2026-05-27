import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { AutomationEngine } from "@/lib/automationEngine";
import { Deal } from "@/core/emlCore";

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

    // Trigger automation engine
    const automation = await AutomationEngine.processDeal(data);

    return NextResponse.json({
      success: true,
      deal: data,
      automation,
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
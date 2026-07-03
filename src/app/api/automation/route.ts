import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { AutoTrigger } from "@/core/autoTrigger";
import { Deal } from "@/core/tmCore";

/**
 * Trigger automation pipeline
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const deal: Deal = body.deal;

    if (!deal) {
      return NextResponse.json(
        { error: "No deal provided" },
        { status: 400 }
      );
    }

    const result = await AutoTrigger.processDeal(deal);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Automation failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
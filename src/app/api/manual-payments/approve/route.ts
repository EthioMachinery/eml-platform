import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  await supabase
    .from("payment_requests")
    .update({
      status: "approved"
    })
    .eq("id", body.id);

  return NextResponse.json({
    success: true
  });
}

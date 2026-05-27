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

  await supabase
    .from("payment_requests")
    .insert({
      payer_name: body.payer_name,
      reference_no: body.reference_no,
      amount: body.amount,
      payment_method: body.payment_method,
      status: "pending"
    });

  return NextResponse.json({
    success: true
  });
}
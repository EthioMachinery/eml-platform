import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const fee =
      Number(amount) * 0.05;

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

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      type,
      amount,
      note,
      status,
    } = body;

    const { data, error } =
      await supabase
        .from("wallet_transactions")
        .insert([
          {
            user_id,
            type,
            amount,
            note,
            status,
          },
        ])
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
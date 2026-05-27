import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      user_id,
      plan,
      price,
    } = body;

    const expires =
      new Date();

    expires.setMonth(
      expires.getMonth() + 1
    );

    const { data, error } =
      await supabase
        .from("subscriptions")
        .insert([
          {
            user_id,
            plan,
            price,
            status: "active",
            expires_at:
              expires.toISOString(),
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
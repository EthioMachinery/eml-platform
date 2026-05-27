import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {

  try {

    const body =
      await req.json();

    const { user_id } = body;

    const { data, error } =
      await supabase
        .from("profiles")
        .update({
          verified: true,
        })
        .eq("id", user_id)
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
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {

  const body = await req.json();

  const { requester_id, machine_id } = body;

  if (!requester_id || !machine_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("contact_requests")
    .insert([
      {
        requester_id,
        machine_id,
        status: "pending",
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
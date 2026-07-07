import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/adminClient";
import { getSession } from "@/lib/auth/getSession";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("*, profiles!sender_id(full_name, phone, is_verified), listings(brand, model, price_sale)")
    .eq("owner_id", session.userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data });
}

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const allowed = ["new", "contacted", "negotiating", "closed", "rejected"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ status })
    .eq("id", id)
    .eq("owner_id", session.userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

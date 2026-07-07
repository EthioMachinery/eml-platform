import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/adminClient";
import { getSession } from "@/lib/auth/getSession";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notifications: data });
}

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  const query = id
    ? supabaseAdmin.from("notifications").update({ read: true }).eq("id", id).eq("user_id", session.userId)
    : supabaseAdmin.from("notifications").update({ read: true }).eq("user_id", session.userId);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Helper: create a notification (used by other API routes)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, type, title, message, link } = body;

  if (!user_id || !title) return NextResponse.json({ error: "user_id and title required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id, type: type || "system", title, message, link, read: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

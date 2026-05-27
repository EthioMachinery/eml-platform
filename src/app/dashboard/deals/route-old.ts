import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    success: true,
    deals: data || []
  });
}
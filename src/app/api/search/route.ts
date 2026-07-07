import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/adminClient";
import type { NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["machinery", "requests", "all"]).default("all"),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = schema.safeParse({
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "all",
    limit: searchParams.get("limit") || 20,
  });

  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const { q, type, limit } = parsed.data;
  const results: Record<string, any[]> = {};

  if (type === "machinery" || type === "all") {
    const { data } = await supabaseAdmin
      .from("listings")
      .select("id, brand, model, category, price_sale, price_rental_daily, city, image_url, status")
      .eq("status", "active")
      .or(`brand.ilike.%${q}%,model.ilike.%${q}%,category.ilike.%${q}%,city.ilike.%${q}%`)
      .limit(limit);
    results.machinery = data || [];
  }

  if (type === "requests" || type === "all") {
    const { data } = await supabaseAdmin
      .from("machinery_requests")
      .select("id, title, category, budget, currency, location, status")
      .eq("status", "open")
      .or(`title.ilike.%${q}%,category.ilike.%${q}%,location.ilike.%${q}%`)
      .limit(limit);
    results.requests = data || [];
  }

  return NextResponse.json({ query: q, results });
}

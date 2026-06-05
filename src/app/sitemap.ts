import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize a database client for server-side sitemap generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.ethiomachinerylink.com";

  // 1. Define EML Static Core Pages
  const staticPages = [
    "",
    "/browse",
    "/tenders",
    "/jobs",
    "/escrow",
    "/financing",
    "/insurance",
    "/fleet",
    "/signup",
    "/login"
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Fetch Active Listings dynamically from Supabase
  let dynamicListings: MetadataRoute.Sitemap = [];
  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("status", "verified_available");

    if (listings) {
      dynamicListings = listings.map((item) => ({
        url: `${baseUrl}/machinery/${item.id}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Sitemap listings generation error:", err);
  }

  // 3. Fetch Active Tenders dynamically from Supabase
  let dynamicTenders: MetadataRoute.Sitemap = [];
  try {
    const { data: tenders } = await supabase
      .from("tenders")
      .select("id, updated_at");

    if (tenders) {
      dynamicTenders = tenders.map((item) => ({
        url: `${baseUrl}/tenders`, // Tenders query list anchor
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Sitemap tenders generation error:", err);
  }

  // Combine static and dynamic routes into a single sitemap array
  return [...staticRoutes, ...dynamicListings, ...dynamicTenders];
}
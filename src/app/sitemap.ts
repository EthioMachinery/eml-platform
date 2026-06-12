import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize a server-side database client for sitemap generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = "https://ethiomachinery.vercel.app";
const SUPPORTED_LANGS = ["en", "am", "or", "ti"] as const;

type Lang = (typeof SUPPORTED_LANGS)[number];

/**
 * Generate alternate language URLs for a given path.
 * Since the app uses client-side i18n, we inject ?lang= params so that
 * web crawlers can discover all language versions.
 */
function buildLangAlternates(path: string): { lang: string; url: string }[] {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
    url: lang === "en"
      ? `${BASE_URL}${path}`
      : `${BASE_URL}${path}?lang=${lang}`,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Core Pages — all indexed with English as canonical + lang alternates
  const staticPages = [
    "",
    "/browse",
    "/tenders",
    "/jobs",
    "/escrow",
    "/financing",
    "/insurance",
    "/fleet",
    "/operators",
    "/logistics",
    "/about",
    "/contact",
    "/signup",
    "/login",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.flatMap((route) => {
    const alternates = buildLangAlternates(route);
    // Canonical English route
    const canonical: MetadataRoute.Sitemap[0] = {
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
    };
    // Language-specific alternate routes for indexing
    const langRoutes: MetadataRoute.Sitemap = alternates
      .filter((a) => a.lang !== "en")
      .map((a) => ({
        url: a.url,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    return [canonical, ...langRoutes];
  });

  // 2. Dynamic Machinery Listings from the active 'machinery' table
  let dynamicListings: MetadataRoute.Sitemap = [];
  try {
    const { data: machines, error } = await supabase
      .from("machinery")
      .select("id, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Sitemap machinery query error:", error.message);
    }

    if (machines && machines.length > 0) {
      dynamicListings = machines.flatMap((item) => {
        const lastMod = item.created_at ? new Date(item.created_at) : new Date();
        return SUPPORTED_LANGS.map((lang) => ({
          url: lang === "en"
            ? `${BASE_URL}/machines/${item.id}`
            : `${BASE_URL}/machines/${item.id}?lang=${lang}`,
          lastModified: lastMod,
          changeFrequency: "weekly" as const,
          priority: 0.75,
        }));
      });
    }
  } catch (err) {
    console.error("Sitemap listings generation error:", err);
  }

  // 3. Dynamic Tenders — canonical list page per unique updated_at
  let dynamicTenders: MetadataRoute.Sitemap = [];
  try {
    const { data: tenders, error } = await supabase
      .from("tenders")
      .select("id, updated_at")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Sitemap tenders query error:", error.message);
    }

    if (tenders && tenders.length > 0) {
      // Index individual tender detail pages with language alternates
      dynamicTenders = tenders.flatMap((item) => {
        const lastMod = item.updated_at ? new Date(item.updated_at) : new Date();
        return SUPPORTED_LANGS.map((lang) => ({
          url: lang === "en"
            ? `${BASE_URL}/tenders`
            : `${BASE_URL}/tenders?lang=${lang}`,
          lastModified: lastMod,
          changeFrequency: "daily" as const,
          priority: 0.8,
        }));
      });

      // Deduplicate tender URLs — only one entry per unique URL
      const seen = new Set<string>();
      dynamicTenders = dynamicTenders.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
      });
    }
  } catch (err) {
    console.error("Sitemap tenders generation error:", err);
  }

  return [...staticRoutes, ...dynamicListings, ...dynamicTenders];
}
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ethiomachinery.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/browse",
          "/machines/",
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
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/founder-admin/",
          "/founder-login/",
          "/dashboard/",
          "/command-center/",
          "/control-center/",
          "/ai-command/",
          "/ai-agents/",
          "/eml-os/",
          "/eml-cloud/",
          "/eml-identity/",
          "/eml-payments/",
          "/_next/",
        ],
      },
      // Allow Googlebot full access to indexable pages
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/browse",
          "/machines/",
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
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/founder-admin/",
          "/founder-login/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

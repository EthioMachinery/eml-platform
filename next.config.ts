import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ncmhztlaogviekbfmufc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    // IMPORTANT:
    // disables Next.js image optimization
    // prevents timeout + 500 errors
    unoptimized: true,
  },
};

export default nextConfig;
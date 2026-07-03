import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ncmhztlaogviekbfmufc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "trustworthymachinery.vercel.app",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
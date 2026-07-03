/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
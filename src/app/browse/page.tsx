import React from "react";
import { Metadata } from "next";
import EMLUniversalMarketplace from "@/components/system/EMLUniversalMarketplace";

// Server-side static SEO metadata for this route
export const metadata: Metadata = {
  title: "Browse Machinery | Ethio Machinery Link (EML)",
  description: "Search and filter heavy construction equipment for rent or sale in Addis Ababa and across Ethiopia.",
};

export default function BrowsePage() {
  return (
    <div className="bg-black min-h-screen py-6">
      <EMLUniversalMarketplace />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Star,
  Phone,
  MessageCircle,
  ShieldCheck,
  Crown,
  Building2,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type Seller = {
  id: string;
  full_name: string;
  company_name: string;
  city: string;
  region: string;
  phone: string;
  bio: string;
  verified: boolean;
  premium: boolean;
  company_account: boolean;
  created_at: string;
};

type Machinery = {
  id: string;
  title: string;
  price: string;
  image_url: string;
  location: string;
  listing_type: string;
  condition: string;
  views: number;
};

export default function SellerPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const params = useParams();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [machines, setMachines] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadSeller(params.id as string);
    }
  }, [params]);

  async function loadSeller(id: string) {
    setLoading(true);

    const { data: sellerData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (sellerData) {
      setSeller(sellerData);

      const { data: machineryData } = await supabase
        .from("machinery")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      setMachines(machineryData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-2xl font-black text-blue-700">
          Loading Seller...
        </div>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-6">
            Seller Not Found
          </h1>
          <Link
            href="/browse"
            className="inline-flex px-8 h-14 rounded-2xl bg-blue-700 text-white items-center font-black"
          >
            Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const sellerName = seller.company_name || seller.full_name || "Seller";

  const joinedYear = seller.created_at
    ? new Date(seller.created_at).getFullYear()
    : "2024";

  const whatsappNumber = seller.phone?.replace(/\s/g, "")?.replace("+", "") || "";

  const whatsappMessage = encodeURIComponent(
    `Hello ${sellerName}, I found your company profile on TM and I am interested in your machinery listings.`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const totalViews = machines.reduce(
    (sum, item) => sum + (item.views || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-blue-800 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            {/* AVATAR */}
            <div className="flex justify-center md:justify-start">
              <div className="w-36 h-36 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-6xl font-black shadow-2xl">
                {sellerName.charAt(0)}
              </div>
            </div>

            {/* SELLER INFO */}
            <div className="md:col-span-2 text-center md:text-left">
              
              {/* BADGES */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {seller.verified && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-black">
                    <ShieldCheck size={16} />
                    {t("Verified Seller", "የተረጋገጠ ሻጭ")}
                  </div>
                )}

                {seller.premium && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-black">
                    <Crown size={16} />
                    {t("Premium Seller", "ፕሪሚየም ሻጭ")}
                  </div>
                )}

                {seller.company_account && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-black border border-white/20">
                    <Building2 size={16} />
                    {t("Company Account", "የኩባንያ መለያ")}
                  </div>
                )}
              </div>

              {/* NAME */}
              <h1 className="text-4xl md:text-6xl font-black mt-5 leading-tight">
                {sellerName}
              </h1>

              {/* LOCATION */}
              <div className="mt-5 flex flex-wrap gap-5 justify-center md:justify-start text-white/80 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {seller.region || "Ethiopia"}
                  {seller.city ? `, ${seller.city}` : ""}
                </div>

                <div>
                  {t("Joined", "ተቀላቀለ")}{" "}
                  {joinedYear}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                {seller.phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black inline-flex items-center gap-3 transition"
                  >
                    <MessageCircle size={22} />
                    WhatsApp
                  </a>
                )}

                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-black inline-flex items-center gap-3"
                  >
                    <Phone size={22} />
                    {t("Call Seller", "ለሻጭ ይደውሉ")}
                  </a>
                )}

                <Link
                  href="/browse"
                  className="px-8 py-4 rounded-2xl border border-white/40 font-bold hover:bg-white/10 transition"
                >
                  {t("Browse Marketplace", "ገበያውን ይመልከቱ")}
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-5">
          <StatCard value={machines.length} label={t("Listings", "ዝርዝሮች")} />
          <StatCard value="4.9" label={t("Seller Rating", "የሻጭ ደረጃ")} />
          <StatCard value={`${totalViews}+`} label={t("Listing Views", "የማሽነሪ እይታዎች")} />
          <StatCard value="24h" label={t("Avg Response", "አማካይ ምላሽ")} />
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border p-8 shadow-sm">
          <h2 className="text-3xl font-black">
            {t("About Seller", "ስለ ሻጭ")}
          </h2>

          <p className="mt-5 text-gray-600 leading-8 whitespace-pre-line">
            {seller.bio ||
              t(
                "Trusted machinery supplier serving contractors, transport companies and industrial buyers across Ethiopia.",
                "በመላው ኢትዮጵያ ለኮንትራክተሮች፣ ለትራንስፖርት ኩባንያዎች እና ለኢንዱስትሪ ገዢዎች የሚያገለግል የታመነ የማሽነሪ አቅራቢ።"
              )}
          </p>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black">
            {t("Seller Listings", "የሻጭ ማሽነሪዎች")}
          </h2>
        </div>

        {machines.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center text-gray-500">
            {t("No machinery listings yet.", "እስካሁን ምንም ማሽነሪ አልተጨመረም።")}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {machines.map((item) => (
              <Link
                key={item.id}
                href={`/machinery/${item.id}`}
                className="bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🚜
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      <Star size={14} />
                      VERIFIED
                    </div>

                    <div className="text-sm text-gray-500">
                      {item.condition}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mt-3 leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-3xl font-black text-blue-700">
                      {item.price}
                    </div>

                    <div className="text-xs font-bold bg-slate-100 px-3 py-2 rounded-full">
                      {item.listing_type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mt-5">
                    <MapPin size={16} />
                    {item.location || seller.city || "Ethiopia"}
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-3xl border shadow-xl p-6 text-center">
      <div className="text-4xl font-black text-blue-700">
        {value}
      </div>

      <div className="text-gray-500 mt-2">
        {label}
      </div>
    </div>
  );
}
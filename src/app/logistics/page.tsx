"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Clock3,
  ShieldCheck,
  Fuel,
  ChevronRight,
  Weight,
  Route,
  Plus,
  Star,
  Building2,
  ArrowRight,
  BadgeCheck,
  Phone,
  Search,
  Filter,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

export default function TransportPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [requests, setRequests] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransportRequests();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [search, serviceType, providers]);

  async function loadTransportRequests() {
    setLoading(true);

    try {
      // Fetching live transporter records from logistics table
      const { data } = await supabase
        .from("logistics")
        .select("*")
        .order("created_at", { ascending: false });

      setProviders(data || []);
      setFilteredProviders(data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function filterProviders() {
    let result = [...providers];

    if (search) {
      result = result.filter(
        (item) =>
          item.provider_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (serviceType !== "all") {
      result = result.filter((item) => item.service_type === serviceType);
    }

    setFilteredProviders(result);
  }

  const serviceTypes = [
    {
      value: "all",
      label: t("All Services", "ሁሉም አገልግሎቶች"),
    },
    {
      value: "lowbed",
      label: t("Low-Bed", "ሎው-ቤድ"),
    },
    {
      value: "highbed",
      label: t("High-Bed", "ሀይ-ቤድ"),
    },
    {
      value: "fuel",
      label: t("Fuel Transport", "የነዳጅ መጓጓዣ"),
    },
    {
      value: "crane",
      label: t("Crane Transport", "የክሬን መጓጓዣ"),
    },
    {
      value: "machinery",
      label: t("Machinery Delivery", "የማሽነሪ ማጓጓዣ"),
    },
  ];

  const logisticsServices = [
    {
      title: t(
        "Heavy Haulage",
        "ከባድ ጭነት"
      ),
      description: t(
        "Long-distance transport for heavy machinery and oversized equipment.",
        "ከባድ ማሽነሪዎችን ለረጅም ርቀት መጓጓዣ።"
      ),
      icon: Truck,
    },
    {
      title: t(
        "Lowbed Transport",
        "ሎቤድ ትራንስፖርት"
      ),
      description: t(
        "Lowbed trucks for excavators, loaders and road equipment.",
        "ለኤክስካቫተር፣ ሎደር እና የመንገድ ማሽነሪዎች ሎቤድ ትራንስፖርት።"
      ),
      icon: Weight,
    },
    {
      title: t(
        "Fuel Logistics",
        "የነዳጅ ሎጂስቲክስ"
      ),
      description: t(
        "Fuel tanker transport and construction fuel supply.",
        "የነዳጅ ታንከር እና የፕሮጀክት ነዳጅ አቅርቦት።"
      ),
      icon: Fuel,
    },
    {
      title: t(
        "Project Mobilization",
        "ፕሮጀክት ማንቀሳቀስ"
      ),
      description: t(
        "Transport machinery to construction, mining and industrial sites.",
        "ማሽነሪዎችን ወደ ፕሮጀክት ሳይቶች ማጓጓዝ።"
      ),
      icon: Route,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-yellow-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">
              🚛 {t(
                "TM Logistics Network",
                "የTM ሎጂስቲክስ ኔትወርክ"
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {t(
                "Heavy Machinery Transport Ecosystem",
                "የከባድ ማሽነሪ ትራንስፖርት ስርዓት"
              )}
            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">
              {t(
                "TM connects machinery owners, transport companies, lowbed operators, fuel logistics providers and project mobilization teams into one intelligent logistics ecosystem.",
                "TM የማሽነሪ ባለቤቶችን፣ ትራንስፖርት ኩባንያዎችን, ሎቤድ ኦፕሬተሮችን እና የፕሮጀክት ሎጂስቲክስ ባለሙያዎችን በአንድ ስርዓት ያገናኛል።"
              )}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/post-request"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <Plus size={20} />
                {t(
                  "Post Transport Request",
                  "የትራንስፖርት ጥያቄ ይለጥፉ"
                )}
              </Link>

              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Find Transporters",
                  "አጓጓዦችን ያግኙ"
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">24/7</div>
            <div className="mt-3 text-zinc-400">
              {t("Transport Availability", "የመጓጓዣ አገልግሎት")}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">🇪🇹</div>
            <div className="mt-3 text-zinc-400">
              {t("Nationwide Coverage", "በመላው ኢትዮጵያ")}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">100%</div>
            <div className="mt-3 text-zinc-400">
              {t("Verified Providers", "የተረጋገጡ አቅራቢዎች")}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">⚡</div>
            <div className="mt-3 text-zinc-400">
              {t("Fast Dispatch", "ፈጣን ምላሽ")}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* SEARCH */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder={t(
                  "Search provider or location...",
                  "አቅራቢ ወይም ቦታ ይፈልጉ..."
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-yellow-500 text-sm"
              />
            </div>

            {/* SERVICE FILTER */}
            <div className="relative">
              <Filter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-yellow-500 text-sm"
              >
                {serviceTypes.map((item) => (
                  <option key={item.value} value={item.value} className="bg-zinc-950 text-white">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* CTA */}
            <Link
              href="/upload"
              className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center gap-2 transition text-sm"
            >
              <Truck size={18} />
              {t("List Transport Service", "የየመጓጓዣ አገልግሎት ይጨምሩ")}
            </Link>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-yellow-400 font-black tracking-widest mb-3">
              TM LOGISTICS
            </div>
            <h2 className="text-4xl font-black">
              {t("Verified Transport Providers", "የተረጋገጡ አጓጓዦች")}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center text-zinc-400 text-xl font-bold">
            {t(
              "Loading logistics providers...",
              "የሎጂስቲክስ አቅራቢዎች በመጫን ላይ..."
            )}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">
            <div className="text-7xl mb-6">🚛</div>
            <div className="text-3xl font-black mb-4">
              {t("No Providers Found", "ምንም አቅራቢ አልተገኘም")}
            </div>
            <p className="text-zinc-400 mb-8">
              {t(
                "Be the first logistics provider in the TM ecosystem.",
                "በTM ስርዓት ውስጥ የመጀመሪያው አጓጓዥ ይሁኑ።"
              )}
            </p>
            <Link
              href="/upload"
              className="inline-flex bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
            >
              {t("Become Provider", "አቅራቢ ይሁኑ")}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProviders.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="h-56 bg-zinc-800 relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.provider_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">
                      🚚
                    </div>
                  )}

                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black shadow-xl">
                    VERIFIED
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-black">
                      <Truck size={14} />
                      {item.service_type}
                    </div>

                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold">4.9</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black">{item.provider_name}</h3>

                  <div className="mt-4 space-y-3 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {item.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      {item.capacity || "Heavy Duty"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {item.availability || "24/7"}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500">
                        {t("Starting Price", "የየመነሻ ዋጋ")}
                      </div>
                      <div className="text-3xl font-black text-yellow-400">
                        {item.price}
                      </div>
                    </div>

                    <Link
                      href={`/seller/${item.user_id}`}
                      className="w-14 h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button className="h-12 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-yellow-500 transition font-bold flex items-center justify-center gap-2">
                      <Phone size={16} />
                      {t("Contact", "ይደውሉ")}
                    </button>

                    <button className="h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition flex items-center justify-center gap-2">
                      <BadgeCheck size={16} />
                      {t("Book", "ይያዙ")}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* TRUST */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[40px] p-10">
            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
              
              <div className="max-w-3xl">
                <div className="text-yellow-400 font-black tracking-widest mb-4">
                  {t("TM VERIFIED LOGISTICS", "የየTM የተረጋገጠ ሎጂስቲክስ")}
                </div>
                <h2 className="text-4xl font-black mb-6">
                  {t(
                    "Secure & Verified Heavy Transport Network",
                    "ደህንነቱ የተጠበቀ የከባድ ትራንስፖርት ኔትወርክ"
                  )}
                </h2>
                <p className="text-zinc-300 leading-8 text-lg">
                  {t(
                    "TM helps transporters, contractors and machinery owners connect through secure logistics workflows, verified transport providers and transparent transport requests.",
                    "TM አጓጓዦችን፣ ተቋራጮችን እና የማሽነሪ ባለቤቶችን በደህንነቱ በተጠበቀ የሎጂስቲክስ ስርዓት ያገናኛል።"
                  )}
                </p>
              </div>

              <div className="w-28 h-28 rounded-[32px] bg-yellow-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={60} className="text-yellow-400" />
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
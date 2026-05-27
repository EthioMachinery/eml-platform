"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Truck,
  ShieldCheck,
  Search,
  MapPin,
  ChevronRight,
  Fuel,
  Building2,
  Phone,
  Star,
  Filter,
  Clock3,
  ArrowRight,
  BadgeCheck,
  TimerReset,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { useLanguage } from "@/context/LanguageContext";

export default function LogisticsPage() {
  const { t } = useLanguage();

  const [providers, setProviders] =
    useState<any[]>([]);

  const [filteredProviders, setFilteredProviders] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [serviceType, setServiceType] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [
    search,
    serviceType,
    providers,
  ]);

  async function loadProviders() {
    setLoading(true);

    const { data } =
      await supabase
        .from("logistics")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setProviders(data || []);
    setFilteredProviders(data || []);

    setLoading(false);
  }

  function filterProviders() {
    let result = [...providers];

    if (search) {
      result = result.filter(
        (item) =>
          item.provider_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.location
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    if (serviceType !== "all") {
      result = result.filter(
        (item) =>
          item.service_type ===
          serviceType
      );
    }

    setFilteredProviders(result);
  }

  const serviceTypes = [
    {
      value: "all",
      label: t(
        "All Services",
        "ሁሉም አገልግሎቶች"
      ),
    },

    {
      value: "lowbed",
      label: t(
        "Low-Bed",
        "ሎው-ቤድ"
      ),
    },

    {
      value: "highbed",
      label: t(
        "High-Bed",
        "ሀይ-ቤድ"
      ),
    },

    {
      value: "fuel",
      label: t(
        "Fuel Transport",
        "የነዳጅ መጓጓዣ"
      ),
    },

    {
      value: "crane",
      label: t(
        "Crane Transport",
        "የክሬን መጓጓዣ"
      ),
    },

    {
      value: "machinery",
      label: t(
        "Machinery Delivery",
        "የማሽነሪ ማጓጓዣ"
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-yellow-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-black mb-8">

              🚚 EML LOGISTICS NETWORK

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "Heavy Machinery Logistics Marketplace",
                "የከባድ ማሽነሪ ሎጂስቲክስ ገበያ"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              {t(
                "Connect with verified low-bed, high-bed and heavy transport providers across Ethiopia.",
                "በመላው ኢትዮጵያ ካሉ የተረጋገጡ ሎው-ቤድ፣ ሀይ-ቤድ እና ከባድ መጓጓዣ አቅራቢዎች ጋር ይገናኙ።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/upload"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Become Provider",
                  "አቅራቢ ይሁኑ"
                )}
              </Link>

              <Link
                href="/browse"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Browse Machinery",
                  "ማሽነሪዎችን ይመልከቱ"
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

            <div className="text-5xl font-black text-yellow-400">
              24/7
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Transport Availability",
                "የመጓጓዣ አገልግሎት"
              )}
            </div>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <div className="text-5xl font-black text-yellow-400">
              🇪🇹
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Nationwide Coverage",
                "በመላው ኢትዮጵያ"
              )}
            </div>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <div className="text-5xl font-black text-yellow-400">
              100%
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Verified Providers",
                "የተረጋገጡ አቅራቢዎች"
              )}
            </div>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <div className="text-5xl font-black text-yellow-400">
              ⚡
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Fast Dispatch",
                "ፈጣን ምላሽ"
              )}
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

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                placeholder={t(
                  "Search provider or location...",
                  "አቅራቢ ወይም ቦታ ይፈልጉ..."
                )}
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-yellow-500"
              />

            </div>

            {/* SERVICE FILTER */}

            <div className="relative">

              <Filter
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(
                    e.target.value
                  )
                }
                className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-yellow-500"
              >

                {serviceTypes.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* CTA */}

            <Link
              href="/upload"
              className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center gap-2 transition"
            >

              <Truck size={18} />

              {t(
                "List Transport Service",
                "የመጓጓዣ አገልግሎት ይጨምሩ"
              )}

            </Link>

          </div>

        </div>

      </section>

      {/* LISTINGS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="flex items-center justify-between mb-10">

          <div>

            <div className="text-yellow-400 font-black tracking-widest mb-3">
              EML LOGISTICS
            </div>

            <h2 className="text-4xl font-black">

              {t(
                "Verified Transport Providers",
                "የተረጋገጡ አጓጓዦች"
              )}

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

            <div className="text-7xl mb-6">
              🚛
            </div>

            <div className="text-3xl font-black mb-4">

              {t(
                "No Providers Found",
                "ምንም አቅራቢ አልተገኘም"
              )}

            </div>

            <p className="text-zinc-400 mb-8">

              {t(
                "Be the first logistics provider in the EML ecosystem.",
                "በEML ስርዓት ውስጥ የመጀመሪያው አጓጓዥ ይሁኑ።"
              )}

            </p>

            <Link
              href="/upload"
              className="inline-flex bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
            >

              {t(
                "Become Provider",
                "አቅራቢ ይሁኑ"
              )}

            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredProviders.map(
              (item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1"
                >

                  {/* IMAGE */}

                  <div className="h-56 bg-zinc-800 relative overflow-hidden">

                    {item.image_url ? (

                      <img
                        src={
                          item.image_url
                        }
                        alt={
                          item.provider_name
                        }
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

                        {
                          item.service_type
                        }

                      </div>

                      <div className="flex items-center gap-1 text-yellow-400">

                        <Star
                          size={16}
                          fill="currentColor"
                        />

                        <span className="font-bold">
                          4.9
                        </span>

                      </div>

                    </div>

                    <h3 className="text-2xl font-black">
                      {
                        item.provider_name
                      }
                    </h3>

                    <div className="mt-4 space-y-3 text-zinc-400">

                      <div className="flex items-center gap-2">
                        <MapPin size={16} />

                        {
                          item.location
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 size={16} />

                        {
                          item.capacity ||
                          "Heavy Duty"
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 size={16} />

                        {
                          item.availability ||
                          "24/7"
                        }
                      </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between">

                      <div>

                        <div className="text-xs text-zinc-500">
                          {t(
                            "Starting Price",
                            "የመነሻ ዋጋ"
                          )}
                        </div>

                        <div className="text-3xl font-black text-yellow-400">
                          {
                            item.price
                          }
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

                        {t(
                          "Contact",
                          "ይደውሉ"
                        )}

                      </button>

                      <button className="h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition flex items-center justify-center gap-2">

                        <BadgeCheck size={16} />

                        {t(
                          "Book",
                          "ይያዙ"
                        )}

                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </section>

      {/* CTA */}

      <section className="border-t border-zinc-800 bg-zinc-900/50">

        <div className="max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-4xl">

            <div className="text-yellow-400 font-black tracking-widest mb-4">
              EML TRANSPORT NETWORK
            </div>

            <h2 className="text-5xl font-black leading-tight">

              {t(
                "Move Heavy Machinery Across Ethiopia With Confidence",
                "ከባድ ማሽነሪዎችን በመላው ኢትዮጵያ በደህንነት ያንቀሳቅሱ"
              )}

            </h2>

            <p className="mt-6 text-xl text-zinc-400 leading-9">

              {t(
                "EML connects trusted transport providers with machinery owners, contractors and industrial businesses.",
                "EML የታመኑ አጓጓዦችን ከማሽነሪ ባለቤቶች፣ ኮንትራክተሮች እና ኢንዱስትሪ ተቋማት ጋር ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/upload"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Join Logistics Network",
                  "የሎጂስቲክስ አውታረ መረብን ይቀላቀሉ"
                )}
              </Link>

              <Link
                href="/ecosystem"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Explore Ecosystem",
                  "ስርዓቱን ይመልከቱ"
                )}
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
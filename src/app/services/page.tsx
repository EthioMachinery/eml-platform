"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Wrench,
  ShieldCheck,
  Fuel,
  Gauge,
  Truck,
  Cpu,
  ChevronRight,
  Settings,
  Zap,
  HardHat,
  CircleDollarSign,
  Plus,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const [providers, setProviders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);

    const { data } =
      await supabase
        .from("service_providers")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(12);

    setProviders(data || []);

    setLoading(false);
  }

  const services = [
    {
      title: t(
        "Mechanics",
        "መካኒኮች"
      ),

      description: t(
        "Heavy machinery diagnostics, repair and maintenance.",
        "የከባድ ማሽነሪ ምርመራ፣ ጥገና እና አገልግሎት።"
      ),

      icon: Wrench,
    },

    {
      title: t(
        "Hydraulic Experts",
        "ሃይድሮሊክ ባለሙያዎች"
      ),

      description: t(
        "Hydraulic pump, hose and cylinder maintenance.",
        "የሃይድሮሊክ ፓምፕ፣ ሆዝ እና ሲሊንደር ጥገና።"
      ),

      icon: Gauge,
    },

    {
      title: t(
        "Electrical Systems",
        "ኤሌክትሪክ ሲስተሞች"
      ),

      description: t(
        "Machine wiring, ECU, sensors and diagnostics.",
        "የማሽን ዋየሪንግ፣ ECU፣ ሴንሰሮች እና ምርመራ።"
      ),

      icon: Zap,
    },

    {
      title: t(
        "Spare Parts",
        "መለዋወጫ እቃዎች"
      ),

      description: t(
        "Original and aftermarket heavy machinery parts.",
        "ኦሪጅናል እና አፍተርማርኬት መለዋወጫዎች።"
      ),

      icon: Settings,
    },

    {
      title: t(
        "Fuel & Lubricants",
        "ነዳጅ እና ሉብሪካንት"
      ),

      description: t(
        "Fuel supply, oil service and lubricant delivery.",
        "የነዳጅ አቅርቦት፣ ዘይት እና ሉብሪካንት አገልግሎት።"
      ),

      icon: Fuel,
    },

    {
      title: t(
        "Machine Operators",
        "ማሽን ኦፕሬተሮች"
      ),

      description: t(
        "Certified excavator, grader and loader operators.",
        "የተረጋገጡ ኤክስካቫተር፣ ግሬደር እና ሎደር ኦፕሬተሮች።"
      ),

      icon: HardHat,
    },

    {
      title: t(
        "Mobile Repair Teams",
        "ተንቀሳቃሽ የጥገና ቡድኖች"
      ),

      description: t(
        "Emergency field repair for remote project sites.",
        "ለሩቅ ፕሮጀክቶች የፊልድ ጥገና አገልግሎት።"
      ),

      icon: Truck,
    },

    {
      title: t(
        "AI Diagnostics",
        "AI ምርመራ"
      ),

      description: t(
        "Future-ready intelligent machine diagnostics ecosystem.",
        "ዘመናዊ AI የማሽን ምርመራ ስርዓት።"
      ),

      icon: Cpu,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-yellow-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">

              🛠️ {t(
                "EML Service Ecosystem",
                "የEML የአገልግሎት ስርዓት"
              )}

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "Machinery Services Infrastructure",
                "የማሽነሪ አገልግሎት ስርዓት"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">

              {t(
                "EML connects mechanics, workshops, operators, technicians, spare parts suppliers and machinery service providers into one intelligent ecosystem.",
                "EML መካኒኮችን፣ ጋራጆችን፣ ኦፕሬተሮችን፣ ቴክኒሻኖችን እና የመለዋወጫ አቅራቢዎችን በአንድ ዘመናዊ ስርዓት ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/signup"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <Plus size={20} />

                {t(
                  "Become Service Provider",
                  "አገልግሎት ሰጪ ይሁኑ"
                )}
              </Link>

              <Link
                href="/post-request"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Request Service",
                  "አገልግሎት ይጠይቁ"
                )}
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* SERVICE CATEGORIES */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="mb-12">

          <div className="text-yellow-400 font-black tracking-widest mb-4">

            {t(
              "SERVICE CATEGORIES",
              "የአገልግሎት ምድቦች"
            )}

          </div>

          <h2 className="text-4xl font-black">

            {t(
              "Everything Machinery Needs",
              "ማሽነሪ የሚያስፈልገው ሁሉ"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {services.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/30 transition"
                >

                  <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 flex items-center justify-center mb-6">

                    <Icon className="text-yellow-400" />

                  </div>

                  <h3 className="text-2xl font-black mb-4">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 leading-8">
                    {
                      item.description
                    }
                  </p>

                </div>
              );
            }
          )}

        </div>

      </section>

      {/* PROVIDERS */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-3">

                {t(
                  "VERIFIED PROVIDERS",
                  "የተረጋገጡ አቅራቢዎች"
                )}

              </div>

              <h2 className="text-4xl font-black">

                {t(
                  "Machinery Service Network",
                  "የማሽነሪ አገልግሎት ኔትወርክ"
                )}

              </h2>

            </div>

            <Link
              href="/signup"
              className="text-yellow-400 font-bold flex items-center gap-2"
            >
              {t(
                "Join Network",
                "ኔትወርኩን ይቀላቀሉ"
              )}

              <ChevronRight
                size={18}
              />
            </Link>

          </div>

          {loading ? (

            <div className="text-center py-20 text-zinc-500">

              {t(
                "Loading providers...",
                "አቅራቢዎች በመጫን ላይ..."
              )}

            </div>

          ) : providers.length ===
            0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

              <div className="text-2xl font-black mb-4">

                {t(
                  "No providers yet",
                  "እስካሁን አቅራቢ የለም"
                )}

              </div>

              <p className="text-zinc-400 mb-8">

                {t(
                  "Start the machinery services ecosystem by registering the first provider.",
                  "የመጀመሪያውን አቅራቢ በማስገባት ስርዓቱን ይጀምሩ።"
                )}

              </p>

              <Link
                href="/signup"
                className="inline-flex bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Register Provider",
                  "አቅራቢ ይመዝገቡ"
                )}
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {providers.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/30 transition"
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-xs font-black">
                        {
                          item.service_type ||
                          t(
                            "Service",
                            "አገልግሎት"
                          )
                        }
                      </div>

                      <div className="flex items-center gap-2 text-green-400 text-sm font-bold">

                        <ShieldCheck
                          size={16}
                        />

                        VERIFIED

                      </div>

                    </div>

                    <h3 className="text-2xl font-black mb-4">

                      {
                        item.company_name ||
                        item.full_name ||
                        "EML Provider"
                      }

                    </h3>

                    <div className="space-y-4 text-zinc-300">

                      <div>

                        <div className="text-zinc-500 text-sm mb-1">
                          {t(
                            "Location",
                            "አድራሻ"
                          )}
                        </div>

                        <div className="font-bold">
                          {
                            item.location ||
                            "-"
                          }
                        </div>

                      </div>

                      <div>

                        <div className="text-zinc-500 text-sm mb-1">
                          {t(
                            "Specialization",
                            "ስፔሻላይዜሽን"
                          )}
                        </div>

                        <div className="font-bold">
                          {
                            item.specialization ||
                            "-"
                          }
                        </div>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                      <div>

                        <div className="text-zinc-500 text-sm">
                          {t(
                            "Starting Price",
                            "የመነሻ ዋጋ"
                          )}
                        </div>

                        <div className="text-yellow-400 font-black text-2xl">
                          ETB{" "}
                          {Number(
                            item.starting_price ||
                              0
                          ).toLocaleString()}
                        </div>

                      </div>

                      <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black transition">

                        {t(
                          "Hire",
                          "ይቅጠሩ"
                        )}

                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* TRUST */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-yellow-400 font-black tracking-widest mb-4">

                  {t(
                    "EML VERIFIED SERVICES",
                    "የEML የተረጋገጡ አገልግሎቶች"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "Trusted Machinery Service Infrastructure",
                    "የታመነ የማሽነሪ አገልግሎት ስርዓት"
                  )}

                </h2>

                <p className="text-zinc-300 leading-8 text-lg">

                  {t(
                    "EML helps machinery owners connect with verified professionals, mobile repair teams and intelligent service providers across Ethiopia.",
                    "EML የማሽነሪ ባለቤቶችን ከተረጋገጡ ባለሙያዎች እና የጥገና ቡድኖች ጋር ያገናኛል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-yellow-500/20 flex items-center justify-center shrink-0">

                <CircleDollarSign
                  size={60}
                  className="text-yellow-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
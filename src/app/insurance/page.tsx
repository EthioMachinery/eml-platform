"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  Construction,
  BriefcaseBusiness,
  ChevronRight,
  HeartHandshake,
  AlertTriangle,
  Building2,
  Shield,
  FileCheck2,
  Plus,
  BadgeCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

export default function InsurancePage() {
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
        .from(
          "insurance_providers"
        )
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

  const insuranceServices = [
    {
      title: t(
        "Machinery Insurance",
        "የማሽነሪ ኢንሹራንስ"
      ),

      description: t(
        "Protect excavators, loaders, graders and construction equipment.",
        "ኤክስካቫተር፣ ሎደር፣ ግሬደር እና ሌሎች ማሽነሪዎችን ይጠብቁ።"
      ),

      icon: Construction,
    },

    {
      title: t(
        "Fleet Insurance",
        "የፍሊት ኢንሹራንስ"
      ),

      description: t(
        "Insurance coverage for transport fleets and logistics operations.",
        "ለመጓጓዣ ፍሊቶች እና ሎጂስቲክስ የኢንሹራንስ ጥበቃ።"
      ),

      icon: Truck,
    },

    {
      title: t(
        "Contractor Protection",
        "የተቋራጭ ጥበቃ"
      ),

      description: t(
        "Risk protection for contractors and project owners.",
        "ለተቋራጮች እና ለፕሮጀክት ባለቤቶች የጥበቃ አገልግሎት።"
      ),

      icon: BriefcaseBusiness,
    },

    {
      title: t(
        "Cargo Insurance",
        "የጭነት ኢንሹራንስ"
      ),

      description: t(
        "Protect machinery and goods during transportation.",
        "በመጓጓዣ ወቅት ጭነቶችን ይጠብቁ።"
      ),

      icon: ShieldCheck,
    },

    {
      title: t(
        "Rental Protection",
        "የኪራይ ጥበቃ"
      ),

      description: t(
        "Insurance for rental businesses and equipment leasing.",
        "ለኪራይ ንግዶች እና ለሊዝ አገልግሎቶች የጥበቃ ስርዓት።"
      ),

      icon: HeartHandshake,
    },

    {
      title: t(
        "Operator Safety Coverage",
        "የኦፕሬተር ጥበቃ"
      ),

      description: t(
        "Protect machine operators and field personnel.",
        "ኦፕሬተሮችን እና የመስክ ሰራተኞችን ይጠብቁ።"
      ),

      icon: AlertTriangle,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              🛡️ {t(
                "EML Insurance Ecosystem",
                "የEML ኢንሹራንስ ስርዓት"
              )}

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "Machinery Insurance Infrastructure",
                "የማሽነሪ ኢንሹራንስ ስርዓት"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">

              {t(
                "EML connects contractors, machinery owners, transporters, rental businesses and insurance providers into one trusted ecosystem.",
                "EML ተቋራጮችን፣ የማሽነሪ ባለቤቶችን፣ አጓጓዦችን፣ የኪራይ ንግዶችን እና የኢንሹራንስ ተቋማትን በአንድ ስርዓት ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/post-request"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <Plus size={20} />

                {t(
                  "Request Insurance",
                  "ኢንሹራንስ ይጠይቁ"
                )}

              </Link>

              <Link
                href="/signup"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Become Insurance Partner",
                  "የኢንሹራንስ አጋር ይሁኑ"
                )}

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* SERVICES */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="mb-12">

          <div className="text-cyan-400 font-black tracking-widest mb-4">

            {t(
              "INSURANCE SERVICES",
              "የኢንሹራንስ አገልግሎቶች"
            )}

          </div>

          <h2 className="text-4xl font-black">

            {t(
              "Enterprise Machinery Protection",
              "የማሽነሪ ጥበቃ ስርዓት"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {insuranceServices.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500/30 transition"
                >

                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-6">

                    <Icon className="text-cyan-400" />

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

      {/* INSURANCE PROVIDERS */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-cyan-400 font-black tracking-widest mb-3">

                {t(
                  "INSURANCE PARTNERS",
                  "የኢንሹራንስ አጋሮች"
                )}

              </div>

              <h2 className="text-4xl font-black">

                {t(
                  "Insurance Companies",
                  "የኢንሹራንስ ተቋማት"
                )}

              </h2>

            </div>

            <Link
              href="/signup"
              className="text-cyan-400 font-bold flex items-center gap-2"
            >
              {t(
                "Join Insurance Network",
                "የኢንሹራንስ ኔትወርክን ይቀላቀሉ"
              )}

              <ChevronRight
                size={18}
              />

            </Link>

          </div>

          {loading ? (

            <div className="text-center py-20 text-zinc-500">

              {t(
                "Loading insurance providers...",
                "የኢንሹራንስ ተቋማት በመጫን ላይ..."
              )}

            </div>

          ) : providers.length ===
            0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

              <div className="text-2xl font-black mb-4">

                {t(
                  "No insurance providers yet",
                  "እስካሁን የኢንሹራንስ ተቋማት የሉም"
                )}

              </div>

              <p className="text-zinc-400 mb-8">

                {t(
                  "Start the insurance ecosystem by registering the first provider.",
                  "የመጀመሪያውን ተቋም በመመዝገብ ስርዓቱን ይጀምሩ።"
                )}

              </p>

              <Link
                href="/signup"
                className="inline-flex bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Register Provider",
                  "ተቋም ይመዝገቡ"
                )}
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {providers.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500/30 transition"
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-xs font-black">
                        {
                          item.insurance_type ||
                          t(
                            "Insurance",
                            "ኢንሹራንስ"
                          )
                        }
                      </div>

                      <div className="flex items-center gap-2 text-green-400 text-sm font-bold">

                        <BadgeCheck
                          size={16}
                        />

                        VERIFIED

                      </div>

                    </div>

                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-6">

                      <Building2 className="text-cyan-400" />

                    </div>

                    <h3 className="text-2xl font-black mb-4">

                      {
                        item.company_name ||
                        "EML Insurance"
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
                            "Coverage",
                            "የጥበቃ አይነት"
                          )}
                        </div>

                        <div className="font-bold">
                          {
                            item.coverage ||
                            "-"
                          }
                        </div>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                      <div>

                        <div className="text-zinc-500 text-sm">
                          {t(
                            "Coverage Limit",
                            "የጥበቃ መጠን"
                          )}
                        </div>

                        <div className="text-cyan-400 font-black text-2xl">
                          ETB{" "}
                          {Number(
                            item.coverage_limit ||
                              0
                          ).toLocaleString()}
                        </div>

                      </div>

                      <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-2xl font-black transition">

                        {t(
                          "Apply",
                          "ያመልክቱ"
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

      {/* TRUST SECTION */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-cyan-400 font-black tracking-widest mb-4">

                  {t(
                    "EML VERIFIED PROTECTION",
                    "የEML የተረጋገጠ ጥበቃ"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "Trusted Machinery Risk Protection",
                    "የታመነ የማሽነሪ ጥበቃ"
                  )}

                </h2>

                <p className="text-zinc-300 leading-8 text-lg">

                  {t(
                    "EML helps contractors, machinery owners and logistics operators reduce operational risk through verified insurance systems.",
                    "EML ተቋራጮችን፣ የማሽነሪ ባለቤቶችን እና አጓጓዦችን ከሪስክ ለመጠበቅ ያግዛል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-cyan-500/20 flex items-center justify-center shrink-0">

                <Shield
                  size={60}
                  className="text-cyan-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Brain,
  Zap,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  BriefcaseBusiness,
  Building2,
  BadgeCheck,
  Search,
  Construction,
  Wallet,
  HeartHandshake,
  CheckCircle2,
  Cpu,
  Workflow,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

export default function SmartMatchPage() {
  const { t } = useLanguage();

  const [matches, setMatches] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);

    const { data } =
      await supabase
        .from("smart_matches")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(12);

    setMatches(data || []);

    setLoading(false);
  }

  const aiSystems = [
    {
      title: t(
        "Buyer ↔ Seller AI",
        "የገዢ ↔ ሻጭ AI"
      ),

      description: t(
        "Automatically matches machinery buyers with verified sellers.",
        "የማሽነሪ ገዢዎችን ከተረጋገጡ ሻጮች ጋር ያገናኛል።"
      ),

      icon: Construction,
    },

    {
      title: t(
        "Transport Matching",
        "የመጓጓዣ ማገናኛ"
      ),

      description: t(
        "Finds trucks and logistics providers for machinery transport.",
        "ለማሽነሪ መጓጓዣ ተሽከርካሪዎችን እና ሎጂስቲክስ ያገናኛል።"
      ),

      icon: Truck,
    },

    {
      title: t(
        "Financing Intelligence",
        "የፋይናንስ AI"
      ),

      description: t(
        "Matches borrowers with financing institutions.",
        "ተበዳሪዎችን ከፋይናንስ ተቋማት ጋር ያገናኛል።"
      ),

      icon: Wallet,
    },

    {
      title: t(
        "Insurance AI",
        "የኢንሹራንስ AI"
      ),

      description: t(
        "Recommends insurance systems based on machinery risk.",
        "በማሽነሪ ሪስክ መሰረት የኢንሹራንስ ምክር ይሰጣል።"
      ),

      icon: ShieldCheck,
    },

    {
      title: t(
        "Contractor Matching",
        "የተቋራጭ ማገናኛ"
      ),

      description: t(
        "Connects contractors with machinery owners and operators.",
        "ተቋራጮችን ከማሽነሪ ባለቤቶች እና ኦፕሬተሮች ጋር ያገናኛል።"
      ),

      icon: BriefcaseBusiness,
    },

    {
      title: t(
        "Rental AI",
        "የኪራይ AI"
      ),

      description: t(
        "Optimizes rental requests and equipment availability.",
        "የኪራይ ጥያቄዎችን እና የማሽነሪ አቅርቦትን ያስተካክላል።"
      ),

      icon: HeartHandshake,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              🤖 {t(
                "EML Artificial Intelligence Engine",
                "የEML የሰው ሰራሽ አስተዋይነት ስርዓት"
              )}

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "AI Smart Match Ecosystem",
                "AI ዘመናዊ ማገናኛ ስርዓት"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              {t(
                "EML automatically connects machinery buyers, sellers, transporters, contractors, financiers, insurance providers and service providers using intelligent AI matching.",
                "EML የማሽነሪ ገዢዎችን፣ ሻጮችን፣ አጓጓዦችን፣ ተቋራጮችን፣ ፋይናንስ ተቋማትን፣ ኢንሹራንስ አቅራቢዎችን እና አገልግሎት ሰጪዎችን AI በመጠቀም ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/matching-requests"
                className="bg-violet-500 hover:bg-violet-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <Sparkles size={20} />

                {t(
                  "Start AI Matching",
                  "AI ማገናኛን ይጀምሩ"
                )}

              </Link>

              <Link
                href="/dashboard/deals"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "View AI Deals",
                  "AI ግብይቶችን ይመልከቱ"
                )}

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* AI SYSTEMS */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="mb-12">

          <div className="text-violet-400 font-black tracking-widest mb-4">

            {t(
              "AI SYSTEMS",
              "የAI ስርዓቶች"
            )}

          </div>

          <h2 className="text-4xl font-black">

            {t(
              "Enterprise Intelligence Infrastructure",
              "የድርጅት AI መሠረት"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {aiSystems.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-violet-500/30 transition"
                >

                  <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-6">

                    <Icon className="text-violet-400" />

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

      {/* AI MATCHES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-violet-400 font-black tracking-widest mb-3">

                {t(
                  "LIVE AI MATCHES",
                  "የAI ማገናኛዎች"
                )}

              </div>

              <h2 className="text-4xl font-black">

                {t(
                  "Enterprise Match Results",
                  "የድርጅት AI ውጤቶች"
                )}

              </h2>

            </div>

            <Link
              href="/matching"
              className="text-violet-400 font-bold flex items-center gap-2"
            >
              {t(
                "View All Matches",
                "ሁሉንም ማገናኛዎች ይመልከቱ"
              )}

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

          {loading ? (

            <div className="text-center py-20 text-zinc-500">

              {t(
                "Loading AI matches...",
                "AI ማገናኛዎች በመጫን ላይ..."
              )}

            </div>

          ) : matches.length ===
            0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

              <div className="text-2xl font-black mb-4">

                {t(
                  "No AI matches yet",
                  "እስካሁን AI ማገናኛዎች የሉም"
                )}

              </div>

              <p className="text-zinc-400 mb-8">

                {t(
                  "Start AI matching requests through EML.",
                  "የAI ማገናኛ ጥያቄዎችን በEML ይጀምሩ።"
                )}

              </p>

              <Link
                href="/matching-requests"
                className="inline-flex bg-violet-500 hover:bg-violet-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Start Matching",
                  "ማገናኛን ይጀምሩ"
                )}
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {matches.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-violet-500/30 transition"
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div className="bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-xs font-black">
                        {
                          item.match_type ||
                          t(
                            "AI Match",
                            "AI ማገናኛ"
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

                    <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-6">

                      <Brain className="text-violet-400" />

                    </div>

                    <h3 className="text-2xl font-black mb-4">

                      {
                        item.title ||
                        "EML AI Match"
                      }

                    </h3>

                    <div className="space-y-4 text-zinc-300">

                      <div>

                        <div className="text-zinc-500 text-sm mb-1">
                          {t(
                            "Client",
                            "ደንበኛ"
                          )}
                        </div>

                        <div className="font-bold">
                          {
                            item.client_name ||
                            "-"
                          }
                        </div>

                      </div>

                      <div>

                        <div className="text-zinc-500 text-sm mb-1">
                          {t(
                            "Provider",
                            "አቅራቢ"
                          )}
                        </div>

                        <div className="font-bold">
                          {
                            item.provider_name ||
                            "-"
                          }
                        </div>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                      <div>

                        <div className="text-zinc-500 text-sm">
                          {t(
                            "AI Score",
                            "የAI ውጤት"
                          )}
                        </div>

                        <div className="text-violet-400 font-black text-2xl">
                          {Number(
                            item.ai_score ||
                              98
                          )}
                          %
                        </div>

                      </div>

                      <button className="bg-violet-500 hover:bg-violet-400 text-black px-5 py-3 rounded-2xl font-black transition">

                        {t(
                          "View",
                          "ይመልከቱ"
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

      {/* AI TRUST SECTION */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-violet-400 font-black tracking-widest mb-4">

                  {t(
                    "EML AI INTELLIGENCE",
                    "የEML AI አስተዋይነት"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "AI Driven Machinery Ecosystem",
                    "AI የሚመራ የማሽነሪ ስርዓት"
                  )}

                </h2>

                <p className="text-zinc-300 leading-8 text-lg">

                  {t(
                    "EML transforms machinery commerce into a smart enterprise ecosystem powered by intelligent automation and AI matching.",
                    "EML የማሽነሪ ግብይትን AI እና አውቶሜሽን የሚመራ ዘመናዊ ስርዓት ያደርገዋል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-violet-500/20 flex items-center justify-center shrink-0">

                <Cpu
                  size={60}
                  className="text-violet-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
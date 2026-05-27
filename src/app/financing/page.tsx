"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Landmark,
  ShieldCheck,
  Wallet,
  CreditCard,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Banknote,
  BadgeDollarSign,
  BriefcaseBusiness,
  Plus,
  TrendingUp,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

export default function FinancingPage() {
  const { t } = useLanguage();

  const [institutions, setInstitutions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadInstitutions();
  }, []);

  async function loadInstitutions() {
    setLoading(true);

    const { data } =
      await supabase
        .from(
          "financing_providers"
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

    setInstitutions(data || []);

    setLoading(false);
  }

  const financeServices = [
    {
      title: t(
        "Equipment Financing",
        "የማሽነሪ ፋይናንስ"
      ),

      description: t(
        "Finance excavators, loaders, graders and construction machinery.",
        "ኤክስካቫተር፣ ሎደር፣ ግሬደር እና የግንባታ ማሽነሪዎች ፋይናንስ።"
      ),

      icon: Landmark,
    },

    {
      title: t(
        "Machinery Leasing",
        "የማሽነሪ ሊዝ"
      ),

      description: t(
        "Lease heavy equipment with flexible payment options.",
        "በተለዋዋጭ ክፍያ የማሽነሪ ሊዝ አገልግሎት።"
      ),

      icon: Wallet,
    },

    {
      title: t(
        "Contractor Credit",
        "የተቋራጭ ብድር"
      ),

      description: t(
        "Project-based financing for contractors and infrastructure firms.",
        "ለተቋራጮች እና ለፕሮጀክቶች የፋይናንስ ድጋፍ።"
      ),

      icon: BriefcaseBusiness,
    },

    {
      title: t(
        "Rental Financing",
        "የኪራይ ፋይናንስ"
      ),

      description: t(
        "Funding for machinery rental businesses and fleet growth.",
        "ለማሽነሪ ኪራይ ንግዶች የፋይናንስ ድጋፍ።"
      ),

      icon: CreditCard,
    },

    {
      title: t(
        "Asset-backed Loans",
        "በንብረት የተደገፈ ብድር"
      ),

      description: t(
        "Use machinery assets to access capital and growth financing.",
        "ማሽነሪን እንደ ዋስትና በመጠቀም ፋይናንስ ማግኘት።"
      ),

      icon: BadgeDollarSign,
    },

    {
      title: t(
        "AI Smart Financing",
        "AI ዘመናዊ ፋይናንስ"
      ),

      description: t(
        "Future-ready intelligent financing and machine risk analysis.",
        "ዘመናዊ AI የፋይናንስ እና የሪስክ ትንተና ስርዓት።"
      ),

      icon: TrendingUp,
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

              💰 {t(
                "EML Financing Ecosystem",
                "የEML ፋይናንስ ስርዓት"
              )}

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "Machinery Financing Infrastructure",
                "የማሽነሪ ፋይናንስ ስርዓት"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">

              {t(
                "EML connects contractors, machinery buyers, leasing companies, banks and financial institutions into one intelligent financing ecosystem.",
                "EML ተቋራጮችን፣ የማሽነሪ ገዢዎችን፣ ባንኮችን እና የፋይናንስ ተቋማትን በአንድ ዘመናዊ ስርዓት ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/post-request"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <Plus size={20} />

                {t(
                  "Apply for Financing",
                  "ለፋይናንስ ያመልክቱ"
                )}
              </Link>

              <Link
                href="/signup"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Become Financing Partner",
                  "የፋይናንስ አጋር ይሁኑ"
                )}
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* FINANCE SERVICES */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="mb-12">

          <div className="text-yellow-400 font-black tracking-widest mb-4">

            {t(
              "FINANCING SERVICES",
              "የፋይናንስ አገልግሎቶች"
            )}

          </div>

          <h2 className="text-4xl font-black">

            {t(
              "Flexible Machinery Financing",
              "ተለዋዋጭ የማሽነሪ ፋይናንስ"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {financeServices.map(
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

      {/* FINANCING INSTITUTIONS */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-3">

                {t(
                  "FINANCING PARTNERS",
                  "የፋይናንስ አጋሮች"
                )}

              </div>

              <h2 className="text-4xl font-black">

                {t(
                  "Banks & Financial Institutions",
                  "ባንኮች እና የፋይናንስ ተቋማት"
                )}

              </h2>

            </div>

            <Link
              href="/signup"
              className="text-yellow-400 font-bold flex items-center gap-2"
            >
              {t(
                "Join Financing Network",
                "የፋይናንስ ኔትወርክን ይቀላቀሉ"
              )}

              <ChevronRight
                size={18}
              />
            </Link>

          </div>

          {loading ? (

            <div className="text-center py-20 text-zinc-500">

              {t(
                "Loading financing institutions...",
                "የፋይናንስ ተቋማት በመጫን ላይ..."
              )}

            </div>

          ) : institutions.length ===
            0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

              <div className="text-2xl font-black mb-4">

                {t(
                  "No financing institutions yet",
                  "እስካሁን የፋይናንስ ተቋማት የሉም"
                )}

              </div>

              <p className="text-zinc-400 mb-8">

                {t(
                  "Start the financing ecosystem by registering the first financial institution.",
                  "የመጀመሪያውን ተቋም በመመዝገብ ስርዓቱን ይጀምሩ።"
                )}

              </p>

              <Link
                href="/signup"
                className="inline-flex bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Register Institution",
                  "ተቋም ይመዝገቡ"
                )}
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {institutions.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/30 transition"
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-xs font-black">
                        {
                          item.financing_type ||
                          t(
                            "Financing",
                            "ፋይናንስ"
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

                    <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 flex items-center justify-center mb-6">

                      <Building2 className="text-yellow-400" />

                    </div>

                    <h3 className="text-2xl font-black mb-4">

                      {
                        item.company_name ||
                        item.bank_name ||
                        "EML Finance"
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
                            "Financing Focus",
                            "የፋይናንስ አይነት"
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
                            "Financing Range",
                            "የፋይናንስ መጠን"
                          )}
                        </div>

                        <div className="text-yellow-400 font-black text-2xl">
                          ETB{" "}
                          {Number(
                            item.maximum_financing ||
                              0
                          ).toLocaleString()}
                        </div>

                      </div>

                      <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black transition">

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

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-yellow-400 font-black tracking-widest mb-4">

                  {t(
                    "EML VERIFIED FINANCING",
                    "የEML የተረጋገጠ ፋይናንስ"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "Trusted Machinery Financing Infrastructure",
                    "የታመነ የማሽነሪ ፋይናንስ ስርዓት"
                  )}

                </h2>

                <p className="text-zinc-300 leading-8 text-lg">

                  {t(
                    "EML helps contractors, fleet owners and machinery buyers access financing through verified institutions and intelligent financing workflows.",
                    "EML ተቋራጮችን፣ የፍሊት ባለቤቶችን እና የማሽነሪ ገዢዎችን ከተረጋገጡ የፋይናንስ ተቋማት ጋር ያገናኛል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-yellow-500/20 flex items-center justify-center shrink-0">

                <Banknote
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
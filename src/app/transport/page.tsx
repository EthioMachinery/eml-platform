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
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

export default function TransportPage() {
  const { t } = useLanguage();

  const [requests, setRequests] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTransportRequests();
  }, []);

  async function loadTransportRequests() {
    setLoading(true);

    const { data } =
      await supabase
        .from(
          "transport_requests"
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

    setRequests(data || []);

    setLoading(false);
  }

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

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">

              🚛 {t(
                "EML Logistics Network",
                "የEML ሎጂስቲክስ ኔትወርክ"
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
                "EML connects machinery owners, transport companies, lowbed operators, fuel logistics providers and project mobilization teams into one intelligent logistics ecosystem.",
                "EML የማሽነሪ ባለቤቶችን፣ ትራንስፖርት ኩባንያዎችን፣ ሎቤድ ኦፕሬተሮችን እና የፕሮጀክት ሎጂስቲክስ ባለሙያዎችን በአንድ ስርዓት ያገናኛል።"
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

      {/* LOGISTICS SERVICES */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="mb-12">

          <div className="text-yellow-400 font-black tracking-widest mb-4">

            {t(
              "LOGISTICS SERVICES",
              "የሎጂስቲክስ አገልግሎቶች"
            )}

          </div>

          <h2 className="text-4xl font-black">

            {t(
              "Nationwide Heavy Transport Infrastructure",
              "ሀገር አቀፍ ከባድ ትራንስፖርት ስርዓት"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {logisticsServices.map(
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

      {/* LIVE REQUESTS */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-3">

                {t(
                  "LIVE TRANSPORT REQUESTS",
                  "ቀጥታ የትራንስፖርት ጥያቄዎች"
                )}

              </div>

              <h2 className="text-4xl font-black">

                {t(
                  "Latest Logistics Demands",
                  "የቅርብ ጊዜ የሎጂስቲክስ ፍላጎቶች"
                )}

              </h2>

            </div>

            <Link
              href="/post-request"
              className="text-yellow-400 font-bold flex items-center gap-2"
            >
              {t(
                "Post Request",
                "ጥያቄ ይለጥፉ"
              )}

              <ChevronRight
                size={18}
              />
            </Link>

          </div>

          {loading ? (

            <div className="text-center py-20 text-zinc-500">
              {t(
                "Loading transport requests...",
                "የትራንስፖርት ጥያቄዎች በመጫን ላይ..."
              )}
            </div>

          ) : requests.length ===
            0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

              <div className="text-2xl font-black mb-4">

                {t(
                  "No transport requests yet",
                  "እስካሁን የትራንስፖርት ጥያቄ የለም"
                )}

              </div>

              <p className="text-zinc-400 mb-8">

                {t(
                  "Start the logistics ecosystem by posting the first transport request.",
                  "የመጀመሪያውን የትራንስፖርት ጥያቄ በመለጠፍ ሎጂስቲክስን ይጀምሩ።"
                )}

              </p>

              <Link
                href="/post-request"
                className="inline-flex bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Post Transport Request",
                  "የትራንስፖርት ጥያቄ ይለጥፉ"
                )}
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {requests.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/30 transition"
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-xs font-black">
                        {
                          item.machine_type ||
                          t(
                            "Transport",
                            "ትራንስፖርት"
                          )
                        }
                      </div>

                      <div className="text-zinc-500 text-sm flex items-center gap-2">

                        <Clock3
                          size={15}
                        />

                        {
                          item.status ||
                          "open"
                        }

                      </div>

                    </div>

                    <h3 className="text-2xl font-black leading-snug mb-6">

                      {
                        item.title ||
                        t(
                          "Heavy Machinery Transport",
                          "የከባድ ማሽነሪ ትራንስፖርት"
                        )
                      }

                    </h3>

                    <div className="space-y-4 text-zinc-300">

                      <div className="flex items-start gap-3">

                        <MapPin
                          size={18}
                          className="text-yellow-400 shrink-0 mt-1"
                        />

                        <div>

                          <div className="text-zinc-500 text-sm">
                            {t(
                              "Origin",
                              "መነሻ"
                            )}
                          </div>

                          <div className="font-bold">
                            {
                              item.origin ||
                              "-"
                            }
                          </div>

                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <Route
                          size={18}
                          className="text-yellow-400 shrink-0 mt-1"
                        />

                        <div>

                          <div className="text-zinc-500 text-sm">
                            {t(
                              "Destination",
                              "መድረሻ"
                            )}
                          </div>

                          <div className="font-bold">
                            {
                              item.destination ||
                              "-"
                            }
                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                      <div>

                        <div className="text-zinc-500 text-sm">
                          {t(
                            "Budget",
                            "በጀት"
                          )}
                        </div>

                        <div className="text-yellow-400 font-black text-2xl">
                          ETB{" "}
                          {Number(
                            item.budget ||
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

      {/* TRUST */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-yellow-400 font-black tracking-widest mb-4">

                  {t(
                    "EML VERIFIED LOGISTICS",
                    "የEML የተረጋገጠ ሎጂስቲክስ"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "Secure & Verified Heavy Transport Network",
                    "ደህንነቱ የተጠበቀ የከባድ ትራንስፖርት ኔትወርክ"
                  )}

                </h2>

                <p className="text-zinc-300 leading-8 text-lg">

                  {t(
                    "EML helps transporters, contractors and machinery owners connect through secure logistics workflows, verified transport providers and transparent transport requests.",
                    "EML አጓጓዦችን፣ ተቋራጮችን እና የማሽነሪ ባለቤቶችን በደህንነቱ በተጠበቀ የሎጂስቲክስ ስርዓት ያገናኛል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-yellow-500/20 flex items-center justify-center shrink-0">

                <ShieldCheck
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
"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Brain,
  Building2,
  Calculator,
  CircleDollarSign,
  Fuel,
  Gauge,
  Globe2,
  LineChart,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingDown,
  TrendingUp,
  Truck,
  Wallet,
  Warehouse,
} from "lucide-react";

type PricingAsset = {
  id: number;

  asset: string;

  category: string;

  region: string;

  currentPrice: string;

  aiPrediction: string;

  marketTrend: string;

  demandScore: number;

  riskLevel: string;

  recommendation: string;
};

export default function PricingAIPage() {
  const [assets, setAssets] =
    useState<PricingAsset[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  function loadAssets() {
    const demo: PricingAsset[] =
      [
        {
          id: 1,

          asset:
            "CAT 320 Excavator Rental",

          category:
            "Machinery Rental",

          region:
            "Addis Ababa",

          currentPrice:
            "38,000 ETB/day",

          aiPrediction:
            "+12% in 14 days",

          marketTrend:
            "Rising",

          demandScore: 96,

          riskLevel:
            "Low",

          recommendation:
            "Increase rental pricing due to infrastructure demand surge.",
        },

        {
          id: 2,

          asset:
            "Fleet Transportation Pricing",

          category:
            "Logistics",

          region:
            "Bahir Dar",

          currentPrice:
            "145 ETB/km",

          aiPrediction:
            "+6% in 7 days",

          marketTrend:
            "Stable",

          demandScore: 82,

          riskLevel:
            "Medium",

          recommendation:
            "Fuel cost trends indicate moderate transport pricing increase.",
        },

        {
          id: 3,

          asset:
            "Hydraulic Pump Systems",

          category:
            "Spare Parts",

          region:
            "Hawassa",

          currentPrice:
            "420,000 ETB",

          aiPrediction:
            "+18% in 21 days",

          marketTrend:
            "High Growth",

          demandScore: 98,

          riskLevel:
            "Low",

          recommendation:
            "Shortage risk detected. Increase procurement immediately.",
        },
      ];

    setAssets(demo);
  }

  const filtered =
    useMemo(() => {
      return assets.filter(
        (item) => {
          const keyword =
            `${item.asset} ${item.category} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [assets, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-orange-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              EML DYNAMIC PRICING AI

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Market Pricing Intelligence Engine

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Predict machinery prices,
              optimize rental rates,
              forecast market demand,
              analyze regional pricing,
              detect price anomalies,
              and automate industrial pricing intelligence using AI.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/procurement"
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Procurement AI

              </Link>

              <Link
                href="/suppliers"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Supplier Marketplace

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="AI Pricing Models"
            value="184K+"
            icon={Calculator}
            color="orange"
          />

          <KPI
            title="Market Predictions"
            value="2.8M+"
            icon={Brain}
            color="yellow"
          />

          <KPI
            title="Pricing Accuracy"
            value="96%"
            icon={TrendingUp}
            color="green"
          />

          <KPI
            title="Enterprise Insights"
            value="LIVE"
            icon={BarChart3}
            color="violet"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-orange-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AI MARKET PREDICTION

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI predicts pricing trends before markets shift.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes demand,
                fuel prices,
                infrastructure activity,
                supplier behavior,
                logistics costs,
                seasonality,
                and industrial growth patterns across Africa.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Pricing Accuracy"
                value="96%"
              />

              <MiniStat
                title="Demand Forecast"
                value="+41%"
              />

              <MiniStat
                title="Market Risk AI"
                value="ACTIVE"
              />

              <MiniStat
                title="Regional Analysis"
                value="LIVE"
              />

            </div>

          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-6">

          <div className="relative">

            <Search className="absolute left-4 top-4 text-zinc-500" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search market pricing intelligence..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* ASSETS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-orange-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <CircleDollarSign
                    size={90}
                    className="text-orange-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.asset
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.category
                        }

                      </div>

                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {
                        item.demandScore
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Wallet}
                      label={`Current: ${item.currentPrice}`}
                    />

                    <Info
                      icon={TrendingUp}
                      label={`Prediction: ${item.aiPrediction}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Trend: ${item.marketTrend}`}
                    />

                    <Info
                      icon={MapPinned}
                      label={`Region: ${item.region}`}
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-orange-400 font-black mb-3">

                      <Brain size={18} />

                      AI Recommendation

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.recommendation
                      }

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Market Risk

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.riskLevel
                      }

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition">

                      View Intelligence

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <LineChart />

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      {/* SERVICES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={Fuel}
              title="Fuel Impact Analysis"
              text="AI predicts how fuel costs affect industrial pricing."
            />

            <Service
              icon={Warehouse}
              title="Inventory Pricing"
              text="Optimize inventory pricing using demand forecasting."
            />

            <Service
              icon={Truck}
              title="Transport Cost AI"
              text="Analyze logistics and transportation cost fluctuations."
            />

            <Service
              icon={ShieldCheck}
              title="Market Protection"
              text="Detect abnormal pricing and procurement manipulation."
            />

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-12">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              <div className="max-w-4xl">

                <div className="text-orange-400 font-black tracking-widest mb-4">

                  MARKET INTELLIGENCE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s smartest industrial pricing engine

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML combines procurement AI,
                  supplier intelligence,
                  fleet economics,
                  logistics forecasting,
                  and dynamic pricing into one industrial intelligence platform.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/procurement"
                  className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Procurement AI

                </Link>

                <Link
                  href="/maintenance"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  AI Maintenance

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function KPI({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colors: any = {
    orange:
      "bg-orange-500/10 text-orange-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    green:
      "bg-green-500/10 text-green-400",

    violet:
      "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-7">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}
        >

          <Icon size={30} />

        </div>

        <ArrowUpRight className="text-zinc-700" />

      </div>

      <div className="text-zinc-400 text-sm mb-3">

        {title}

      </div>

      <div className="text-4xl font-black">

        {value}

      </div>

    </div>
  );
}

function MiniStat({
  title,
  value,
}: any) {
  return (
    <div className="bg-black/40 border border-orange-500/10 rounded-3xl p-5">

      <div className="text-zinc-400 text-sm mb-2">

        {title}

      </div>

      <div className="font-black text-xl">

        {value}

      </div>

    </div>
  );
}

function Info({
  icon: Icon,
  label,
}: any) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">

      <Icon size={18} className="text-orange-400" />

      <span>{label}</span>

    </div>
  );
}

function Service({
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-8">

      <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-6">

        <Icon className="text-orange-400" size={30} />

      </div>

      <h3 className="text-2xl font-black mb-4">

        {title}

      </h3>

      <p className="text-zinc-400 leading-8">

        {text}

      </p>

    </div>
  );
}
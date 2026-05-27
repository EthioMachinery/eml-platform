"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Binary,
  Bot,
  Brain,
  Building2,
  ChartArea,
  ChartBarBig,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Globe2,
  Landmark,
  Layers3,
  LineChart,
  Network,
  Orbit,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Workflow,
  Zap,
} from "lucide-react";

type IntelligenceNode = {
  id: number;

  system: string;

  category: string;

  status: string;

  scope: string;

  prediction: number;

  engine: string;

  intelligence: string;
};

export default function MarketIntelligencePage() {
  const [systems, setSystems] =
    useState<IntelligenceNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: IntelligenceNode[] =
      [
        {
          id: 1,

          system:
            "Industrial Demand Forecast Engine",

          category:
            "Predictive Procurement",

          status:
            "Operational",

          scope:
            "Global Supply Networks",

          prediction: 99,

          engine:
            "AI Forecast Intelligence",

          intelligence:
            "Forecasting procurement demand, industrial pricing shifts, supplier volatility, and logistics capacity signals.",
        },

        {
          id: 2,

          system:
            "Infrastructure Predictive Analytics",

          category:
            "Infrastructure Intelligence",

          status:
            "Live",

          scope:
            "National Infrastructure",

          prediction: 98,

          engine:
            "Transport + Urban AI",

          intelligence:
            "Predicting transport demand, infrastructure stress, traffic flows, and infrastructure expansion needs.",
        },

        {
          id: 3,

          system:
            "Industrial Economic Signal Grid",

          category:
            "Economic Intelligence",

          status:
            "Optimized",

          scope:
            "Regional Economies",

          prediction: 97,

          engine:
            "Economic Pattern Intelligence",

          intelligence:
            "Analyzing industrial growth, investment trends, logistics movement, and regional economic corridors.",
        },

        {
          id: 4,

          system:
            "AI Strategic Intelligence Network",

          category:
            "Autonomous Market Intelligence",

          status:
            "Secured",

          scope:
            "Industrial AI Ecosystem",

          prediction: 99,

          engine:
            "Strategic AI Modeling",

          intelligence:
            "Running autonomous market analysis, industrial forecasting, risk modeling, and ecosystem intelligence prediction.",
        },
      ];

    setSystems(demo);
  }

  const filtered =
    useMemo(() => {
      return systems.filter(
        (item) => {
          const keyword =
            `${item.system} ${item.category} ${item.scope}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [systems, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <Radar size={20} />

              EML MARKET INTELLIGENCE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Predictive Industrial Intelligence Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Autonomous industrial intelligence infrastructure forecasting procurement trends,
              logistics demand,
              infrastructure growth,
              economic signals,
              industrial risks,
              and strategic ecosystem opportunities using advanced AI intelligence systems.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/knowledge-graph"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Knowledge Graph

              </Link>

              <Link
                href="/ai-agents"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                AI Agents

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Forecast Models"
            value="8.4M"
            icon={ChartArea}
            color="violet"
          />

          <KPI
            title="AI Market Signals"
            value="LIVE"
            icon={Bot}
            color="fuchsia"
          />

          <KPI
            title="Prediction Accuracy"
            value="99.4%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Economic Intelligence"
            value="GLOBAL"
            icon={Globe2}
            color="purple"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                PREDICTIVE INDUSTRIAL INTELLIGENCE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The strategic intelligence layer powering industrial economies.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Market Intelligence predicts industrial demand,
                infrastructure growth,
                logistics movement,
                procurement trends,
                economic corridors,
                and strategic ecosystem risks using autonomous AI intelligence systems.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Market Signals"
                value="LIVE"
              />

              <MiniStat
                title="AI Forecasting"
                value="ACTIVE"
              />

              <MiniStat
                title="Economic Intelligence"
                value="CONNECTED"
              />

              <MiniStat
                title="Predictive Systems"
                value="GLOBAL"
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
              placeholder="Search market intelligence systems..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-violet-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <LineChart
                    size={90}
                    className="text-violet-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.system
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.category
                        }

                      </div>

                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.prediction
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Globe2}
                      label={`Scope: ${item.scope}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Brain}
                      label={`Engine: ${item.engine}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Strategic Intelligence Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Radar size={18} />

                      Strategic Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* PREDICTION */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Forecast Confidence

                      </div>

                      <div className="font-black text-violet-400">

                        {
                          item.prediction
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                          width:
                            `${item.prediction}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      Open Intelligence

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <ArrowRight />

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      {/* CAPABILITIES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={CircleDollarSign}
              title="Procurement Forecasting"
              text="Predict procurement demand, pricing volatility, supplier risks, and logistics capacity."
            />

            <Service
              icon={Truck}
              title="Infrastructure Forecasting"
              text="Forecast traffic demand, transport growth, infrastructure pressure, and operational stress."
            />

            <Service
              icon={Landmark}
              title="Economic Intelligence"
              text="Analyze industrial growth, regional investment patterns, and strategic economic corridors."
            />

            <Service
              icon={Bot}
              title="AI Strategic Analysis"
              text="Enable autonomous industrial forecasting and ecosystem-scale predictive intelligence."
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

                <div className="text-violet-400 font-black tracking-widest mb-4">

                  INDUSTRIAL STRATEGIC INTELLIGENCE INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Market Intelligence powers predictive industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Market Intelligence transforms EML into a strategic industrial intelligence civilization —
                  enabling predictive planning,
                  AI-driven market forecasting,
                  infrastructure growth modeling,
                  and autonomous economic intelligence orchestration.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/knowledge-graph"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Knowledge Graph

                </Link>

                <Link
                  href="/automation"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Automation

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
    violet:
      "bg-violet-500/10 text-violet-400",

    fuchsia:
      "bg-fuchsia-500/10 text-fuchsia-400",

    green:
      "bg-green-500/10 text-green-400",

    purple:
      "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-7">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}
        >

          <Icon size={30} />

        </div>

        <Zap className="text-zinc-700" />

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
    <div className="bg-black/40 border border-violet-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-violet-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-6">

        <Icon className="text-violet-400" size={30} />

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
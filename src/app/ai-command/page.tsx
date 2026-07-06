"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  Globe2,
  Layers3,
  LineChart,
  Radar,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

type AIEngine = {
  id: number;

  name: string;

  category: string;

  status: string;

  accuracy: number;

  region: string;

  load: string;

  insight: string;
};

export default function AICommandPage() {
  const [engines, setEngines] =
    useState<AIEngine[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadAI();
  }, []);

  function loadAI() {
    const demo: AIEngine[] =
      [
        {
          id: 1,

          name:
            "Procurement Intelligence AI",

          category:
            "Government",

          status:
            "Active",

          accuracy: 97,

          region:
            "National",

          load: "High",

          insight:
            "Monitoring procurement anomalies and infrastructure bidding patterns.",
        },

        {
          id: 2,

          name:
            "Industrial Credit AI",

          category:
            "Financing",

          status:
            "Learning",

          accuracy: 94,

          region:
            "Pan-Africa",

          load: "Medium",

          insight:
            "Predicting contractor repayment risk and supplier financing reliability.",
        },

        {
          id: 3,

          name:
            "Dynamic Pricing AI",

          category:
            "Marketplace",

          status:
            "Optimized",

          accuracy: 98,

          region:
            "Regional",

          load: "High",

          insight:
            "Adjusting machinery pricing using demand forecasting and regional analytics.",
        },

        {
          id: 4,

          name:
            "Fleet Optimization AI",

          category:
            "Transport",

          status:
            "Active",

          accuracy: 92,

          region:
            "East Africa",

          load: "Medium",

          insight:
            "Optimizing logistics routing and transport efficiency.",
        },
      ];

    setEngines(demo);
  }

  const filtered =
    useMemo(() => {
      return engines.filter(
        (item) => {
          const keyword =
            `${item.name} ${item.category} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [engines, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              TM AI COMMAND CENTER

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Autonomous Industrial Intelligence Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Centralized AI orchestration for procurement,
              financing,
              logistics,
              marketplace intelligence,
              ERP automation,
              government analytics,
              industrial forecasting,
              and infrastructure optimization.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/analytics"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Ecosystem Analytics

              </Link>

              <Link
                href="/erp"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                ERP Core

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="AI Engines"
            value="48+"
            icon={Microchip}
            color="cyan"
          />

          <KPI
            title="Infrastructure Intelligence"
            value="LIVE"
            icon={Radar}
            color="blue"
          />

          <KPI
            title="Prediction Accuracy"
            value="97%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Autonomous Operations"
            value="24/7"
            icon={Activity}
            color="yellow"
          />

        </div>

      </section>

      {/* CORE AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-cyan-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AUTONOMOUS AI ECOSYSTEM

              </div>

              <h2 className="text-4xl font-black mb-6">

                TM AI continuously learns from the entire industrial ecosystem.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI systems monitor marketplace behavior,
                infrastructure procurement,
                financing risk,
                supplier reliability,
                logistics efficiency,
                fleet intelligence,
                industrial analytics,
                and enterprise operations in real time.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="AI Monitoring"
                value="ACTIVE"
              />

              <MiniStat
                title="Regional AI"
                value="PAN-AFRICA"
              />

              <MiniStat
                title="Prediction Layer"
                value="LIVE"
              />

              <MiniStat
                title="Automation"
                value="SMART"
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
              placeholder="Search AI engines..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* AI GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-cyan-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Brain
                    size={90}
                    className="text-cyan-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.name
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.category
                        }

                      </div>

                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.accuracy
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Globe2}
                      label={`Region: ${item.region}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Load: ${item.load}`}
                    />

                    <Info
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Database}
                      label="Data Intelligence Active"
                    />

                  </div>

                  {/* AI INSIGHT */}

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Sparkles size={18} />

                      AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.insight
                      }

                    </p>

                  </div>

                  {/* ACCURACY */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        AI Confidence

                      </div>

                      <div className="font-black text-cyan-400">

                        {
                          item.accuracy
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width:
                            `${item.accuracy}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

                      View Engine

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

      {/* CAPABILITIES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={Workflow}
              title="AI Orchestration"
              text="Coordinate industrial AI systems across procurement, ERP, logistics, and financing."
            />

            <Service
              icon={ShieldCheck}
              title="Risk Monitoring"
              text="Detect ecosystem-wide anomalies and industrial operational threats."
            />

            <Service
              icon={BarChart3}
              title="Predictive Analytics"
              text="Forecast infrastructure demand, financing risk, and marketplace activity."
            />

            <Service
              icon={Zap}
              title="Autonomous Operations"
              text="Enable self-optimizing industrial workflows and intelligent automation."
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

                <div className="text-cyan-400 font-black tracking-widest mb-4">

                  INDUSTRIAL AI INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build autonomous industrial intelligence ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM AI Command Center integrates financing,
                  procurement,
                  logistics,
                  infrastructure analytics,
                  marketplace intelligence,
                  ERP automation,
                  and enterprise AI into one unified intelligence architecture.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/credit-ai"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Credit AI

                </Link>

                <Link
                  href="/government"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Government Systems

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
    cyan:
      "bg-cyan-500/10 text-cyan-400",

    blue:
      "bg-blue-500/10 text-blue-400",

    green:
      "bg-green-500/10 text-green-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-7">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}
        >

          <Icon size={30} />

        </div>

        <TrendingUp className="text-zinc-700" />

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
    <div className="bg-black/40 border border-cyan-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-cyan-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-6">

        <Icon className="text-cyan-400" size={30} />

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
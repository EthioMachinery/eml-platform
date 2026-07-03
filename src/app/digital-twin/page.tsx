"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  Globe2,
  Layers3,
  LineChart,
  Map,
  MapPinned,
  Orbit,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Truck,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type TwinModel = {
  id: number;

  name: string;

  category: string;

  region: string;

  health: number;

  status: string;

  prediction: string;

  simulation: string;
};

export default function DigitalTwinPage() {
  const [models, setModels] =
    useState<TwinModel[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModels();
  }, []);

  function loadModels() {
    const demo: TwinModel[] =
      [
        {
          id: 1,

          name:
            "Addis Smart Infrastructure Twin",

          category:
            "Urban Infrastructure",

          region:
            "Addis Ababa",

          health: 98,

          status:
            "Stable",

          prediction:
            "Traffic load expected to increase 12% within next quarter.",

          simulation:
            "AI recommends transport redistribution optimization.",
        },

        {
          id: 2,

          name:
            "PanAfrica Fleet Twin",

          category:
            "Fleet Operations",

          region:
            "East Africa",

          health: 93,

          status:
            "Optimized",

          prediction:
            "Fuel efficiency likely to improve by 7% after rerouting.",

          simulation:
            "Fleet balancing simulation completed successfully.",
        },

        {
          id: 3,

          name:
            "Mega Construction Twin",

          category:
            "Construction",

          region:
            "Bahir Dar",

          health: 87,

          status:
            "Monitoring",

          prediction:
            "Material delays may affect timeline in next cycle.",

          simulation:
            "AI generated alternative procurement pathways.",
        },

        {
          id: 4,

          name:
            "Industrial Machinery Twin",

          category:
            "Heavy Equipment",

          region:
            "Dire Dawa",

          health: 81,

          status:
            "Alert",

          prediction:
            "Predictive maintenance required within 120 operational hours.",

          simulation:
            "Operational stress threshold nearing limit.",
        },
      ];

    setModels(demo);
  }

  const filtered =
    useMemo(() => {
      return models.filter(
        (item) => {
          const keyword =
            `${item.name} ${item.category} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [models, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <Orbit size={20} />

              TM DIGITAL TWIN SYSTEM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Intelligent Infrastructure Simulation Engine

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Build real-time digital replicas of infrastructure,
              fleets,
              industrial operations,
              machinery,
              logistics systems,
              and construction ecosystems powered by AI simulation and predictive analytics.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/ai-command"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                AI Command Center

              </Link>

              <Link
                href="/infrastructure-monitor"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Infrastructure Monitor

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Twin Models"
            value="1,240"
            icon={Layers3}
            color="violet"
          />

          <KPI
            title="Simulation Accuracy"
            value="96%"
            icon={Brain}
            color="purple"
          />

          <KPI
            title="Predictive Engines"
            value="LIVE"
            icon={Radar}
            color="cyan"
          />

          <KPI
            title="Operational Forecasts"
            value="24/7"
            icon={TrendingUp}
            color="green"
          />

        </div>

      </section>

      {/* DIGITAL TWIN CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                LIVE DIGITAL INFRASTRUCTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                Simulate infrastructure systems before problems happen.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Digital Twin technology creates intelligent real-time models of industrial systems,
                infrastructure operations,
                machinery ecosystems,
                transport networks,
                and enterprise activity using predictive AI simulation engines.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Simulation Layer"
                value="ACTIVE"
              />

              <MiniStat
                title="Predictive AI"
                value="RUNNING"
              />

              <MiniStat
                title="Twin Sync"
                value="LIVE"
              />

              <MiniStat
                title="Infrastructure Risk"
                value="LOW"
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
              placeholder="Search digital twin systems..."
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

                <div className="h-56 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Orbit
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
                          item.name
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
                        item.health
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={MapPinned}
                      label={`Region: ${item.region}`}
                    />

                    <Info
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Cpu}
                      label="AI Simulation Active"
                    />

                    <Info
                      icon={Database}
                      label="Twin Synchronization Live"
                    />

                  </div>

                  {/* PREDICTION */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-5">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Brain size={18} />

                      Predictive Forecast

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.prediction
                      }

                    </p>

                  </div>

                  {/* SIMULATION */}

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Workflow size={18} />

                      Simulation Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.simulation
                      }

                    </p>

                  </div>

                  {/* HEALTH */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Twin Integrity

                      </div>

                      <div className="font-black text-violet-400">

                        {
                          item.health
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                          width:
                            `${item.health}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      Open Twin

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
              icon={Building2}
              title="Infrastructure Twins"
              text="Build intelligent replicas of roads, projects, industrial systems, and urban infrastructure."
            />

            <Service
              icon={Truck}
              title="Fleet Simulation"
              text="Simulate logistics systems and transport optimization before deployment."
            />

            <Service
              icon={Wrench}
              title="Maintenance Forecasting"
              text="Predict equipment failures and optimize maintenance cycles."
            />

            <Service
              icon={BarChart3}
              title="Operational Forecasting"
              text="Forecast costs, delays, risks, fuel usage, and industrial efficiency."
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

                  AI-POWERED DIGITAL INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  The future of industrial intelligence is simulation-driven

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Digital Twin technology transforms infrastructure operations into intelligent,
                  predictive,
                  AI-powered simulation ecosystems capable of forecasting industrial risks before they occur.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/ai-command"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  AI Systems

                </Link>

                <Link
                  href="/infrastructure-monitor"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Monitoring Layer

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

    purple:
      "bg-purple-500/10 text-purple-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    green:
      "bg-green-500/10 text-green-400",
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
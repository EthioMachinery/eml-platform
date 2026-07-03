"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Cpu,
  Database,
  Eye,
  Gauge,
  GitBranch,
  Globe2,
  Layers3,
  LineChart,
  Monitor,
  Network,
  Orbit,
  Radar,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Truck,
  Wallet,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type ControlModule = {
  id: number;

  system: string;

  category: string;

  health: number;

  status: string;

  region: string;

  intelligence: string;

  uptime: string;
};

export default function ControlCenterPage() {
  const [modules, setModules] =
    useState<ControlModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: ControlModule[] =
      [
        {
          id: 1,

          system:
            "AI Agent Coordination Network",

          category:
            "Autonomous Operations",

          health: 98,

          status:
            "Operational",

          region:
            "Global",

          uptime:
            "99.99%",

          intelligence:
            "Coordinating industrial AI agents across logistics, procurement, and infrastructure systems.",
        },

        {
          id: 2,

          system:
            "Infrastructure Monitoring Grid",

          category:
            "Infrastructure Intelligence",

          health: 96,

          status:
            "Stable",

          region:
            "Pan-Africa",

          uptime:
            "99.97%",

          intelligence:
            "Monitoring infrastructure health and predictive operational anomalies in real-time.",
        },

        {
          id: 3,

          system:
            "Industrial ERP Core",

          category:
            "Enterprise Systems",

          health: 94,

          status:
            "Optimized",

          region:
            "Regional",

          uptime:
            "99.95%",

          intelligence:
            "Synchronizing procurement, finance, contracts, and operational intelligence.",
        },

        {
          id: 4,

          system:
            "Digital Twin Infrastructure Mesh",

          category:
            "Simulation Systems",

          health: 99,

          status:
            "Live",

          region:
            "Global",

          uptime:
            "99.98%",

          intelligence:
            "Running real-time industrial simulations and predictive ecosystem analysis.",
        },
      ];

    setModules(demo);
  }

  const filtered =
    useMemo(() => {
      return modules.filter(
        (item) => {
          const keyword =
            `${item.system} ${item.category} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [modules, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-red-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-full font-black mb-8">

              <Monitor size={20} />

              TM CONTROL CENTER

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Global Industrial Intelligence Command Center

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Centralized operational command layer for AI agents,
              digital twins,
              infrastructure intelligence,
              enterprise systems,
              autonomous industrial operations,
              procurement ecosystems,
              logistics coordination,
              and infrastructure governance.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/tm-os"
                className="bg-red-500 hover:bg-red-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Open TM OS

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
            title="Operational Systems"
            value="512"
            icon={CircuitBoard}
            color="red"
          />

          <KPI
            title="AI Governance"
            value="LIVE"
            icon={Brain}
            color="orange"
          />

          <KPI
            title="Infrastructure Visibility"
            value="GLOBAL"
            icon={Radar}
            color="cyan"
          />

          <KPI
            title="Industrial Uptime"
            value="99.99%"
            icon={Gauge}
            color="green"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-red-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL COMMAND INFRASTRUCTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                One centralized intelligence center controlling the TM ecosystem.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Control Center unifies infrastructure operations,
                AI governance,
                industrial orchestration,
                ecosystem monitoring,
                autonomous systems,
                enterprise intelligence,
                digital twins,
                and infrastructure command workflows into a single operational intelligence layer.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Control Systems"
                value="CONNECTED"
              />

              <MiniStat
                title="AI Governance"
                value="ACTIVE"
              />

              <MiniStat
                title="Operational Visibility"
                value="GLOBAL"
              />

              <MiniStat
                title="Autonomous Infrastructure"
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
              placeholder="Search control systems..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-red-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Monitor
                    size={90}
                    className="text-red-400"
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

                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.health
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
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Gauge}
                      label={`Uptime: ${item.uptime}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Operational Coordination Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-red-400 font-black mb-3">

                      <Brain size={18} />

                      System Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* HEALTH */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Infrastructure Health

                      </div>

                      <div className="font-black text-red-400">

                        {
                          item.health
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width:
                            `${item.health}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-red-500 hover:bg-red-400 text-black font-black py-4 rounded-2xl transition">

                      Open Control

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
              icon={Bot}
              title="AI Governance"
              text="Monitor and coordinate autonomous industrial AI agents across the ecosystem."
            />

            <Service
              icon={Database}
              title="Unified Operations"
              text="Centralized visibility into ERP, infrastructure, procurement, logistics, and financing."
            />

            <Service
              icon={Eye}
              title="Global Visibility"
              text="Real-time industrial monitoring and operational intelligence at ecosystem scale."
            />

            <Service
              icon={ShieldCheck}
              title="Infrastructure Security"
              text="Govern operational integrity, ecosystem risks, and industrial resilience."
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

                <div className="text-red-400 font-black tracking-widest mb-4">

                  INDUSTRIAL MISSION CONTROL

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM Control Center governs the industrial intelligence ecosystem

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Control Center is the operational brain of the TM platform —
                  orchestrating AI,
                  infrastructure,
                  enterprise systems,
                  digital twins,
                  autonomous agents,
                  and industrial intelligence from one unified command infrastructure.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/tm-os"
                  className="bg-red-500 hover:bg-red-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  TM OS

                </Link>

                <Link
                  href="/knowledge-graph"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Knowledge Graph

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
    red:
      "bg-red-500/10 text-red-400",

    orange:
      "bg-orange-500/10 text-orange-400",

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
    <div className="bg-black/40 border border-red-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-red-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">

        <Icon className="text-red-400" size={30} />

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
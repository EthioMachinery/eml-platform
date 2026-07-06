"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
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
  Gauge,
  GitBranch,
  Globe2,
  Layers3,
  MonitorSmartphone,
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

type OSModule = {
  id: number;

  module: string;

  category: string;

  uptime: string;

  status: string;

  intelligence: string;

  orchestration: number;

  region: string;
};

export default function TMOSPage() {
  const [modules, setModules] =
    useState<OSModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: OSModule[] =
      [
        {
          id: 1,

          module:
            "Industrial AI Orchestrator",

          category:
            "AI Infrastructure",

          uptime:
            "99.99%",

          status:
            "Operational",

          orchestration: 98,

          region:
            "Global",

          intelligence:
            "Coordinating AI agents, infrastructure intelligence, and autonomous industrial workflows.",
        },

        {
          id: 2,

          module:
            "Infrastructure Monitoring Core",

          category:
            "Infrastructure Systems",

          uptime:
            "99.97%",

          status:
            "Live",

          orchestration: 96,

          region:
            "Pan-Africa",

          intelligence:
            "Monitoring infrastructure health, predictive anomalies, and operational stress patterns.",
        },

        {
          id: 3,

          module:
            "Industrial ERP Kernel",

          category:
            "Enterprise Systems",

          uptime:
            "99.95%",

          status:
            "Optimized",

          orchestration: 95,

          region:
            "Regional",

          intelligence:
            "Synchronizing procurement, contracts, finance, and industrial operations.",
        },

        {
          id: 4,

          module:
            "Knowledge Graph Engine",

          category:
            "Ecosystem Intelligence",

          uptime:
            "99.98%",

          status:
            "Connected",

          orchestration: 99,

          region:
            "Global",

          intelligence:
            "Mapping industrial relationships and ecosystem intelligence in real-time.",
        },
      ];

    setModules(demo);
  }

  const filtered =
    useMemo(() => {
      return modules.filter(
        (item) => {
          const keyword =
            `${item.module} ${item.category} ${item.region}`
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

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <CircuitBoard size={20} />

              TM OPERATING SYSTEM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Infrastructure Operating System

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              TM OS synchronizes AI agents,
              digital twins,
              infrastructure monitoring,
              ERP,
              procurement,
              logistics,
              financing,
              analytics,
              and industrial ecosystem intelligence into one unified operational platform.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/ai-command"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Launch TM OS

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
            title="Infrastructure Modules"
            value="256"
            icon={Layers3}
            color="cyan"
          />

          <KPI
            title="AI Coordination"
            value="LIVE"
            icon={Brain}
            color="blue"
          />

          <KPI
            title="Industrial Uptime"
            value="99.99%"
            icon={Gauge}
            color="green"
          />

          <KPI
            title="OS Intelligence"
            value="ACTIVE"
            icon={Microchip}
            color="purple"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-cyan-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL ORCHESTRATION CORE

              </div>

              <h2 className="text-4xl font-black mb-6">

                One operating system controlling the industrial ecosystem.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM OS coordinates industrial infrastructure,
                autonomous AI systems,
                enterprise workflows,
                ecosystem intelligence,
                operational analytics,
                digital twins,
                and infrastructure optimization from a unified orchestration core.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="OS Kernel"
                value="ACTIVE"
              />

              <MiniStat
                title="AI Coordination"
                value="CONNECTED"
              />

              <MiniStat
                title="Infrastructure"
                value="SYNCHRONIZED"
              />

              <MiniStat
                title="Industrial Mesh"
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
              placeholder="Search TM OS modules..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* MODULE GRID */}

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

                  <ServerCog
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
                          item.module
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
                        item.orchestration
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
                      label="Industrial Orchestration Active"
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Brain size={18} />

                      OS Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* ORCHESTRATION */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        System Coordination

                      </div>

                      <div className="font-black text-cyan-400">

                        {
                          item.orchestration
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width:
                            `${item.orchestration}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

                      Open Module

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
              title="AI Coordination"
              text="Synchronize autonomous industrial AI agents across operational workflows."
            />

            <Service
              icon={Database}
              title="Unified Infrastructure"
              text="Integrate ERP, procurement, logistics, monitoring, and financing systems."
            />

            <Service
              icon={Radar}
              title="Real-Time Intelligence"
              text="Continuously monitor infrastructure health and ecosystem behavior."
            />

            <Service
              icon={Cloud}
              title="Industrial Cloud OS"
              text="Operate infrastructure ecosystems from a centralized intelligence platform."
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

                  INDUSTRIAL OPERATING INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM OS is the intelligence core of the industrial ecosystem

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM OS transforms fragmented industrial systems into one synchronized,
                  intelligent,
                  autonomous operational platform capable of powering next-generation infrastructure ecosystems.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/knowledge-graph"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Knowledge Graph

                </Link>

                <Link
                  href="/digital-twin"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Digital Twin

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
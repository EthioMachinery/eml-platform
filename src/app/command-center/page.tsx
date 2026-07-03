"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Cog,
 Database,
  Fingerprint,
  Globe2,
  Landmark,
  Layers3,
  MonitorSmartphone,
  Network,
  Orbit,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Truck,
  Workflow,
  Zap,
} from "lucide-react";

type ControlNode = {
  id: number;

  system: string;

  category: string;

  status: string;

  scope: string;

  synchronization: number;

  orchestration: string;

  intelligence: string;
};

export default function CommandCenterPage() {
  const [systems, setSystems] =
    useState<ControlNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: ControlNode[] =
      [
        {
          id: 1,

          system:
            "Unified Infrastructure Operations",

          category:
            "Infrastructure Orchestration",

          status:
            "Operational",

          scope:
            "Global Industrial Networks",

          synchronization: 99,

          orchestration:
            "Real-Time Infrastructure Control",

          intelligence:
            "Coordinating infrastructure systems, fleets, maintenance operations, logistics intelligence, and industrial monitoring.",
        },

        {
          id: 2,

          system:
            "Enterprise Coordination Grid",

          category:
            "Enterprise Operations",

          status:
            "Live",

          scope:
            "Enterprise Ecosystem",

          synchronization: 98,

          orchestration:
            "ERP + CRM + Procurement",

          intelligence:
            "Managing enterprise execution, procurement orchestration, contracts, CRM intelligence, and ERP synchronization.",
        },

        {
          id: 3,

          system:
            "AI Sovereign Operations Engine",

          category:
            "AI Orchestration",

          status:
            "Optimized",

          scope:
            "Industrial AI Infrastructure",

          synchronization: 99,

          orchestration:
            "AI Agent Coordination",

          intelligence:
            "Operating autonomous AI agents, industrial automation, predictive intelligence, and ecosystem-wide orchestration systems.",
        },

        {
          id: 4,

          system:
            "Strategic Governance & Intelligence Grid",

          category:
            "Sovereign Governance",

          status:
            "Secured",

          scope:
            "National + Enterprise Infrastructure",

          synchronization: 97,

          orchestration:
            "Governance Intelligence",

          intelligence:
            "Managing sovereign operations, governance systems, industrial forecasting, and strategic economic intelligence.",
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

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <MonitorSmartphone size={20} />

              TM COMMAND CENTER

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Unified Industrial Civilization Control Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Centralized sovereign orchestration infrastructure unifying AI systems,
              industrial operations,
              enterprise execution,
              infrastructure intelligence,
              automation,
              governance,
              and strategic ecosystem coordination in real time.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/control-center"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Live Operations

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

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Connected Systems"
            value="48.2K"
            icon={Network}
            color="cyan"
          />

          <KPI
            title="AI Coordination"
            value="LIVE"
            icon={Bot}
            color="blue"
          />

          <KPI
            title="Synchronization"
            value="99.99%"
            icon={ShieldCheck}
            color="emerald"
          />

          <KPI
            title="Operational Reach"
            value="GLOBAL"
            icon={Globe2}
            color="sky"
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

                REAL-TIME ECOSYSTEM ORCHESTRATION

              </div>

              <h2 className="text-4xl font-black mb-6">

                The unified operational brain powering industrial civilization systems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Command Center orchestrates industrial infrastructure,
                enterprise systems,
                AI agents,
                governance networks,
                automation infrastructure,
                predictive intelligence,
                and sovereign ecosystem coordination from one unified operational core.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Operational Grid"
                value="LIVE"
              />

              <MiniStat
                title="AI Coordination"
                value="ACTIVE"
              />

              <MiniStat
                title="Infrastructure Sync"
                value="CONNECTED"
              />

              <MiniStat
                title="Global Ecosystem"
                value="ONLINE"
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
              placeholder="Search command systems..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-cyan-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Radar
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
                          item.system
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
                        item.synchronization
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
                      icon={Workflow}
                      label={`Orchestration: ${item.orchestration}`}
                    />

                    <Info
                      icon={Network}
                      label="Unified Coordination Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Brain size={18} />

                      Ecosystem Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* SYNC */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Synchronization Level

                      </div>

                      <div className="font-black text-cyan-400">

                        {
                          item.synchronization
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width:
                            `${item.synchronization}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

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
              icon={Truck}
              title="Infrastructure Operations"
              text="Coordinate fleets, logistics, maintenance, infrastructure systems, and industrial execution."
            />

            <Service
              icon={Building2}
              title="Enterprise Coordination"
              text="Unify ERP, CRM, procurement, contracts, compliance, and operational execution."
            />

            <Service
              icon={Bot}
              title="AI Orchestration"
              text="Control AI agents, autonomous workflows, industrial intelligence, and predictive automation."
            />

            <Service
              icon={Landmark}
              title="Sovereign Intelligence"
              text="Manage governance systems, strategic forecasting, ecosystem regulation, and economic intelligence."
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

                  INDUSTRIAL CIVILIZATION CONTROL INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM Command Center orchestrates sovereign industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Command Center transforms TM into a real-time industrial civilization operating system —
                  enabling unified orchestration,
                  AI-driven operations,
                  strategic ecosystem intelligence,
                  autonomous execution,
                  and sovereign industrial coordination at global scale.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/market-intelligence"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Market Intelligence

                </Link>

                <Link
                  href="/governance"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Governance

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

    emerald:
      "bg-emerald-500/10 text-emerald-400",

    sky:
      "bg-sky-500/10 text-sky-400",
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
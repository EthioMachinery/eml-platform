"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Binary,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cog,
  Database,
  Fingerprint,
  Globe2,
  Layers3,
  Network,
  Orbit,
  Radar,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Truck,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type AutomationModule = {
  id: number;

  system: string;

  category: string;

  status: string;

  scale: string;

  automation: number;

  orchestration: string;

  intelligence: string;
};

export default function AutomationPage() {
  const [modules, setModules] =
    useState<AutomationModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: AutomationModule[] =
      [
        {
          id: 1,

          system:
            "Autonomous Fleet Operations",

          category:
            "Infrastructure Automation",

          status:
            "Operational",

          scale:
            "Global Logistics",

          automation: 99,

          orchestration:
            "Real-Time AI Automation",

          intelligence:
            "Automating fleet monitoring, dispatching, maintenance triggers, and transport orchestration workflows.",
        },

        {
          id: 2,

          system:
            "Enterprise Workflow Automation",

          category:
            "Business Operations",

          status:
            "Live",

          scale:
            "Enterprise Networks",

          automation: 98,

          orchestration:
            "Workflow Intelligence",

          intelligence:
            "Automating procurement approvals, contracts, ERP workflows, operational compliance, and enterprise execution.",
        },

        {
          id: 3,

          system:
            "AI Agent Workflow Engine",

          category:
            "Autonomous AI Systems",

          status:
            "Optimized",

          scale:
            "Industrial AI Infrastructure",

          automation: 99,

          orchestration:
            "AI Agent Coordination",

          intelligence:
            "Orchestrating autonomous AI agents, infrastructure operations, and industrial intelligence automation.",
        },

        {
          id: 4,

          system:
            "Government Infrastructure Automation",

          category:
            "Public Infrastructure",

          status:
            "Secured",

          scale:
            "National Infrastructure",

          automation: 97,

          orchestration:
            "Sovereign Automation",

          intelligence:
            "Automating infrastructure reporting, permits, transport coordination, and public operational systems.",
        },
      ];

    setModules(demo);
  }

  const filtered =
    useMemo(() => {
      return modules.filter(
        (item) => {
          const keyword =
            `${item.system} ${item.category} ${item.scale}`
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

      <section className="relative overflow-hidden border-b border-lime-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-green-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-lime-500/10 border border-lime-500/20 text-lime-400 px-5 py-3 rounded-full font-black mb-8">

              <Workflow size={20} />

              TM AUTOMATION

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Autonomous Industrial Workflow Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Intelligent industrial automation infrastructure orchestrating enterprise operations,
              fleet systems,
              AI agents,
              logistics execution,
              procurement workflows,
              infrastructure coordination,
              and autonomous industrial ecosystems.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/ai-agents"
                className="bg-lime-500 hover:bg-lime-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                AI Agents

              </Link>

              <Link
                href="/control-center"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Control Center

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Automated Workflows"
            value="12.4M"
            icon={Workflow}
            color="lime"
          />

          <KPI
            title="AI Operations"
            value="ACTIVE"
            icon={Bot}
            color="green"
          />

          <KPI
            title="Autonomous Execution"
            value="99.99%"
            icon={ShieldCheck}
            color="emerald"
          />

          <KPI
            title="Industrial Orchestration"
            value="GLOBAL"
            icon={Globe2}
            color="teal"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-lime-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AUTONOMOUS INDUSTRIAL EXECUTION

              </div>

              <h2 className="text-4xl font-black mb-6">

                The automation layer powering industrial civilization systems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Automation orchestrates enterprise workflows,
                infrastructure systems,
                AI operations,
                procurement execution,
                fleet coordination,
                and autonomous industrial intelligence execution across the ecosystem.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Workflow Engine"
                value="LIVE"
              />

              <MiniStat
                title="AI Automation"
                value="ACTIVE"
              />

              <MiniStat
                title="Infrastructure Orchestration"
                value="CONNECTED"
              />

              <MiniStat
                title="Autonomous Systems"
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
              placeholder="Search automation infrastructure..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-lime-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-lime-500/10 to-green-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Cog
                    size={90}
                    className="text-lime-400"
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

                    <div className="bg-lime-500/10 border border-lime-500/20 text-lime-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.automation
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Globe2}
                      label={`Scale: ${item.scale}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={RefreshCw}
                      label={`Orchestration: ${item.orchestration}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Automation Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-lime-500/10 border border-lime-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-lime-400 font-black mb-3">

                      <Brain size={18} />

                      Automation Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* AUTOMATION */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Automation Capacity

                      </div>

                      <div className="font-black text-lime-400">

                        {
                          item.automation
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-lime-500 rounded-full"
                        style={{
                          width:
                            `${item.automation}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-black py-4 rounded-2xl transition">

                      Open Automation

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
              title="Fleet Automation"
              text="Automate transport operations, dispatching, maintenance, and logistics workflows."
            />

            <Service
              icon={Building2}
              title="Enterprise Workflows"
              text="Automate procurement, ERP execution, approvals, contracts, and compliance systems."
            />

            <Service
              icon={Bot}
              title="AI Orchestration"
              text="Coordinate AI agents, autonomous workflows, and industrial intelligence systems."
            />

            <Service
              icon={Globe2}
              title="Infrastructure Automation"
              text="Automate infrastructure operations, reporting, monitoring, and public systems."
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

                <div className="text-lime-400 font-black tracking-widest mb-4">

                  AUTONOMOUS INDUSTRIAL EXECUTION INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM Automation powers autonomous industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Automation transforms TM into a semi-autonomous industrial civilization platform —
                  enabling AI-driven execution,
                  intelligent workflow orchestration,
                  autonomous infrastructure operations,
                  and industrial-scale operational automation.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/ai-agents"
                  className="bg-lime-500 hover:bg-lime-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  AI Agents

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
    lime:
      "bg-lime-500/10 text-lime-400",

    green:
      "bg-green-500/10 text-green-400",

    emerald:
      "bg-emerald-500/10 text-emerald-400",

    teal:
      "bg-teal-500/10 text-teal-400",
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
    <div className="bg-black/40 border border-lime-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-lime-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-lime-500/10 flex items-center justify-center mb-6">

        <Icon className="text-lime-400" size={30} />

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
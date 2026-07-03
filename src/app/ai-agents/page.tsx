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
  Cpu,
  Database,
  Globe2,
  Layers3,
  Network,
  Radar,
  Search,
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

type Agent = {
  id: number;

  name: string;

  domain: string;

  autonomy: number;

  status: string;

  region: string;

  mission: string;

  intelligence: string;
};

export default function AIAgentsPage() {
  const [agents, setAgents] =
    useState<Agent[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadAgents();
  }, []);

  function loadAgents() {
    const demo: Agent[] =
      [
        {
          id: 1,

          name:
            "Procurement Optimization Agent",

          domain:
            "Government Procurement",

          autonomy: 96,

          status:
            "Active",

          region:
            "National",

          mission:
            "Optimize infrastructure procurement efficiency and supplier allocation.",

          intelligence:
            "Detected procurement inefficiencies and recommended autonomous supplier redistribution.",
        },

        {
          id: 2,

          name:
            "Fleet Coordination Agent",

          domain:
            "Logistics & Transport",

          autonomy: 94,

          status:
            "Learning",

          region:
            "Pan-Africa",

          mission:
            "Autonomously optimize routing, fuel usage, and fleet balancing.",

          intelligence:
            "Reduced idle fleet time using AI logistics orchestration.",
        },

        {
          id: 3,

          name:
            "Maintenance Prediction Agent",

          domain:
            "Industrial Maintenance",

          autonomy: 92,

          status:
            "Monitoring",

          region:
            "Regional",

          mission:
            "Prevent infrastructure downtime through predictive maintenance intelligence.",

          intelligence:
            "Predicted operational stress anomalies before equipment failure.",
        },

        {
          id: 4,

          name:
            "Industrial Financing Agent",

          domain:
            "Credit Intelligence",

          autonomy: 97,

          status:
            "Optimized",

          region:
            "East Africa",

          mission:
            "Autonomously evaluate industrial financing and infrastructure credit risks.",

          intelligence:
            "Detected financing risk clusters across contractor ecosystems.",
        },
      ];

    setAgents(demo);
  }

  const filtered =
    useMemo(() => {
      return agents.filter(
        (item) => {
          const keyword =
            `${item.name} ${item.domain} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [agents, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-orange-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-5 py-3 rounded-full font-black mb-8">

              <Bot size={20} />

              TM AI AGENTS

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Autonomous Industrial Operations Intelligence

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              AI agents capable of autonomously coordinating procurement,
              logistics,
              maintenance,
              financing,
              infrastructure monitoring,
              industrial optimization,
              and operational decision-making across the TM ecosystem.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/ai-command"
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                AI Command Center

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

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="AI Agents"
            value="128"
            icon={Bot}
            color="orange"
          />

          <KPI
            title="Autonomous Decisions"
            value="LIVE"
            icon={Brain}
            color="amber"
          />

          <KPI
            title="Operational Intelligence"
            value="24/7"
            icon={Radar}
            color="cyan"
          />

          <KPI
            title="System Efficiency"
            value="98%"
            icon={TrendingUp}
            color="green"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-orange-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AUTONOMOUS INDUSTRIAL AI

              </div>

              <h2 className="text-4xl font-black mb-6">

                AI systems that act autonomously across industrial ecosystems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM AI Agents continuously coordinate industrial operations,
                optimize logistics,
                forecast risks,
                negotiate procurement pathways,
                monitor maintenance cycles,
                and improve infrastructure efficiency without manual intervention.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Agent Network"
                value="CONNECTED"
              />

              <MiniStat
                title="AI Decisions"
                value="AUTONOMOUS"
              />

              <MiniStat
                title="Operational AI"
                value="LIVE"
              />

              <MiniStat
                title="Industrial Efficiency"
                value="OPTIMIZED"
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
              placeholder="Search AI agents..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-orange-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Bot
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
                          item.name
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.domain
                        }

                      </div>

                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.autonomy
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
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Cpu}
                      label="Autonomous Intelligence Active"
                    />

                    <Info
                      icon={Workflow}
                      label="Operational Coordination Enabled"
                    />

                  </div>

                  {/* MISSION */}

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 mb-5">

                    <div className="flex items-center gap-3 text-orange-400 font-black mb-3">

                      <Radar size={18} />

                      Agent Mission

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.mission
                      }

                    </p>

                  </div>

                  {/* AI */}

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Brain size={18} />

                      Autonomous Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* AUTONOMY */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Agent Autonomy

                      </div>

                      <div className="font-black text-orange-400">

                        {
                          item.autonomy
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{
                          width:
                            `${item.autonomy}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition">

                      Open Agent

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
              icon={Building2}
              title="Procurement Agents"
              text="Autonomously coordinate infrastructure procurement workflows and supplier optimization."
            />

            <Service
              icon={Truck}
              title="Logistics Agents"
              text="Optimize industrial logistics, fleet balancing, and transport routing."
            />

            <Service
              icon={Wrench}
              title="Maintenance Agents"
              text="Predict operational failures and coordinate maintenance scheduling."
            />

            <Service
              icon={Wallet}
              title="Financing Agents"
              text="Evaluate industrial financing risks and optimize credit intelligence."
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

                  AUTONOMOUS INDUSTRIAL OPERATIONS

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  AI agents are the future of industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM AI Agents transform industrial systems into autonomous,
                  intelligent,
                  self-optimizing infrastructure ecosystems capable of acting independently across operational workflows.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/knowledge-graph"
                  className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
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
    orange:
      "bg-orange-500/10 text-orange-400",

    amber:
      "bg-amber-500/10 text-amber-400",

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
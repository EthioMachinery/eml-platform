"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  Globe2,
  GitBranch,
  Layers3,
  Link2,
  Network,
  Orbit,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type GraphNode = {
  id: number;

  entity: string;

  type: string;

  connections: number;

  intelligence: string;

  trust: number;

  region: string;

  status: string;
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] =
    useState<GraphNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadGraph();
  }, []);

  function loadGraph() {
    const demo: GraphNode[] =
      [
        {
          id: 1,

          entity:
            "PanAfrica Contractors",

          type:
            "Contractor Network",

          connections: 1840,

          intelligence:
            "Strong procurement and logistics relationships detected.",

          trust: 96,

          region:
            "East Africa",

          status:
            "Verified",
        },

        {
          id: 2,

          entity:
            "National Infrastructure Procurement",

          type:
            "Government System",

          connections: 2450,

          intelligence:
            "AI identified recurring supplier dependency clusters.",

          trust: 98,

          region:
            "Ethiopia",

          status:
            "Active",
        },

        {
          id: 3,

          entity:
            "EML Fleet Logistics Mesh",

          type:
            "Transport Intelligence",

          connections: 3220,

          intelligence:
            "Autonomous optimization pathways improving delivery efficiency.",

          trust: 94,

          region:
            "Pan-Africa",

          status:
            "Optimized",
        },

        {
          id: 4,

          entity:
            "Industrial Machinery Ecosystem",

          type:
            "Heavy Equipment",

          connections: 4120,

          intelligence:
            "Maintenance-risk propagation detected across linked operators.",

          trust: 91,

          region:
            "Regional",

          status:
            "Monitoring",
        },
      ];

    setNodes(demo);
  }

  const filtered =
    useMemo(() => {
      return nodes.filter(
        (item) => {
          const keyword =
            `${item.entity} ${item.type} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [nodes, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-blue-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-3 rounded-full font-black mb-8">

              <Network size={20} />

              EML KNOWLEDGE GRAPH

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Relationship Intelligence Engine

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Connect machinery,
              contractors,
              suppliers,
              infrastructure projects,
              governments,
              logistics systems,
              financing institutions,
              operators,
              and procurement ecosystems into one intelligent industrial graph.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/ai-command"
                className="bg-blue-500 hover:bg-blue-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                AI Intelligence

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

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Connected Entities"
            value="4.2M+"
            icon={GitBranch}
            color="blue"
          />

          <KPI
            title="Relationship Mapping"
            value="LIVE"
            icon={Network}
            color="cyan"
          />

          <KPI
            title="AI Reasoning"
            value="ACTIVE"
            icon={Brain}
            color="purple"
          />

          <KPI
            title="Trust Intelligence"
            value="97%"
            icon={ShieldCheck}
            color="green"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-blue-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                RELATIONSHIP INTELLIGENCE AI

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI understands the entire industrial ecosystem.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                Knowledge Graph AI maps infrastructure dependencies,
                contractor relationships,
                logistics chains,
                procurement intelligence,
                financing ecosystems,
                maintenance networks,
                and operational behavior into one intelligent reasoning system.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Graph Nodes"
                value="MILLIONS"
              />

              <MiniStat
                title="AI Reasoning"
                value="LIVE"
              />

              <MiniStat
                title="Risk Intelligence"
                value="ACTIVE"
              />

              <MiniStat
                title="Trust Mapping"
                value="CONNECTED"
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
              placeholder="Search knowledge graph entities..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* GRAPH GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-blue-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Network
                    size={90}
                    className="text-blue-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.entity
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.type
                        }

                      </div>

                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.trust
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
                      icon={GitBranch}
                      label={`${item.connections} connections`}
                    />

                    <Info
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={Cpu}
                      label="AI Relationship Mapping"
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-blue-400 font-black mb-3">

                      <Brain size={18} />

                      AI Ecosystem Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* TRUST */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Ecosystem Trust

                      </div>

                      <div className="font-black text-blue-400">

                        {
                          item.trust
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width:
                            `${item.trust}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-blue-500 hover:bg-blue-400 text-black font-black py-4 rounded-2xl transition">

                      Open Graph

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
              icon={Users}
              title="Contractor Intelligence"
              text="Map contractor relationships, trust scoring, and operational dependencies."
            />

            <Service
              icon={Truck}
              title="Supply Chain Mapping"
              text="Visualize logistics systems and industrial movement networks."
            />

            <Service
              icon={Wallet}
              title="Financing Relationships"
              text="Understand infrastructure financing and credit ecosystem interactions."
            />

            <Service
              icon={Building2}
              title="Infrastructure Graph"
              text="Connect governments, projects, suppliers, machinery, and operations."
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

                <div className="text-blue-400 font-black tracking-widest mb-4">

                  INDUSTRIAL REASONING SYSTEM

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML is becoming an industrial intelligence network

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  Knowledge Graph AI transforms disconnected industrial data into intelligent,
                  connected,
                  reasoning-driven infrastructure ecosystems capable of powering next-generation industrial automation.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/digital-twin"
                  className="bg-blue-500 hover:bg-blue-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Digital Twin

                </Link>

                <Link
                  href="/infrastructure-monitor"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Monitoring

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
    blue:
      "bg-blue-500/10 text-blue-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    purple:
      "bg-purple-500/10 text-purple-400",

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
    <div className="bg-black/40 border border-blue-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-blue-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6">

        <Icon className="text-blue-400" size={30} />

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
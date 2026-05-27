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
  Database,
  Fingerprint,
  Globe2,
  Handshake,
  Landmark,
  Layers3,
  Link2,
  Network,
  Orbit,
  Radar,
  Search,
  ShieldCheck,
  Share2,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

type NetworkNode = {
  id: number;

  system: string;

  category: string;

  status: string;

  scope: string;

  connectivity: number;

  orchestration: string;

  intelligence: string;
};

export default function EcosystemNetworkPage() {
  const [systems, setSystems] =
    useState<NetworkNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: NetworkNode[] =
      [
        {
          id: 1,

          system:
            "Industrial Connectivity Grid",

          category:
            "Cross-Organization Infrastructure",

          status:
            "Operational",

          scope:
            "Global Industrial Ecosystem",

          connectivity: 99,

          orchestration:
            "Enterprise Connectivity Intelligence",

          intelligence:
            "Connecting enterprises, fleets, suppliers, governments, contractors, and infrastructure operators into a unified industrial network.",
        },

        {
          id: 2,

          system:
            "Industrial Relationship Graph",

          category:
            "Industrial Ontology",

          status:
            "Live",

          scope:
            "Infrastructure Relationship Networks",

          connectivity: 98,

          orchestration:
            "Industrial Graph Intelligence",

          intelligence:
            "Mapping infrastructure dependencies, procurement relationships, operational coordination, and industrial trust systems.",
        },

        {
          id: 3,

          system:
            "Collaborative Operations Network",

          category:
            "Shared Ecosystem Operations",

          status:
            "Optimized",

          scope:
            "Connected Enterprise Systems",

          connectivity: 99,

          orchestration:
            "Autonomous Collaboration",

          intelligence:
            "Enabling shared workflows, AI coordination, infrastructure collaboration, and industrial operational synchronization.",
        },

        {
          id: 4,

          system:
            "Sovereign Industrial Coordination Infrastructure",

          category:
            "Global Industrial Coordination",

          status:
            "Secured",

          scope:
            "National + Enterprise Ecosystems",

          connectivity: 97,

          orchestration:
            "Strategic Ecosystem Intelligence",

          intelligence:
            "Coordinating sovereign industrial ecosystems, logistics flows, infrastructure intelligence, and economic dependency analysis.",
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

      <section className="relative overflow-hidden border-b border-sky-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-3 rounded-full font-black mb-8">

              <Network size={20} />

              EML ECOSYSTEM NETWORK

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Global Industrial Connectivity Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Sovereign industrial network infrastructure connecting enterprises,
              suppliers,
              fleets,
              governments,
              AI systems,
              contractors,
              developers,
              and infrastructure ecosystems into one unified operational intelligence network.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/knowledge-graph"
                className="bg-sky-500 hover:bg-sky-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Knowledge Graph

              </Link>

              <Link
                href="/command-center"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Command Center

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Connected Organizations"
            value="4.8M"
            icon={Building2}
            color="sky"
          />

          <KPI
            title="Industrial Relationships"
            value="LIVE"
            icon={Handshake}
            color="cyan"
          />

          <KPI
            title="Network Synchronization"
            value="99.9%"
            icon={ShieldCheck}
            color="emerald"
          />

          <KPI
            title="Global Reach"
            value="WORLDWIDE"
            icon={Globe2}
            color="blue"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border border-sky-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-sky-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL CONNECTIVITY INTELLIGENCE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The industrial internet layer powering ecosystem civilization.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Ecosystem Network unifies enterprises,
                infrastructure operators,
                governments,
                AI systems,
                contractors,
                and industrial marketplaces into one intelligent industrial relationship graph.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Industrial Graph"
                value="LIVE"
              />

              <MiniStat
                title="AI Coordination"
                value="ACTIVE"
              />

              <MiniStat
                title="Enterprise Connectivity"
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
              placeholder="Search ecosystem network systems..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-sky-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Orbit
                    size={90}
                    className="text-sky-400"
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

                    <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.connectivity
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
                      label="Ecosystem Connectivity Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-sky-400 font-black mb-3">

                      <Brain size={18} />

                      Ecosystem Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* CONNECTIVITY */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Connectivity Level

                      </div>

                      <div className="font-black text-sky-400">

                        {
                          item.connectivity
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{
                          width:
                            `${item.connectivity}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-sky-500 hover:bg-sky-400 text-black font-black py-4 rounded-2xl transition">

                      Open Network

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
              icon={Handshake}
              title="Cross-Organization Connectivity"
              text="Connect enterprises, governments, suppliers, fleets, contractors, and infrastructure ecosystems."
            />

            <Service
              icon={Radar}
              title="Industrial Relationship Graph"
              text="Map industrial dependencies, trust systems, procurement flows, and operational relationships."
            />

            <Service
              icon={Share2}
              title="Collaborative Operations"
              text="Enable shared workflows, shared AI intelligence, and ecosystem-wide industrial coordination."
            />

            <Service
              icon={TrendingUp}
              title="Network Intelligence"
              text="Analyze ecosystem risks, industrial influence, logistics flows, and strategic dependency intelligence."
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

                <div className="text-sky-400 font-black tracking-widest mb-4">

                  GLOBAL INDUSTRIAL CONNECTIVITY INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Ecosystem Network powers connected industrial civilization

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Ecosystem Network transforms EML into a connected industrial civilization network —
                  enabling industrial relationship intelligence,
                  sovereign coordination,
                  enterprise collaboration,
                  AI-powered ecosystem orchestration,
                  and global industrial connectivity infrastructure.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/command-center"
                  className="bg-sky-500 hover:bg-sky-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Command Center

                </Link>

                <Link
                  href="/digital-economy"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Digital Economy

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
    sky:
      "bg-sky-500/10 text-sky-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    emerald:
      "bg-emerald-500/10 text-emerald-400",

    blue:
      "bg-blue-500/10 text-blue-400",
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
    <div className="bg-black/40 border border-sky-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-sky-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-sky-500/10 flex items-center justify-center mb-6">

        <Icon className="text-sky-400" size={30} />

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
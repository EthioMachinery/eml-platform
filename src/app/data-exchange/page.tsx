"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Binary,
  Blocks,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Database,
  FileStack,
  Globe2,
  Layers3,
  LineChart,
  Network,
  Orbit,
  Radar,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  UploadCloud,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

type ExchangeNode = {
  id: number;

  network: string;

  category: string;

  status: string;

  scale: string;

  confidence: number;

  protocol: string;

  intelligence: string;
};

export default function DataExchangePage() {
  const [nodes, setNodes] =
    useState<ExchangeNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadNodes();
  }, []);

  function loadNodes() {
    const demo: ExchangeNode[] =
      [
        {
          id: 1,

          network:
            "Industrial Logistics Exchange",

          category:
            "Fleet + Transport Data",

          status:
            "Operational",

          scale:
            "Global",

          confidence: 99,

          protocol:
            "Real-Time Telemetry",

          intelligence:
            "Sharing fleet intelligence, transport analytics, infrastructure telemetry, and logistics operational data.",
        },

        {
          id: 2,

          network:
            "Government Infrastructure Grid",

          category:
            "Sovereign Infrastructure",

          status:
            "Live",

          scale:
            "National Systems",

          confidence: 98,

          protocol:
            "Secure Data Mesh",

          intelligence:
            "Exchanging transport, road, infrastructure, planning, and monitoring intelligence between institutions.",
        },

        {
          id: 3,

          network:
            "Industrial AI Dataset Exchange",

          category:
            "AI Infrastructure",

          status:
            "Optimized",

          scale:
            "Distributed AI Systems",

          confidence: 97,

          protocol:
            "AI Data Pipelines",

          intelligence:
            "Providing industrial intelligence datasets for AI agents, digital twins, and autonomous learning systems.",
        },

        {
          id: 4,

          network:
            "Enterprise Procurement Intelligence",

          category:
            "Marketplace Intelligence",

          status:
            "Secured",

          scale:
            "Pan-African",

          confidence: 99,

          protocol:
            "Data Governance APIs",

          intelligence:
            "Exchanging supplier intelligence, procurement analytics, pricing signals, and operational forecasting data.",
        },
      ];

    setNodes(demo);
  }

  const filtered =
    useMemo(() => {
      return nodes.filter(
        (item) => {
          const keyword =
            `${item.network} ${item.category} ${item.scale}`
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

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Database size={20} />

              TM DATA EXCHANGE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Intelligence Data Economy Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Sovereign industrial data exchange infrastructure enabling enterprises,
              governments,
              AI systems,
              logistics operators,
              infrastructure networks,
              and autonomous ecosystems to securely exchange industrial intelligence at scale.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/knowledge-graph"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
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
            title="Industrial Data Streams"
            value="14.2M"
            icon={Database}
            color="cyan"
          />

          <KPI
            title="AI Data Pipelines"
            value="ACTIVE"
            icon={Bot}
            color="blue"
          />

          <KPI
            title="Infrastructure Trust"
            value="99.99%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Exchange Networks"
            value="GLOBAL"
            icon={Network}
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

                INDUSTRIAL DATA ECONOMY

              </div>

              <h2 className="text-4xl font-black mb-6">

                The intelligence layer powering industrial ecosystems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Data Exchange orchestrates secure industrial data movement across logistics,
                procurement,
                infrastructure systems,
                governments,
                AI networks,
                digital twins,
                and autonomous industrial ecosystems.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Data Pipelines"
                value="LIVE"
              />

              <MiniStat
                title="AI Datasets"
                value="CONNECTED"
              />

              <MiniStat
                title="Infrastructure Intelligence"
                value="ACTIVE"
              />

              <MiniStat
                title="Governance Mesh"
                value="SECURED"
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
              placeholder="Search industrial data exchanges..."
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

                  <Network
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
                          item.network
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
                        item.confidence
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
                      label={`Protocol: ${item.protocol}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Exchange Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Brain size={18} />

                      Exchange Intelligence

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

                        Exchange Trust

                      </div>

                      <div className="font-black text-cyan-400">

                        {
                          item.confidence
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width:
                            `${item.confidence}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

                      Open Exchange

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
              title="Logistics Intelligence"
              text="Exchange fleet telemetry, logistics analytics, and operational transport intelligence."
            />

            <Service
              icon={Building2}
              title="Government Infrastructure"
              text="Secure infrastructure intelligence exchange for transport and planning systems."
            />

            <Service
              icon={Bot}
              title="AI Data Infrastructure"
              text="Provide industrial datasets and AI training pipelines for autonomous systems."
            />

            <Service
              icon={ShieldCheck}
              title="Sovereign Governance"
              text="Govern industrial data access, permissions, compliance, and auditability."
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

                  INDUSTRIAL DATA ECONOMY INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM Data Exchange powers industrial intelligence flow

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Data Exchange transforms industrial data into a sovereign intelligence economy —
                  enabling AI ecosystems,
                  infrastructure systems,
                  logistics intelligence,
                  industrial automation,
                  and regional economic coordination.

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
                  href="/tm-cloud"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  TM Cloud

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
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
 CloudCog,
  Cpu,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  Layers3,
  MonitorSmartphone,
  Network,
  Orbit,
  Radar,
  Search,
  Server,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Wallet,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type CloudModule = {
  id: number;

  service: string;

  category: string;

  uptime: string;

  status: string;

  scale: string;

  orchestration: number;

  intelligence: string;
};

export default function EMLCloudPage() {
  const [services, setServices] =
    useState<CloudModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadServices();
  }, []);

  function loadServices() {
    const demo: CloudModule[] =
      [
        {
          id: 1,

          service:
            "Industrial AI Compute Mesh",

          category:
            "AI Infrastructure",

          uptime:
            "99.99%",

          status:
            "Operational",

          scale:
            "Global",

          orchestration: 98,

          intelligence:
            "Distributing AI workloads across industrial intelligence clusters and autonomous infrastructure systems.",
        },

        {
          id: 2,

          service:
            "Digital Twin Simulation Cloud",

          category:
            "Simulation Infrastructure",

          uptime:
            "99.98%",

          status:
            "Live",

          scale:
            "Pan-Africa",

          orchestration: 97,

          intelligence:
            "Processing infrastructure simulations and predictive ecosystem modeling in real-time.",
        },

        {
          id: 3,

          service:
            "Industrial Data Pipeline Network",

          category:
            "Data Infrastructure",

          uptime:
            "99.97%",

          status:
            "Stable",

          scale:
            "Regional",

          orchestration: 96,

          intelligence:
            "Streaming telemetry, logistics, procurement, and operational data into unified intelligence systems.",
        },

        {
          id: 4,

          service:
            "Infrastructure Edge Compute",

          category:
            "Edge Infrastructure",

          uptime:
            "99.95%",

          status:
            "Optimized",

          scale:
            "Distributed",

          orchestration: 95,

          intelligence:
            "Providing low-latency industrial edge computing for autonomous operational systems.",
        },
      ];

    setServices(demo);
  }

  const filtered =
    useMemo(() => {
      return services.filter(
        (item) => {
          const keyword =
            `${item.service} ${item.category} ${item.scale}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [services, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-sky-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-5 py-3 rounded-full font-black mb-8">

              <CloudCog size={20} />

              EML CLOUD

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Cloud Infrastructure Platform

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Cloud-native infrastructure platform powering AI agents,
              digital twins,
              industrial telemetry,
              infrastructure monitoring,
              enterprise orchestration,
              edge intelligence,
              and autonomous industrial ecosystems at planetary scale.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/control-center"
                className="bg-sky-500 hover:bg-sky-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Open Control Center

              </Link>

              <Link
                href="/eml-os"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                EML OS

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Cloud Nodes"
            value="4,096"
            icon={Server}
            color="sky"
          />

          <KPI
            title="AI Compute"
            value="ACTIVE"
            icon={Brain}
            color="cyan"
          />

          <KPI
            title="Infrastructure Uptime"
            value="99.99%"
            icon={Gauge}
            color="green"
          />

          <KPI
            title="Global Orchestration"
            value="LIVE"
            icon={Network}
            color="purple"
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

                INDUSTRIAL CLOUD INFRASTRUCTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The cloud foundation powering autonomous industrial ecosystems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Cloud provides the distributed infrastructure layer for industrial AI,
                digital twins,
                telemetry pipelines,
                autonomous orchestration,
                industrial edge computing,
                and ecosystem-scale operational intelligence.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Cloud Fabric"
                value="CONNECTED"
              />

              <MiniStat
                title="Distributed AI"
                value="ACTIVE"
              />

              <MiniStat
                title="Industrial Compute"
                value="SCALING"
              />

              <MiniStat
                title="Telemetry Streams"
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
              placeholder="Search cloud infrastructure..."
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

                  <Cloud
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
                          item.service
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
                        item.orchestration
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
                      icon={Gauge}
                      label={`Uptime: ${item.uptime}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Cloud Orchestration Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-sky-400 font-black mb-3">

                      <Brain size={18} />

                      Cloud Intelligence

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

                        Orchestration Capacity

                      </div>

                      <div className="font-black text-sky-400">

                        {
                          item.orchestration
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{
                          width:
                            `${item.orchestration}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-sky-500 hover:bg-sky-400 text-black font-black py-4 rounded-2xl transition">

                      Open Infrastructure

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
              icon={Cpu}
              title="AI Compute Infrastructure"
              text="Distributed compute infrastructure for industrial AI and autonomous systems."
            />

            <Service
              icon={HardDrive}
              title="Industrial Data Pipelines"
              text="Real-time telemetry, logistics, procurement, and operational data infrastructure."
            />

            <Service
              icon={Orbit}
              title="Digital Twin Cloud"
              text="Infrastructure simulation and predictive industrial modeling at scale."
            />

            <Service
              icon={MonitorSmartphone}
              title="Edge Infrastructure"
              text="Low-latency industrial edge computing for autonomous operational environments."
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

                  INDUSTRIAL CLOUD OPERATING INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Cloud powers autonomous industrial intelligence systems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Cloud is the distributed infrastructure backbone enabling AI orchestration,
                  industrial telemetry,
                  digital twins,
                  enterprise intelligence,
                  edge infrastructure,
                  and autonomous ecosystem-scale operations.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/control-center"
                  className="bg-sky-500 hover:bg-sky-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Control Center

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
    sky:
      "bg-sky-500/10 text-sky-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

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
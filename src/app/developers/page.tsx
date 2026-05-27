"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  Brain,
  Braces,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Code2,
  Component,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe2,
  Layers3,
  Network,
  Orbit,
  Package,
  Plug,
  Radar,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

type DeveloperModule = {
  id: number;

  name: string;

  category: string;

  status: string;

  adoption: number;

  region: string;

  intelligence: string;

  api: string;
};

export default function DevelopersPage() {
  const [modules, setModules] =
    useState<DeveloperModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: DeveloperModule[] =
      [
        {
          id: 1,

          name:
            "Industrial API Gateway",

          category:
            "Infrastructure APIs",

          status:
            "Operational",

          adoption: 98,

          region:
            "Global",

          api:
            "REST + GraphQL",

          intelligence:
            "Providing industrial infrastructure APIs for logistics, procurement, telemetry, and AI orchestration.",
        },

        {
          id: 2,

          name:
            "AI Agent SDK",

          category:
            "AI Developer Tools",

          status:
            "Live",

          adoption: 96,

          region:
            "Pan-Africa",

          api:
            "TypeScript SDK",

          intelligence:
            "Framework for building autonomous industrial AI agents and operational intelligence systems.",
        },

        {
          id: 3,

          name:
            "Infrastructure Plugin System",

          category:
            "Platform Extensions",

          status:
            "Stable",

          adoption: 95,

          region:
            "Regional",

          api:
            "Plugin APIs",

          intelligence:
            "Allows enterprises and governments to extend EML infrastructure capabilities.",
        },

        {
          id: 4,

          name:
            "Industrial Telemetry SDK",

          category:
            "Data Infrastructure",

          status:
            "Optimized",

          adoption: 97,

          region:
            "Distributed",

          api:
            "Streaming APIs",

          intelligence:
            "Real-time telemetry ingestion and industrial data streaming infrastructure.",
        },
      ];

    setModules(demo);
  }

  const filtered =
    useMemo(() => {
      return modules.filter(
        (item) => {
          const keyword =
            `${item.name} ${item.category} ${item.region}`
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

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <Code2 size={20} />

              EML DEVELOPERS PLATFORM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Developer Ecosystem Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Developer infrastructure platform enabling governments,
              enterprises,
              AI engineers,
              industrial operators,
              and ecosystem partners to build applications,
              AI agents,
              telemetry systems,
              industrial APIs,
              automation pipelines,
              and infrastructure intelligence solutions on top of EML.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/eml-cloud"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                EML Cloud

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
            title="Developer APIs"
            value="1,024"
            icon={Braces}
            color="violet"
          />

          <KPI
            title="Industrial SDKs"
            value="LIVE"
            icon={Package}
            color="purple"
          />

          <KPI
            title="Plugin Ecosystem"
            value="ACTIVE"
            icon={Plug}
            color="cyan"
          />

          <KPI
            title="Infrastructure Extensions"
            value="GLOBAL"
            icon={Network}
            color="green"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL PLATFORM ECOSYSTEM

              </div>

              <h2 className="text-4xl font-black mb-6">

                Build industrial intelligence systems on top of EML infrastructure.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Developers Platform exposes APIs,
                orchestration systems,
                AI infrastructure,
                telemetry networks,
                digital twin systems,
                industrial workflows,
                autonomous agent frameworks,
                and cloud infrastructure for ecosystem-wide innovation.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Developer Ecosystem"
                value="EXPANDING"
              />

              <MiniStat
                title="Industrial APIs"
                value="CONNECTED"
              />

              <MiniStat
                title="AI SDKs"
                value="LIVE"
              />

              <MiniStat
                title="Platform Extensions"
                value="ACTIVE"
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
              placeholder="Search developer infrastructure..."
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

                  <Terminal
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
                        item.adoption
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
                      icon={FileCode2}
                      label={`API: ${item.api}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Developer Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Brain size={18} />

                      Platform Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* ADOPTION */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Ecosystem Adoption

                      </div>

                      <div className="font-black text-violet-400">

                        {
                          item.adoption
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                          width:
                            `${item.adoption}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      Open SDK

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
              title="AI Agent SDKs"
              text="Build autonomous industrial AI agents using EML orchestration systems."
            />

            <Service
              icon={Database}
              title="Industrial APIs"
              text="Access procurement, telemetry, logistics, infrastructure, and ERP APIs."
            />

            <Service
              icon={Blocks}
              title="Plugin Ecosystem"
              text="Extend EML infrastructure through enterprise plugins and integrations."
            />

            <Service
              icon={Cloud}
              title="Cloud Developer Infrastructure"
              text="Deploy industrial intelligence systems on EML Cloud infrastructure."
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

                  INDUSTRIAL DEVELOPER ECOSYSTEM

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML enables the next generation of industrial innovation

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Developers Platform transforms EML into an open industrial intelligence ecosystem —
                  enabling governments,
                  enterprises,
                  developers,
                  AI engineers,
                  and infrastructure innovators to build on top of sovereign industrial infrastructure technology.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/eml-cloud"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  EML Cloud

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
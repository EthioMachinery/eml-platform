"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AppWindow,
  ArrowRight,
  BadgeCheck,
  Blocks,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Code2,
  Database,
  Fingerprint,
  Globe2,
  Layers3,
  Network,
  Orbit,
  Package2,
  PlugZap,
  Radar,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

type EcosystemApp = {
  id: number;

  system: string;

  category: string;

  status: string;

  scope: string;

  scalability: number;

  orchestration: string;

  intelligence: string;
};

export default function AppEcosystemPage() {
  const [systems, setSystems] =
    useState<EcosystemApp[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: EcosystemApp[] =
      [
        {
          id: 1,

          system:
            "Industrial Application Marketplace",

          category:
            "Enterprise App Ecosystem",

          status:
            "Operational",

          scope:
            "Global Industrial Marketplace",

          scalability: 99,

          orchestration:
            "Unified App Distribution",

          intelligence:
            "Providing enterprise-grade industrial applications, logistics systems, AI extensions, infrastructure modules, and operational ecosystems.",
        },

        {
          id: 2,

          system:
            "Developer Infrastructure Platform",

          category:
            "Developer Ecosystem",

          status:
            "Live",

          scope:
            "Global Developer Network",

          scalability: 98,

          orchestration:
            "Industrial API Infrastructure",

          intelligence:
            "Enabling developers to build industrial applications, deploy AI systems, integrate enterprise infrastructure, and extend ecosystem intelligence.",
        },

        {
          id: 3,

          system:
            "Industrial AI Extension Framework",

          category:
            "AI App Infrastructure",

          status:
            "Optimized",

          scope:
            "AI Industrial Ecosystems",

          scalability: 99,

          orchestration:
            "AI Orchestration Infrastructure",

          intelligence:
            "Supporting AI copilots, predictive systems, industrial automation modules, autonomous agents, and intelligent workflow deployment.",
        },

        {
          id: 4,

          system:
            "Enterprise Integration Exchange",

          category:
            "Integration Ecosystem",

          status:
            "Secured",

          scope:
            "Cross-System Industrial Connectivity",

          scalability: 97,

          orchestration:
            "Enterprise Connectivity Intelligence",

          intelligence:
            "Connecting SAP, Oracle, IoT systems, infrastructure networks, government platforms, and industrial enterprise systems into one extensible ecosystem.",
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

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <AppWindow size={20} />

              TM APP ECOSYSTEM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Operating Ecosystem Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Sovereign industrial extensibility infrastructure enabling developers,
              enterprises,
              AI systems,
              industrial operators,
              and ecosystem participants to build,
              integrate,
              deploy,
              monetize,
              and orchestrate industrial applications globally.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/developers"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Developer Platform

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
            title="Industrial Applications"
            value="128K"
            icon={Store}
            color="violet"
          />

          <KPI
            title="Developer Ecosystem"
            value="GLOBAL"
            icon={Code2}
            color="fuchsia"
          />

          <KPI
            title="Platform Reliability"
            value="99.99%"
            icon={ShieldCheck}
            color="emerald"
          />

          <KPI
            title="Enterprise Integrations"
            value="CONNECTED"
            icon={PlugZap}
            color="purple"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL EXTENSIBILITY INFRASTRUCTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The industrial app ecosystem powering civilization-scale extensibility.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM App Ecosystem enables organizations,
                developers,
                AI systems,
                enterprises,
                and infrastructure operators to deploy industrial applications,
                intelligent workflows,
                AI extensions,
                infrastructure services,
                and operational ecosystems at planetary scale.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Industrial Apps"
                value="LIVE"
              />

              <MiniStat
                title="Developer APIs"
                value="ACTIVE"
              />

              <MiniStat
                title="AI Extensions"
                value="CONNECTED"
              />

              <MiniStat
                title="Enterprise Integrations"
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
              placeholder="Search industrial ecosystem systems..."
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

                <div className="h-56 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Blocks
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
                          item.system
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
                        item.scalability
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
                      label="Industrial Ecosystem Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Brain size={18} />

                      Ecosystem Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* SCALE */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Ecosystem Scalability

                      </div>

                      <div className="font-black text-violet-400">

                        {
                          item.scalability
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                          width:
                            `${item.scalability}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      Open Ecosystem

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
              icon={Store}
              title="Industrial App Marketplace"
              text="Distribute industrial applications, enterprise systems, logistics modules, and AI infrastructure globally."
            />

            <Service
              icon={Code2}
              title="Developer Infrastructure"
              text="Provide APIs, SDKs, orchestration systems, workflow engines, and extensibility frameworks."
            />

            <Service
              icon={Bot}
              title="AI Extension Framework"
              text="Deploy industrial AI agents, automation systems, copilots, and predictive intelligence modules."
            />

            <Service
              icon={PlugZap}
              title="Enterprise Integrations"
              text="Connect SAP, Oracle, IoT infrastructure, government systems, and industrial enterprise ecosystems."
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

                  INDUSTRIAL OPERATING ECOSYSTEM INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM App Ecosystem powers industrial extensibility civilization

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM App Ecosystem transforms TM into a sovereign industrial operating ecosystem —
                  enabling developers,
                  enterprises,
                  AI systems,
                  and industrial participants to build,
                  deploy,
                  orchestrate,
                  monetize,
                  and scale industrial applications globally.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/developers"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Developers

                </Link>

                <Link
                  href="/ecosystem-network"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Ecosystem Network

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

    fuchsia:
      "bg-fuchsia-500/10 text-fuchsia-400",

    emerald:
      "bg-emerald-500/10 text-emerald-400",

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
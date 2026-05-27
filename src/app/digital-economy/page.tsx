"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  CreditCard,
  Database,
  Fingerprint,
  Globe2,
  HandCoins,
  Landmark,
  Layers3,
  LineChart,
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
  Zap,
} from "lucide-react";

type EconomyNode = {
  id: number;

  system: string;

  category: string;

  status: string;

  scope: string;

  liquidity: number;

  coordination: string;

  intelligence: string;
};

export default function DigitalEconomyPage() {
  const [systems, setSystems] =
    useState<EconomyNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: EconomyNode[] =
      [
        {
          id: 1,

          system:
            "Industrial Participation Economy",

          category:
            "Industrial Marketplace",

          status:
            "Operational",

          scope:
            "Global Industrial Ecosystem",

          liquidity: 99,

          coordination:
            "Marketplace Coordination",

          intelligence:
            "Connecting contractors, suppliers, operators, governments, and enterprises into a unified industrial economic network.",
        },

        {
          id: 2,

          system:
            "Infrastructure Incentive Engine",

          category:
            "Economic Incentives",

          status:
            "Live",

          scope:
            "Infrastructure Networks",

          liquidity: 98,

          coordination:
            "Autonomous Incentive Intelligence",

          intelligence:
            "Managing industrial contribution scoring, productivity incentives, infrastructure rewards, and operational participation systems.",
        },

        {
          id: 3,

          system:
            "Smart Industrial Commerce Grid",

          category:
            "Economic Coordination",

          status:
            "Optimized",

          scope:
            "Industrial Trade Networks",

          liquidity: 99,

          coordination:
            "Dynamic Economic Intelligence",

          intelligence:
            "Coordinating industrial liquidity, dynamic pricing, procurement intelligence, and AI-driven economic orchestration.",
        },

        {
          id: 4,

          system:
            "Sovereign Industrial Economy Infrastructure",

          category:
            "Future Economy Systems",

          status:
            "Secured",

          scope:
            "National + Enterprise Ecosystems",

          liquidity: 97,

          coordination:
            "Digital Economic Governance",

          intelligence:
            "Enabling tokenized infrastructure participation, industrial trust systems, sovereign economic coordination, and digital industrial ecosystems.",
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

      <section className="relative overflow-hidden border-b border-amber-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-5 py-3 rounded-full font-black mb-8">

              <Coins size={20} />

              EML DIGITAL ECONOMY

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Economic Participation Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Sovereign industrial economic infrastructure enabling participation,
              industrial liquidity,
              intelligent commerce,
              infrastructure incentives,
              AI-driven coordination,
              and ecosystem-wide economic orchestration.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/eml-payments"
                className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                EML Payments

              </Link>

              <Link
                href="/credit-ai"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Credit AI

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Economic Participants"
            value="18.4M"
            icon={Users}
            color="amber"
          />

          <KPI
            title="Industrial Liquidity"
            value="LIVE"
            icon={CircleDollarSign}
            color="yellow"
          />

          <KPI
            title="Transaction Confidence"
            value="99.99%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Economic Reach"
            value="GLOBAL"
            icon={Globe2}
            color="orange"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-amber-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL ECONOMIC ORCHESTRATION

              </div>

              <h2 className="text-4xl font-black mb-6">

                The sovereign economic layer powering industrial civilization systems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Digital Economy coordinates industrial commerce,
                infrastructure participation,
                procurement liquidity,
                AI-driven economic systems,
                ecosystem incentives,
                and sovereign industrial economic intelligence.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Industrial Economy"
                value="LIVE"
              />

              <MiniStat
                title="Economic Intelligence"
                value="ACTIVE"
              />

              <MiniStat
                title="Liquidity Systems"
                value="CONNECTED"
              />

              <MiniStat
                title="Participation Grid"
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
              placeholder="Search economic systems..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-amber-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Wallet
                    size={90}
                    className="text-amber-400"
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

                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.liquidity
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
                      label={`Coordination: ${item.coordination}`}
                    />

                    <Info
                      icon={Network}
                      label="Economic Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-amber-400 font-black mb-3">

                      <Brain size={18} />

                      Economic Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* SCORE */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Liquidity Confidence

                      </div>

                      <div className="font-black text-amber-400">

                        {
                          item.liquidity
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width:
                            `${item.liquidity}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition">

                      Open Economy

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
              title="Industrial Participation"
              text="Enable suppliers, contractors, operators, developers, and governments to participate economically."
            />

            <Service
              icon={HandCoins}
              title="Infrastructure Incentives"
              text="Coordinate contribution scoring, infrastructure rewards, and operational incentive systems."
            />

            <Service
              icon={TrendingUp}
              title="Economic Intelligence"
              text="Manage industrial liquidity, AI pricing, procurement intelligence, and strategic economic coordination."
            />

            <Service
              icon={Landmark}
              title="Sovereign Economy"
              text="Enable digital industrial ecosystems, tokenized infrastructure, and sovereign economic orchestration."
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

                <div className="text-amber-400 font-black tracking-widest mb-4">

                  INDUSTRIAL DIGITAL ECONOMY INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Digital Economy powers industrial economic civilization

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Digital Economy transforms EML into a sovereign industrial economic ecosystem —
                  enabling intelligent commerce,
                  infrastructure participation,
                  AI-driven liquidity,
                  economic coordination,
                  and digital industrial civilization systems.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/eml-payments"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  EML Payments

                </Link>

                <Link
                  href="/market-intelligence"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Market Intelligence

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
    amber:
      "bg-amber-500/10 text-amber-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    green:
      "bg-green-500/10 text-green-400",

    orange:
      "bg-orange-500/10 text-orange-400",
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
    <div className="bg-black/40 border border-amber-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-amber-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6">

        <Icon className="text-amber-400" size={30} />

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
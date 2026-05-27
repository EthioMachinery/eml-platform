"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Banknote,
  Binary,
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
  Network,
  Orbit,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

type PaymentModule = {
  id: number;

  system: string;

  category: string;

  status: string;

  scale: string;

  confidence: number;

  settlement: string;

  intelligence: string;
};

export default function EMLPaymentsPage() {
  const [modules, setModules] =
    useState<PaymentModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: PaymentModule[] =
      [
        {
          id: 1,

          system:
            "Industrial Settlement Network",

          category:
            "Enterprise Payments",

          status:
            "Operational",

          scale:
            "Global",

          confidence: 99,

          settlement:
            "Real-Time",

          intelligence:
            "Enabling procurement settlements, enterprise payments, and industrial transaction orchestration.",
        },

        {
          id: 2,

          system:
            "Autonomous AI Commerce",

          category:
            "Machine Economy",

          status:
            "Live",

          scale:
            "Autonomous Infrastructure",

          confidence: 98,

          settlement:
            "AI-Driven",

          intelligence:
            "Supporting autonomous AI agent payments, infrastructure billing, and machine-to-machine commerce.",
        },

        {
          id: 3,

          system:
            "Cross-Border Infrastructure Payments",

          category:
            "Regional Settlement",

          status:
            "Stable",

          scale:
            "Pan-Africa",

          confidence: 97,

          settlement:
            "Multi-Currency",

          intelligence:
            "Managing sovereign industrial settlement systems and regional infrastructure payments.",
        },

        {
          id: 4,

          system:
            "Industrial Wallet Infrastructure",

          category:
            "Digital Financial Infrastructure",

          status:
            "Secured",

          scale:
            "Enterprise + Government",

          confidence: 99,

          settlement:
            "Secure Wallet Systems",

          intelligence:
            "Providing enterprise wallets, operator wallets, and sovereign infrastructure financial systems.",
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

      <section className="relative overflow-hidden border-b border-yellow-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">

              <Wallet size={20} />

              EML PAYMENTS

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Financial Infrastructure Network

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Sovereign industrial financial infrastructure powering procurement settlements,
              logistics transactions,
              AI commerce,
              infrastructure billing,
              enterprise wallets,
              autonomous machine economies,
              and regional industrial payment orchestration.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/credit-ai"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Credit AI

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
            title="Industrial Transactions"
            value="$4.8B"
            icon={CircleDollarSign}
            color="yellow"
          />

          <KPI
            title="AI Commerce"
            value="ACTIVE"
            icon={Bot}
            color="amber"
          />

          <KPI
            title="Settlement Infrastructure"
            value="99.99%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Enterprise Wallets"
            value="LIVE"
            icon={Wallet}
            color="orange"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-yellow-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL FINANCIAL INFRASTRUCTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The financial engine powering industrial ecosystems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Payments orchestrates industrial value exchange across procurement,
                logistics,
                governments,
                contractors,
                AI agents,
                infrastructure systems,
                and autonomous industrial economies.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Settlement Systems"
                value="LIVE"
              />

              <MiniStat
                title="Machine Commerce"
                value="ACTIVE"
              />

              <MiniStat
                title="Industrial Wallets"
                value="CONNECTED"
              />

              <MiniStat
                title="Cross-Border Flows"
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
              placeholder="Search payment infrastructure..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-yellow-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Coins
                    size={90}
                    className="text-yellow-400"
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

                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">

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
                      icon={CreditCard}
                      label={`Settlement: ${item.settlement}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Financial Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-yellow-400 font-black mb-3">

                      <Brain size={18} />

                      Financial Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* CONFIDENCE */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Infrastructure Confidence

                      </div>

                      <div className="font-black text-yellow-400">

                        {
                          item.confidence
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{
                          width:
                            `${item.confidence}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition">

                      Open Payments

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
              title="Enterprise Payments"
              text="Industrial procurement settlement and enterprise financial orchestration."
            />

            <Service
              icon={Bot}
              title="Machine Economy"
              text="AI agent commerce and autonomous infrastructure payment systems."
            />

            <Service
              icon={Globe2}
              title="Cross-Border Settlement"
              text="Regional industrial payment systems and sovereign financial infrastructure."
            />

            <Service
              icon={Wallet}
              title="Industrial Wallets"
              text="Enterprise wallets, operator wallets, and infrastructure financial systems."
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

                <div className="text-yellow-400 font-black tracking-widest mb-4">

                  INDUSTRIAL ECONOMIC INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Payments powers industrial value exchange

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Payments transforms EML into a living industrial economy —
                  enabling enterprise commerce,
                  sovereign settlement,
                  infrastructure billing,
                  AI commerce,
                  autonomous payments,
                  and ecosystem-scale financial orchestration.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/credit-ai"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Credit AI

                </Link>

                <Link
                  href="/eml-identity"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  EML Identity

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
    yellow:
      "bg-yellow-500/10 text-yellow-400",

    amber:
      "bg-amber-500/10 text-amber-400",

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
    <div className="bg-black/40 border border-yellow-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-yellow-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 flex items-center justify-center mb-6">

        <Icon className="text-yellow-400" size={30} />

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
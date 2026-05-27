"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Banknote,
  BarChart3,
  Brain,
  Building2,
  Calculator,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileSearch,
  Globe2,
  HardHat,
  Landmark,
  LineChart,
  Percent,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wallet,
} from "lucide-react";

type CreditEntity = {
  id: number;

  company: string;

  type: string;

  score: number;

  risk: string;

  financing: string;

  region: string;

  aiInsight: string;

  status: string;
};

export default function CreditAIPage() {
  const [entities, setEntities] =
    useState<CreditEntity[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadEntities();
  }, []);

  function loadEntities() {
    const demo: CreditEntity[] =
      [
        {
          id: 1,

          company:
            "Ethio Infrastructure Group",

          type:
            "Contractor",

          score: 94,

          risk: "Low",

          financing:
            "1.8B ETB",

          region:
            "Addis Ababa",

          aiInsight:
            "Strong repayment consistency and high infrastructure delivery reliability.",

          status:
            "Verified",
        },

        {
          id: 2,

          company:
            "Blue Nile Machinery Supply",

          type:
            "Supplier",

          score: 87,

          risk: "Moderate",

          financing:
            "640M ETB",

          region:
            "Bahir Dar",

          aiInsight:
            "Supplier stability remains strong with moderate procurement exposure.",

          status:
            "AI Monitored",
        },

        {
          id: 3,

          company:
            "PanAfrica Transport Systems",

          type:
            "Fleet Operator",

          score: 97,

          risk: "Low",

          financing:
            "2.4B ETB",

          region:
            "Hawassa",

          aiInsight:
            "Exceptional operational consistency and fleet financing stability.",

          status:
            "Trusted",
        },
      ];

    setEntities(demo);
  }

  const filtered =
    useMemo(() => {
      return entities.filter(
        (item) => {
          const keyword =
            `${item.company} ${item.type} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [entities, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              EML INDUSTRIAL CREDIT AI

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Financing & Credit Intelligence

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Evaluate contractors,
              suppliers,
              fleet operators,
              infrastructure financing,
              industrial trust,
              procurement reliability,
              and enterprise risk using AI-driven credit intelligence.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/financing"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Financing Center

              </Link>

              <Link
                href="/government"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Government Procurement

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Credit Profiles"
            value="420K+"
            icon={CreditCard}
            color="violet"
          />

          <KPI
            title="Financing Intelligence"
            value="8.4B ETB"
            icon={Wallet}
            color="purple"
          />

          <KPI
            title="AI Trust Accuracy"
            value="96%"
            icon={ShieldCheck}
            color="cyan"
          />

          <KPI
            title="Risk Monitoring"
            value="LIVE"
            icon={Activity}
            color="green"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                CREDIT RISK AI ENGINE

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI predicts financing risk before failures happen.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes operational history,
                procurement reliability,
                repayment consistency,
                infrastructure delivery,
                supplier trust,
                fleet performance,
                and industrial cash flow stability.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Default Prediction"
                value="ACTIVE"
              />

              <MiniStat
                title="AI Trust Engine"
                value="96%"
              />

              <MiniStat
                title="Risk Detection"
                value="LIVE"
              />

              <MiniStat
                title="Financing AI"
                value="SMART"
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
              placeholder="Search credit profiles..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* CARDS */}

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

                  <CreditCard
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
                          item.company
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.type
                        }

                      </div>

                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.score
                      }
                      /100

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Wallet}
                      label={`Financing: ${item.financing}`}
                    />

                    <Info
                      icon={AlertTriangle}
                      label={`Risk: ${item.risk}`}
                    />

                    <Info
                      icon={Globe2}
                      label={`Region: ${item.region}`}
                    />

                    <Info
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Brain size={18} />

                      Credit AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.aiInsight
                      }

                    </p>

                  </div>

                  {/* SCORE */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Credit Reliability

                      </div>

                      <div className="font-black text-violet-400">

                        {
                          item.score
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                          width:
                            `${item.score}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      View Analysis

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <LineChart />

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      {/* SERVICES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={ShieldCheck}
              title="Risk Intelligence"
              text="Detect financing anomalies and predict industrial repayment risk."
            />

            <Service
              icon={Building2}
              title="Contractor Scoring"
              text="Analyze infrastructure delivery reliability and operational trust."
            />

            <Service
              icon={Wallet}
              title="Financing AI"
              text="Evaluate industrial financing strength and funding capacity."
            />

            <Service
              icon={BarChart3}
              title="Enterprise Analytics"
              text="Monitor financial reliability and procurement intelligence."
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

                  INDUSTRIAL TRUST INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build intelligent financing systems for industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML combines financing intelligence,
                  contractor scoring,
                  supplier reliability,
                  procurement trust,
                  and AI-powered industrial risk analytics into one unified intelligence platform.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/financing"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Financing System

                </Link>

                <Link
                  href="/erp"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  ERP Core

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

        <TrendingUp className="text-zinc-700" />

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
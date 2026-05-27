"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  GanttChartSquare,
  Globe2,
  HardHat,
  Landmark,
  LineChart,
  MapPinned,
  ReceiptText,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

type Tender = {
  id: number;

  title: string;

  agency: string;

  region: string;

  budget: string;

  bids: number;

  aiRisk: string;

  transparency: number;

  status: string;

  description: string;
};

export default function GovernmentPage() {
  const [tenders, setTenders] =
    useState<Tender[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadTenders();
  }, []);

  function loadTenders() {
    const demo: Tender[] =
      [
        {
          id: 1,

          title:
            "National Highway Expansion Project",

          agency:
            "Federal Infrastructure Authority",

          region:
            "Addis Ababa",

          budget:
            "1.2B ETB",

          bids: 42,

          aiRisk:
            "Low",

          transparency: 97,

          status:
            "Open Tender",

          description:
            "Infrastructure procurement for national highway development and road expansion systems.",
        },

        {
          id: 2,

          title:
            "Municipal Fleet Procurement",

          agency:
            "Regional Transport Bureau",

          region:
            "Bahir Dar",

          budget:
            "480M ETB",

          bids: 21,

          aiRisk:
            "Medium",

          transparency: 91,

          status:
            "Evaluation Phase",

          description:
            "Government procurement for transport vehicles and municipal fleet modernization.",
        },

        {
          id: 3,

          title:
            "Industrial Machinery Acquisition",

          agency:
            "National Construction Agency",

          region:
            "Hawassa",

          budget:
            "920M ETB",

          bids: 35,

          aiRisk:
            "Low",

          transparency: 95,

          status:
            "AI Audit Active",

          description:
            "Large-scale machinery procurement for public infrastructure construction.",
        },
      ];

    setTenders(demo);
  }

  const filtered =
    useMemo(() => {
      return tenders.filter(
        (item) => {
          const keyword =
            `${item.title} ${item.agency} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [tenders, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-emerald-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-full font-black mb-8">

              <Landmark size={20} />

              EML GOVERNMENT PROCUREMENT SYSTEM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              National Infrastructure Procurement Intelligence

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Manage public tenders,
              infrastructure bidding,
              contractor verification,
              supplier intelligence,
              procurement transparency,
              and government infrastructure analytics using AI.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/procurement"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Procurement AI

              </Link>

              <Link
                href="/erp"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                ERP System

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Government Tenders"
            value="12,400+"
            icon={ClipboardCheck}
            color="emerald"
          />

          <KPI
            title="Verified Contractors"
            value="84K+"
            icon={BadgeCheck}
            color="green"
          />

          <KPI
            title="AI Transparency"
            value="97%"
            icon={ShieldCheck}
            color="cyan"
          />

          <KPI
            title="Infrastructure Analytics"
            value="LIVE"
            icon={BarChart3}
            color="yellow"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-emerald-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                GOVERNMENT PROCUREMENT AI

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI detects procurement risk and infrastructure anomalies.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI evaluates contractor reliability,
                procurement transparency,
                project delays,
                infrastructure demand,
                procurement fraud,
                and public spending efficiency.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Fraud Detection"
                value="ACTIVE"
              />

              <MiniStat
                title="Transparency AI"
                value="97%"
              />

              <MiniStat
                title="Project Monitoring"
                value="LIVE"
              />

              <MiniStat
                title="Bid Analysis"
                value="AI"
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
              placeholder="Search government tenders..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* TENDERS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-emerald-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Landmark
                    size={90}
                    className="text-emerald-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.title
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.agency
                        }

                      </div>

                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.transparency
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Wallet}
                      label={`Budget: ${item.budget}`}
                    />

                    <Info
                      icon={Users}
                      label={`Bids: ${item.bids}`}
                    />

                    <Info
                      icon={MapPinned}
                      label={`Region: ${item.region}`}
                    />

                    <Info
                      icon={AlertTriangle}
                      label={`Risk: ${item.aiRisk}`}
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-emerald-400 font-black mb-3">

                      <Brain size={18} />

                      Government AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      AI continuously monitors procurement transparency and infrastructure delivery risk.

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Tender Status

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.status
                      }

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-8 text-zinc-400 leading-8">

                    {
                      item.description
                    }

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition">

                      View Tender

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
              title="Fraud Detection AI"
              text="AI detects abnormal procurement behavior and bidding anomalies."
            />

            <Service
              icon={HardHat}
              title="Contractor Verification"
              text="Validate contractor capability and infrastructure reliability."
            />

            <Service
              icon={GanttChartSquare}
              title="Project Monitoring"
              text="Monitor infrastructure progress and project delivery timelines."
            />

            <Service
              icon={BarChart3}
              title="Infrastructure Analytics"
              text="Analyze regional infrastructure investment and procurement trends."
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

                <div className="text-emerald-400 font-black tracking-widest mb-4">

                  DIGITAL GOVERNMENT INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build transparent national procurement systems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML integrates procurement intelligence,
                  contractor verification,
                  infrastructure monitoring,
                  government ERP,
                  and public analytics into one unified digital infrastructure ecosystem.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/procurement"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Procurement AI

                </Link>

                <Link
                  href="/pricing-ai"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Pricing Intelligence

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
    emerald:
      "bg-emerald-500/10 text-emerald-400",

    green:
      "bg-green-500/10 text-green-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",
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
    <div className="bg-black/40 border border-emerald-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-emerald-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">

        <Icon className="text-emerald-400" size={30} />

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
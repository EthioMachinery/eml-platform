"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Cog,
  Database,
  FileText,
  Fuel,
  Globe2,
  HardHat,
  LayoutDashboard,
  LineChart,
  Package,
  PackageCheck,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Warehouse,
  Wrench,
} from "lucide-react";

type ERPModule = {
  id: number;

  title: string;

  description: string;

  status: string;

  aiScore: number;

  category: string;

  analytics: string;
};

export default function ERPPage() {
  const [modules, setModules] =
    useState<ERPModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadModules();
  }, []);

  function loadModules() {
    const demo: ERPModule[] =
      [
        {
          id: 1,

          title:
            "Procurement Management",

          description:
            "Enterprise procurement automation, supplier intelligence, AI sourcing, and purchasing workflows.",

          status:
            "Operational",

          aiScore: 96,

          category:
            "Procurement",

          analytics:
            "Purchasing optimized by AI.",
        },

        {
          id: 2,

          title:
            "Fleet Operations",

          description:
            "Manage vehicles, transport logistics, machine allocation, and operational efficiency.",

          status:
            "Live",

          aiScore: 94,

          category:
            "Fleet",

          analytics:
            "Fleet utilization increased.",
        },

        {
          id: 3,

          title:
            "Maintenance Intelligence",

          description:
            "Predictive maintenance AI, machine diagnostics, repair scheduling, and fleet servicing.",

          status:
            "AI Active",

          aiScore: 98,

          category:
            "Maintenance",

          analytics:
            "Downtime reduced significantly.",
        },

        {
          id: 4,

          title:
            "Inventory & Warehousing",

          description:
            "Inventory forecasting, warehouse operations, stock monitoring, and supply optimization.",

          status:
            "Operational",

          aiScore: 93,

          category:
            "Inventory",

          analytics:
            "Inventory shortages predicted.",
        },

        {
          id: 5,

          title:
            "Finance & Revenue",

          description:
            "Industrial financial intelligence, payments, invoices, contracts, and ERP accounting.",

          status:
            "Secured",

          aiScore: 95,

          category:
            "Finance",

          analytics:
            "Revenue analytics automated.",
        },

        {
          id: 6,

          title:
            "Workforce & Operations",

          description:
            "Operator management, contractor coordination, HR intelligence, and project allocation.",

          status:
            "Enterprise",

          aiScore: 91,

          category:
            "Workforce",

          analytics:
            "Operational efficiency optimized.",
        },
      ];

    setModules(demo);
  }

  const filtered =
    useMemo(() => {
      return modules.filter(
        (item) => {
          const keyword =
            `${item.title} ${item.category}`
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

      <section className="relative overflow-hidden border-b border-blue-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              EML INDUSTRIAL ERP CORE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Unified Industrial ERP Operating System

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Manage procurement,
              fleets,
              maintenance,
              suppliers,
              logistics,
              inventory,
              finance,
              operations,
              and industrial intelligence inside one unified ERP platform.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/procurement"
                className="bg-blue-500 hover:bg-blue-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Procurement AI

              </Link>

              <Link
                href="/dashboard/crm"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                CRM System

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="ERP Modules"
            value="42+"
            icon={LayoutDashboard}
            color="blue"
          />

          <KPI
            title="Enterprise Operations"
            value="1.2M+"
            icon={Building2}
            color="cyan"
          />

          <KPI
            title="AI Decisions Daily"
            value="420K+"
            icon={Brain}
            color="violet"
          />

          <KPI
            title="Operational Efficiency"
            value="+39%"
            icon={TrendingUp}
            color="green"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-blue-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                ERP AI INTELLIGENCE

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI automates industrial operations across the enterprise.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes procurement,
                operations,
                maintenance,
                logistics,
                inventory,
                workforce,
                and financial systems to optimize industrial performance.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="ERP AI"
                value="ACTIVE"
              />

              <MiniStat
                title="Operational Accuracy"
                value="97%"
              />

              <MiniStat
                title="Automation Level"
                value="+64%"
              />

              <MiniStat
                title="Enterprise Scale"
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
              placeholder="Search ERP modules..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* MODULES */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (module) => (
              <div
                key={module.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-blue-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Database
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
                          module.title
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          module.category
                        }

                      </div>

                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {
                        module.aiScore
                      }
                      %

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="text-zinc-400 leading-8 mb-7">

                    {
                      module.description
                    }

                  </div>

                  {/* ANALYTICS */}

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-blue-400 font-black mb-3">

                      <Brain size={18} />

                      ERP AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        module.analytics
                      }

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      System Status

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        module.status
                      }

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-blue-500 hover:bg-blue-400 text-black font-black py-4 rounded-2xl transition">

                      Open Module

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
              icon={Package}
              title="Inventory Intelligence"
              text="Monitor industrial inventory and optimize warehousing operations."
            />

            <Service
              icon={Truck}
              title="Fleet Coordination"
              text="Coordinate logistics, transportation, and machine deployment."
            />

            <Service
              icon={Wrench}
              title="Maintenance AI"
              text="Automate servicing and predictive maintenance operations."
            />

            <Service
              icon={Wallet}
              title="Financial Operations"
              text="Manage invoices, ERP accounting, revenue, and industrial finance."
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

                  INDUSTRIAL ERP CLOUD

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s unified industrial ERP infrastructure

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML integrates procurement,
                  logistics,
                  maintenance,
                  fleet operations,
                  suppliers,
                  finance,
                  inventory,
                  and AI enterprise intelligence into one operating system.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/pricing-ai"
                  className="bg-blue-500 hover:bg-blue-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Pricing AI

                </Link>

                <Link
                  href="/maintenance"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  AI Maintenance

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

    violet:
      "bg-violet-500/10 text-violet-400",

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
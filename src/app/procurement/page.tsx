"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowRightLeft,
  BadgeCheck,
  Banknote,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileCheck2,
  Globe2,
  LineChart,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  TimerReset,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

type ProcurementRequest = {
  id: number;

  title: string;

  category: string;

  quantity: string;

  region: string;

  budget: string;

  suppliers: number;

  aiScore: number;

  deliveryRisk: string;

  status: string;

  description: string;
};

export default function ProcurementPage() {
  const [requests, setRequests] =
    useState<
      ProcurementRequest[]
    >([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  function loadRequests() {
    const demo: ProcurementRequest[] =
      [
        {
          id: 1,

          title:
            "Excavator Hydraulic Systems",

          category:
            "Heavy Machinery Parts",

          quantity:
            "240 Units",

          region:
            "Addis Ababa",

          budget:
            "4.8M ETB",

          suppliers: 18,

          aiScore: 96,

          deliveryRisk:
            "Low",

          status:
            "Open Bidding",

          description:
            "Procurement request for industrial hydraulic systems and excavator maintenance components.",
        },

        {
          id: 2,

          title:
            "Fleet Tire Procurement",

          category:
            "Fleet Operations",

          quantity:
            "800 Tires",

          region:
            "Bahir Dar",

          budget:
            "7.2M ETB",

          suppliers: 12,

          aiScore: 91,

          deliveryRisk:
            "Medium",

          status:
            "Under Evaluation",

          description:
            "Large-scale procurement for logistics and transportation fleets.",
        },

        {
          id: 3,

          title:
            "Industrial Generator Components",

          category:
            "Energy Infrastructure",

          quantity:
            "125 Systems",

          region:
            "Hawassa",

          budget:
            "11.5M ETB",

          suppliers: 22,

          aiScore: 94,

          deliveryRisk:
            "Low",

          status:
            "AI Optimizing",

          description:
            "Enterprise procurement for industrial energy infrastructure projects.",
        },
      ];

    setRequests(demo);
  }

  const filtered =
    useMemo(() => {
      return requests.filter(
        (item) => {
          const keyword =
            `${item.title} ${item.category} ${item.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [requests, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-violet-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              TM PROCUREMENT AI ENGINE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Intelligent Industrial Procurement System

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Automate procurement,
              optimize sourcing,
              compare suppliers,
              reduce fraud,
              forecast inventory demand,
              and manage enterprise purchasing using AI.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/suppliers"
                className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Supplier Marketplace

              </Link>

              <Link
                href="/spare-parts"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Spare Parts

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Procurement Requests"
            value="82,400+"
            icon={ClipboardList}
            color="violet"
          />

          <KPI
            title="AI Supplier Matches"
            value="214K+"
            icon={Brain}
            color="cyan"
          />

          <KPI
            title="Cost Optimization"
            value="-27%"
            icon={TrendingDown}
            color="green"
          />

          <KPI
            title="Verified Suppliers"
            value="12,400+"
            icon={BadgeCheck}
            color="yellow"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-violet-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                PROCUREMENT AI OPTIMIZATION

              </div>

              <h2 className="text-4xl font-black mb-6">

                TM AI automatically selects the best suppliers and predicts procurement risk.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes pricing,
                supplier reliability,
                delivery speed,
                inventory demand,
                logistics risk,
                and procurement efficiency across the industrial ecosystem.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Fraud Detection"
                value="ACTIVE"
              />

              <MiniStat
                title="Delivery Prediction"
                value="94%"
              />

              <MiniStat
                title="Supplier Accuracy"
                value="97%"
              />

              <MiniStat
                title="Inventory Forecast"
                value="+43%"
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
              placeholder="Search procurement requests..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* PROCUREMENT REQUESTS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (request) => (
              <div
                key={request.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-violet-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <ShoppingCart
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
                          request.title
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          request.category
                        }

                      </div>

                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {
                        request.aiScore
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={
                        PackageSearch
                      }
                      label={`Quantity: ${request.quantity}`}
                    />

                    <Info
                      icon={
                        Building2
                      }
                      label={`Suppliers: ${request.suppliers}`}
                    />

                    <Info
                      icon={Truck}
                      label={`Risk: ${request.deliveryRisk}`}
                    />

                    <Info
                      icon={Banknote}
                      label={`Budget: ${request.budget}`}
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-violet-400 font-black mb-3">

                      <Brain size={18} />

                      AI Procurement Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      AI recommends supplier optimization and predicts favorable procurement pricing trends.

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Procurement Status

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        request.status
                      }

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-8 text-zinc-400 leading-8">

                    {
                      request.description
                    }

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-black font-black py-4 rounded-2xl transition">

                      View Procurement

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
              title="Fraud Detection"
              text="AI-powered procurement fraud analysis and supplier verification."
            />

            <Service
              icon={ArrowRightLeft}
              title="Supplier Matching"
              text="Automatically match procurement requests with optimized suppliers."
            />

            <Service
              icon={Warehouse}
              title="Inventory Forecasting"
              text="Predict inventory shortages before operational disruption occurs."
            />

            <Service
              icon={BarChart3}
              title="Procurement Analytics"
              text="Track enterprise procurement efficiency and cost optimization."
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

                  ENTERPRISE PROCUREMENT

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s smartest procurement ecosystem

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM combines AI procurement,
                  supplier intelligence,
                  inventory forecasting,
                  industrial logistics,
                  and enterprise sourcing into one unified platform.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/suppliers"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Supplier Network

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
    violet:
      "bg-violet-500/10 text-violet-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    green:
      "bg-green-500/10 text-green-400",

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
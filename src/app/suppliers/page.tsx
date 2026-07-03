"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  BadgeCheck,
  Banknote,
  Brain,
  Building2,
  Factory,
  Globe2,
  HardHat,
  LineChart,
  MapPinned,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";

type Supplier = {
  id: number;

  company: string;

  category: string;

  region: string;

  inventoryCount: number;

  rating: number;

  aiScore: number;

  verified: boolean;

  specialties: string[];

  delivery: string;

  description: string;
};

export default function SuppliersPage() {
  const [search, setSearch] =
    useState("");

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  function loadSuppliers() {
    const demoSuppliers: Supplier[] =
      [
        {
          id: 1,

          company:
            "Ethio Industrial Supply PLC",

          category:
            "Heavy Machinery Parts",

          region:
            "Addis Ababa",

          inventoryCount: 12450,

          rating: 4.9,

          aiScore: 97,

          verified: true,

          specialties: [
            "OEM Parts",
            "Hydraulic Systems",
            "Excavator Components",
          ],

          delivery:
            "Nationwide",

          description:
            "Enterprise supplier for industrial machinery systems and OEM components.",
        },

        {
          id: 2,

          company:
            "Blue Nile Equipment Supply",

          category:
            "Construction Equipment",

          region:
            "Bahir Dar",

          inventoryCount: 8620,

          rating: 4.8,

          aiScore: 93,

          verified: true,

          specialties: [
            "Bulldozer Parts",
            "Fleet Tires",
            "Industrial Lubricants",
          ],

          delivery:
            "Regional + National",

          description:
            "Construction-focused supplier serving infrastructure and logistics sectors.",
        },

        {
          id: 3,

          company:
            "Hawassa Mega Supplier",

          category:
            "Industrial Components",

          region:
            "Hawassa",

          inventoryCount: 5190,

          rating: 4.7,

          aiScore: 89,

          verified: true,

          specialties: [
            "Filters",
            "Electrical Components",
            "Truck Systems",
          ],

          delivery:
            "Nationwide",

          description:
            "Industrial procurement and maintenance component supplier.",
        },
      ];

    setSuppliers(
      demoSuppliers
    );
  }

  const filtered =
    useMemo(() => {
      return suppliers.filter(
        (supplier) => {
          const keyword =
            `${supplier.company} ${supplier.category} ${supplier.region}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [suppliers, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-emerald-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-full font-black mb-8">

              <Warehouse size={20} />

              TM SUPPLIER MARKETPLACE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Supplier Intelligence Network

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Connect suppliers,
              contractors,
              machinery owners,
              fleets,
              operators,
              procurement teams,
              and logistics providers into one intelligent procurement ecosystem.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/sell"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Become Supplier

              </Link>

              <Link
                href="/spare-parts"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Spare Parts Marketplace

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Verified Suppliers"
            value="12,400+"
            icon={BadgeCheck}
            color="emerald"
          />

          <KPI
            title="Industrial Inventory"
            value="4.8M+"
            icon={PackageCheck}
            color="cyan"
          />

          <KPI
            title="Procurement Requests"
            value="32K+"
            icon={ShoppingBag}
            color="yellow"
          />

          <KPI
            title="AI Supplier Engine"
            value="ACTIVE"
            icon={Brain}
            color="violet"
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

                AI PROCUREMENT ENGINE

              </div>

              <h2 className="text-4xl font-black mb-6">

                TM AI analyzes supplier reliability,
                inventory demand,
                delivery performance,
                and procurement optimization.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI continuously predicts inventory shortages,
                pricing opportunities,
                logistics bottlenecks,
                and regional industrial demand.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Supplier Trust"
                value="97%"
              />

              <MiniStat
                title="Delivery Prediction"
                value="93%"
              />

              <MiniStat
                title="Fraud Detection"
                value="ACTIVE"
              />

              <MiniStat
                title="Inventory Forecast"
                value="+46%"
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
              placeholder="Search suppliers, products, inventory..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* SUPPLIERS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (supplier) => (
              <div
                key={supplier.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-emerald-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Factory
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
                          supplier.company
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          supplier.category
                        }

                      </div>

                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {
                        supplier.aiScore
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={
                        MapPinned
                      }
                      label={
                        supplier.region
                      }
                    />

                    <Info
                      icon={
                        PackageCheck
                      }
                      label={`${supplier.inventoryCount.toLocaleString()} Inventory Items`}
                    />

                    <Info
                      icon={Star}
                      label={`${supplier.rating} Rating`}
                    />

                    <Info
                      icon={Truck}
                      label={
                        supplier.delivery
                      }
                    />

                  </div>

                  {/* SPECIALTIES */}

                  <div className="mb-7">

                    <div className="flex items-center gap-3 text-zinc-400 mb-4">

                      <Wrench
                        size={18}
                      />

                      Specialties

                    </div>

                    <div className="flex flex-wrap gap-3">

                      {supplier.specialties.map(
                        (
                          item
                        ) => (
                          <div
                            key={item}
                            className="bg-zinc-800 px-4 py-2 rounded-full text-sm"
                          >

                            {item}

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* AI */}

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-emerald-400 font-black mb-3">

                      <Brain size={18} />

                      AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      High reliability supplier with strong delivery consistency and procurement optimization score.

                    </p>

                  </div>

                  {/* VERIFIED */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Verification Status

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {supplier.verified
                        ? "Verified"
                        : "Pending"}

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-8 text-zinc-400 leading-8">

                    {
                      supplier.description
                    }

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition">

                      View Inventory

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
              title="Supplier Verification"
              text="AI-powered trust scoring and supplier verification systems."
            />

            <Service
              icon={Truck}
              title="Logistics Coordination"
              text="Integrated industrial logistics and delivery systems."
            />

            <Service
              icon={Banknote}
              title="Procurement Financing"
              text="Enterprise procurement financing and industrial credit systems."
            />

            <Service
              icon={Globe2}
              title="Pan-African Expansion"
              text="Scale supplier distribution across Africa and beyond."
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

                  PROCUREMENT ECOSYSTEM

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s industrial procurement backbone

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM connects suppliers,
                  contractors,
                  machinery fleets,
                  operators,
                  procurement teams,
                  spare parts vendors,
                  and logistics companies into one intelligent ecosystem.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/spare-parts"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Spare Parts Marketplace

                </Link>

                <Link
                  href="/contractors"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Contractor Marketplace

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

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    violet:
      "bg-violet-500/10 text-violet-400",
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
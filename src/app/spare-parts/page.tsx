"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  BadgeCheck,
  BatteryCharging,
  Brain,
  CircleDollarSign,
  Cog,
  Factory,
  Filter,
  Globe2,
  HardHat,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";

type SparePart = {
  id: number;

  name: string;

  category: string;

  compatibleMachines: string[];

  supplier: string;

  location: string;

  price: string;

  stock: string;

  condition: string;

  aiScore: number;

  rating: number;

  image:
    | string
    | null;
};

export default function SparePartsPage() {
  const [search, setSearch] =
    useState("");

  const [parts, setParts] =
    useState<SparePart[]>([]);

  useEffect(() => {
    loadParts();
  }, []);

  function loadParts() {
    const demoParts: SparePart[] =
      [
        {
          id: 1,

          name:
            "Excavator Hydraulic Pump",

          category:
            "Hydraulic System",

          compatibleMachines:
            [
              "CAT 320",
              "Komatsu PC200",
            ],

          supplier:
            "Ethio Industrial Parts",

          location:
            "Addis Ababa",

          price:
            "185,000 ETB",

          stock:
            "In Stock",

          condition:
            "New",

          aiScore: 96,

          rating: 4.9,

          image: null,
        },

        {
          id: 2,

          name:
            "Bulldozer Track Chain",

          category:
            "Track System",

          compatibleMachines:
            [
              "CAT D6",
              "Shantui SD16",
            ],

          supplier:
            "Blue Nile Machinery Parts",

          location:
            "Bahir Dar",

          price:
            "92,000 ETB",

          stock:
            "Limited",

          condition:
            "OEM",

          aiScore: 92,

          rating: 4.8,

          image: null,
        },

        {
          id: 3,

          name:
            "Heavy Duty Air Filter",

          category:
            "Filters",

          compatibleMachines:
            [
              "Excavator",
              "Loader",
              "Truck",
            ],

          supplier:
            "Hawassa Parts Center",

          location:
            "Hawassa",

          price:
            "4,500 ETB",

          stock:
            "In Stock",

          condition:
            "New",

          aiScore: 89,

          rating: 4.7,

          image: null,
        },
      ];

    setParts(demoParts);
  }

  const filtered =
    useMemo(() => {
      return parts.filter(
        (part) => {
          const keyword =
            `${part.name} ${part.category} ${part.location} ${part.supplier}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [parts, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-yellow-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">

              <Cog size={20} />

              EML SPARE PARTS MARKETPLACE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Spare Parts Ecosystem

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Buy,
              sell,
              source,
              and distribute machinery spare parts,
              industrial components,
              hydraulic systems,
              filters,
              engines,
              tires,
              and maintenance products across Africa.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/sell"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Sell Spare Parts

              </Link>

              <Link
                href="/fleet"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Fleet Marketplace

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Active Parts"
            value="124K+"
            icon={Package}
            color="yellow"
          />

          <KPI
            title="Verified Suppliers"
            value="8,300"
            icon={BadgeCheck}
            color="green"
          />

          <KPI
            title="Daily Transactions"
            value="19K+"
            icon={
              ShoppingCart
            }
            color="cyan"
          />

          <KPI
            title="AI Matching"
            value="95%"
            icon={Brain}
            color="violet"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-yellow-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AI PARTS INTELLIGENCE

              </div>

              <h2 className="text-4xl font-black mb-6">

                EML AI predicts compatibility,
                demand,
                inventory needs,
                and counterfeit risk automatically.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes machinery history,
                maintenance cycles,
                regional demand,
                and supplier quality to optimize industrial procurement.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Compatibility Accuracy"
                value="95%"
              />

              <MiniStat
                title="Counterfeit Detection"
                value="ACTIVE"
              />

              <MiniStat
                title="Inventory Forecasting"
                value="+41%"
              />

              <MiniStat
                title="Supply Optimization"
                value="+37%"
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
              placeholder="Search parts, suppliers, compatibility..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* PARTS GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (part) => (
              <div
                key={part.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-yellow-500/30 transition"
              >

                {/* IMAGE */}

                <div className="h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Cog
                    size={90}
                    className="text-yellow-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {part.name}

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          part.category
                        }

                      </div>

                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {part.aiScore}
                      %

                    </div>

                  </div>

                  {/* PRICE */}

                  <div className="text-4xl font-black text-yellow-400 mb-6">

                    {part.price}

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={
                        Warehouse
                      }
                      label={
                        part.supplier
                      }
                    />

                    <Info
                      icon={
                        Globe2
                      }
                      label={
                        part.location
                      }
                    />

                    <Info
                      icon={Star}
                      label={`${part.rating} Rating`}
                    />

                    <Info
                      icon={
                        BadgeCheck
                      }
                      label={
                        part.condition
                      }
                    />

                  </div>

                  {/* COMPATIBILITY */}

                  <div className="mb-7">

                    <div className="flex items-center gap-3 text-zinc-400 mb-4">

                      <Wrench
                        size={18}
                      />

                      Compatible Machines

                    </div>

                    <div className="flex flex-wrap gap-3">

                      {part.compatibleMachines.map(
                        (
                          machine
                        ) => (
                          <div
                            key={
                              machine
                            }
                            className="bg-zinc-800 px-4 py-2 rounded-full text-sm"
                          >

                            {
                              machine
                            }

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* AI */}

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-yellow-400 font-black mb-3">

                      <Brain size={18} />

                      AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      High compatibility confidence with strong demand prediction across fleet maintenance systems.

                    </p>

                  </div>

                  {/* STOCK */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Availability

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {part.stock}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition">

                      Buy Now

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <ShoppingCart />

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
              icon={Truck}
              title="Logistics Integration"
              text="Integrated industrial delivery and transport systems."
            />

            <Service
              icon={ShieldCheck}
              title="Supplier Verification"
              text="AI-driven supplier reputation and fraud detection."
            />

            <Service
              icon={BatteryCharging}
              title="Fleet Maintenance AI"
              text="Predictive maintenance and inventory forecasting."
            />

            <Service
              icon={Factory}
              title="OEM & Aftermarket"
              text="Connect with original and aftermarket suppliers."
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

                  INDUSTRIAL SUPPLY CHAIN

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s largest industrial spare parts network

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML connects suppliers,
                  machinery owners,
                  contractors,
                  maintenance teams,
                  fleet operators,
                  and logistics providers into one AI-powered industrial ecosystem.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/contractors"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Contractor Marketplace

                </Link>

                <Link
                  href="/operators"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Operator Marketplace

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

    green:
      "bg-green-500/10 text-green-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

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
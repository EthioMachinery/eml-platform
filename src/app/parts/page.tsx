"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  MapPin,
  Star,
  ShieldCheck,
  Filter,
  Truck,
  ArrowRight,
  Wrench,
} from "lucide-react";

type Part = {
  id: number;
  title: string;
  category: string;
  city: string;
  condition: string;
  price: string;
  rating: number;
  seller: string;
  verified: boolean;
  stock: string;
};

export default function PartsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [category, setCategory] = useState("All Categories");

  const parts: Part[] = [
    {
      id: 1,
      title: "CAT Excavator Hydraulic Pump",
      category: "Hydraulics",
      city: "Addis Ababa",
      condition: "New",
      price: "145,000 ETB",
      rating: 4.9,
      seller: "Addis Parts Hub",
      verified: true,
      stock: "In Stock",
    },
    {
      id: 2,
      title: "Komatsu Engine Filter Kit",
      category: "Filters",
      city: "Adama",
      condition: "New",
      price: "8,500 ETB",
      rating: 4.8,
      seller: "Oromia Machinery Parts",
      verified: true,
      stock: "In Stock",
    },
    {
      id: 3,
      title: "Loader Heavy Duty Tyre",
      category: "Tyres",
      city: "Hawassa",
      condition: "Used",
      price: "32,000 ETB",
      rating: 4.7,
      seller: "South Fleet Supply",
      verified: false,
      stock: "2 Left",
    },
    {
      id: 4,
      title: "Dozer Track Chain Assembly",
      category: "Tracks",
      city: "Dire Dawa",
      condition: "New",
      price: "96,000 ETB",
      rating: 4.8,
      seller: "East Industrial Parts",
      verified: true,
      stock: "In Stock",
    },
    {
      id: 5,
      title: "Bearing Set for Grader",
      category: "Bearings",
      city: "Bahir Dar",
      condition: "New",
      price: "12,300 ETB",
      rating: 4.6,
      seller: "Blue Nile Parts",
      verified: true,
      stock: "In Stock",
    },
    {
      id: 6,
      title: "Starter Motor 24V Heavy Duty",
      category: "Electrical",
      city: "Mekelle",
      condition: "Used",
      price: "18,000 ETB",
      rating: 4.8,
      seller: "North Power Components",
      verified: true,
      stock: "1 Left",
    },
  ];

  const cities = [
    "All Cities",
    "Addis Ababa",
    "Adama",
    "Hawassa",
    "Dire Dawa",
    "Bahir Dar",
    "Mekelle",
  ];

  const categories = [
    "All Categories",
    "Hydraulics",
    "Filters",
    "Tyres",
    "Tracks",
    "Bearings",
    "Electrical",
    "Engines",
    "Lubricants",
  ];

  const filtered = useMemo(() => {
    return parts.filter((item) => {
      const q =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.seller.toLowerCase().includes(query.toLowerCase());

      const c = city === "All Cities" ? true : item.city === city;

      const g =
        category === "All Categories"
          ? true
          : item.category === category;

      return q && c && g;
    });
  }, [query, city, category]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500 text-black font-black text-sm">
            Spare Parts Marketplace
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
            Find Genuine Machinery Parts
          </h1>

          <p className="mt-5 text-white/75 text-lg max-w-3xl leading-8">
            Search filters, engines, tyres, hydraulics, bearings,
            tracks, electrical parts and industrial supplies across Ethiopia.
          </p>

          {/* SEARCH */}
          <div className="mt-8 bg-white rounded-3xl p-3 grid md:grid-cols-4 gap-3">

            <div className="md:col-span-2 flex items-center px-3">
              <Search className="text-slate-400 mr-2" size={18} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search CAT pump, tyres, filters..."
                className="w-full h-12 outline-none text-black"
              />
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 rounded-2xl border px-4 text-black"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-2xl border px-4 text-black"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            ["10K+", "Parts Listed"],
            ["250+", "Verified Sellers"],
            ["80+", "Cities Reach"],
            ["24h", "Fast Delivery Options"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="bg-white rounded-3xl border p-6"
            >
              <div className="text-3xl font-black text-yellow-700">
                {value}
              </div>
              <div className="text-slate-500 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-4 pb-20">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">
            Available Parts
          </h2>

          <div className="text-slate-500 flex items-center gap-2">
            <Filter size={16} />
            {filtered.length} results
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between gap-3">

                <div>
                  <div className="text-xl font-black">
                    {item.title}
                  </div>

                  <div className="mt-2 text-slate-500 flex items-center gap-2">
                    <Package size={15} />
                    {item.category}
                  </div>

                  <div className="mt-2 text-slate-500 flex items-center gap-2">
                    <MapPin size={15} />
                    {item.city}
                  </div>
                </div>

                {item.verified && (
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black flex items-center gap-1">
                    <ShieldCheck size={12} />
                    VERIFIED
                  </div>
                )}

              </div>

              <div className="mt-5 text-3xl font-black text-yellow-700">
                {item.price}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-500 text-sm">
                  {item.condition}
                </div>

                <div className="font-bold text-sm">
                  {item.stock}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold">
                  <Star size={15} className="text-yellow-500" />
                  {item.rating}
                </div>

                <div className="text-slate-500 text-sm">
                  {item.seller}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <Link
                  href="/transport"
                  className="h-12 rounded-2xl bg-black text-white font-bold flex items-center justify-center gap-2"
                >
                  <Truck size={16} />
                  Deliver
                </Link>

                <Link
                  href="/messages"
                  className="h-12 rounded-2xl bg-yellow-500 text-black font-black flex items-center justify-center gap-2"
                >
                  Buy
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
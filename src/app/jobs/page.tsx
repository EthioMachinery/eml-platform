"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Briefcase,
  MapPin,
  Star,
  ShieldCheck,
  Filter,
  Clock3,
  ArrowRight,
  Users,
  Truck,
  Wrench,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  city: string;
  type: string;
  salary: string;
  urgent: boolean;
  verified: boolean;
  posted: string;
  category: string;
};

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [category, setCategory] = useState("All Roles");

  const jobs: Job[] = [
    {
      id: 1,
      title: "Excavator Operator",
      company: "Addis Earthworks PLC",
      city: "Addis Ababa",
      type: "Full Time",
      salary: "35,000 ETB / month",
      urgent: true,
      verified: true,
      posted: "Today",
      category: "Operator",
    },
    {
      id: 2,
      title: "Heavy Truck Driver",
      company: "National Logistics Group",
      city: "Adama",
      type: "Contract",
      salary: "28,000 ETB / month",
      urgent: true,
      verified: true,
      posted: "1 day ago",
      category: "Driver",
    },
    {
      id: 3,
      title: "Hydraulic Technician",
      company: "Hawassa Machine Care",
      city: "Hawassa",
      type: "Full Time",
      salary: "32,000 ETB / month",
      urgent: false,
      verified: true,
      posted: "2 days ago",
      category: "Technician",
    },
    {
      id: 4,
      title: "Crane Operator",
      company: "Dire Mega Projects",
      city: "Dire Dawa",
      type: "Project Based",
      salary: "45,000 ETB / month",
      urgent: false,
      verified: true,
      posted: "Today",
      category: "Operator",
    },
    {
      id: 5,
      title: "Fleet Maintenance Manager",
      company: "Blue Nile Construction",
      city: "Bahir Dar",
      type: "Full Time",
      salary: "55,000 ETB / month",
      urgent: false,
      verified: true,
      posted: "3 days ago",
      category: "Management",
    },
    {
      id: 6,
      title: "Diesel Mechanic",
      company: "North Industrial Services",
      city: "Mekelle",
      type: "Full Time",
      salary: "30,000 ETB / month",
      urgent: true,
      verified: false,
      posted: "Today",
      category: "Mechanic",
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
    "All Roles",
    "Operator",
    "Driver",
    "Technician",
    "Mechanic",
    "Management",
  ];

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q =
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());

      const c = city === "All Cities" ? true : job.city === city;

      const g =
        category === "All Roles"
          ? true
          : job.category === category;

      return q && c && g;
    });
  }, [query, city, category]);

  function iconByCategory(cat: string) {
    if (cat === "Driver") return Truck;
    if (cat === "Mechanic") return Wrench;
    return Users;
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500 text-black font-black text-sm">
            Workforce & Talent Hub
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
            Hire Skilled Operators & Industrial Talent
          </h1>

          <p className="mt-5 text-white/75 text-lg max-w-3xl leading-8">
            Find excavator operators, crane operators, drivers,
            mechanics, technicians and fleet managers across Ethiopia.
          </p>

          {/* SEARCH */}
          <div className="mt-8 bg-white rounded-3xl p-3 grid md:grid-cols-4 gap-3">

            <div className="md:col-span-2 flex items-center px-3">
              <Search className="text-slate-400 mr-2" size={18} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search operator, mechanic, driver..."
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
            ["5K+", "Active Candidates"],
            ["800+", "Open Jobs"],
            ["80+", "Cities Reach"],
            ["24h", "Urgent Hiring Speed"],
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
            Open Roles
          </h2>

          <div className="text-slate-500 flex items-center gap-2">
            <Filter size={16} />
            {filtered.length} jobs
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((job) => {
            const Icon = iconByCategory(job.category);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <div className="text-xl font-black">
                      {job.title}
                    </div>

                    <div className="mt-2 text-slate-500 flex items-center gap-2">
                      <Briefcase size={15} />
                      {job.company}
                    </div>

                    <div className="mt-2 text-slate-500 flex items-center gap-2">
                      <MapPin size={15} />
                      {job.city}
                    </div>
                  </div>

                  {job.verified && (
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black flex items-center gap-1">
                      <ShieldCheck size={12} />
                      VERIFIED
                    </div>
                  )}

                </div>

                <div className="mt-5 text-3xl font-black text-yellow-700">
                  {job.salary}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="text-slate-500">
                    {job.type}
                  </div>

                  {job.urgent && (
                    <div className="font-bold text-red-600">
                      Urgent Hiring
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-slate-500 text-sm flex items-center gap-2">
                    <Clock3 size={14} />
                    {job.posted}
                  </div>

                  <div className="font-bold flex items-center gap-2">
                    <Icon size={14} />
                    {job.category}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <Link
                    href="/signup"
                    className="h-12 rounded-2xl bg-black text-white font-bold flex items-center justify-center"
                  >
                    Apply
                  </Link>

                  <Link
                    href="/messages"
                    className="h-12 rounded-2xl bg-yellow-500 text-black font-black flex items-center justify-center gap-2"
                  >
                    Contact
                    <ArrowRight size={16} />
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </section>

    </main>
  );
}
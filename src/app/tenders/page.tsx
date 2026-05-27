"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLang, Lang } from "@/lib/i18n";

type TenderRow = {
  id: string;
  title: string;
  client: string;
  category: string;
  city: string;
  budget: string;
  deadline: string;
  verified?: boolean;
  urgent?: boolean;
};

export default function TendersPage() {
  const [lang, setLangState] =
    useState<Lang>("en");

  const [search, setSearch] =
    useState("");

  const [city, setCity] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [verifiedOnly,
    setVerifiedOnly] =
    useState(false);

  const [rows] =
    useState<TenderRow[]>([
      {
        id: "1",
        title: "Excavator Rental for Road Project",
        client: "Habesha Roads PLC",
        category: "machinery",
        city: "Addis Ababa",
        budget: "1,200,000 ETB",
        deadline: "15 Days",
        verified: true,
        urgent: true,
      },
      {
        id: "2",
        title: "Bridge Site Operators Needed",
        client: "Abay Engineering",
        category: "workforce",
        city: "Bahir Dar",
        budget: "Negotiable",
        deadline: "7 Days",
        verified: true,
      },
      {
        id: "3",
        title: "Low-bed Transport Tender",
        client: "Ethio Logistics",
        category: "transport",
        city: "Adama",
        budget: "650,000 ETB",
        deadline: "10 Days",
        urgent: true,
      },
      {
        id: "4",
        title: "Spare Parts Supply Contract",
        client: "Mega Fleet Group",
        category: "parts",
        city: "Dire Dawa",
        budget: "900,000 ETB",
        deadline: "20 Days",
        verified: true,
      },
      {
        id: "5",
        title: "Tower Crane Lease Request",
        client: "Capital Towers",
        category: "machinery",
        city: "Addis Ababa",
        budget: "2,800,000 ETB",
        deadline: "12 Days",
      },
      {
        id: "6",
        title: "Site Mechanics Required",
        client: "South Build",
        category: "workforce",
        city: "Hawassa",
        budget: "Negotiable",
        deadline: "5 Days",
        urgent: true,
      },
    ]);

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const isAm =
    lang === "am";

  const t = {
    title: isAm
      ? "ጨረታ እና ፕሮጀክት ገበያ"
      : "Tender & Projects Marketplace",

    sub: isAm
      ? "ማሽነሪ • ሰው ኃይል • ትራንስፖርት • ክፍሎች"
      : "Machinery • Workforce • Transport • Parts",

    search: isAm
      ? "ጨረታ / ደንበኛ / ከተማ..."
      : "Search tender / client / city...",

    allCities: isAm
      ? "ሁሉም ከተሞች"
      : "All Cities",

    allCats: isAm
      ? "ሁሉም ክፍሎች"
      : "All Categories",

    machinery: isAm
      ? "ማሽነሪ"
      : "Machinery",

    workforce: isAm
      ? "የሰው ኃይል"
      : "Workforce",

    transport: isAm
      ? "ትራንስፖርት"
      : "Transport",

    parts: isAm
      ? "ክፍሎች"
      : "Parts",

    verified: isAm
      ? "የተረጋገጡ ብቻ"
      : "Verified Only",

    urgent: isAm
      ? "አስቸኳይ"
      : "Urgent",

    budget: isAm
      ? "በጀት"
      : "Budget",

    deadline: isAm
      ? "የመጨረሻ ቀን"
      : "Deadline",

    bid: isAm
      ? "ይግቡ"
      : "Submit Bid",

    contact: isAm
      ? "ያግኙ"
      : "Contact",
  };

  const cities =
    Array.from(
      new Set(
        rows.map(
          (x) => x.city
        )
      )
    );

  const filtered =
    useMemo(() => {
      let list = [...rows];

      if (search) {
        list = list.filter(
          (x) =>
            x.title
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            x.client
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            x.city
              .toLowerCase()
              .includes(search.toLowerCase())
        );
      }

      if (city) {
        list = list.filter(
          (x) =>
            x.city === city
        );
      }

      if (category) {
        list = list.filter(
          (x) =>
            x.category === category
        );
      }

      if (verifiedOnly) {
        list = list.filter(
          (x) =>
            x.verified
        );
      }

      return list;
    }, [
      rows,
      search,
      city,
      category,
      verifiedOnly,
    ]);

  function catLabel(v:string) {
    if (v==="machinery") return t.machinery;
    if (v==="workforce") return t.workforce;
    if (v==="transport") return t.transport;
    return t.parts;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <p className="text-zinc-400 text-xl">
            {t.sub}
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">

          <input
            value={search}
            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }
            placeholder={t.search}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          />

          <select
            value={city}
            onChange={(e)=>
              setCity(
                e.target.value
              )
            }
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          >
            <option value="">
              {t.allCities}
            </option>

            {cities.map((c)=>(
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e)=>
              setCategory(
                e.target.value
              )
            }
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          >
            <option value="">
              {t.allCats}
            </option>
            <option value="machinery">
              {t.machinery}
            </option>
            <option value="workforce">
              {t.workforce}
            </option>
            <option value="transport">
              {t.transport}
            </option>
            <option value="parts">
              {t.parts}
            </option>
          </select>

          <label className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e)=>
                setVerifiedOnly(
                  e.target.checked
                )
              }
            />
            {t.verified}
          </label>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

          {filtered.map((item)=>(
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"
            >
              <div className="flex justify-between items-start mb-4">

                <div>
                  <h2 className="text-2xl font-bold">
                    {item.title}
                  </h2>

                  <p className="text-zinc-400 mt-1">
                    {item.client}
                  </p>
                </div>

                <div className="flex gap-2">
                  {item.verified && (
                    <span className="px-3 py-1 rounded-full bg-green-600 text-sm font-bold">
                      ✓
                    </span>
                  )}

                  {item.urgent && (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-sm font-bold">
                      {t.urgent}
                    </span>
                  )}
                </div>

              </div>

              <p className="mb-2">
                📍 {item.city}
              </p>

              <p className="mb-2">
                {catLabel(item.category)}
              </p>

              <p className="mb-2 text-green-400 font-bold">
                {t.budget}: {item.budget}
              </p>

              <p className="mb-6 text-zinc-400">
                {t.deadline}: {item.deadline}
              </p>

              <div className="grid grid-cols-2 gap-3">

                <Link
                  href="/dashboard/messages"
                  className="text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-bold"
                >
                  {t.bid}
                </Link>

                <Link
                  href="/dashboard/messages"
                  className="text-center bg-green-600 hover:bg-green-700 py-3 rounded-2xl font-bold"
                >
                  {t.contact}
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLang, Lang } from "@/lib/i18n";

type RentalRow = {
  id: string;
  machine: string;
  owner: string;
  city: string;
  category: string;
  priceHour: string;
  priceDay: string;
  available: boolean;
  rating: number;
  verified?: boolean;
};

export default function RentalsPage() {
  const [lang, setLangState] =
    useState<Lang>("en");

  const [search, setSearch] =
    useState("");

  const [city, setCity] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [availableOnly,
    setAvailableOnly] =
    useState(false);

  const [rows] =
    useState<RentalRow[]>([
      {
        id: "1",
        machine: "Excavator CAT 320",
        owner: "Habesha Equip",
        city: "Addis Ababa",
        category: "excavator",
        priceHour: "2,500 ETB",
        priceDay: "18,000 ETB",
        available: true,
        rating: 4.8,
        verified: true,
      },
      {
        id: "2",
        machine: "Wheel Loader SDLG",
        owner: "Mega Rental",
        city: "Adama",
        category: "loader",
        priceHour: "2,200 ETB",
        priceDay: "16,500 ETB",
        available: true,
        rating: 4.6,
        verified: true,
      },
      {
        id: "3",
        machine: "Bulldozer D6",
        owner: "Road Force",
        city: "Bahir Dar",
        category: "bulldozer",
        priceHour: "3,000 ETB",
        priceDay: "22,000 ETB",
        available: false,
        rating: 4.7,
      },
      {
        id: "4",
        machine: "Backhoe JCB",
        owner: "South Build",
        city: "Hawassa",
        category: "backhoe",
        priceHour: "1,900 ETB",
        priceDay: "14,000 ETB",
        available: true,
        rating: 4.5,
        verified: true,
      },
      {
        id: "5",
        machine: "Crane 25T",
        owner: "Capital Lift",
        city: "Addis Ababa",
        category: "crane",
        priceHour: "4,500 ETB",
        priceDay: "35,000 ETB",
        available: true,
        rating: 4.9,
        verified: true,
      },
      {
        id: "6",
        machine: "Grader CAT",
        owner: "Dire Works",
        city: "Dire Dawa",
        category: "grader",
        priceHour: "3,400 ETB",
        priceDay: "24,000 ETB",
        available: false,
        rating: 4.4,
      },
    ]);

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const isAm =
    lang === "am";

  const t = {
    title: isAm
      ? "የቀጥታ ኪራይ ገበያ"
      : "Live Rental Booking Marketplace",

    sub: isAm
      ? "በሰዓት • በቀን • ፈጣን ቦታ ማስያዝ"
      : "Hourly • Daily • Instant Booking",

    search: isAm
      ? "ማሽን / ከተማ..."
      : "Search machine / city...",

    allCities: isAm
      ? "ሁሉም ከተሞች"
      : "All Cities",

    allCats: isAm
      ? "ሁሉም ማሽኖች"
      : "All Machines",

    available: isAm
      ? "ዝግጁ ብቻ"
      : "Available Only",

    hour: isAm
      ? "በሰዓት"
      : "Per Hour",

    day: isAm
      ? "በቀን"
      : "Per Day",

    rating: isAm
      ? "ደረጃ"
      : "Rating",

    book: isAm
      ? "ያስይዙ"
      : "Book Now",

    chat: isAm
      ? "መልዕክት"
      : "Message",

    verified: isAm
      ? "የተረጋገጠ"
      : "Verified",
  };

  const cities =
    Array.from(
      new Set(
        rows.map(
          (x) => x.city
        )
      )
    );

  const categories =
    Array.from(
      new Set(
        rows.map(
          (x) => x.category
        )
      )
    );

  const filtered =
    useMemo(() => {
      let list = [...rows];

      if (search) {
        list = list.filter(
          (x) =>
            x.machine
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

      if (availableOnly) {
        list = list.filter(
          (x) =>
            x.available
        );
      }

      return list;
    }, [
      rows,
      search,
      city,
      category,
      availableOnly,
    ]);

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

            {categories.map((c)=>(
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e)=>
                setAvailableOnly(
                  e.target.checked
                )
              }
            />
            {t.available}
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
                    {item.machine}
                  </h2>

                  <p className="text-zinc-400 mt-1">
                    {item.owner}
                  </p>
                </div>

                {item.verified && (
                  <span className="px-3 py-1 rounded-full bg-green-600 text-sm font-bold">
                    ✓
                  </span>
                )}

              </div>

              <p className="mb-2">
                📍 {item.city}
              </p>

              <p className="mb-2">
                {t.hour}: {item.priceHour}
              </p>

              <p className="mb-2">
                {t.day}: {item.priceDay}
              </p>

              <p className="mb-4 text-yellow-400 font-bold">
                ⭐ {item.rating} / 5
              </p>

              <p className={`mb-6 font-bold ${
                item.available
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
                {item.available
                  ? "Available"
                  : "Booked"}
              </p>

              <div className="grid grid-cols-2 gap-3">

                <Link
                  href="/dashboard/messages"
                  className="text-center bg-green-600 hover:bg-green-700 py-3 rounded-2xl font-bold"
                >
                  {t.book}
                </Link>

                <Link
                  href="/dashboard/messages"
                  className="text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-bold"
                >
                  {t.chat}
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
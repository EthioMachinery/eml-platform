"use client";

import { useEffect, useMemo, useState } from "react";
import { getLang, Lang } from "@/lib/i18n";

type ForecastRow = {
  id: string;
  city: string;
  machine: string;
  demandNow: number;
  demandNext: number;
  priceTrend: "up" | "flat" | "down";
  laborGap: number;
  confidence: number;
};

export default function DemandDashboardPage() {
  const [lang, setLangState] = useState<Lang>("en");
  const [city, setCity] = useState("");
  const [machine, setMachine] = useState("");

  const [rows] = useState<ForecastRow[]>([
    {
      id: "1",
      city: "Addis Ababa",
      machine: "Excavator",
      demandNow: 84,
      demandNext: 93,
      priceTrend: "up",
      laborGap: 18,
      confidence: 91,
    },
    {
      id: "2",
      city: "Adama",
      machine: "Loader",
      demandNow: 72,
      demandNext: 81,
      priceTrend: "up",
      laborGap: 11,
      confidence: 87,
    },
    {
      id: "3",
      city: "Bahir Dar",
      machine: "Bulldozer",
      demandNow: 65,
      demandNext: 61,
      priceTrend: "flat",
      laborGap: 9,
      confidence: 78,
    },
    {
      id: "4",
      city: "Hawassa",
      machine: "Backhoe",
      demandNow: 58,
      demandNext: 74,
      priceTrend: "up",
      laborGap: 14,
      confidence: 84,
    },
    {
      id: "5",
      city: "Dire Dawa",
      machine: "Grader",
      demandNow: 61,
      demandNext: 56,
      priceTrend: "down",
      laborGap: 7,
      confidence: 76,
    },
    {
      id: "6",
      city: "Addis Ababa",
      machine: "Crane",
      demandNow: 79,
      demandNext: 95,
      priceTrend: "up",
      laborGap: 21,
      confidence: 94,
    },
  ]);

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const isAm = lang === "am";

  const t = {
    title: isAm
      ? "AI የፍላጎት ትንበያ ዳሽቦርድ"
      : "AI Predictive Demand Dashboard",

    sub: isAm
      ? "ከተማ • ማሽን • ዋጋ • ሰው ኃይል ትንበያ"
      : "City • Machine • Price • Workforce Forecast",

    city: isAm ? "ከተማ" : "City",
    machine: isAm ? "ማሽን" : "Machine",
    allCities: isAm ? "ሁሉም ከተሞች" : "All Cities",
    allMachines: isAm ? "ሁሉም ማሽኖች" : "All Machines",
    now: isAm ? "አሁን" : "Now",
    next: isAm ? "ቀጣይ ወር" : "Next Month",
    trend: isAm ? "የዋጋ አቅጣጫ" : "Price Trend",
    labor: isAm ? "የሰው ኃይል እጥረት" : "Labor Gap",
    conf: isAm ? "እምነት" : "Confidence",
    up: isAm ? "ይጨምራል" : "Up",
    flat: isAm ? "ተመሳሳይ" : "Flat",
    down: isAm ? "ይቀንሳል" : "Down",
    hot: isAm ? "ትኩስ ዕድል" : "Hot Opportunity",
  };

  const cities = Array.from(new Set(rows.map((x) => x.city)));
  const machines = Array.from(new Set(rows.map((x) => x.machine)));

  const filtered = useMemo(() => {
    let list = [...rows];

    if (city) {
      list = list.filter((x) => x.city === city);
    }

    if (machine) {
      list = list.filter((x) => x.machine === machine);
    }

    return list.sort((a, b) => b.demandNext - a.demandNext);
  }, [rows, city, machine]);

  function trendLabel(v: string) {
    if (v === "up") return t.up;
    if (v === "down") return t.down;
    return t.flat;
  }

  function trendColor(v: string) {
    if (v === "up") return "text-green-400";
    if (v === "down") return "text-red-400";
    return "text-yellow-400";
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <p className="text-zinc-400 text-xl">
            {t.sub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          >
            <option value="">{t.allCities}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          >
            <option value="">{t.allMachines}</option>
            {machines.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >
              <h2 className="text-2xl font-bold mb-2">
                {item.city}
              </h2>

              <p className="text-zinc-400 mb-4">
                {item.machine}
              </p>

              <p className="mb-2">
                {t.now}: {item.demandNow}%
              </p>

              <p className="mb-2 text-cyan-400 font-bold">
                {t.next}: {item.demandNext}%
              </p>

              <p className={`mb-2 font-bold ${trendColor(item.priceTrend)}`}>
                {t.trend}: {trendLabel(item.priceTrend)}
              </p>

              <p className="mb-2">
                {t.labor}: {item.laborGap}%
              </p>

              <p className="mb-4">
                {t.conf}: {item.confidence}%
              </p>

              {item.demandNext >= 85 && (
                <div className="bg-green-600 rounded-2xl px-4 py-2 text-center font-bold">
                  {t.hot}
                </div>
              )}
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
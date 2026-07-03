"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function EastAfricaScalePage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const markets = [
    {
      flag: "🇪🇹",
      name: "Ethiopia",
      status: "Live Market",
      users: "42K+ Users",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      flag: "🇰🇪",
      name: "Kenya",
      status: "Launch 2027",
      users: "High Demand",
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      flag: "🇺🇬",
      name: "Uganda",
      status: "Expansion 2028",
      users: "Growth Ready",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      flag: "🇹🇿",
      name: "Tanzania",
      status: "Expansion 2028",
      users: "Mining Demand",
      color: "bg-orange-100 text-orange-700",
    },
    {
      flag: "🇷🇼",
      name: "Rwanda",
      status: "Expansion 2029",
      users: "Smart Economy",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const strengths = [
    "Regional machinery marketplace network",
    "Cross-border transport + logistics",
    "Escrow & secure payments",
    "Financing and insurance partnerships",
    "AI pricing + demand engine",
    "Trusted industrial commerce brand",
  ];

  const milestones = [
    "2026 — Dominate Ethiopia",
    "2027 — Launch Kenya",
    "2028 — Uganda + Tanzania",
    "2029 — Rwanda + Regional Trade",
    "2030 — East Africa Market Leader",
  ];

  const metrics = [
    { value: "5", label: "Target Countries" },
    { value: "250K+", label: "Future Users" },
    { value: "ETB 500M+", label: "Revenue Potential" },
    { value: "1", label: "Regional Leader Goal" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-emerald-800 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="uppercase tracking-widest text-sm opacity-80">
            PAN REGIONAL MODE
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-4">
            {t(
              "East Africa Scale Mode",
              "የምስራቅ አፍሪካ ስፋት ሁኔታ"
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            {t(
              "From Ethiopia's machinery leader to East Africa's industrial super platform.",
              "ከኢትዮጵያ የማሽነሪ መሪነት ወደ የምስራቅ አፍሪካ ኢንዱስትሪ ሱፐር ፕላትፎርም።"
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/investor-command-center"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black"
            >
              Investor View
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl border border-white/40 font-bold"
            >
              Operator View
            </Link>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-5">
          {metrics.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border shadow-xl p-6 text-center"
            >
              <div className="text-3xl font-black text-emerald-700">
                {item.value}
              </div>
              <div className="text-gray-500 mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-10">
          Regional Expansion Markets
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {markets.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-5xl">{item.flag}</div>

              <h3 className="text-3xl font-black mt-4">
                {item.name}
              </h3>

              <span
                className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-bold ${item.color}`}
              >
                {item.status}
              </span>

              <p className="text-gray-500 mt-4">
                {item.users}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP + MOAT */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            Growth Roadmap
          </h2>

          <div className="space-y-5">
            {milestones.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            Regional Advantages
          </h2>

          <div className="space-y-5">
            {strengths.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 font-semibold"
              >
                🚀 {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 to-emerald-700 text-white p-12 text-center">
          <h3 className="text-4xl font-black">
            {t(
              "Build the Regional Category Leader",
              "የክልሉን መሪ ኩባንያ ይገንቡ"
            )}
          </h3>

          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            {t(
              "TM can own machinery commerce across East Africa through trust, fintech and marketplace scale.",
              "TM በእምነት፣ fintech እና marketplace scale የምስራቅ አፍሪካ ማሽነሪ ንግድን ሊመራ ይችላል።"
            )}
          </p>

          <Link
            href="/premium"
            className="inline-block mt-8 px-10 py-4 rounded-2xl bg-white text-black font-black"
          >
            Activate Growth
          </Link>
        </div>
      </section>
    </main>
  );
}
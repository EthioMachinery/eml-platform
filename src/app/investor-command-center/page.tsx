"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function InvestorCommandCenterPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const stats = [
    { value: "ETB 3.2M", label: "Monthly Revenue" },
    { value: "42K+", label: "Marketplace Users" },
    { value: "8,400+", label: "Machines Listed" },
    { value: "+27%", label: "Monthly Growth" },
  ];

  const reasons = [
    {
      icon: "🌍",
      title: "Massive Untapped Market",
      desc: "Construction, transport and agriculture machinery demand is growing rapidly in Ethiopia and East Africa.",
    },
    {
      icon: "💸",
      title: "Multi-Revenue Model",
      desc: "Subscriptions, commissions, escrow fees, financing, insurance and advertising.",
    },
    {
      icon: "🧠",
      title: "AI Powered Operations",
      desc: "Smart pricing, fraud detection, lead matching and automation increase margins.",
    },
    {
      icon: "🏆",
      title: "First Mover Advantage",
      desc: "EML can become the category leader before traditional players digitize.",
    },
  ];

  const roadmap = [
    "2026 — Ethiopia market leadership",
    "2027 — Kenya expansion",
    "2028 — Uganda + Tanzania",
    "2029 — Pan-African machinery network",
  ];

  const moat = [
    "Network effects: more buyers attract more sellers",
    "Marketplace trust data + verification history",
    "Payments + escrow ecosystem lock-in",
    "AI pricing and demand intelligence",
    "Brand leadership in industrial commerce",
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-emerald-800 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="uppercase tracking-widest text-sm opacity-80">
            SERIES A MODE
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-4">
            {t(
              "Investor Command Center",
              "የኢንቨስተር ማዕከል"
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            {t(
              "EML is building Ethiopia's leading machinery super app with scalable revenue and Pan-African expansion potential.",
              "EML የኢትዮጵያ መሪ የማሽነሪ ሱፐር አፕ እየገነባ ነው፣ ሊሰፋ የሚችል ገቢ እና የአፍሪካ ስፋት እድል አለው።"
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/founder-admin"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black"
            >
              Founder View
            </Link>

            <Link
              href="/admin/revenue"
              className="px-8 py-4 rounded-2xl border border-white/40 font-bold"
            >
              Revenue Metrics
            </Link>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-5">
          {stats.map((item, i) => (
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

      {/* WHY INVEST */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-10">
          Why EML Wins
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="text-2xl font-black mt-4">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-3 leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP + MOAT */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">
        {/* Roadmap */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            Expansion Roadmap
          </h2>

          <div className="space-y-5">
            {roadmap.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Moat */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            Competitive Moat
          </h2>

          <div className="space-y-5">
            {moat.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 font-semibold"
              >
                🛡️ {item}
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
              "Built for Category Leadership",
              "ለመሪነት የተገነባ"
            )}
          </h3>

          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            {t(
              "EML combines marketplace scale, fintech revenue and industrial trust infrastructure.",
              "EML የገበያ መጠን፣ fintech ገቢ እና የኢንዱስትሪ እምነት መሠረትን ያጣምራል።"
            )}
          </p>

          <Link
            href="/admin/autopilot"
            className="inline-block mt-8 px-10 py-4 rounded-2xl bg-white text-black font-black"
          >
            View AI Systems
          </Link>
        </div>
      </section>
    </main>
  );
}
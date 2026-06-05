"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function RevenueAdminPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const stats = [
    { value: "ETB 3.2M", label: "Monthly Revenue" },
    { value: "ETB 108K", label: "Daily Revenue" },
    { value: "ETB 1.4M", label: "MRR Subscriptions" },
    { value: "+27%", label: "Growth Rate" },
  ];

  const streams = [
    {
      icon: "👑",
      title: "Premium Plans",
      amount: "ETB 1.4M",
      desc: "Seller subscriptions and upgrades.",
    },
    {
      icon: "🤝",
      title: "Commissions",
      amount: "ETB 980K",
      desc: "Marketplace transaction fees.",
    },
    {
      icon: "🔒",
      title: "Escrow Fees",
      amount: "ETB 510K",
      desc: "Secure deal payment services.",
    },
    {
      icon: "📢",
      title: "Advertising",
      amount: "ETB 310K",
      desc: "Sponsored listings and boosts.",
    },
  ];

  const insights = [
    {
      title: "Premium conversions increased",
      desc: "Upgrade campaigns delivered +18% this month.",
      tag: "Growth",
    },
    {
      title: "Escrow revenue accelerating",
      desc: "Higher trust deals increased payment usage.",
      tag: "Trust",
    },
    {
      title: "Top city: Addis Ababa",
      desc: "Highest paid transactions from metro market.",
      tag: "Market",
    },
  ];

  const topSellers = [
    { name: "Abebe Construction PLC", revenue: "ETB 420K" },
    { name: "Nile Machinery House", revenue: "ETB 315K" },
    { name: "Hawassa Equipment Rental", revenue: "ETB 228K" },
    { name: "Ethio Heavy Transport", revenue: "ETB 184K" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-emerald-800 to-lime-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="uppercase tracking-widest text-sm opacity-80">
            MONEY MODE
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-4">
            {t("Revenue Intelligence Center", "የገቢ መረጃ ማዕከል")}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            {t(
              "Track every birr earned from subscriptions, commissions, escrow and advertising.",
              "ከምዝገባ፣ ኮሚሽን፣ escrow እና ማስታወቂያ የሚገኘውን ገቢ ሁሉ ይቆጣጠሩ።"
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/founder-admin"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black"
            >
              {t("Founder Dashboard", "የመስራች ዳሽቦርድ")}
            </Link>

            <Link
              href="/investor-command-center"
              className="px-8 py-4 rounded-2xl border border-white/40 font-bold"
            >
              {t("Investor View", "የኢንቨስተር እይታ")}
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
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
              <div className="text-gray-500 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVENUE STREAMS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-10">
          {t("Revenue Streams", "የገቢ ምንጮች")}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {streams.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="text-2xl font-black mt-4">
                {item.title}
              </h3>

              <p className="text-emerald-700 font-black text-2xl mt-3">
                {item.amount}
              </p>

              <p className="text-gray-500 mt-3 leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INSIGHTS + SELLERS */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">
        {/* Insights */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            {t("Revenue Insights", "የገቢ ግንዛቤ")}
          </h2>

          <div className="space-y-5">
            {insights.map((item, i) => (
              <div key={i} className="rounded-2xl border p-5">
                <div className="flex justify-between gap-4">
                  <h3 className="font-black text-lg">
                    {item.title}
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                    {item.tag}
                  </span>
                </div>

                <p className="text-gray-500 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-4xl font-black mb-8">
            {t("Top Revenue Sellers", "ከፍተኛ ገቢ ሻጮች")}
          </h2>

          <div className="space-y-5">
            {topSellers.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 flex justify-between items-center"
              >
                <h3 className="font-black">{item.name}</h3>

                <span className="text-emerald-700 font-black text-xl">
                  {item.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-emerald-700 text-white p-12 text-center">
          <h3 className="text-4xl font-black">
            {t(
              "Turn Growth Into Profit",
              "እድገትን ወደ ትርፍ ይቀይሩ"
            )}
          </h3>

          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            {t(
              "Use EML revenue intelligence to scale subscriptions, deals and market expansion.",
              "EML የገቢ መረጃን ተጠቅመው ምዝገባ፣ ግብይት እና ስፋትን ያሳድጉ።"
            )}
          </p>

          <Link
            href="/admin/autopilot"
            className="inline-block mt-8 px-10 py-4 rounded-2xl bg-white text-black font-black"
          >
            {t("Open AI Growth Tools", "AI የእድገት መሳሪያ")}
          </Link>
        </div>
      </section>
    </main>
  );
}
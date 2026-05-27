"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FounderAdminPage() {
  const { t } = useLanguage();

  const stats = [
    { value: "ETB 3.2M", label: "Monthly Revenue" },
    { value: "42,180", label: "Users" },
    { value: "812", label: "Deals This Month" },
    { value: "31%", label: "Growth Rate" },
  ];

  const alerts = [
    {
      title: "High Demand in Addis Ababa",
      desc: "Excavator searches increased by 42%.",
      tag: "Opportunity",
    },
    {
      title: "Premium Conversions Rising",
      desc: "Seller upgrades increased this week.",
      tag: "Revenue",
    },
    {
      title: "Low Supply in Hawassa",
      desc: "Need more rental machines listed.",
      tag: "Expansion",
    },
  ];

  const modules = [
    {
      icon: "💰",
      title: "Revenue Center",
      desc: "Track subscriptions, commissions and escrow fees.",
      link: "/admin/revenue",
    },
    {
      icon: "📊",
      title: "Analytics",
      desc: "View traffic, growth and performance insights.",
      link: "/admin/analytics",
    },
    {
      icon: "🤖",
      title: "AI Autopilot",
      desc: "Automation for pricing, fraud and matching.",
      link: "/admin/autopilot",
    },
    {
      icon: "👑",
      title: "Premium Control",
      desc: "Manage premium plans and seller upgrades.",
      link: "/admin/premium",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-purple-800 to-indigo-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="uppercase tracking-widest text-sm opacity-80">
            EXECUTIVE MODE
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-4">
            {t("Founder Admin Command Center", "የመስራች አስተዳደር ማዕከል")}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            {t(
              "Run EML like a unicorn startup with live revenue, growth, operations and AI intelligence.",
              "EMLን እንደ ዩኒኮርን ኩባንያ በቀጥታ ገቢ፣ እድገት፣ ኦፕሬሽን እና AI ጥበብ ያስተዳድሩ።"
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/admin/revenue"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black"
            >
              {t("View Revenue", "ገቢ")}
            </Link>

            <Link
              href="/admin/analytics"
              className="px-8 py-4 rounded-2xl border border-white/40 font-bold"
            >
              {t("Analytics", "ትንታኔ")}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-5">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border shadow-xl p-6 text-center"
            >
              <div className="text-3xl font-black text-purple-700">
                {item.value}
              </div>
              <div className="text-gray-500 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-10">
          {t("Executive Controls", "የአስተዳደር መቆጣጠሪያ")}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {modules.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition block"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="text-2xl font-black mt-4">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-3 leading-7">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ALERTS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black">
              {t("Founder Alerts", "የመስራች ማሳወቂያዎች")}
            </h2>

            <Link
              href="/notifications"
              className="font-bold text-purple-700"
            >
              {t("All Alerts", "ሁሉም")}
            </Link>
          </div>

          <div className="space-y-5">
            {alerts.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-black text-xl">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {item.desc}
                  </p>
                </div>

                <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-purple-700 text-white p-12 text-center">
          <h3 className="text-4xl font-black">
            {t(
              "Build the #1 Machinery Company in Africa",
              "በአፍሪካ #1 የማሽነሪ ኩባንያ ይገንቡ"
            )}
          </h3>

          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            {t(
              "Use data, automation and world-class operations to dominate the market.",
              "ገበያውን ለመቆጣጠር ውሂብ፣ AI እና ዘመናዊ ኦፕሬሽን ይጠቀሙ።"
            )}
          </p>

          <Link
            href="/investor-command-center"
            className="inline-block mt-8 px-10 py-4 rounded-2xl bg-white text-black font-black"
          >
            {t("Open Investor View", "የኢንቨስተር እይታ")}
          </Link>
        </div>
      </section>
    </main>
  );
}
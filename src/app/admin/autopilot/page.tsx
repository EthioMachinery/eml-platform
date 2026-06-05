"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  BellRing,
  Truck,
  Wallet,
  BriefcaseBusiness,
  BadgeDollarSign,
  CheckCircle2,
  Radio,
  Bot,
  BarChart3,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

export default function AutopilotPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [stats, setStats] = useState({
    deals: 0,
    revenue: 0,
    matches: 0,
    logistics: 0,
    financing: 0,
    insurance: 0,
    alerts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnterpriseStats();
  }, []);

  async function loadEnterpriseStats() {
    setLoading(true);

    try {
      const [
        deals,
        revenue,
        matches,
        logistics,
      ] = await Promise.all([
        supabase
          .from("deals")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("transactions")
          .select("platform_fee"),

        supabase
          .from("smart_matches")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("transport_requests")
          .select("*", {
            count: "exact",
            head: true,
          }),
      ]);

      let totalRevenue = 0;

      (revenue.data || []).forEach((item: any) => {
        totalRevenue += Number(item.platform_fee || 0);
      });

      setStats({
        deals: deals.count || 0,
        revenue: totalRevenue,
        matches: matches.count || 0,
        logistics: logistics.count || 0,
        financing: 18,
        insurance: 11,
        alerts: 3,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const engines = [
    {
      title: t(
        "AI Deal Engine",
        "AI የግብይት ስርዓት"
      ),
      description: t(
        "Automatically generates machinery deals and opportunities.",
        "የማሽነሪ ግብይቶችን በራስ ሰር ይፈጥራል።"
      ),
      icon: BadgeDollarSign,
      status: "ACTIVE",
    },
    {
      title: t(
        "Transport Intelligence",
        "የመጓጓዣ AI"
      ),
      description: t(
        "Optimizes machinery logistics and truck routing.",
        "የማሽነሪ ሎጂስቲክስን እና መንገዶችን ያስተካክላል።"
      ),
      icon: Truck,
      status: "ACTIVE",
    },
    {
      title: t(
        "AI Revenue Engine",
        "AI የገቢ ስርዓት"
      ),
      description: t(
        "Tracks commissions, subscriptions and enterprise revenue.",
        "ኮሚሽኖችን እና የድርጅት ገቢን ይከታተላል።"
      ),
      icon: Wallet,
      status: "ACTIVE",
    },
    {
      title: t(
        "Fraud Protection",
        "የማጭበርበር መከላከያ"
      ),
      description: t(
        "AI monitors suspicious transactions and activities.",
        "AI አደገኛ ግብይቶችን ይቆጣጠራል።"
      ),
      icon: ShieldCheck,
      status: "PROTECTED",
    },
    {
      title: t(
        "AI Notifications",
        "AI ማሳወቂያዎች"
      ),
      description: t(
        "Automatically alerts users about deals and opportunities.",
        "ስለ ግብይቶች እና እድሎች በራስ ሰር ያሳውቃል።"
      ),
      icon: BellRing,
      status: "ACTIVE",
    },
    {
      title: t(
        "Enterprise Matching",
        "የድርጅት AI ማገናኛ"
      ),
      description: t(
        "Connects buyers, sellers, transporters and financiers.",
        "ገዢዎችን፣ ሻጮችን፣ አጓጓዦችን እና ፋይናንስ ተቋማትን ያገናኛል።"
      ),
      icon: BriefcaseBusiness,
      status: "ACTIVE",
    },
  ];

  const quickLinks = [
    {
      title: t(
        "Revenue Center",
        "የገቢ ማዕከል"
      ),
      href: "/admin/revenue",
      icon: BadgeDollarSign,
    },
    {
      title: t(
        "Commission Center",
        "የኮሚሽን ማዕከል"
      ),
      href: "/admin/commission",
      icon: Wallet,
    },
    {
      title: t(
        "AI Deals",
        "AI ግብይቶች"
      ),
      href: "/admin/deals",
      icon: BriefcaseBusiness,
    },
    {
      title: t(
        "Analytics",
        "ትንታኔ"
      ),
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">
              <Bot size={20} />
              {t(
                "EML Enterprise AI Autopilot",
                "የEML የድርጅት AI አውቶፓይሎት"
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {t(
                "AI Mission Control Center",
                "የAI ቁጥጥር ማዕከል"
              )}
            </h1>
            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">
              {t(
                "This is the autonomous intelligence system powering the entire Ethio Machinery Link ecosystem.",
                "ይህ መላውን የኢትዮ ማሽነሪ አገናኝ ስርዓት የሚያስኬድ የAI ማዕከል ነው።"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* LIVE STATUS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title={t("AI Deals", "AI ግብይቶች")}
            value={stats.deals}
            icon={BriefcaseBusiness}
            color="cyan"
          />
          <StatCard
            title={t("Platform Revenue", "የፕላትፎርም ገቢ")}
            value={`ETB ${stats.revenue.toLocaleString()}`}
            icon={BadgeDollarSign}
            color="green"
          />
          <StatCard
            title={t("AI Matches", "AI ማገናኛዎች")}
            value={stats.matches}
            icon={Sparkles}
            color="violet"
          />
          <StatCard
            title={t("Transport Requests", "የመጓጓዣ ጥያቄዎች")}
            value={stats.logistics}
            icon={Truck}
            color="orange"
          />
        </div>
      </section>

      {/* AI ENGINES */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="mb-12">
            <div className="text-cyan-400 font-black tracking-widest mb-4">
              {t("AUTONOMOUS SYSTEMS", "ራስ ሰር ስርዓቶች")}
            </div>
            <h2 className="text-4xl font-black">
              {t("AI Enterprise Engines", "AI የድርጅት ስርዓቶች")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {engines.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500/30 transition"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                      <Icon className="text-cyan-400" />
                    </div>
                    <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2">
                      <Radio size={14} />
                      {item.status}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-8">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="mb-12">
            <div className="text-cyan-400 font-black tracking-widest mb-4">
              {t("MISSION CONTROL", "የቁጥጥር ማዕከል")}
            </div>
            <h2 className="text-4xl font-black">
              {t("Enterprise Navigation", "የድርጅት መቆጣጠሪያ")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-cyan-500/30 transition group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                      <Icon className="text-cyan-400" />
                    </div>
                    <ArrowUpRight className="text-zinc-500 group-hover:text-cyan-400 transition" />
                  </div>
                  <h3 className="text-2xl font-black">
                    {item.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SYSTEM HEALTH */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[40px] p-10">
            <div className="flex flex-col md:flex-row gap-10 md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="text-cyan-400 font-black tracking-widest mb-4">
                  {t("SYSTEM STATUS", "የስርዓት ሁኔታ")}
                </div>
                <h2 className="text-4xl font-black mb-6">
                  {t("Enterprise AI Systems Operational", "የAI ስርዓቶች በስራ ላይ ናቸው")}
                </h2>
                <p className="text-zinc-300 text-lg leading-8">
                  {t(
                    "EML autonomous infrastructure is actively monitoring, matching, routing and generating machinery ecosystem opportunities.",
                    "የEML AI ስርዓት የማሽነሪ እድሎችን በራስ ሰር እያስተዳደረ ነው።"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-[32px] bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={60} className="text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colorMap: any = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    green: "text-green-400 bg-green-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    orange: "text-orange-400 bg-orange-500/10",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon />
        </div>
        <Activity className="text-zinc-600" />
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
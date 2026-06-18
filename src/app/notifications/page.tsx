"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Brain,
  Truck,
  Wallet,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Radio,
  Bot,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type NotificationItem = {
  id: string;
  title: string;
  title_am?: string;
  message: string;
  message_am?: string;
  type: string;
  created_at?: string;
  read?: boolean;
  action_url?: string;
};

export default function NotificationsPage() {
  const { language } = useLanguage();

  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    aiAlerts: 0,
    finance: 0,
    logistics: 0,
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSignedIn(false);
        setLoading(false);
        return;
      }

      setSignedIn(true);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to load notifications:", error);
      }

      const finalData: NotificationItem[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        title_am: item.title_am,
        message: item.body || "No details available.",
        message_am: item.body_am || "ዝርዝር መረጃ የለም።",
        type: item.type || "general",
        created_at: item.created_at,
        read: item.read,
        action_url: item.link || "#",
      }));

      setNotifications(finalData);

      setStats({
        total: finalData.length,
        unread: finalData.filter((n) => !n.read).length,
        aiAlerts: finalData.filter((n) => n.type === "match").length,
        finance: finalData.filter((n) => n.type === "finance").length,
        logistics: finalData.filter((n) => n.type === "transport").length,
      });
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }

    setLoading(false);
  }

  function getIcon(type: string) {
    switch (type) {
      case "match":
        return Sparkles;
      case "transport":
        return Truck;
      case "finance":
        return Wallet;
      case "insurance":
        return ShieldCheck;
      case "deal":
        return BriefcaseBusiness;
      case "contract":
        return FileText;
      default:
        return Bell;
    }
  }

  function getColor(type: string) {
    switch (type) {
      case "match":
        return "text-cyan-400 bg-cyan-500/10";
      case "transport":
        return "text-orange-400 bg-orange-500/10";
      case "finance":
        return "text-green-400 bg-green-500/10";
      case "insurance":
        return "text-violet-400 bg-violet-500/10";
      case "deal":
        return "text-yellow-400 bg-yellow-500/10";
      default:
        return "text-zinc-400 bg-zinc-700";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="relative overflow-hidden border-b border-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">
              <Bot size={20} />
              {t("EML Live Intelligence", "የEML ቀጥታ መረጃ")}
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {t("Enterprise Notifications", "የድርጅት ማሳወቂያዎች")}
            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">
              {t(
                "Realtime AI-powered notifications across machinery, transport, financing, insurance and contracts.",
                "በማሽነሪ፣ ትራንስፖርት፣ ፋይናንስ፣ መድን እና ውሎች ላይ የAI የተደገፉ ቀጥታ ማሳወቂያዎች።"
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
          <StatCard title={t("Total", "ጠቅላላ")} value={stats.total} icon={Bell} color="cyan" />
          <StatCard title={t("Unread", "ያልተነበበ")} value={stats.unread} icon={AlertTriangle} color="orange" />
          <StatCard title={t("AI Alerts", "የAI ማንቂያዎች")} value={stats.aiAlerts} icon={Brain} color="violet" />
          <StatCard title={t("Financing", "ፋይናንስ")} value={stats.finance} icon={Wallet} color="green" />
          <StatCard title={t("Transport", "ትራንስፖርት")} value={stats.logistics} icon={Truck} color="yellow" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-cyan-400 font-black tracking-widest mb-2">
                {t("LIVE FEED", "ቀጥታ ፍሰት")}
              </div>
              <h2 className="text-3xl font-black">
                {t("Realtime Enterprise Events", "ቀጥታ የድርጅት ክስተቶች")}
              </h2>
            </div>

            <div className="bg-green-500/10 text-green-400 px-5 py-3 rounded-full text-sm font-black flex items-center gap-2">
              <Radio size={16} />
              LIVE
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-zinc-400">
              {t("Loading notifications...", "ማሳወቂያዎችን በመጫን ላይ...")}
            </div>
          ) : signedIn === false ? (
            <div className="p-12 text-center">
              <p className="text-zinc-300 mb-5">
                {t("Please sign in to view your notifications.", "ማሳወቂያዎችዎን ለማየት እባክዎ ይግቡ።")}
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-sm uppercase tracking-wider transition-all"
              >
                {t("Sign In", "ግባ")}
              </Link>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-2xl font-black text-white mb-3">
                {t("No Notifications Yet", "እስካሁን ማሳወቂያ የለም")}
              </h3>
              <p className="text-zinc-500">
                {t(
                  "You'll see matches, financing offers, and transport updates here.",
                  "ተመጣጣኝ ግዢዎች፣ የፋይናንስ አቅርቦቶች እና የትራንስፖርት ዝመናዎች እዚህ ይታያሉ።"
                )}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <Link
                    key={notification.id}
                    href={notification.action_url || "#"}
                    className="block hover:bg-zinc-800/40 transition"
                  >
                    <div className="p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                      <div className="flex gap-5">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${getColor(notification.type)}`}>
                          <Icon />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-black">
                              {t(notification.title, notification.title_am || notification.title)}
                            </h3>

                            {!notification.read && (
                              <div className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-full font-black">
                                NEW
                              </div>
                            )}
                          </div>

                          <p className="text-zinc-400 leading-8 max-w-3xl">
                            {t(notification.message, notification.message_am || notification.message)}
                          </p>

                          <div className="mt-4 text-sm text-zinc-500 flex items-center gap-2">
                            <Clock3 size={16} />
                            {new Date(notification.created_at || "").toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-cyan-400 font-black">
                        {t("Open", "ክፈት")}
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[40px] p-10">
            <div className="flex flex-col md:flex-row gap-10 md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="text-cyan-400 font-black tracking-widest mb-4">
                  {t("AI AUTOMATION", "የAI አውቶሜሽን")}
                </div>
                <h2 className="text-4xl font-black mb-6">
                  {t("Autonomous Event Intelligence", "ራሱን የቻለ የክስተት ብልህነት")}
                </h2>
                <p className="text-zinc-300 text-lg leading-8">
                  {t(
                    "EML continuously monitors marketplace activity and automatically delivers intelligent notifications to users.",
                    "EML የገበያውን እንቅስቃሴ ያለማቋረጥ ይከታተላል እና ለተጠቃሚዎች ብልህ ማሳወቂያዎችን በራስ-ሰር ያቀርባል።"
                  )}
                </p>
              </div>

              <div className="w-28 h-28 rounded-[32px] bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 size={60} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    orange: "text-orange-400 bg-orange-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    green: "text-green-400 bg-green-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon />
        </div>
        <Star className="text-zinc-600" />
      </div>
      <div className="text-zinc-400 text-sm mb-3">{title}</div>
      <div className="text-4xl font-black">{value}</div>
    </div>
  );
}
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
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useI18n } from "@/context/LanguageContext";

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
  const { t, lang } = useI18n();
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

      if (error) throw error;

      const finalData: NotificationItem[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        title_am: item.title_am,
        message: item.body || "No details available.",
        message_am: item.body_am,
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
      console.error("Notification Fetch Error", err);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case "match": return Sparkles;
      case "transport": return Truck;
      case "finance": return Wallet;
      case "insurance": return ShieldCheck;
      case "deal": return BriefcaseBusiness;
      case "contract": return FileText;
      default: return Bell;
    }
  }

  function getColor(type: string) {
    switch (type) {
      case "match": return "text-cyan-400 bg-cyan-500/10";
      case "transport": return "text-orange-400 bg-orange-500/10";
      case "finance": return "text-green-400 bg-green-500/10";
      case "insurance": return "text-violet-400 bg-violet-500/10";
      case "deal": return "text-yellow-400 bg-yellow-500/10";
      default: return "text-zinc-400 bg-zinc-700";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-emerald-500/10 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-full font-black mb-8">
            <Bot size={20} className="animate-pulse" />
            {t("notifications")}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">
            {t("notifications")}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title={t("total")} value={stats.total} icon={Bell} />
        <StatCard title={t("unread")} value={stats.unread} icon={AlertTriangle} />
        <StatCard title="AI Alerts" value={stats.aiAlerts} icon={Brain} />
        <StatCard title={t("financing")} value={stats.finance} icon={Wallet} />
        <StatCard title={t("transport")} value={stats.logistics} icon={Truck} />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div>
              <div className="text-emerald-500 font-black tracking-widest text-[10px] uppercase mb-1">
                LIVE FEED
              </div>
              <h2 className="text-2xl font-black uppercase">
                {t("notifications")}
              </h2>
            </div>
            <div className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2">
              <Radio size={14} className="animate-pulse" /> LIVE
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin mx-auto text-emerald-500 mb-4" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Loading...</p>
            </div>
          ) : signedIn === false ? (
            <div className="p-20 text-center">
              <p className="text-zinc-400 mb-6 uppercase text-xs font-bold tracking-widest">Sign in to view alerts</p>
              <Link href="/login" className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-xs">
                {t("signIn")}
              </Link>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-20 text-center">
              <h3 className="text-xl font-black text-white uppercase">No Notifications</h3>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => {
                const Icon = getIcon(n.type);
                return (
                  <Link key={n.id} href={n.action_url || "#"} className="block hover:bg-white/5 transition-all p-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                      <div className="flex gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getColor(n.type)}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black uppercase tracking-tight">
                              {lang === "am" ? (n.title_am || n.title) : n.title}
                            </h3>
                            {!n.read && <span className="bg-emerald-500 text-black text-[9px] px-2 py-0.5 rounded font-black">NEW</span>}
                          </div>
                          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                            {lang === "am" ? (n.message_am || n.message) : n.message}
                          </p>
                          <div className="mt-3 text-[10px] text-zinc-600 font-bold uppercase flex items-center gap-2">
                            <Clock3 size={12} /> {new Date(n.created_at || "").toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                        View <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <Icon size={18} />
        </div>
        <Star size={12} className="text-zinc-800" />
      </div>
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</div>
      <div className="text-3xl font-black tabular-nums">{value}</div>
    </div>
  );
}
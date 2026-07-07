"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2, Info, ShieldAlert, DollarSign, Truck, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type Notification = {
  id: string;
  type: "deal" | "payment" | "system" | "review" | "alert";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
};

const TYPE_ICON: Record<string, any> = {
  deal: DollarSign,
  payment: DollarSign,
  system: Info,
  review: Star,
  alert: ShieldAlert,
  transport: Truck,
};

const TYPE_COLOR: Record<string, string> = {
  deal: "text-emerald-400",
  payment: "text-yellow-400",
  system: "text-blue-400",
  review: "text-purple-400",
  alert: "text-red-400",
  transport: "text-cyan-400",
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAllRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function deleteNotification(id: string) {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const visible = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
              filter === f
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-zinc-500 py-20 text-sm">Loading...</div>
      ) : visible.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter === "unread" ? "unread" : ""} notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(n => {
            const Icon = TYPE_ICON[n.type] || Info;
            const color = TYPE_COLOR[n.type] || "text-zinc-400";
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`relative flex gap-3 p-4 rounded-xl border transition cursor-pointer ${
                  n.read
                    ? "bg-zinc-900/30 border-white/5"
                    : "bg-zinc-900/70 border-emerald-500/20"
                }`}
              >
                {!n.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
                )}
                <div className={`mt-0.5 shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{n.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-1.5">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="shrink-0 text-zinc-700 hover:text-red-400 transition mt-0.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data);
    }

    setLoading(false);
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        is_read: true,
      }))
    );
  }

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <div className="relative">
      <button
        onClick={async () => {
          setOpen(!open);

          if (!open) {
            await markAllAsRead();
          }
        }}
        className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-slate-100 transition"
      >
        <Bell className="w-6 h-6 text-slate-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[360px] bg-white border rounded-3xl shadow-2xl overflow-hidden z-50">

          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-lg font-black">
              Notifications
            </h3>

            <button
              onClick={markAllAsRead}
              className="text-sm font-bold text-yellow-700 hover:text-yellow-600"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto">

            {loading && (
              <div className="p-6 text-center text-slate-500">
                Loading...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No notifications yet
              </div>
            )}

            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 border-b transition hover:bg-slate-50 ${
                    !notification.is_read
                      ? "bg-yellow-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center">
                      🔔
                    </div>

                    <div className="flex-1">
                      <h4 className="font-black text-slate-900">
                        {notification.title}
                      </h4>

                      <p className="text-sm text-slate-600 mt-1 leading-6">
                        {notification.content}
                      </p>

                      <p className="text-xs text-slate-400 mt-3">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function NotificationBell() {

  const router = useRouter();
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    let channel: any;

    const init = async () => {

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);

      channel = supabase
        .channel("notifications-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };

  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = async (n: any) => {
    await supabase.from("notifications").update({ read: true }).eq("id", n.id);
    router.push(n.link || "/dashboard");
  };

  return (
    <div className="relative">

      <button onClick={() => setOpen(!open)} className="relative text-xl">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-lg z-50">

          <div className="p-3 font-bold border-b">
            {t.notifications}
          </div>

          {notifications.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">
              {t.noNotifications}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${!n.read ? "bg-gray-200" : ""}`}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm">{n.message}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const currentUser = auth.user;

    if (!currentUser) return;

    setUser(currentUser);

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
  };

  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="font-bold mb-3">Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-sm text-gray-500">No notifications</p>
      )}

      {notifications.map((n) => (
        <div key={n.id} className="text-sm border-b py-2">
          {n.message}
        </div>
      ))}

    </div>
  );
}
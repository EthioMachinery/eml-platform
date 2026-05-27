"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPremiumPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("premium_users")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
  }

  async function activate(id: string, plan: string) {
    let days = 30;

    if (plan === "Starter") days = 7;
    if (plan === "Business") days = 90;

    const now = new Date();
    const exp = new Date();
    exp.setDate(now.getDate() + days);

    await supabase
      .from("premium_users")
      .update({
        payment_status: "paid",
        premium_status: "active",
        starts_at: now,
        expires_at: exp,
      })
      .eq("id", id);

    loadUsers();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8 text-yellow-400">
          Premium Admin
        </h1>

        <div className="grid gap-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800"
            >
              <p><b>{u.full_name}</b></p>
              <p>{u.phone}</p>
              <p>{u.plan}</p>
              <p>Status: {u.premium_status}</p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => activate(u.id, u.plan)}
                  className="bg-green-500 px-5 py-2 rounded-xl font-bold"
                >
                  Activate
                </button>

                <a
                  href={`https://wa.me/${u.phone.replace("+","")}`}
                  target="_blank"
                  className="bg-blue-600 px-5 py-2 rounded-xl font-bold"
                >
                  WhatsApp
                </a>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
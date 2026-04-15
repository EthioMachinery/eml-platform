"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    const { data: usersData } = await supabase.from("profiles").select("*");
    const { data: machinesData } = await supabase.from("machines").select("*");
    const { data: dealsData } = await supabase.from("deals").select("*");

    setUsers(usersData || []);
    setMachines(machinesData || []);
    setDeals(dealsData || []);

    setLoading(false);
  };

  const refresh = () => fetchAll();

  // =========================
  // USER ACTIONS
  // =========================
  const verifyUser = async (id: string) => {
    await supabase.from("profiles").update({ verified: true }).eq("id", id);
    refresh();
  };

  const banUser = async (id: string) => {
    await supabase.from("profiles").update({ banned: true }).eq("id", id);
    refresh();
  };

  const deleteUser = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    refresh();
  };

  // =========================
  // MACHINE ACTIONS
  // =========================
  const deleteMachine = async (id: string) => {
    await supabase.from("machines").delete().eq("id", id);
    refresh();
  };

  // =========================
  // DEAL ACTIONS
  // =========================
  const forceCompleteDeal = async (id: string) => {
    await supabase
      .from("deals")
      .update({
        status: "completed",
        payment_status: "verified",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);

    refresh();
  };

  const deleteDeal = async (id: string) => {
    await supabase.from("deals").delete().eq("id", id);
    refresh();
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6">Loading admin panel...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">
            Super Admin Command Center
          </h1>

          {/* AUTOPILOT BUTTON */}
          <Link href="/admin/autopilot">
            <button className="bg-black text-white px-4 py-2 rounded">
              🤖 Run AI Autopilot
            </button>
          </Link>
        </div>

        {/* USERS */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">👥 Users</h2>

          {users.length === 0 && (
            <p className="text-sm text-gray-500">No users found</p>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-b py-2 text-sm gap-2"
            >

              <div>
                <p className="font-semibold">{u.email || u.id}</p>
                <p className="text-gray-500 text-xs">
                  Role: {u.role || "user"} | Verified: {String(u.verified)} | Banned: {String(u.banned)}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => verifyUser(u.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Verify
                </button>

                <button
                  onClick={() => banUser(u.id)}
                  className="bg-yellow-500 px-2 py-1 rounded"
                >
                  Ban
                </button>

                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </section>

        {/* MACHINES */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">🏗 Machines</h2>

          {machines.length === 0 && (
            <p className="text-sm text-gray-500">No machines found</p>
          )}

          {machines.map((m) => (
            <div
              key={m.id}
              className="flex justify-between border-b py-2 text-sm"
            >

              <span>
                {m.name} | {m.location}
              </span>

              <button
                onClick={() => deleteMachine(m.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

            </div>
          ))}
        </section>

        {/* DEALS */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">💰 Deals</h2>

          {deals.length === 0 && (
            <p className="text-sm text-gray-500">No deals found</p>
          )}

          {deals.map((d) => (
            <div
              key={d.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-b py-2 text-sm gap-2"
            >

              <div>
                <p className="font-semibold">
                  {d.id.slice(0, 6)} | {d.price} ETB
                </p>
                <p className="text-gray-500 text-xs">
                  Status: {d.status} | Payment: {d.payment_status}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => forceCompleteDeal(d.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Force Complete
                </button>

                <button
                  onClick={() => deleteDeal(d.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </section>

      </div>

    </div>
  );
}
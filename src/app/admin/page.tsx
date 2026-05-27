"use client";

import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] =
    useState<any>({});

  async function load() {
    const res = await fetch(
      "/api/admin/stats"
    );

    const data = await res.json();

    setStats(data);
  }

  useEffect(() => {
    load();

    const timer =
      setInterval(load, 10000);

    return () =>
      clearInterval(timer);
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-2xl font-bold mb-6">
            Founder Control Center
          </h1>

          <div className="grid grid-cols-2 gap-3">

            <Card title="Users" value={stats.users || 0} />
            <Card title="Requests" value={stats.requests || 0} />
            <Card title="Payments" value={stats.payments || 0} />
            <Card title="Pending" value={stats.pendingPayments || 0} />

          </div>

          <div className="mt-6 space-y-3">

            <a
              href="/admin/payments"
              className="block bg-green-600 text-white rounded-xl p-4 text-center font-semibold"
            >
              Approve Payments
            </a>

            <a
              href="/dashboard/deals"
              className="block bg-slate-900 text-white rounded-xl p-4 text-center font-semibold"
            >
              View Deals
            </a>

            <a
              href="/"
              className="block bg-white border rounded-xl p-4 text-center font-semibold"
            >
              Open Marketplace
            </a>

          </div>

        </div>
      </main>
    </AdminGuard>
  );
}

function Card({
  title,
  value
}: any) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-2xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}
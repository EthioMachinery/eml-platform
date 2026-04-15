"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAnalytics() {

  const [stats, setStats] = useState<any>({
    users: 0,
    machines: 0,
    requests: 0,
    deals: 0,
    completedDeals: 0,
    revenue: 0,
    pendingRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStats = async () => {

      setLoading(true);

      // USERS
      const { count: users } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // MACHINERY
      const { count: machines } = await supabase
        .from("machinery")
        .select("*", { count: "exact", head: true });

      // REQUESTS
      const { count: requests } = await supabase
        .from("machine_requests")
        .select("*", { count: "exact", head: true });

      // DEALS
      const { data: dealsData } = await supabase
        .from("contact_requests")
        .select("*");

      const totalDeals = dealsData?.length || 0;

      const completedDeals = dealsData?.filter(
        (d) => d.deal_status === "completed"
      ).length || 0;

      // 💰 COMMISSION CALCULATION
      // Example: fixed 5% OR manual entry later

      let revenue = 0;
      let pendingRevenue = 0;

      dealsData?.forEach((d) => {

        const commission = d.commission_amount || 0;

        if (d.commission_status === "paid") {
          revenue += commission;
        } else {
          pendingRevenue += commission;
        }

      });

      setStats({
        users: users || 0,
        machines: machines || 0,
        requests: requests || 0,
        deals: totalDeals,
        completedDeals,
        revenue,
        pendingRevenue
      });

      setLoading(false);
    };

    fetchStats();

  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading analytics...
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-10 text-center">
        EML Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        <Card title="Total Users" value={stats.users} />
        <Card title="Machinery Listed" value={stats.machines} />
        <Card title="Requests Posted" value={stats.requests} />

        <Card title="Total Deals" value={stats.deals} />
        <Card title="Completed Deals" value={stats.completedDeals} />

        <Card title="Revenue (ETB)" value={stats.revenue} />
        <Card title="Pending Commission" value={stats.pendingRevenue} />

      </div>

    </main>

  );
}

// 📦 CARD COMPONENT
function Card({ title, value }: any) {
  return (
    <div className="bg-gray-900 p-6 rounded text-center">
      <p className="text-gray-400 mb-2">{title}</p>
      <h2 className="text-2xl text-yellow-400 font-bold">
        {value}
      </h2>
    </div>
  );
}
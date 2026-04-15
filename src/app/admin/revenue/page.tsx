"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function RevenueDashboard() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // KPIs
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [completedDeals, setCompletedDeals] = useState(0);
  const [pendingDeals, setPendingDeals] = useState(0);

  // Charts
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data } = await supabase.from("deals").select("*");

    const allDeals = data || [];
    setDeals(allDeals);

    calculateMetrics(allDeals);
    prepareCharts(allDeals);

    setLoading(false);
  };

  // =========================
  // KPI CALCULATIONS
  // =========================
  const calculateMetrics = (data: any[]) => {
    let revenue = 0;
    let commission = 0;
    let completed = 0;
    let pending = 0;

    data.forEach((deal) => {
      if (deal.status === "completed") {
        revenue += deal.price || 0;
        commission += deal.commission || 0;
        completed++;
      } else {
        pending++;
      }
    });

    setTotalRevenue(revenue);
    setTotalCommission(commission);
    setCompletedDeals(completed);
    setPendingDeals(pending);
  };

  // =========================
  // CHART DATA PREPARATION
  // =========================
  const prepareCharts = (data: any[]) => {
    // Monthly revenue
    const monthlyMap: any = {};

    data.forEach((deal) => {
      if (!deal.created_at) return;

      const date = new Date(deal.created_at);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month: key,
          revenue: 0,
          commission: 0,
        };
      }

      if (deal.status === "completed") {
        monthlyMap[key].revenue += deal.price || 0;
        monthlyMap[key].commission += deal.commission || 0;
      }
    });

    setMonthlyData(Object.values(monthlyMap));

    // Status distribution
    const statusCount: any = {};

    data.forEach((deal) => {
      statusCount[deal.status] =
        (statusCount[deal.status] || 0) + 1;
    });

    const statusArray = Object.keys(statusCount).map((key) => ({
      name: key,
      value: statusCount[key],
    }));

    setStatusData(statusArray);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Advanced Revenue Analytics
          </h1>
          <p className="text-gray-600 text-sm">
            Deep insights into platform performance
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm">Total Revenue</p>
            <h2 className="text-xl font-bold">
              {totalRevenue.toLocaleString()} ETB
            </h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm">Commission</p>
            <h2 className="text-xl font-bold">
              {totalCommission.toLocaleString()} ETB
            </h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm">Completed</p>
            <h2 className="text-xl font-bold">
              {completedDeals}
            </h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm">Pending</p>
            <h2 className="text-xl font-bold">
              {pendingDeals}
            </h2>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* REVENUE LINE CHART */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">
              Monthly Revenue Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" />
                <Line dataKey="commission" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* STATUS PIE */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">
              Deal Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* COMMISSION BAR */}
          <div className="bg-white p-4 rounded shadow md:col-span-2">
            <h2 className="font-bold mb-3">
              Commission Growth
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commission" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </div>
  );
}
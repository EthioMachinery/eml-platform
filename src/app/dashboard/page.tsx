"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DealEngine } from "@/lib/dealengine"; // ✅ FIXED (case-sensitive)
import { useLanguage } from "@/lib/LanguageContext";

type Deal = {
  id: string;
  status: string;
  amount: number;
};

export default function DashboardPage() {
  const { lang } = useLanguage();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching deals:", error.message);
      setLoading(false);
      return;
    }

    setDeals(data || []);

    // Calculate total revenue
    const total = (data || []).reduce(
      (sum, deal) => sum + (deal.amount || 0),
      0
    );
    setTotalRevenue(total);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "ዳሽቦርድ" : "Dashboard"}
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">
            {lang === "am" ? "ጠቅላላ ገቢ" : "Total Revenue"}
          </h2>
          <p className="text-xl font-bold text-green-600">
            {totalRevenue.toLocaleString()} ETB
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">
            {lang === "am" ? "ጠቅላላ ዲሎች" : "Total Deals"}
          </h2>
          <p className="text-xl font-bold">
            {deals.length}
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">
            {lang === "am" ? "የተጠናቀቁ ዲሎች" : "Completed Deals"}
          </h2>
          <p className="text-xl font-bold">
            {deals.filter((d) => d.status === "completed").length}
          </p>
        </div>
      </div>

      {/* DEAL LIST */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">
          {lang === "am" ? "ዲሎች" : "Deals"}
        </h2>

        {loading ? (
          <p className="text-gray-500">
            {lang === "am" ? "በመጫን ላይ..." : "Loading..."}
          </p>
        ) : deals.length === 0 ? (
          <p className="text-gray-500">
            {lang === "am" ? "ምንም ዲል የለም" : "No deals found"}
          </p>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">ID: {deal.id}</p>
                  <p className="text-sm text-gray-500">
                    {lang === "am" ? "ሁኔታ" : "Status"}: {deal.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-yellow-600">
                    {deal.amount?.toLocaleString()} ETB
                  </p>

                  {/* 🔥 Optional AI Action */}
                  <button
                    className="mt-2 bg-black text-white px-3 py-1 text-sm rounded"
                    onClick={() => DealEngine.process(deal)}
                  >
                    {lang === "am" ? "አካሂድ" : "Process"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
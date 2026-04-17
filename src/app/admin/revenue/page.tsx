"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RevenuePage() {
  const [revenue, setRevenue] = useState(0);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    const { data, error } = await supabase.from("deals").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setDeals(data || []);

    const total = (data || []).reduce(
      (sum, d) => sum + (d.amount || 0),
      0
    );

    setRevenue(total);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Revenue Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-gray-500">Total Revenue</p>
        <p className="text-2xl font-bold text-green-600">
          {revenue.toLocaleString()} ETB
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Deals</h2>

        {deals.map((deal) => (
          <div key={deal.id} className="border p-2 mb-2 rounded">
            <p>ID: {deal.id}</p>
            <p>Amount: {deal.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
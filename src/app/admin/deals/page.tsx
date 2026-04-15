"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDeals() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const { data } = await supabase.from("deals").select("*");
    setDeals(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("deals")
      .update({ status })
      .eq("id", id);

    fetchDeals();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Deals Control</h1>

      {deals.map((deal) => (
        <div
          key={deal.id}
          className="border p-4 mb-3 rounded bg-white"
        >
          <p>Type: {deal.deal_type}</p>
          <p>Price: {deal.price} ETB</p>
          <p>Status: {deal.status}</p>

          <div className="flex gap-2 mt-2">

            <button
              onClick={() => updateStatus(deal.id, "approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(deal.id, "rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}
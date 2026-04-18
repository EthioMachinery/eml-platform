"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadPayment from "@/components/payments/UploadPayment";

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const { data, error } = await supabase.from("deals").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setDeals(data || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Deals</h1>

      {deals.length === 0 && (
        <p className="text-gray-500">No deals found.</p>
      )}

      {deals.map((d) => (
        <div key={d.id} className="border p-4 mb-4 rounded bg-white">
          <p><strong>ID:</strong> {d.id}</p>
          <p><strong>Amount:</strong> {d.amount}</p>
          <p><strong>Status:</strong> {d.payment_status}</p>

          {/* ✅ SAFE USAGE */}
          {d.payment_status !== "paid" && (
            <UploadPayment deal={d} />
          )}
        </div>
      ))}
    </div>
  );
}
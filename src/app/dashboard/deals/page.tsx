"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadPayment from "@/components/payments/UploadPayment";

interface Deal {
  id: string;
  machinery_name: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching deals:", error);
    } else {
      setDeals(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        <p>Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">My Deals</h1>

      {deals.length === 0 ? (
        <p>No deals found.</p>
      ) : (
        <div className="space-y-4">
          {deals.map((d) => (
            <div
              key={d.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold">
                {d.machinery_name || "Machinery"}
              </h2>

              <p className="text-sm text-gray-400">
                Price: {d.price} ETB
              </p>

              <p className="text-sm">
                Status:{" "}
                <span className="font-medium">{d.status}</span>
              </p>

              <p className="text-sm">
                Payment:{" "}
                <span className="font-medium">
                  {d.payment_status || "pending"}
                </span>
              </p>

              {/* Upload Payment Section */}
              {d.payment_status !== "paid" && (
                <div className="mt-4">
                  <UploadPayment deal={d} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
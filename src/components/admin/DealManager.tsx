"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DealManager() {
  const [deals, setDeals] = useState<any[]>([]);

  const fetchDeals = async () => {
    const { data } = await supabase
      .from("deals")
      .select("*");

    setDeals(data || []);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const verify = async (id: string) => {
    await supabase
      .from("deals")
      .update({ payment_status: "paid" })
      .eq("id", id);

    fetchDeals();
  };

  return (
    <div className="space-y-4">

      {deals.map((d) => (
        <div key={d.id} className="bg-white p-4 border">

          <p>Price: {d.price}</p>
          <p>Commission: {d.commission}</p>
          <p>Status: {d.payment_status}</p>

          {d.payment_status === "pending_verification" && (
            <button
              onClick={() => verify(d.id)}
              className="bg-green-600 text-white px-3 py-1 mt-2"
            >
              Verify Payment
            </button>
          )}

        </div>
      ))}

    </div>
  );
}
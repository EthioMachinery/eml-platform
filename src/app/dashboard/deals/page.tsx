"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchDeals = async () => {
      const { data } = await supabase
        .from("deals")
        .select("*")
        .eq("buyer_id", user.id);

      setDeals(data || []);
    };

    fetchDeals();
  }, [user]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">
        My Deals
      </h1>

      {deals.map((d) => (
        <div key={d.id} className="border p-4 mb-4 bg-white">

          <p><b>Price:</b> {d.price} ETB</p>
          <p><b>Commission:</b> {d.commission} ETB</p>
          <p><b>Status:</b> {d.payment_status}</p>

          {d.payment_status !== "paid" && (
            <UploadPayment deal={d} />
          )}

        </div>
      ))}

    </main>
  );
}
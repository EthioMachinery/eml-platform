"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DealEngine } from "@/lib/dealengine";
import { useLanguage } from "@/lib/LanguageContext";

interface Deal {
  id: string;
  machinery_name?: string | null;
  price?: number | null;
  status?: string | null;
  payment_status?: string | null;
  created_at?: string;
}

export default function DashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

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
      console.error(error);
    } else {
      setDeals(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "ዳሽቦርድ" : "Dashboard"}
      </h1>

      {deals.length === 0 ? (
        <p>{lang === "am" ? "ምንም ግብይቶች የሉም" : "No deals found."}</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold">
                {deal.machinery_name ?? "Machinery"}
              </h2>

              <p className="text-sm text-gray-400">
                {lang === "am" ? "ዋጋ" : "Price"}: {deal.price ?? 0} ETB
              </p>

              <p className="text-sm">
                {lang === "am" ? "ሁኔታ" : "Status"}:{" "}
                {deal.status ?? "pending"}
              </p>

              <p className="text-sm">
                {lang === "am" ? "ክፍያ" : "Payment"}:{" "}
                {deal.payment_status ?? "pending"}
              </p>

              {/* ACTION BUTTONS (FIXED) */}
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-green-600 px-3 py-1 rounded text-sm"
                  onClick={() => DealEngine.approveDeal(deal)}
                >
                  {lang === "am" ? "አፅድቅ" : "Approve"}
                </button>

                <button
                  className="bg-red-600 px-3 py-1 rounded text-sm"
                  onClick={() => DealEngine.rejectDeal(deal)}
                >
                  {lang === "am" ? "አስቀር" : "Reject"}
                </button>
              </div>

              {/* PAYMENT STATUS */}
              {deal.payment_status !== "paid" && (
                <div className="mt-3 text-yellow-400 text-sm">
                  {lang === "am"
                    ? "ክፍያ በመጠበቅ ላይ"
                    : "Payment pending"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
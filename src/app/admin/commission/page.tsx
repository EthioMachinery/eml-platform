"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommissionEngine() {

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dealValue, setDealValue] = useState<{[key:string]: string}>({});
  const [commissionRate, setCommissionRate] = useState(10); // %

  // 🔥 FETCH APPROVED REQUESTS
  const fetchRequests = async () => {

    const { data, error } = await supabase
      .from("contact_requests")
      .select(`
        *,
        machinery (title, location)
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error) setRequests(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 💰 CALCULATE COMMISSION
  const calculateCommission = (value: number) => {
    return (value * commissionRate) / 100;
  };

  // 💾 SAVE DEAL
  const saveDeal = async (id: string) => {

    const value = parseFloat(dealValue[id] || "0");

    if (!value || value <= 0) {
      alert("Enter valid deal value");
      return;
    }

    const commission = calculateCommission(value);

    const { error } = await supabase
      .from("contact_requests")
      .update({
        deal_value: value,
        commission_amount: commission,
      })
      .eq("id", id);

    if (error) {
      alert("Error saving deal");
    } else {
      alert("Deal saved");
      fetchRequests();
    }
  };

  // ✅ MARK COMMISSION PAID + RELEASE CONTACT
  const markPaid = async (id: string) => {

    const { error } = await supabase
      .from("contact_requests")
      .update({
        commission_paid: true,
        is_contact_released: true
      })
      .eq("id", id);

    if (error) {
      alert("Error updating payment");
    } else {
      alert("Commission paid & contact released");
      fetchRequests();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl text-yellow-400 mb-6 text-center">
        Commission Engine
      </h1>

      {/* ⚙️ COMMISSION RATE */}
      <div className="max-w-md mx-auto mb-8 bg-gray-900 p-4 rounded">

        <label className="block mb-2">Commission Rate (%)</label>

        <input
          type="number"
          value={commissionRate}
          onChange={(e)=>setCommissionRate(parseFloat(e.target.value))}
          className="w-full p-2 text-black rounded"
        />

      </div>

      {requests.length === 0 ? (

        <p className="text-center text-gray-400">
          No approved deals
        </p>

      ) : (

        <div className="max-w-4xl mx-auto space-y-6">

          {requests.map((r) => {

            const value = parseFloat(dealValue[r.id] || r.deal_value || 0);
            const commission = value ? calculateCommission(value) : 0;

            return (

              <div key={r.id} className="bg-gray-900 p-5 rounded">

                <h2 className="text-yellow-400 text-lg">
                  {r.machinery?.title}
                </h2>

                <p><b>Location:</b> {r.machinery?.location}</p>

                {/* 💰 DEAL INPUT */}
                <input
                  type="number"
                  placeholder="Enter deal value"
                  value={dealValue[r.id] || ""}
                  onChange={(e)=>
                    setDealValue({
                      ...dealValue,
                      [r.id]: e.target.value
                    })
                  }
                  className="w-full p-3 mt-3 text-black rounded"
                />

                {/* 💵 COMMISSION DISPLAY */}
                {value > 0 && (
                  <p className="mt-2 text-green-400">
                    Commission: {commission.toFixed(2)}
                  </p>
                )}

                {/* SAVE BUTTON */}
                <button
                  onClick={()=>saveDeal(r.id)}
                  className="mt-3 w-full bg-yellow-500 text-black py-2 rounded"
                >
                  Save Deal
                </button>

                {/* PAYMENT STATUS */}
                <p className="mt-3">
                  <b>Paid:</b>{" "}
                  {r.commission_paid ? "✅ Yes" : "❌ No"}
                </p>

                {/* RELEASE CONTROL */}
                {!r.commission_paid && (
                  <button
                    onClick={()=>markPaid(r.id)}
                    className="mt-3 w-full bg-green-600 py-2 rounded"
                  >
                    Mark Paid & Release Contact
                  </button>
                )}

                {r.is_contact_released && (
                  <p className="text-green-400 mt-2">
                    🔓 Contact Released
                  </p>
                )}

              </div>

            );
          })}

        </div>

      )}

    </main>
  );
}
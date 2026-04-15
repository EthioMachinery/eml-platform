"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Deal = {
  id: string;
  deal_type: string;
  price: number;
  commission: number;
  status: string;
  payment_status: string;
  payment_proof_url: string | null;
};

export default function AdminPayments() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH DEALS WITH PAYMENT SUBMITTED
  // ===============================
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("payment_status", "pending_verification")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDeals(data || []);
    }

    setLoading(false);
  };

  // ===============================
  // APPROVE PAYMENT
  // ===============================
  const approvePayment = async (id: string) => {
    setLoading(true);

    const { error } = await supabase
      .from("deals")
      .update({
        payment_status: "verified",
        status: "completed",
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Error approving payment");
    } else {
      alert("✅ Payment approved & deal completed");
      fetchDeals();
    }

    setLoading(false);
  };

  // ===============================
  // REJECT PAYMENT
  // ===============================
  const rejectPayment = async (id: string) => {
    setLoading(true);

    const { error } = await supabase
      .from("deals")
      .update({
        payment_status: "rejected",
      })
      .eq("id", id);

    if (error) {
      alert("Error rejecting payment");
    } else {
      alert("❌ Payment rejected");
      fetchDeals();
    }

    setLoading(false);
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Admin Payment Verification
      </h1>

      {loading && <p>Loading...</p>}

      {deals.length === 0 && !loading && (
        <p>No pending payments.</p>
      )}

      <div className="space-y-4">

        {deals.map((deal) => (
          <div
            key={deal.id}
            className="border p-4 rounded bg-white text-black"
          >

            <div className="grid md:grid-cols-2 gap-4">

              {/* LEFT SIDE */}
              <div>
                <p><strong>Deal ID:</strong> {deal.id}</p>
                <p><strong>Type:</strong> {deal.deal_type}</p>
                <p><strong>Price:</strong> {deal.price} ETB</p>
                <p><strong>Commission:</strong> {deal.commission} ETB</p>
                <p><strong>Status:</strong> {deal.status}</p>
              </div>

              {/* RIGHT SIDE - PROOF */}
              <div>
                <p className="font-bold mb-2">
                  Payment Proof
                </p>

                {deal.payment_proof_url ? (
                  <a
                    href={deal.payment_proof_url}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View Proof
                  </a>
                ) : (
                  <p>No proof uploaded</p>
                )}
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => approvePayment(deal.id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectPayment(deal.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
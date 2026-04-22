"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

interface Deal {
  id: string;
  requester_id: string;
  owner_id: string;
  agreed_price: number;
  deal_status: string;
  payment_status: string;
  payment_proof_url: string | null;
  created_at: string;
}

export default function DealsDashboard() {
  const { lang } = useLanguage();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setLoading(false);
      return;
    }

    setUserId(data.user.id);
    fetchDeals(data.user.id);
  }

  async function fetchDeals(uid: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .or(`requester_id.eq.${uid},owner_id.eq.${uid}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setDeals(data || []);
    }

    setLoading(false);
  }

  // ✅ APPROVE DEAL
  async function approveDeal(id: string) {
    await supabase
      .from("deals")
      .update({
        deal_status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", id);

    fetchDeals(userId!);
  }

  // ❌ REJECT DEAL
  async function rejectDeal(id: string) {
    await supabase
      .from("deals")
      .update({
        deal_status: "rejected",
      })
      .eq("id", id);

    fetchDeals(userId!);
  }

  // 💰 MANUAL PAID (optional fallback)
  async function markPaid(id: string) {
    await supabase
      .from("deals")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", id);

    fetchDeals(userId!);
  }

  // 📤 UPLOAD PAYMENT PROOF
  async function uploadPayment(dealId: string, file: File) {
    if (!file) return;

    const fileName = `${dealId}-${Date.now()}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    // Update deal
    await supabase
      .from("deals")
      .update({
        payment_proof_url: publicUrl,
        payment_status: "pending_verification",
      })
      .eq("id", dealId);

    fetchDeals(userId!);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "በመጫን ላይ..." : "Loading deals..."}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "ግብይቶች" : "Deals Dashboard"}
      </h1>

      {deals.length === 0 ? (
        <p>{lang === "am" ? "ምንም ግብይት የለም" : "No deals yet"}</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
            >
              <p className="text-xs text-gray-500">ID: {deal.id}</p>

              <p>
                {lang === "am" ? "ዋጋ" : "Price"}:{" "}
                <span className="text-yellow-400 font-bold">
                  {deal.agreed_price} ETB
                </span>
              </p>

              <p>
                {lang === "am" ? "ሁኔታ" : "Deal Status"}:{" "}
                <span className="font-semibold">
                  {deal.deal_status}
                </span>
              </p>

              <p>
                {lang === "am" ? "ክፍያ" : "Payment"}:{" "}
                <span className="font-semibold">
                  {deal.payment_status}
                </span>
              </p>

              {/* PAYMENT PROOF */}
              {deal.payment_proof_url && (
                <a
                  href={deal.payment_proof_url}
                  target="_blank"
                  className="text-blue-400 text-sm block mt-2"
                >
                  {lang === "am"
                    ? "ክፍያ ማረጋገጫ ይመልከቱ"
                    : "View Payment Proof"}
                </a>
              )}

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2 flex-wrap">
                {/* APPROVAL */}
                {deal.deal_status === "pending" && (
                  <>
                    <button
                      onClick={() => approveDeal(deal.id)}
                      className="bg-green-600 px-3 py-1 rounded text-sm"
                    >
                      {lang === "am" ? "አፅድቅ" : "Approve"}
                    </button>

                    <button
                      onClick={() => rejectDeal(deal.id)}
                      className="bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      {lang === "am" ? "አስቀር" : "Reject"}
                    </button>
                  </>
                )}

                {/* PAYMENT UPLOAD */}
                {deal.deal_status === "approved" &&
                  deal.payment_status === "unpaid" && (
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          uploadPayment(deal.id, e.target.files[0])
                        }
                        className="text-sm"
                      />
                    </div>
                  )}

                {/* WAITING */}
                {deal.payment_status === "pending_verification" && (
                  <span className="text-yellow-400 text-sm">
                    {lang === "am"
                      ? "እየተረጋገጠ ነው"
                      : "Waiting for verification"}
                  </span>
                )}

                {/* PAID */}
                {deal.payment_status === "paid" && (
                  <span className="text-green-400 text-sm">
                    {lang === "am" ? "ተከፍሏል" : "Paid"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
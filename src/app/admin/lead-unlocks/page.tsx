"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PendingUnlock = {
  id: string;
  lead_id: string;
  buyer_id: string;
  payment_id: string | null;
  status: string;
  created_at: string;
  lead_title: string | null;
  buyer_name: string | null;
  buyer_phone: string | null;
  payment_method: string | null;
  payment_bank: string | null;
  payment_reference: string | null;
  payment_amount: number | null;
  payment_receipt_path: string | null;
};

export default function AdminLeadUnlocksPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [unlocks, setUnlocks] = useState<PendingUnlock[]>([]);
  const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending_review" | "approved" | "rejected" | "all">(
    "pending_review"
  );

  useEffect(() => {
    init();
  }, [filter]);

  async function init() {
    setLoading(true);
    setActionError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const admin = !!profile && (profile.role === "ADMIN" || profile.role === "admin");
    setIsAdmin(admin);

    if (!admin) {
      setLoading(false);
      return;
    }

    await loadUnlocks();
    setLoading(false);
  }

  async function loadUnlocks() {
    let query = supabase
      .from("lead_unlocks")
      .select("id, lead_id, buyer_id, payment_id, status, created_at")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data: unlockRows, error } = await query;

    if (error || !unlockRows) {
      setUnlocks([]);
      return;
    }

    const enriched: PendingUnlock[] = await Promise.all(
      unlockRows.map(async (row) => {
        let leadTitle: string | null = null;
        let buyerName: string | null = null;
        let buyerPhone: string | null = null;
        let paymentMethod: string | null = null;
        let paymentBank: string | null = null;
        let paymentReference: string | null = null;
        let paymentAmount: number | null = null;
        let paymentReceiptPath: string | null = null;

        const { data: lead } = await supabase
          .from("leads")
          .select("machine_title")
          .eq("id", row.lead_id)
          .maybeSingle();
        if (lead) leadTitle = lead.machine_title;

        const { data: buyer } = await supabase
          .from("profiles")
          .select("full_name, phone, phone_number")
          .eq("id", row.buyer_id)
          .maybeSingle();
        if (buyer) {
          buyerName = buyer.full_name;
          buyerPhone = buyer.phone_number || buyer.phone || null;
        }

        if (row.payment_id) {
          const { data: payment } = await supabase
            .from("payments")
            .select("method, bank_name, reference, amount, receipt_url")
            .eq("id", row.payment_id)
            .maybeSingle();
          if (payment) {
            paymentMethod = payment.method;
            paymentBank = payment.bank_name;
            paymentReference = payment.reference;
            paymentAmount = payment.amount;
            paymentReceiptPath = payment.receipt_url;
          }
        }

        return {
          ...row,
          lead_title: leadTitle,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          payment_method: paymentMethod,
          payment_bank: paymentBank,
          payment_reference: paymentReference,
          payment_amount: paymentAmount,
          payment_receipt_path: paymentReceiptPath,
        };
      })
    );

    setUnlocks(enriched);

    const urlEntries = await Promise.all(
      enriched
        .filter((u) => !!u.payment_receipt_path)
        .map(async (u) => {
          const { data } = await supabase.storage
            .from("payment-receipts")
            .createSignedUrl(u.payment_receipt_path as string, 60 * 10);
          return [u.id, data?.signedUrl || ""] as const;
        })
    );

    const urlMap: Record<string, string> = {};
    urlEntries.forEach(([id, url]) => {
      if (url) urlMap[id] = url;
    });
    setReceiptUrls(urlMap);
  }

  async function reviewUnlock(unlockId: string, paymentId: string | null, approve: boolean) {
    setActingOn(unlockId);
    setActionError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setActionError("Not signed in.");
      setActingOn(null);
      return;
    }

    const newStatus = approve ? "approved" : "rejected";

    const { error: unlockError } = await supabase
      .from("lead_unlocks")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", unlockId);

    if (unlockError) {
      setActionError(unlockError.message);
      setActingOn(null);
      return;
    }

    if (paymentId) {
      const { error: paymentError } = await supabase
        .from("payments")
        .update({ status: approve ? "approved" : "rejected" })
        .eq("id", paymentId);

      if (paymentError) {
        setActionError(paymentError.message);
        setActingOn(null);
        return;
      }
    }

    await loadUnlocks();
    setActingOn(null);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin access required</h1>
          <p className="text-zinc-400">
            You don't have permission to view this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Lead Unlock Payments
        </h1>
        <p className="text-zinc-400 mb-8">
          Review buyer payment submissions for unlocking seller contact info.
        </p>

        <div className="flex gap-3 mb-8">
          {(["pending_review", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-4 py-2 rounded-xl font-semibold " +
                (filter === f
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800")
              }
            >
              {f === "pending_review"
                ? "Pending"
                : f === "approved"
                ? "Approved"
                : f === "rejected"
                ? "Rejected"
                : "All"}
            </button>
          ))}
        </div>

        {actionError && (
          <p className="text-red-400 mb-4">{actionError}</p>
        )}

        {unlocks.length === 0 ? (
          <p className="text-zinc-500">No items in this view.</p>
        ) : (
          <div className="space-y-4">
            {unlocks.map((u) => (
              <div
                key={u.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <p className="text-lg font-bold">{u.lead_title || "Untitled lead"}</p>
                    <p className="text-zinc-400 text-sm">
                      Buyer: {u.buyer_name || "Unknown"} {u.buyer_phone ? "— " + u.buyer_phone : ""}
                    </p>
                  </div>
                  <span
                    className={
                      "px-3 py-1 rounded-full text-xs font-bold h-fit " +
                      (u.status === "pending_review"
                        ? "bg-yellow-500 text-black"
                        : u.status === "approved"
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white")
                    }
                  >
                    {u.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-sm text-zinc-300 mb-4">
                  <p>Method: {u.payment_method || "—"}</p>
                  {u.payment_bank && <p>Bank: {u.payment_bank}</p>}
                  <p>Reference: {u.payment_reference || "—"}</p>
                  <p>Amount: {u.payment_amount ? u.payment_amount + " ETB" : "—"}</p>
                </div>

                {receiptUrls[u.id] && (
                  <a href={receiptUrls[u.id]} target="_blank" rel="noopener noreferrer" className="inline-block mb-4 text-blue-400 underline text-sm">View receipt</a>
                )}

                {u.status === "pending_review" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => reviewUnlock(u.id, u.payment_id, true)}
                      disabled={actingOn === u.id}
                      className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reviewUnlock(u.id, u.payment_id, false)}
                      disabled={actingOn === u.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

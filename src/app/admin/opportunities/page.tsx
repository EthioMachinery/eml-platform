"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  listPendingPaymentReview,
  listAwaitingFacilitation,
  reviewOpportunityPayment,
  markFacilitationStarted,
  releaseContact,
  type OpportunityUnlock,
} from "@/lib/opportunityEngine";

type EnrichedUnlock = OpportunityUnlock & {
  listing_title: string | null;
  buyer_name: string | null;
  buyer_phone: string | null;
  seller_name: string | null;
  seller_phone: string | null;
};

type Tab = "review" | "facilitate";

export default function AdminOpportunitiesPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("review");

  const [reviewQueue, setReviewQueue] = useState<EnrichedUnlock[]>([]);
  const [facilitateQueue, setFacilitateQueue] = useState<EnrichedUnlock[]>([]);
  const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});

  const [actingOn, setActingOn] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    init();
  }, []);

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
    setAdminId(user.id);

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

    await loadQueues();
    setLoading(false);
  }

  async function enrich(rows: OpportunityUnlock[]): Promise<EnrichedUnlock[]> {
    return Promise.all(
      rows.map(async (row) => {
        let listingTitle: string | null = null;
        let buyerName: string | null = null;
        let buyerPhone: string | null = null;
        let sellerName: string | null = null;
        let sellerPhone: string | null = null;

        if (row.listing_id) {
          const { data: listing } = await supabase
            .from("listings")
            .select("title_en, title_am, brand, model")
            .eq("id", row.listing_id)
            .maybeSingle();
          if (listing) {
            listingTitle = listing.title_en || listing.title_am || `${listing.brand ?? ""} ${listing.model ?? ""}`.trim();
          }
        }

        if (row.buyer_id) {
          const { data: buyer } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", row.buyer_id)
            .maybeSingle();
          if (buyer) {
            buyerName = buyer.full_name;
            buyerPhone = buyer.phone;
          }
        }

        if (row.seller_id) {
          const { data: seller } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", row.seller_id)
            .maybeSingle();
          if (seller) {
            sellerName = seller.full_name;
            sellerPhone = seller.phone;
          }
        }

        return {
          ...row,
          listing_title: listingTitle,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          seller_name: sellerName,
          seller_phone: sellerPhone,
        };
      })
    );
  }

  async function loadQueues() {
    const [pending, facilitating] = await Promise.all([
      listPendingPaymentReview(),
      listAwaitingFacilitation(),
    ]);

    const [enrichedReview, enrichedFacilitate] = await Promise.all([
      enrich(pending),
      enrich(facilitating),
    ]);

    setReviewQueue(enrichedReview);
    setFacilitateQueue(enrichedFacilitate);

    const receiptRows = enrichedReview.filter((u) => !!u.payment_receipt_path);
    const urlEntries = await Promise.all(
      receiptRows.map(async (u) => {
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

  async function handleReview(unlockId: string, approve: boolean) {
    if (!adminId) return;
    setActingOn(unlockId);
    setActionError(null);

    const { error } = await reviewOpportunityPayment({
      unlockId,
      adminId,
      approve,
      notes: notesDraft[unlockId] || undefined,
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }

    await loadQueues();
    setActingOn(null);
  }

  async function handleStartFacilitation(unlockId: string) {
    if (!adminId) return;
    setActingOn(unlockId);
    setActionError(null);

    const { error } = await markFacilitationStarted({ unlockId, adminId });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }

    await loadQueues();
    setActingOn(null);
  }

  async function handleReleaseContact(unlockId: string) {
    if (!adminId) return;
    const confirmed = window.confirm(
      "Confirm TM has actually completed facilitation and is ready to release direct contact to the buyer. This cannot be undone."
    );
    if (!confirmed) return;

    setActingOn(unlockId);
    setActionError(null);

    const { error } = await releaseContact({ unlockId, adminId });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }

    await loadQueues();
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
          <p className="text-zinc-400">You don&apos;t have permission to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Opportunity Unlocks
        </h1>
        <p className="text-zinc-400 mb-8">
          Stage 1: review buyer payment proof. Stage 2: TM facilitates the introduction, then — and only
          then — release direct contact. Approving payment never releases contact automatically.
        </p>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab("review")}
            className={
              "px-4 py-2 rounded-xl font-semibold " +
              (tab === "review" ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800")
            }
          >
            Pending Payment Review ({reviewQueue.length})
          </button>
          <button
            onClick={() => setTab("facilitate")}
            className={
              "px-4 py-2 rounded-xl font-semibold " +
              (tab === "facilitate" ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800")
            }
          >
            Awaiting Facilitation ({facilitateQueue.length})
          </button>
        </div>

        {actionError && <p className="text-red-400 mb-4">{actionError}</p>}

        {tab === "review" && (
          <div className="space-y-4">
            {reviewQueue.length === 0 ? (
              <p className="text-zinc-500">No payments awaiting review.</p>
            ) : (
              reviewQueue.map((u) => (
                <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{u.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">
                        Buyer: {u.buyer_name || "Unknown"} {u.buyer_phone ? `— ${u.buyer_phone}` : ""}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold h-fit bg-yellow-500 text-black">
                      Pending Review
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-zinc-300 mb-4">
                    <p>Fee: {u.unlock_fee} {u.currency}</p>
                    <p>Method: {u.payment_method || "—"}</p>
                    <p>Reference: {u.payment_reference || "—"}</p>
                    <p>Submitted: {new Date(u.created_at).toLocaleString()}</p>
                  </div>

                  {receiptUrls[u.id] && (
                    <a
                      href={receiptUrls[u.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-4 text-blue-400 underline text-sm"
                    >
                      View payment receipt
                    </a>
                  )}

                  <textarea
                    placeholder="Optional admin notes..."
                    value={notesDraft[u.id] || ""}
                    onChange={(e) => setNotesDraft((prev) => ({ ...prev, [u.id]: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white mb-4"
                    rows={2}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(u.id, true)}
                      disabled={actingOn === u.id}
                      className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Approve Payment
                    </button>
                    <button
                      onClick={() => handleReview(u.id, false)}
                      disabled={actingOn === u.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Reject Payment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "facilitate" && (
          <div className="space-y-4">
            {facilitateQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing awaiting facilitation.</p>
            ) : (
              facilitateQueue.map((u) => (
                <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{u.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">
                        Buyer: {u.buyer_name || "Unknown"} {u.buyer_phone ? `— ${u.buyer_phone}` : ""}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Seller: {u.seller_name || "Unknown"} {u.seller_phone ? `— ${u.seller_phone}` : ""}
                      </p>
                    </div>
                    <span
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold h-fit " +
                        (u.status === "facilitating" ? "bg-blue-500 text-white" : "bg-amber-500 text-black")
                      }
                    >
                      {u.status === "facilitating" ? "Facilitating" : "Payment Approved"}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 mb-4">
                    Payment approved {u.reviewed_at ? new Date(u.reviewed_at).toLocaleString() : "—"}
                  </p>

                  <div className="flex gap-3">
                    {u.status === "payment_approved" && (
                      <button
                        onClick={() => handleStartFacilitation(u.id)}
                        disabled={actingOn === u.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                      >
                        Mark Facilitation Started
                      </button>
                    )}
                    <button
                      onClick={() => handleReleaseContact(u.id)}
                      disabled={actingOn === u.id}
                      className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Release Contact to Buyer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

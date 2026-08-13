# ============================================================================
# TM Disintermediation Follow-ups (Priority #3 of 4)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_disintermediation.ps1
# Writes 3 files as UTF-8 without BOM. Safe to re-run.
#
# WHAT THIS ADDS:
# 1. Commission credit: recordCompletedDeal() now automatically checks if
#    the buyer already paid the ETB 500 unlock fee for this exact listing
#    (and had contact released), and credits that amount toward the
#    commission owed on the completed deal. Shown in the admin success
#    message when applied.
# 2. A real anti-circumvention clause in Terms of Service (Section 9.1) —
#    the old bullet had no definition, time window, or consequence. Now
#    explicit: 12-month window, stated consequences, and cross-references
#    the commission credit above as the fair-dealing incentive.
# ============================================================================

$ErrorActionPreference = "Stop"
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Write-TmFile($RelativePath, $Content) {
    $full = Join-Path (Get-Location) $RelativePath
    $dir = Split-Path $full -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($full, $Content, $Utf8NoBom)
    Write-Host "Wrote $RelativePath"
}

$f1 = @'
import { supabase } from "@/lib/supabaseClient";

/**
 * OPPORTUNITY UNLOCK ENGINE
 * =========================
 * This is the real replacement for the old fake "pay ETB 500 → instantly see
 * seller phone number" flow.
 *
 * CRITICAL BUSINESS RULE (do not change without explicit instruction):
 * The ETB 500 payment does NOT directly reveal seller contact information.
 * It unlocks a verified TM opportunity and signals genuine buyer intent.
 * Buyer and seller are not connected immediately after payment. TM
 * facilitates the initial communication itself; direct contact between
 * buyer and seller is only released after TM completes its own
 * verification and communication process — always a separate, deliberate
 * admin action, never automatic on payment approval.
 *
 * STAGE 1 — Payment review
 *   Buyer submits payment proof (method + reference, optional receipt) for
 *   a specific listing. Row is created with status = 'pending_review'.
 *   Admin reviews it in /admin/opportunities and either:
 *     - approves  -> status = 'payment_approved'  (moves to Stage 2 queue)
 *     - rejects   -> status = 'payment_rejected'   (terminal)
 *
 * STAGE 2 — TM facilitation & contact release
 *   Admin manually facilitates the introduction (phone call / message
 *   between TM and both parties) OUTSIDE this app, then, only when TM has
 *   actually completed that process, clicks "Release Contact" in
 *   /admin/opportunities. That is the ONLY action that sets
 *   status = 'contact_released' and reveals the seller's contact details
 *   to the buyer. This is always a distinct, deliberate click — approving
 *   payment never does this automatically.
 *
 * Revenue model:
 *   - Primary income: commission % on completed sales/rentals (see
 *     recordCompletedDeal / getCommissionRate below), configurable per
 *     category via commission_settings.
 *   - Secondary income: the ETB 500 unlock fee itself, logged to
 *     revenue_records with type = 'unlock_fee' at the moment contact is
 *     released (i.e. once TM has actually delivered the service being paid
 *     for, not the moment payment is merely submitted).
 *
 * Tables used (see supabase/migrations/002_opportunity_unlocks.sql):
 *   - opportunity_unlocks   (new — this engine's own table)
 *   - commission_settings   (existing — category, commission_percent)
 *   - deals                 (existing — completed sale/rental records)
 *   - revenue_records       (existing — deal_id, amount, type, metadata)
 */

export type OpportunityStatus =
  | "pending_review"
  | "payment_rejected"
  | "payment_approved"
  | "facilitating"
  | "contact_released";

export interface OpportunityUnlock {
  id: string;
  listing_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  unlock_fee: number;
  currency: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_receipt_path: string | null;
  status: OpportunityStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  facilitated_by: string | null;
  facilitated_at: string | null;
  contact_released_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DealCategory = "machinery_sale" | "machinery_rental" | "transport_booking";

// Fallback rates used only if commission_settings has no row for the
// category yet (e.g. migration not run). Kept in sync with the seed values
// in 002_opportunity_unlocks.sql: 5% sales, 8% rentals, 10% transport.
const FALLBACK_COMMISSION_PERCENT: Record<DealCategory, number> = {
  machinery_sale: 5.0,
  machinery_rental: 8.0,
  transport_booking: 10.0,
};

const DEFAULT_UNLOCK_FEE = 500;

function nowIso() {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// STAGE 1: Buyer submits a payment for an opportunity
// ---------------------------------------------------------------------------

export async function requestOpportunityUnlock(params: {
  listingId: string;
  buyerId: string;
  sellerId: string | null;
  paymentMethod: string;
  paymentReference: string;
  paymentReceiptPath?: string | null;
  unlockFee?: number;
}): Promise<{ data: OpportunityUnlock | null; error: string | null }> {
  const { listingId, buyerId, sellerId, paymentMethod, paymentReference, paymentReceiptPath, unlockFee } = params;

  if (!listingId || !buyerId) {
    return { data: null, error: "Missing listing or buyer information." };
  }
  if (!paymentMethod || !paymentReference) {
    return { data: null, error: "Payment method and reference are required." };
  }

  const { data, error } = await supabase
    .from("opportunity_unlocks")
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      unlock_fee: unlockFee ?? DEFAULT_UNLOCK_FEE,
      currency: "ETB",
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      payment_receipt_path: paymentReceiptPath || null,
      status: "pending_review",
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as OpportunityUnlock, error: null };
}

/** Fetch a buyer's own unlock requests for a given listing, most recent first. */
export async function getBuyerUnlocksForListing(
  buyerId: string,
  listingId: string
): Promise<OpportunityUnlock[]> {
  const { data, error } = await supabase
    .from("opportunity_unlocks")
    .select("*")
    .eq("buyer_id", buyerId)
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OpportunityUnlock[];
}

// ---------------------------------------------------------------------------
// ADMIN: Stage 1 — review the payment proof
// ---------------------------------------------------------------------------

export async function reviewOpportunityPayment(params: {
  unlockId: string;
  adminId: string;
  approve: boolean;
  notes?: string;
}): Promise<{ error: string | null }> {
  const { unlockId, adminId, approve, notes } = params;

  const { error } = await supabase
    .from("opportunity_unlocks")
    .update({
      status: approve ? "payment_approved" : "payment_rejected",
      reviewed_by: adminId,
      reviewed_at: nowIso(),
      admin_notes: notes ?? null,
      updated_at: nowIso(),
    })
    .eq("id", unlockId)
    .eq("status", "pending_review"); // guard: only movable from pending_review

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// ADMIN: Stage 2 — mark facilitation in progress (optional intermediate step)
// ---------------------------------------------------------------------------

export async function markFacilitationStarted(params: {
  unlockId: string;
  adminId: string;
}): Promise<{ error: string | null }> {
  const { unlockId, adminId } = params;

  const { error } = await supabase
    .from("opportunity_unlocks")
    .update({
      status: "facilitating",
      facilitated_by: adminId,
      facilitated_at: nowIso(),
      updated_at: nowIso(),
    })
    .eq("id", unlockId)
    .in("status", ["payment_approved", "facilitating"]);

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// ADMIN: Stage 2 — final, deliberate contact release
// This is the ONLY function that reveals contact info and books unlock-fee
// revenue. It must never be called automatically from payment approval.
// ---------------------------------------------------------------------------

export async function releaseContact(params: {
  unlockId: string;
  adminId: string;
}): Promise<{ error: string | null }> {
  const { unlockId, adminId } = params;

  const { data: unlock, error: fetchError } = await supabase
    .from("opportunity_unlocks")
    .select("*")
    .eq("id", unlockId)
    .single();

  if (fetchError || !unlock) {
    return { error: fetchError?.message || "Opportunity unlock not found." };
  }

  if (!["payment_approved", "facilitating"].includes(unlock.status)) {
    return { error: `Cannot release contact from status "${unlock.status}".` };
  }

  const { error: updateError } = await supabase
    .from("opportunity_unlocks")
    .update({
      status: "contact_released",
      facilitated_by: unlock.facilitated_by || adminId,
      facilitated_at: unlock.facilitated_at || nowIso(),
      contact_released_at: nowIso(),
      updated_at: nowIso(),
    })
    .eq("id", unlockId);

  if (updateError) return { error: updateError.message };

  // Book the unlock-fee revenue now that TM has actually delivered the
  // introduction it was paid for. deal_id is null: this is not a completed
  // sale/rental, just the facilitation fee.
  const { error: revenueError } = await supabase.from("revenue_records").insert({
    deal_id: null,
    amount: unlock.unlock_fee,
    type: "unlock_fee",
    metadata: {
      opportunity_unlock_id: unlock.id,
      listing_id: unlock.listing_id,
      buyer_id: unlock.buyer_id,
      seller_id: unlock.seller_id,
    },
  });

  if (revenueError) {
    // Contact release already succeeded; surface the revenue-logging issue
    // separately so an admin can fix bookkeeping without re-releasing contact.
    return { error: `Contact released, but revenue logging failed: ${revenueError.message}` };
  }

  return { error: null };
}

// ---------------------------------------------------------------------------
// ADMIN: read queues for the two tabs of /admin/opportunities
// ---------------------------------------------------------------------------

export async function listPendingPaymentReview(): Promise<OpportunityUnlock[]> {
  const { data, error } = await supabase
    .from("opportunity_unlocks")
    .select("*")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as OpportunityUnlock[];
}

export async function listAwaitingFacilitation(): Promise<OpportunityUnlock[]> {
  const { data, error } = await supabase
    .from("opportunity_unlocks")
    .select("*")
    .in("status", ["payment_approved", "facilitating"])
    .order("reviewed_at", { ascending: true });

  if (error || !data) return [];
  return data as OpportunityUnlock[];
}

// ---------------------------------------------------------------------------
// COMMISSION SETTINGS
// ---------------------------------------------------------------------------

export async function getCommissionRate(category: DealCategory): Promise<number> {
  const { data, error } = await supabase
    .from("commission_settings")
    .select("commission_percent")
    .eq("category", category)
    .maybeSingle();

  if (error || !data || data.commission_percent == null) {
    return FALLBACK_COMMISSION_PERCENT[category];
  }
  return Number(data.commission_percent);
}

export async function listCommissionRates(): Promise<
  { category: DealCategory; commission_percent: number }[]
> {
  const categories: DealCategory[] = ["machinery_sale", "machinery_rental", "transport_booking"];

  const { data, error } = await supabase
    .from("commission_settings")
    .select("category, commission_percent")
    .in("category", categories);

  const byCategory = new Map<string, number>();
  if (!error && data) {
    for (const row of data) {
      if (row.category) byCategory.set(row.category, Number(row.commission_percent));
    }
  }

  return categories.map((category) => ({
    category,
    commission_percent: byCategory.has(category)
      ? (byCategory.get(category) as number)
      : FALLBACK_COMMISSION_PERCENT[category],
  }));
}

export async function updateCommissionRate(
  category: DealCategory,
  commissionPercent: number
): Promise<{ error: string | null }> {
  if (commissionPercent < 0 || commissionPercent > 100) {
    return { error: "Commission rate must be between 0 and 100." };
  }

  const { error } = await supabase
    .from("commission_settings")
    .upsert(
      { category, commission_percent: commissionPercent, updated_at: nowIso() },
      { onConflict: "category" }
    );

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// RECORD A COMPLETED SALE / RENTAL — primary revenue
// ---------------------------------------------------------------------------

export interface RecordDealInput {
  category: DealCategory;
  buyerId: string | null;
  sellerId: string | null;
  machineryId: string | null;
  grossAmount: number;
  currency?: string;
  notes?: string;
}

export async function recordCompletedDeal(
  input: RecordDealInput
): Promise<{ dealId: string | null; commissionAmount: number | null; unlockFeeCredited: number; error: string | null }> {
  const { category, buyerId, sellerId, machineryId, grossAmount, currency, notes } = input;

  if (!grossAmount || grossAmount <= 0) {
    return { dealId: null, commissionAmount: null, unlockFeeCredited: 0, error: "Gross amount must be greater than zero." };
  }

  const commissionPercent = await getCommissionRate(category);
  let commissionAmount = Math.round((grossAmount * commissionPercent) / 100 * 100) / 100;

  // COMMISSION CREDIT: if this exact buyer already paid the ETB 500 unlock
  // fee for this exact listing and TM released contact, credit that amount
  // toward the commission owed on the completed deal. The unlock fee was
  // already booked as its own revenue (type = 'unlock_fee') at the moment
  // contact was released, so crediting it here doesn't cost TM anything —
  // it just avoids charging the buyer/seller twice for the same
  // relationship, which is exactly the "double-paying TM" resentment that
  // pushes people to close deals off-platform instead.
  let unlockFeeCredited = 0;
  if (buyerId && machineryId) {
    const { data: unlock } = await supabase
      .from("opportunity_unlocks")
      .select("id, unlock_fee")
      .eq("buyer_id", buyerId)
      .eq("listing_id", machineryId)
      .eq("status", "contact_released")
      .order("contact_released_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (unlock) {
      unlockFeeCredited = Math.min(Number(unlock.unlock_fee), commissionAmount);
      commissionAmount = Math.round((commissionAmount - unlockFeeCredited) * 100) / 100;
    }
  }

  const sellerReceives = Math.round((grossAmount - commissionAmount) * 100) / 100;

  const dealTypeMap: Record<DealCategory, string> = {
    machinery_sale: "SALE",
    machinery_rental: "RENTAL",
    transport_booking: "TRANSPORT",
  };

  const dealCode = `TM-${dealTypeMap[category]}-${Date.now()}`;

  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .insert({
      deal_code: dealCode,
      deal_type: dealTypeMap[category],
      machinery_id: machineryId,
      buyer_id: buyerId,
      seller_id: sellerId,
      commission_rate: commissionPercent,
      commission_amount: commissionAmount,
      seller_receives: sellerReceives,
      gross_amount: grossAmount,
      currency: currency ?? "ETB",
      is_completed: true,
      metadata: {
        ...(notes ? { notes } : {}),
        ...(unlockFeeCredited > 0 ? { unlock_fee_credited: unlockFeeCredited } : {}),
      },
    })
    .select("id")
    .single();

  if (dealError || !deal) {
    return { dealId: null, commissionAmount: null, unlockFeeCredited: 0, error: dealError?.message || "Failed to record deal." };
  }

  const { error: revenueError } = await supabase.from("revenue_records").insert({
    deal_id: deal.id,
    amount: commissionAmount,
    type: "commission",
    metadata: {
      category,
      gross_amount: grossAmount,
      commission_percent: commissionPercent,
      unlock_fee_credited: unlockFeeCredited,
      buyer_id: buyerId,
      seller_id: sellerId,
    },
  });

  if (revenueError) {
    return {
      dealId: deal.id,
      commissionAmount,
      unlockFeeCredited,
      error: `Deal recorded, but revenue logging failed: ${revenueError.message}`,
    };
  }

  return { dealId: deal.id, commissionAmount, unlockFeeCredited, error: null };
}

/** Total commission + unlock-fee revenue recorded so far, for a quick dashboard number. */
export async function getTotalRevenue(): Promise<{ commission: number; unlockFees: number; total: number }> {
  const { data, error } = await supabase.from("revenue_records").select("amount, type");

  if (error || !data) return { commission: 0, unlockFees: 0, total: 0 };

  let commission = 0;
  let unlockFees = 0;
  for (const row of data) {
    const amount = Number(row.amount) || 0;
    if (row.type === "commission") commission += amount;
    else if (row.type === "unlock_fee") unlockFees += amount;
  }

  return { commission, unlockFees, total: commission + unlockFees };
}

'@
Write-TmFile "src/lib/opportunityEngine.ts" $f1

$f2 = @'
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  recordCompletedDeal,
  listCommissionRates,
  updateCommissionRate,
  getTotalRevenue,
  type DealCategory,
} from "@/lib/opportunityEngine";

const CATEGORY_LABELS: Record<DealCategory, string> = {
  machinery_sale: "Machinery Sale",
  machinery_rental: "Machinery Rental",
  transport_booking: "Transport Booking",
};

export default function AdminDealRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [rates, setRates] = useState<{ category: DealCategory; commission_percent: number }[]>([]);
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});
  const [rateSaving, setRateSaving] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  const [totals, setTotals] = useState({ commission: 0, unlockFees: 0, total: 0 });

  // Record-a-deal form state
  const [category, setCategory] = useState<DealCategory>("machinery_sale");
  const [buyerId, setBuyerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [machineryId, setMachineryId] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [previewCommission, setPreviewCommission] = useState<number | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    computePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, grossAmount, rates]);

  async function init() {
    setLoading(true);

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

    await Promise.all([loadRates(), loadTotals()]);
    setLoading(false);
  }

  async function loadRates() {
    const data = await listCommissionRates();
    setRates(data);
    const drafts: Record<string, string> = {};
    data.forEach((r) => {
      drafts[r.category] = String(r.commission_percent);
    });
    setRateDrafts(drafts);
  }

  async function loadTotals() {
    const data = await getTotalRevenue();
    setTotals(data);
  }

  function computePreview() {
    const rate = rates.find((r) => r.category === category)?.commission_percent;
    const gross = Number(grossAmount);
    if (!rate || !gross || gross <= 0) {
      setPreviewCommission(null);
      return;
    }
    setPreviewCommission(Math.round(((gross * rate) / 100) * 100) / 100);
  }

  async function handleSaveRate(cat: DealCategory) {
    setRateSaving(cat);
    setRateError(null);

    const value = Number(rateDrafts[cat]);
    if (isNaN(value)) {
      setRateError("Enter a valid number.");
      setRateSaving(null);
      return;
    }

    const { error } = await updateCommissionRate(cat, value);
    if (error) {
      setRateError(error);
      setRateSaving(null);
      return;
    }

    await loadRates();
    setRateSaving(null);
  }

  async function handleSubmitDeal(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const gross = Number(grossAmount);
    if (!gross || gross <= 0) {
      setFormError("Enter a valid gross deal amount.");
      return;
    }

    setSubmitting(true);

    const { dealId, commissionAmount, unlockFeeCredited, error } = await recordCompletedDeal({
      category,
      buyerId: buyerId.trim() || null,
      sellerId: sellerId.trim() || null,
      machineryId: machineryId.trim() || null,
      grossAmount: gross,
      notes: notes.trim() || undefined,
    });

    if (error && !dealId) {
      setFormError(error);
      setSubmitting(false);
      return;
    }

    setFormSuccess(
      `Deal recorded${dealId ? ` (${dealId})` : ""}. Commission booked: ${commissionAmount ?? "—"} ETB.` +
        (unlockFeeCredited ? ` (${unlockFeeCredited} ETB unlock fee credited toward this commission.)` : "") +
        (error ? ` Note: ${error}` : "")
    );
    setBuyerId("");
    setSellerId("");
    setMachineryId("");
    setGrossAmount("");
    setNotes("");
    setSubmitting(false);
    await loadTotals();
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Deal Revenue &amp; Commission
        </h1>
        <p className="text-zinc-400 mb-8">
          Primary revenue: commission on completed sales/rentals. Secondary revenue: the ETB 500 unlock fee
          (booked automatically when contact is released in Opportunity Unlocks).
        </p>

        {/* TOTALS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Commission Revenue</p>
            <p className="text-2xl font-black text-amber-400">{totals.commission.toLocaleString()} ETB</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Unlock Fee Revenue</p>
            <p className="text-2xl font-black text-blue-400">{totals.unlockFees.toLocaleString()} ETB</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-white">{totals.total.toLocaleString()} ETB</p>
          </div>
        </div>

        {/* COMMISSION RATES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Commission Rates</h2>
          {rateError && <p className="text-red-400 mb-3 text-sm">{rateError}</p>}
          <div className="space-y-3">
            {rates.map((r) => (
              <div key={r.category} className="flex items-center gap-3">
                <span className="w-48 text-sm text-zinc-300">{CATEGORY_LABELS[r.category]}</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rateDrafts[r.category] ?? ""}
                  onChange={(e) => setRateDrafts((prev) => ({ ...prev, [r.category]: e.target.value }))}
                  className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white"
                />
                <span className="text-zinc-500 text-sm">%</span>
                <button
                  onClick={() => handleSaveRate(r.category)}
                  disabled={rateSaving === r.category}
                  className="ml-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {rateSaving === r.category ? "Saving..." : "Save"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RECORD A DEAL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Record a Completed Deal</h2>
          {formError && <p className="text-red-400 mb-3 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-400 mb-3 text-sm">{formSuccess}</p>}

          <form onSubmit={handleSubmitDeal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DealCategory)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                {(Object.keys(CATEGORY_LABELS) as DealCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Buyer User ID</label>
                <input
                  type="text"
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  placeholder="uuid (optional)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Seller User ID</label>
                <input
                  type="text"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="uuid (optional)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Listing / Machinery ID</label>
              <input
                type="text"
                value={machineryId}
                onChange={(e) => setMachineryId(e.target.value)}
                placeholder="uuid (optional)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              />
              <p className="text-[11px] text-blue-400/80 mt-1">
                Fill in Buyer + Listing ID and, if this buyer already paid the ETB 500 unlock fee for this exact
                listing, that amount is automatically credited toward the commission below.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Gross Deal Amount (ETB)
              </label>
              <input
                type="number"
                min="0"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                placeholder="e.g. 350000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                required
              />
              {previewCommission !== null && (
                <p className="text-xs text-amber-400 mt-1">
                  Estimated commission: {previewCommission.toLocaleString()} ETB
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-xl font-bold disabled:opacity-50"
            >
              {submitting ? "Recording..." : "Record Deal"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

'@
Write-TmFile "src/app/admin/deal-revenue/page.tsx" $f2

$f3 = @'
"use client";

import React from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 py-6 border-b border-zinc-900">
      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">{title}</h2>
      <div className="text-sm text-zinc-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          ታማኝ ማሽነሪ — TM
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500 mb-6">Last updated: July 2026 · Governed by the laws of Ethiopia</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200 leading-relaxed">
          <strong className="text-amber-300">Draft notice:</strong> This document is a working draft reflecting Ethiopia&apos;s
          Commercial Code, the Trade Competition and Consumer Protection Proclamation No. 813/2013, and the Electronic Transaction
          Proclamation No. 1205/2020. It is not a substitute for advice from an Ethiopian-licensed attorney, and Trustworthy Machinery
          (TM) should have it formally reviewed before treating it as final and binding.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or using the Trustworthy Machinery (&quot;TM&quot;) platform, you agree to be bound by these Terms
            of Service and our Privacy Policy. If you do not agree, you must not use the platform.
          </p>
        </Section>

        <Section title="2. What TM Is (and Is Not)">
          <p>
            TM is a matchmaking marketplace connecting machinery owners, renters, operators, mechanics, transporters, and industrial
            businesses. Unless expressly stated (for example, where TM provides an optional escrow service), TM is not a party to
            transactions between users, does not own the machinery listed, and does not guarantee the accuracy of any listing beyond
            what is indicated by our verification badges.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 18 years old and have the legal capacity to enter into binding contracts under the Ethiopian Civil
            Code to use TM. Businesses registering on TM must hold valid business registration and any licenses required under
            Ethiopian law for the goods or services they offer.
          </p>
        </Section>

        <Section title="4. Account Registration and Verification">
          <p>
            You agree to provide accurate, current, and complete information when creating an account and during any KYC
            verification process, and to keep this information up to date. TM may suspend or terminate accounts that provide false or
            misleading information.
          </p>
        </Section>

        <Section title="5. Listings and Seller Obligations">
          <p>
            Consistent with the Trade Competition and Consumer Protection Proclamation No. 813/2013, sellers and lessors on TM must:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide sufficient and accurate information about the quality, type, and condition of the machinery offered;</li>
            <li>Not engage in misleading, deceptive, or unfair trade practices;</li>
            <li>Honor the price and terms stated in a listing once a transaction is agreed; and</li>
            <li>Treat buyers and renters fairly and respectfully.</li>
          </ul>
        </Section>

        <Section title="6. Fees and Payments">
          <p>
            TM may charge fees for premium listing plans, contact-unlock access, or optional escrow services, as displayed on the
            Pricing page at the time of purchase. Fees are quoted in Ethiopian Birr (ETB) and are non-refundable except where required
            by law or expressly stated otherwise.
          </p>
        </Section>

        <Section title="7. Optional Escrow Service">
          <p>
            Where TM offers an optional escrow service, funds are held by TM or its designated payment partner until the conditions
            agreed by both parties (such as on-site inspection) are satisfied. Escrow terms specific to a transaction will be
            presented at the time of use and form part of these Terms once accepted.
          </p>
        </Section>

        <Section title="8. Electronic Contracts">
          <p>
            Agreements formed through TM, including electronic acceptance of listing terms and escrow conditions, are legally
            recognized and enforceable under the Electronic Transaction Proclamation No. 1205/2020, which grants electronic records
            and signatures the same legal validity as their paper equivalents.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>List machinery you do not own or are not authorized to sell, rent, or broker;</li>
            <li>Circumvent TM&apos;s escrow or contact-unlock systems to avoid applicable fees;</li>
            <li>Post false, misleading, or fraudulent listings or reviews;</li>
            <li>Use the platform for any unlawful purpose under Ethiopian law; or</li>
            <li>Attempt to interfere with the security or normal operation of the platform.</li>
          </ul>

          <p className="mt-4 font-semibold">9.1 Circumvention of TM&apos;s Commission</p>
          <p>
            When TM introduces a buyer and seller through the Opportunity Unlock or Verified Inspection process, TM has earned a
            commission on any resulting sale, rental, or transport booking between those parties, regardless of whether the deal is
            ultimately completed through TM&apos;s platform or arranged independently after the introduction. Deliberately completing
            a transaction outside the platform with a party you were introduced to through TM, specifically to avoid TM&apos;s
            commission, is a breach of these Terms.
          </p>
          <p className="mt-2">This obligation applies for twelve (12) months from the date of introduction. TM may:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Suspend or terminate the accounts of any parties found to have circumvented TM in this way;</li>
            <li>Invoice the commission that would have been owed had the deal been completed through TM, calculated at the standard rate for that category; and</li>
            <li>Decline to provide future facilitation, escrow, or verified inspection services to parties who have done so.</li>
          </ul>
          <p className="mt-2">
            To make honoring this straightforward, the ETB 500 Opportunity Unlock fee is credited in full toward the commission owed
            on any deal you complete through TM within the same introduction — you are not charged twice for the same relationship.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>
            The TM name, logo, and platform design are the property of Trustworthy Machinery. Users retain ownership of content they
            submit (such as listing photos and descriptions) but grant TM a license to display that content on the platform for the
            purpose of operating the marketplace.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TM facilitates connections between users but is not responsible for the condition, legality, or performance of machinery
            listed by third parties, except to the extent TM has expressly undertaken verification or escrow obligations. To the
            maximum extent permitted under Ethiopian law, TM&apos;s liability for any claim arising from use of the platform is
            limited to the fees paid by the affected user in the preceding three months.
          </p>
        </Section>

        <Section title="12. Suspension and Termination">
          <p>
            TM may suspend or terminate any account that violates these Terms, provides false verification information, or engages in
            conduct harmful to other users or the platform, with or without notice depending on the severity of the violation.
          </p>
        </Section>

        <Section title="13. Dispute Resolution and Governing Law">
          <p>
            These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any dispute arising from these Terms
            or use of the platform that cannot be resolved amicably shall be subject to the jurisdiction of the competent courts of
            Addis Ababa, Ethiopia, without prejudice to any consumer rights available to you under the Trade Competition and Consumer
            Protection Proclamation.
          </p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Continued use of TM after changes take effect constitutes acceptance of the
            revised Terms. Material changes will be posted on this page with an updated effective date.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <p>
            Questions about these Terms can be directed to{" "}
            <a href="mailto:machinerymatchmaker@gmail.com" className="text-amber-400 hover:text-amber-300">
              machinerymatchmaker@gmail.com
            </a>{" "}
            or +251 911 000 000.
          </p>
        </Section>
      </section>
    </div>
  );
}
'@
Write-TmFile "src/app/terms/page.tsx" $f3

Write-Host ""
Write-Host "Disintermediation follow-ups written. Run: git status" -ForegroundColor Green

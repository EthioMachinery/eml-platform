import { supabase } from "@/lib/supabaseClient";

/**
 * OPPORTUNITY UNLOCK ENGINE
 * =========================
 * This is the real replacement for the old fake "pay ETB 500 â†’ instantly see
 * seller phone number" flow.
 *
 * CRITICAL BUSINESS RULE (do not change without explicit instruction):
 * The ETB 500 payment does NOT directly reveal seller contact information.
 * It unlocks a verified TM opportunity and signals genuine buyer intent.
 * Buyer and seller are not connected immediately after payment. TM
 * facilitates the initial communication itself; direct contact between
 * buyer and seller is only released after TM completes its own
 * verification and communication process â€” always a separate, deliberate
 * admin action, never automatic on payment approval.
 *
 * STAGE 1 â€” Payment review
 *   Buyer submits payment proof (method + reference, optional receipt) for
 *   a specific listing. Row is created with status = 'pending_review'.
 *   Admin reviews it in /admin/opportunities and either:
 *     - approves  -> status = 'payment_approved'  (moves to Stage 2 queue)
 *     - rejects   -> status = 'payment_rejected'   (terminal)
 *
 * STAGE 2 â€” TM facilitation & contact release
 *   Admin manually facilitates the introduction (phone call / message
 *   between TM and both parties) OUTSIDE this app, then, only when TM has
 *   actually completed that process, clicks "Release Contact" in
 *   /admin/opportunities. That is the ONLY action that sets
 *   status = 'contact_released' and reveals the seller's contact details
 *   to the buyer. This is always a distinct, deliberate click â€” approving
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
 *   - opportunity_unlocks   (new â€” this engine's own table)
 *   - commission_settings   (existing â€” category, commission_percent)
 *   - deals                 (existing â€” completed sale/rental records)
 *   - revenue_records       (existing â€” deal_id, amount, type, metadata)
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
// ADMIN: Stage 1 â€” review the payment proof
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
// ADMIN: Stage 2 â€” mark facilitation in progress (optional intermediate step)
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
// ADMIN: Stage 2 â€” final, deliberate contact release
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
// RECORD A COMPLETED SALE / RENTAL â€” primary revenue
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
): Promise<{ dealId: string | null; commissionAmount: number | null; error: string | null }> {
  const { category, buyerId, sellerId, machineryId, grossAmount, currency, notes } = input;

  if (!grossAmount || grossAmount <= 0) {
    return { dealId: null, commissionAmount: null, error: "Gross amount must be greater than zero." };
  }

  const commissionPercent = await getCommissionRate(category);
  const commissionAmount = Math.round((grossAmount * commissionPercent) / 100 * 100) / 100;
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
      metadata: notes ? { notes } : {},
    })
    .select("id")
    .single();

  if (dealError || !deal) {
    return { dealId: null, commissionAmount: null, error: dealError?.message || "Failed to record deal." };
  }

  const { error: revenueError } = await supabase.from("revenue_records").insert({
    deal_id: deal.id,
    amount: commissionAmount,
    type: "commission",
    metadata: {
      category,
      gross_amount: grossAmount,
      commission_percent: commissionPercent,
      buyer_id: buyerId,
      seller_id: sellerId,
    },
  });

  if (revenueError) {
    return {
      dealId: deal.id,
      commissionAmount,
      error: `Deal recorded, but revenue logging failed: ${revenueError.message}`,
    };
  }

  return { dealId: deal.id, commissionAmount, error: null };
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

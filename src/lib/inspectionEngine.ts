import { supabase } from "@/lib/supabaseClient";

/**
 * VERIFIED INSPECTION ENGINE
 * ===========================
 * See TM_Verified_Inspection_Service_Spec.md for the full product rationale.
 *
 * Unlike the opportunity-unlock fee, this revenue is structurally resistant
 * to circumvention: the value (a physical inspection + report) is consumed
 * before any buyer/seller contact exchange happens, so there's nothing to
 * bypass by going around TM.
 *
 * STATUS LIFECYCLE
 *   pending_review    -> requester submitted payment proof, awaiting admin review
 *   payment_rejected  -> admin rejected the payment proof (terminal)
 *   payment_approved  -> payment confirmed, queued for scheduling
 *   scheduled         -> admin assigned an inspector and a visit date
 *   completed         -> inspector's report uploaded, awaiting publish
 *   published         -> report is live on the listing; revenue booked here
 *                         (mirrors opportunityEngine: book revenue when the
 *                         service is actually delivered, not merely paid for)
 */

export type InspectionTier = "basic" | "standard" | "premium";
export type InspectionStatus =
  | "pending_review"
  | "payment_rejected"
  | "payment_approved"
  | "scheduled"
  | "completed"
  | "published";
export type InspectionResult = "passed" | "passed_with_notes" | "failed";

export interface Inspection {
  id: string;
  listing_id: string | null;
  requested_by: string | null;
  tier: InspectionTier;
  fee: number;
  currency: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_receipt_path: string | null;
  status: InspectionStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  inspector_id: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  result: InspectionResult | null;
  report_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Default fees per TM_Verified_Inspection_Service_Spec.md. Admins can
// override the fee for a specific request when needed (e.g. premium
// machinery categories) — these are just sensible defaults, not hard limits.
export const DEFAULT_TIER_FEES: Record<InspectionTier, number> = {
  basic: 1500,
  standard: 4000,
  premium: 10000,
};

const LISTING_STATUS_BY_TIER: Record<InspectionTier, string> = {
  basic: "basic_verified",
  standard: "standard_verified",
  premium: "premium_verified",
};

function nowIso() {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Requester: submit a paid inspection request
// ---------------------------------------------------------------------------

export async function requestInspection(params: {
  listingId: string;
  requestedBy: string;
  tier: InspectionTier;
  paymentMethod: string;
  paymentReference: string;
  paymentReceiptPath?: string | null;
  fee?: number;
}): Promise<{ data: Inspection | null; error: string | null }> {
  const { listingId, requestedBy, tier, paymentMethod, paymentReference, paymentReceiptPath, fee } = params;

  if (!listingId || !requestedBy) {
    return { data: null, error: "Missing listing or requester information." };
  }
  if (!paymentMethod || !paymentReference) {
    return { data: null, error: "Payment method and reference are required." };
  }

  const { data, error } = await supabase
    .from("inspection_requests")
    .insert({
      listing_id: listingId,
      requested_by: requestedBy,
      tier,
      fee: fee ?? DEFAULT_TIER_FEES[tier],
      currency: "ETB",
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      payment_receipt_path: paymentReceiptPath || null,
      status: "pending_review",
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Inspection, error: null };
}

export async function getRequesterInspectionsForListing(
  requestedBy: string,
  listingId: string
): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("requested_by", requestedBy)
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Inspection[];
}

// ---------------------------------------------------------------------------
// Admin: Stage 1 — review payment
// ---------------------------------------------------------------------------

export async function reviewInspectionPayment(params: {
  inspectionId: string;
  adminId: string;
  approve: boolean;
  notes?: string;
}): Promise<{ error: string | null }> {
  const { inspectionId, adminId, approve, notes } = params;

  const { error } = await supabase
    .from("inspection_requests")
    .update({
      status: approve ? "payment_approved" : "payment_rejected",
      reviewed_by: adminId,
      reviewed_at: nowIso(),
      admin_notes: notes ?? null,
      updated_at: nowIso(),
    })
    .eq("id", inspectionId)
    .eq("status", "pending_review");

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// Admin: Stage 2 — schedule an inspector
// ---------------------------------------------------------------------------

export async function scheduleInspection(params: {
  inspectionId: string;
  inspectorId: string;
  scheduledAt: string; // ISO date/time
}): Promise<{ error: string | null }> {
  const { inspectionId, inspectorId, scheduledAt } = params;

  const { error } = await supabase
    .from("inspection_requests")
    .update({
      status: "scheduled",
      inspector_id: inspectorId,
      scheduled_at: scheduledAt,
      updated_at: nowIso(),
    })
    .eq("id", inspectionId)
    .eq("status", "payment_approved");

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// Admin: Stage 3 — record completion (report uploaded)
// ---------------------------------------------------------------------------

export async function completeInspection(params: {
  inspectionId: string;
  result: InspectionResult;
  reportUrl: string;
  notes?: string;
}): Promise<{ error: string | null }> {
  const { inspectionId, result, reportUrl, notes } = params;

  const { error } = await supabase
    .from("inspection_requests")
    .update({
      status: "completed",
      result,
      report_url: reportUrl,
      admin_notes: notes ?? null,
      completed_at: nowIso(),
      updated_at: nowIso(),
    })
    .eq("id", inspectionId)
    .eq("status", "scheduled");

  if (error) return { error: error.message };
  return { error: null };
}

// ---------------------------------------------------------------------------
// Admin: Stage 4 — publish (revenue booked here, badge applied to listing)
// ---------------------------------------------------------------------------

export async function publishInspection(params: {
  inspectionId: string;
}): Promise<{ error: string | null }> {
  const { inspectionId } = params;

  const { data: inspection, error: fetchError } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("id", inspectionId)
    .single();

  if (fetchError || !inspection) {
    return { error: fetchError?.message || "Inspection not found." };
  }

  if (inspection.status !== "completed") {
    return { error: `Cannot publish from status "${inspection.status}".` };
  }

  const { error: updateError } = await supabase
    .from("inspection_requests")
    .update({
      status: "published",
      published_at: nowIso(),
      updated_at: nowIso(),
    })
    .eq("id", inspectionId);

  if (updateError) return { error: updateError.message };

  // Apply the real "Verified" badge to the listing — only for a passing
  // (or passed-with-notes) result. A failed inspection is still published
  // for transparency, but does not earn the badge.
  if (inspection.result === "passed" || inspection.result === "passed_with_notes") {
    if (inspection.listing_id) {
      await supabase
        .from("listings")
        .update({
          inspection_status: LISTING_STATUS_BY_TIER[inspection.tier as InspectionTier],
          last_inspection_report_url: inspection.report_url,
        })
        .eq("id", inspection.listing_id);
    }
  }

  const { error: revenueError } = await supabase.from("revenue_records").insert({
    deal_id: null,
    amount: inspection.fee,
    type: "inspection_fee",
    metadata: {
      inspection_id: inspection.id,
      listing_id: inspection.listing_id,
      requested_by: inspection.requested_by,
      tier: inspection.tier,
      result: inspection.result,
    },
  });

  if (revenueError) {
    return { error: `Published, but revenue logging failed: ${revenueError.message}` };
  }

  return { error: null };
}

// ---------------------------------------------------------------------------
// Admin: read queues
// ---------------------------------------------------------------------------

export async function listPendingInspectionPaymentReview(): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as Inspection[];
}

export async function listInspectionsToSchedule(): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("status", "payment_approved")
    .order("reviewed_at", { ascending: true });

  if (error || !data) return [];
  return data as Inspection[];
}

export async function listScheduledInspections(): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: true });

  if (error || !data) return [];
  return data as Inspection[];
}

export async function listCompletedAwaitingPublish(): Promise<Inspection[]> {
  const { data, error } = await supabase
    .from("inspection_requests")
    .select("*")
    .eq("status", "completed")
    .order("completed_at", { ascending: true });

  if (error || !data) return [];
  return data as Inspection[];
}

/** Total inspection-fee revenue recorded so far. */
export async function getInspectionRevenue(): Promise<number> {
  const { data, error } = await supabase
    .from("revenue_records")
    .select("amount")
    .eq("type", "inspection_fee");

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
}

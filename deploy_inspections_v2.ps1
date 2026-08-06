# ============================================================================
# TM Verified Inspection — deployment script (v2, corrected table name)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_inspections_v2.ps1
# Writes 4 files as UTF-8 WITHOUT a BOM. Safe to re-run.
#
# This v2 fixes a packaging mistake in the original script: it still
# referenced a table named "inspections" (the wrong, pre-existing,
# incompatible legacy table) instead of "inspection_requests" (the correct
# new table your database now actually has). If you already ran the
# original deploy_inspections.ps1, this OVERWRITES those same 4 files with
# the corrected version — safe to re-run, no separate cleanup needed.
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
-- ============================================================================
-- TM: VERIFIED INSPECTION SERVICE — migration 003
-- Run in Supabase SQL Editor after 002_opportunity_unlocks.sql
--
-- Adds the paid inspection/verification product described in
-- TM_Verified_Inspection_Service_Spec.md. Reuses the same patterns already
-- proven in 002 (RLS checking role in ('ADMIN','admin') — not just 'ADMIN',
-- which was the exact bug fixed on commission_settings/deals earlier).
--
-- NOTE ON TABLE NAME: your database already has a table literally called
-- "inspections" from an earlier, unrelated attempt at this feature — it
-- stores finished/certified results (overall_grade, hydraulic_pressure_psi,
-- etc.) with several NOT NULL columns that don't fit a request/payment/
-- schedule workflow. Rather than fight that shape, this migration creates
-- a new table, inspection_requests, and leaves the old inspections table
-- untouched — the same approach already taken with the other pre-existing,
-- differently-shaped legacy tables in this project.
--
-- IMPORTANT — VISIBLE SITE CHANGE AFTER THIS MIGRATION + its matching code:
-- search.ts currently hardcodes every listing as verified: true (fake). This
-- migration adds a REAL inspection_status column, and the matching code
-- change makes the "Verified" badge reflect it truthfully. That means every
-- existing listing will show as unverified until it actually goes through
-- Basic Verification. This is intentional — the whole point of this feature
-- is that "Verified" should mean something — but you should know the badge
-- will disappear from your current 14 listings immediately after deploy,
-- until you verify them (for real, or via the manual SQL note at the
-- bottom of this file for a fast transition).
--
-- Safe to re-run: every statement is IF NOT EXISTS / defensive.
-- ============================================================================

-- 1. THE INSPECTIONS TABLE ---------------------------------------------------
create table if not exists public.inspection_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  requested_by uuid references public.profiles(id) on delete set null,

  tier text not null default 'basic',
  fee numeric(15,2) not null,
  currency text not null default 'ETB',

  -- Payment (same pattern as opportunity_unlocks Stage 1)
  payment_method text,
  payment_reference text,
  payment_receipt_path text,

  status text not null default 'pending_review',
  -- pending_review -> payment_rejected | payment_approved -> scheduled -> completed -> published

  admin_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,

  inspector_id uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz,
  completed_at timestamptz,

  result text check (result in ('passed','passed_with_notes','failed')),
  report_url text,
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'inspection_requests_status_check'
  ) then
    alter table public.inspection_requests
      add constraint inspection_requests_status_check
      check (status in ('pending_review','payment_rejected','payment_approved','scheduled','completed','published'));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'inspection_requests_tier_check'
  ) then
    alter table public.inspection_requests
      add constraint inspection_requests_tier_check
      check (tier in ('basic','standard','premium'));
  end if;
end $$;

create index if not exists idx_inspection_requests_status on public.inspection_requests(status, created_at desc);
create index if not exists idx_inspection_requests_listing on public.inspection_requests(listing_id);
create index if not exists idx_inspection_requests_requester on public.inspection_requests(requested_by);

-- 2. ROW LEVEL SECURITY -------------------------------------------------------
alter table public.inspection_requests enable row level security;

drop policy if exists "requester reads own inspections" on public.inspection_requests;
create policy "requester reads own inspections" on public.inspection_requests
  for select using (auth.uid() = requested_by);

drop policy if exists "requester creates own inspection request" on public.inspection_requests;
create policy "requester creates own inspection request" on public.inspection_requests
  for insert with check (auth.uid() = requested_by);

drop policy if exists "admin full access on inspections" on public.inspection_requests;
create policy "admin full access on inspections" on public.inspection_requests
  for all using (
    auth.uid() in (select id from public.profiles where role in ('ADMIN','admin'))
  );

-- Public can read published, passing reports (for displaying the badge/report
-- link on a listing to any visitor, not just the person who paid for it).
drop policy if exists "public reads published inspections" on public.inspection_requests;
create policy "public reads published inspections" on public.inspection_requests
  for select using (status = 'published');

-- 3. REAL VERIFICATION STATUS ON LISTINGS (replaces the hardcoded fake flag) -
alter table public.listings
  add column if not exists inspection_status text not null default 'none',
  add column if not exists last_inspection_report_url text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'listings_inspection_status_check'
  ) then
    alter table public.listings
      add constraint listings_inspection_status_check
      check (inspection_status in ('none','basic_verified','standard_verified','premium_verified'));
  end if;
end $$;

-- ============================================================================
-- OPTIONAL FAST TRANSITION: if you want a few trusted existing listings to
-- keep showing "Verified" immediately (rather than all 14 dropping to
-- unverified at once), you can manually mark specific ones, e.g.:
--   update public.listings set inspection_status = 'basic_verified'
--   where id = 'PASTE-LISTING-UUID';
-- Only do this for listings you have personally confirmed are legitimate —
-- this bypasses the paid inspection flow, so use sparingly.
-- ============================================================================

'@
Write-TmFile "supabase/migrations/003_inspections.sql" $f1

$f2 = @'
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

'@
Write-TmFile "src/lib/inspectionEngine.ts" $f2

$f3 = @'
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  listPendingInspectionPaymentReview,
  listInspectionsToSchedule,
  listScheduledInspections,
  listCompletedAwaitingPublish,
  reviewInspectionPayment,
  scheduleInspection,
  completeInspection,
  publishInspection,
  getInspectionRevenue,
  type Inspection,
  type InspectionResult,
} from "@/lib/inspectionEngine";

type EnrichedInspection = Inspection & {
  listing_title: string | null;
  requester_name: string | null;
  requester_phone: string | null;
};

type Tab = "review" | "schedule" | "scheduled" | "publish";

const TIER_LABELS: Record<string, string> = {
  basic: "Basic Verification",
  standard: "Standard Inspection",
  premium: "Premium Inspection",
};

function buildReportStoragePath(inspectionId: string, fileName: string): string {
  return `${inspectionId}/${Date.now()}-${fileName}`;
}

export default function AdminInspectionsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("review");

  const [reviewQueue, setReviewQueue] = useState<EnrichedInspection[]>([]);
  const [scheduleQueue, setScheduleQueue] = useState<EnrichedInspection[]>([]);
  const [scheduledQueue, setScheduledQueue] = useState<EnrichedInspection[]>([]);
  const [publishQueue, setPublishQueue] = useState<EnrichedInspection[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [actingOn, setActingOn] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [inspectorDraft, setInspectorDraft] = useState<Record<string, string>>({});
  const [dateDraft, setDateDraft] = useState<Record<string, string>>({});
  const [resultDraft, setResultDraft] = useState<Record<string, InspectionResult>>({});
  const [reportFile, setReportFile] = useState<Record<string, File | null>>({});

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

  async function enrich(rows: Inspection[]): Promise<EnrichedInspection[]> {
    return Promise.all(
      rows.map(async (row) => {
        let listingTitle: string | null = null;
        let requesterName: string | null = null;
        let requesterPhone: string | null = null;

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

        if (row.requested_by) {
          const { data: requester } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", row.requested_by)
            .maybeSingle();
          if (requester) {
            requesterName = requester.full_name;
            requesterPhone = requester.phone;
          }
        }

        return { ...row, listing_title: listingTitle, requester_name: requesterName, requester_phone: requesterPhone };
      })
    );
  }

  async function loadQueues() {
    const [review, schedule, scheduled, publish, revenue] = await Promise.all([
      listPendingInspectionPaymentReview(),
      listInspectionsToSchedule(),
      listScheduledInspections(),
      listCompletedAwaitingPublish(),
      getInspectionRevenue(),
    ]);

    const [er, es, esch, ep] = await Promise.all([enrich(review), enrich(schedule), enrich(scheduled), enrich(publish)]);

    setReviewQueue(er);
    setScheduleQueue(es);
    setScheduledQueue(esch);
    setPublishQueue(ep);
    setTotalRevenue(revenue);
  }

  async function handleReview(id: string, approve: boolean) {
    if (!adminId) return;
    setActingOn(id);
    setActionError(null);

    const { error } = await reviewInspectionPayment({
      inspectionId: id,
      adminId,
      approve,
      notes: notesDraft[id] || undefined,
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handleSchedule(id: string) {
    const inspectorId = inspectorDraft[id];
    const scheduledAt = dateDraft[id];

    if (!inspectorId || !scheduledAt) {
      setActionError("Enter both an inspector user ID and a scheduled date/time.");
      return;
    }

    setActingOn(id);
    setActionError(null);

    const { error } = await scheduleInspection({
      inspectionId: id,
      inspectorId,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handleComplete(id: string) {
    const file = reportFile[id];
    const result = resultDraft[id];

    if (!file || !result) {
      setActionError("Choose a report file and select a result before completing.");
      return;
    }

    setActingOn(id);
    setActionError(null);

    const path = buildReportStoragePath(id, file.name);
    const { error: uploadError } = await supabase.storage.from("inspection-reports").upload(path, file);

    if (uploadError) {
      setActionError(`Report upload failed: ${uploadError.message}`);
      setActingOn(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("inspection-reports").getPublicUrl(path);

    const { error } = await completeInspection({
      inspectionId: id,
      result,
      reportUrl: urlData.publicUrl,
      notes: notesDraft[id] || undefined,
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handlePublish(id: string) {
    setActingOn(id);
    setActionError(null);

    const { error } = await publishInspection({ inspectionId: id });

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

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "review", label: "Payment Review", count: reviewQueue.length },
    { key: "schedule", label: "To Schedule", count: scheduleQueue.length },
    { key: "scheduled", label: "Scheduled — Upload Report", count: scheduledQueue.length },
    { key: "publish", label: "Ready to Publish", count: publishQueue.length },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Verified Inspections
        </h1>
        <p className="text-zinc-400 mb-2">
          Payment review → schedule an inspector → upload the report → publish. Publishing books the
          inspection-fee revenue and applies the real &quot;Verified&quot; badge to the listing.
        </p>
        <p className="text-amber-400 text-sm mb-8">Total inspection-fee revenue booked: {totalRevenue.toLocaleString()} ETB</p>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2 rounded-xl font-semibold text-sm " +
                (tab === t.key ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800")
              }
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {actionError && <p className="text-red-400 mb-4">{actionError}</p>}

        {tab === "review" && (
          <div className="space-y-4">
            {reviewQueue.length === 0 ? (
              <p className="text-zinc-500">No inspection payments awaiting review.</p>
            ) : (
              reviewQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{i.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">
                        Requested by: {i.requester_name || "Unknown"} {i.requester_phone ? `— ${i.requester_phone}` : ""}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold h-fit bg-yellow-500 text-black">
                      {TIER_LABELS[i.tier]}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-zinc-300 mb-4">
                    <p>Fee: {i.fee} {i.currency}</p>
                    <p>Method: {i.payment_method || "—"}</p>
                    <p>Reference: {i.payment_reference || "—"}</p>
                    <p>Submitted: {new Date(i.created_at).toLocaleString()}</p>
                  </div>
                  <textarea
                    placeholder="Optional admin notes..."
                    value={notesDraft[i.id] || ""}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white mb-4"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(i.id, true)}
                      disabled={actingOn === i.id}
                      className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Approve Payment
                    </button>
                    <button
                      onClick={() => handleReview(i.id, false)}
                      disabled={actingOn === i.id}
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

        {tab === "schedule" && (
          <div className="space-y-4">
            {scheduleQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing awaiting scheduling.</p>
            ) : (
              scheduleQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-lg font-bold mb-1">{i.listing_title || "Untitled listing"}</p>
                  <p className="text-zinc-400 text-sm mb-4">{TIER_LABELS[i.tier]} — payment approved {i.reviewed_at ? new Date(i.reviewed_at).toLocaleString() : ""}</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Inspector User ID</label>
                      <input
                        type="text"
                        value={inspectorDraft[i.id] || ""}
                        onChange={(e) => setInspectorDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                        placeholder="uuid"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Scheduled Date/Time</label>
                      <input
                        type="datetime-local"
                        value={dateDraft[i.id] || ""}
                        onChange={(e) => setDateDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSchedule(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Confirm Schedule
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "scheduled" && (
          <div className="space-y-4">
            {scheduledQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing currently scheduled.</p>
            ) : (
              scheduledQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-lg font-bold mb-1">{i.listing_title || "Untitled listing"}</p>
                  <p className="text-zinc-400 text-sm mb-4">
                    {TIER_LABELS[i.tier]} — scheduled for {i.scheduled_at ? new Date(i.scheduled_at).toLocaleString() : "—"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Result</label>
                      <select
                        value={resultDraft[i.id] || ""}
                        onChange={(e) => setResultDraft((p) => ({ ...p, [i.id]: e.target.value as InspectionResult }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="">Select...</option>
                        <option value="passed">Passed</option>
                        <option value="passed_with_notes">Passed with notes</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Report File</label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => setReportFile((p) => ({ ...p, [i.id]: e.target.files?.[0] || null }))}
                        className="w-full text-xs text-zinc-400"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Inspector notes..."
                    value={notesDraft[i.id] || ""}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white mb-4"
                    rows={2}
                  />
                  <button
                    onClick={() => handleComplete(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "publish" && (
          <div className="space-y-4">
            {publishQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing ready to publish.</p>
            ) : (
              publishQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{i.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">{TIER_LABELS[i.tier]}</p>
                    </div>
                    <span
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold h-fit " +
                        (i.result === "failed" ? "bg-red-500 text-white" : "bg-green-500 text-black")
                      }
                    >
                      {i.result === "passed" ? "Passed" : i.result === "passed_with_notes" ? "Passed with notes" : "Failed"}
                    </span>
                  </div>
                  {i.report_url && (
                    <a href={i.report_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm block mb-4">
                      View report
                    </a>
                  )}
                  <button
                    onClick={() => handlePublish(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Publish &amp; Book Revenue
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

'@
Write-TmFile "src/app/admin/inspections/page.tsx" $f3

$f4 = @'
import { supabase } from "@/lib/supabaseClient";
import { SupportedLanguage, LocalizedListing } from "@/types";

export async function fetchLocalizedListings(
  lang: SupportedLanguage,
  filters?: {
    category?: string;
    location?: string;
    maxPrice?: number;
    intent?: 'all' | 'rent' | 'sale';
  }
): Promise<LocalizedListing[]> {
  try {
    let query = supabase
      .from('listings')
      .select(`
        id,
        owner_id,
        brand,
        model,
        category_token,
        model_year,
        serial_number,
        title_am,
        title_en,
        description_am,
        description_en,
        localized_title,
        localized_description,
        price,
        price_sale,
        price_rental_daily,
        is_rental_only,
        status,
        image_url,
        location,
        inspection_status
      `)
      .eq('status', 'verified_available');

    if (filters?.category) query = query.eq('category_token', filters.category);
    if (filters?.location) query = query.eq('location', filters.location);
    if (filters?.maxPrice) query = query.lte('price_sale', filters.maxPrice);
    if (filters?.intent === 'rent') query = query.eq('is_rental_only', true);
    else if (filters?.intent === 'sale') query = query.eq('is_rental_only', false);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query failed: ${error.message} (code: ${error.code})`);
    }

    if (!data) return [];

    return data.map((item: any) => {
      let title = "No Title";
      if (item.localized_title && typeof item.localized_title === "object") {
        title = item.localized_title[lang] || item.localized_title['en'] || title;
      } else {
        title = lang === 'am'
          ? (item.title_am || item.title_en || title)
          : (item.title_en || item.title_am || title);
      }

      let description = "No Description";
      if (item.localized_description && typeof item.localized_description === "object") {
        description = item.localized_description[lang] || item.localized_description['en'] || description;
      } else {
        description = lang === 'am'
          ? (item.description_am || item.description_en || description)
          : (item.description_en || item.description_am || description);
      }

      return {
        id: item.id,
        brand: item.brand || "Unknown",
        model: item.model || "Unknown",
        categoryToken: item.category_token || "machinery",
        modelYear: item.model_year || 2020,
        serialNumber: "Vetted & Hidden",
        title,
        description,
        priceSale: item.price_sale ? Number(item.price_sale) : (item.price ? Number(item.price) : null),
        priceRentalDaily: item.price_rental_daily ? Number(item.price_rental_daily) : null,
        isRentalOnly: item.is_rental_only || false,
        status: item.status,
        engineHours: 1200,
        locationToken: item.location || "addis_ababa",
        // FIXED: this used to be hardcoded `true` for every single listing,
        // regardless of whether anyone had actually verified anything. It
        // now reflects the real Verified Inspection result (see
        // inspectionEngine.ts / admin/inspections) — a listing is only
        // "Verified" once it has actually passed a paid inspection.
        verified: !!item.inspection_status && item.inspection_status !== "none",
        imageUrl: item.image_url || null,
        ownerId: item.owner_id || null,
        ownerName: "TM Verified Supplier",
        ownerPhone: "Contact via TM"
      };
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : JSON.stringify(err, Object.getOwnPropertyNames(err));
    console.error("Failed to fetch machinery listings:", message);
    return [];
  }
}

'@
Write-TmFile "src/lib/db/machinery/search.ts" $f4

Write-Host ""
Write-Host "Inspection feature files written (v2, corrected). Run: git status" -ForegroundColor Green

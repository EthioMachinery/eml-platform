# ============================================================================
# TM Opportunity Engine — file deployment script (v2, UTF-8 fixed)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_tm_files_v2.ps1
# This creates/overwrites all 9 files with their verified final content,
# writing them as UTF-8 WITHOUT a BOM (correct for Next.js source files).
# Safe to re-run.
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
-- TM: OPPORTUNITY UNLOCK ENGINE — migration 002
-- Run in Supabase SQL Editor (Project > SQL Editor > New query)
--
-- Purpose: create the ONE new table the two-stage opportunity-unlock system
-- needs (opportunity_unlocks). Everything else (commission_settings, deals,
-- revenue_records, profiles, listings) already exists in this project per
-- SUPABASE_MASTER_BACKBONE.sql, so this migration reuses them as-is rather
-- than redefining them.
--
-- NOTE on the previous failure ("column source does not exist"): that error
-- came from code trying to write a `source` column into `revenue_records`.
-- The real `revenue_records` table (see SUPABASE_MASTER_BACKBONE.sql line
-- ~515) only has: id, deal_id, amount, type, metadata, created_at — no
-- `source` column. This migration, and opportunityEngine.ts, use `type`
-- + `metadata` instead of `source`, so that bug class cannot recur here.
--
-- Safe to re-run: every statement is IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- ============================================================================

-- 1. THE NEW TABLE ----------------------------------------------------------
-- Tracks both stages of an unlock in one row:
--   pending_review    -> buyer submitted ETB 500 payment proof, awaiting admin review (Stage 1)
--   payment_rejected  -> admin rejected the payment proof (terminal)
--   payment_approved  -> admin confirmed payment; TM now facilitates intro (Stage 2 begins)
--   facilitating       -> admin has started reaching out to buyer & seller
--   contact_released  -> TM has completed its own verification/introduction and
--                         released direct contact details to the buyer (terminal, success)
create table if not exists public.opportunity_unlocks (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  buyer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,

  unlock_fee numeric(15,2) not null default 500,
  currency text not null default 'ETB',

  -- Stage 1: payment proof submitted directly by the buyer
  payment_method text,
  payment_reference text,
  payment_receipt_path text,

  status text not null default 'pending_review',

  admin_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,

  -- Stage 2: TM facilitation & final contact release
  facilitated_by uuid references public.profiles(id) on delete set null,
  facilitated_at timestamptz,
  contact_released_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'opportunity_unlocks_status_check'
  ) then
    alter table public.opportunity_unlocks
      add constraint opportunity_unlocks_status_check
      check (status in ('pending_review','payment_rejected','payment_approved','facilitating','contact_released'));
  end if;
end $$;

create index if not exists idx_opportunity_unlocks_status on public.opportunity_unlocks(status, created_at desc);
create index if not exists idx_opportunity_unlocks_buyer on public.opportunity_unlocks(buyer_id);
create index if not exists idx_opportunity_unlocks_listing on public.opportunity_unlocks(listing_id);

-- 2. ROW LEVEL SECURITY ------------------------------------------------------
alter table public.opportunity_unlocks enable row level security;

drop policy if exists "buyer reads own unlocks" on public.opportunity_unlocks;
create policy "buyer reads own unlocks" on public.opportunity_unlocks
  for select using (auth.uid() = buyer_id);

drop policy if exists "buyer creates own unlock request" on public.opportunity_unlocks;
create policy "buyer creates own unlock request" on public.opportunity_unlocks
  for insert with check (auth.uid() = buyer_id);

drop policy if exists "admin full access on opportunity_unlocks" on public.opportunity_unlocks;
create policy "admin full access on opportunity_unlocks" on public.opportunity_unlocks
  for all using (
    auth.uid() in (select id from public.profiles where role in ('ADMIN','admin'))
  );

-- 3. DEFENSIVE CHECKS ON EXISTING TABLES ------------------------------------
-- (No-ops if these already exist; included so this migration is fully
-- self-sufficient even on a database that never ran the master backbone.)
alter table public.revenue_records
  add column if not exists deal_id uuid references public.deals(id) on delete cascade,
  add column if not exists amount numeric(15,2),
  add column if not exists type text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now();

alter table public.commission_settings
  add column if not exists category text,
  add column if not exists commission_percent numeric(8,4);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'commission_settings_category_unique'
  ) then
    alter table public.commission_settings
      add constraint commission_settings_category_unique unique (category);
  end if;
end $$;

-- Seed / update the three categories TM actually uses today with the rates
-- agreed in the business rules (5% sales, 8% rentals, 10% transport).
insert into public.commission_settings (category, commission_percent)
values
  ('machinery_sale', 5.0),
  ('machinery_rental', 8.0),
  ('transport_booking', 10.0)
on conflict (category) do update set commission_percent = excluded.commission_percent;

-- ============================================================================
-- DONE. After running this:
--   1. Confirm with:  select * from public.opportunity_unlocks limit 1;
--   2. Confirm with:  select category, commission_percent from public.commission_settings;
--   3. Set your admin account (replace the UUID):
--        update public.profiles set role = 'admin' where id = 'YOUR-USER-UUID';
-- ============================================================================

'@
Write-TmFile "supabase/migrations/002_opportunity_unlocks.sql" $f1

$f2 = @'
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

'@
Write-TmFile "src/lib/opportunityEngine.ts" $f2

$f3 = @'
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

'@
Write-TmFile "src/app/admin/opportunities/page.tsx" $f3

$f4 = @'
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

    const { dealId, commissionAmount, error } = await recordCompletedDeal({
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
      `Deal recorded${dealId ? ` (${dealId})` : ""}. Commission booked: ${commissionAmount ?? "—"} ETB.${
        error ? ` Note: ${error}` : ""
      }`
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
Write-TmFile "src/app/admin/deal-revenue/page.tsx" $f4

$f5 = @'
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { fetchLocalizedListings } from "@/lib/db/machinery/search";
import type { LocalizedListing } from "@/types";
import TranslatedInput from "@/components/ui/TranslatedInput";
import TranslatedSelect from "@/components/ui/TranslatedSelect";
import {
  requestOpportunityUnlock,
  getBuyerUnlocksForListing,
  type OpportunityUnlock,
  type OpportunityStatus,
} from "@/lib/opportunityEngine";

const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "hawassa": { en: "Hawassa", am: "ሀዋሳ", om: "Hawaas", ti: "ሃዋሳ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" },
  "bahir_dar": { en: "Bahir Dar", am: "ባህር ዳር", om: "Baahir Daar", ti: "ባህር ዳር" },
  "dire_dawa": { en: "Dire Dawa", am: "ድሬዳዋ", om: "Dirree Dhawaa", ti: "ድሬዳዋ" }
};

// Local modal view states, derived from the buyer's most recent
// opportunity_unlocks row for the selected listing (see opportunityEngine.ts
// for the authoritative status machine).
type ModalView =
  | "loading"
  | "needs_login"
  | "form"
  | "submitting"
  | "submitted"
  | "pending_review"
  | "awaiting_facilitation"
  | "rejected"
  | "released";

export default function TMUniversalMarketplace() {
  const { t, currentLanguage } = useTranslate();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [listings, setListings] = useState<LocalizedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategorySpecification, setOtherCategorySpecification] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [otherLocationSpecification, setOtherLocationSpecification] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rentFilter, setRentFilter] = useState<"all" | "rent" | "sale">("all");

  // Opportunity unlock modal state
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedListingForUnlock, setSelectedListingForUnlock] = useState<LocalizedListing | null>(null);
  const [modalView, setModalView] = useState<ModalView>("form");
  const [existingUnlock, setExistingUnlock] = useState<OpportunityUnlock | null>(null);
  const [releasedContact, setReleasedContact] = useState<{ name: string | null; phone: string | null } | null>(null);

  // Payment submission form fields
  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [paymentReference, setPaymentReference] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const targetCategory = selectedCategory === "other" ? otherCategorySpecification : selectedCategory;
      const targetLocation = selectedLocation === "other" ? otherLocationSpecification : selectedLocation;

      const data = await fetchLocalizedListings(currentLanguage, {
        category: targetCategory || undefined,
        location: targetLocation || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        intent: rentFilter
      });
      setListings(data);
      setIsLoading(false);
    }

    startTransition(() => {
      loadData();
    });
  }, [currentLanguage, selectedCategory, otherCategorySpecification, selectedLocation, otherLocationSpecification, maxPrice, rentFilter]);

  const displayedListings = listings.filter((item) => {
    return `${item.brand} ${item.model}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Compute stats
  const totalListings = displayedListings.length;
  const verifiedCount = displayedListings.filter(l => l.verified).length;
  const avgPrice = totalListings > 0
    ? Math.floor(displayedListings.reduce((sum, l) => sum + (l.isRentalOnly ? (l.priceRentalDaily || 0) : (l.priceSale || 0)), 0) / totalListings)
    : 0;

  function statusToView(status: OpportunityStatus): ModalView {
    if (status === "pending_review") return "pending_review";
    if (status === "payment_approved" || status === "facilitating") return "awaiting_facilitation";
    if (status === "payment_rejected") return "rejected";
    if (status === "contact_released") return "released";
    return "form";
  }

  // Handle opening the unlock modal — check for an existing request first
  const handleUnlockContact = async (listing: LocalizedListing) => {
    setSelectedListingForUnlock(listing);
    setSubmitError(null);
    setPaymentReference("");
    setReceiptFile(null);
    setExistingUnlock(null);
    setReleasedContact(null);
    setShowUnlockModal(true);

    if (!user) {
      setModalView("needs_login");
      return;
    }

    setModalView("loading");

    const unlocks = await getBuyerUnlocksForListing(user.id, listing.id);
    const latest = unlocks[0] || null;
    setExistingUnlock(latest);

    if (!latest) {
      setModalView("form");
      return;
    }

    const view = statusToView(latest.status);
    setModalView(view);

    if (view === "released" && listing.ownerId) {
      const { data: seller } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", listing.ownerId)
        .maybeSingle();
      setReleasedContact({ name: seller?.full_name ?? null, phone: seller?.phone ?? null });
    }
  };

  async function handleSubmitPayment() {
    if (!user || !selectedListingForUnlock) return;

    if (!paymentReference.trim()) {
      setSubmitError("Please enter your payment reference / transaction ID.");
      return;
    }

    setSubmitError(null);
    setModalView("submitting");

    let receiptPath: string | null = null;
    if (receiptFile) {
      const path = `${user.id}/${Date.now()}-${receiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(path, receiptFile);
      if (!uploadError) {
        receiptPath = path;
      }
    }

    const { error } = await requestOpportunityUnlock({
      listingId: selectedListingForUnlock.id,
      buyerId: user.id,
      sellerId: selectedListingForUnlock.ownerId,
      paymentMethod,
      paymentReference: paymentReference.trim(),
      paymentReceiptPath: receiptPath,
    });

    if (error) {
      setSubmitError(error);
      setModalView("form");
      return;
    }

    setModalView("submitted");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" id="eml-marketplace-app">

      {/* BANNER SECTION (add carousel later) */}
      <div className="mb-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl p-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🔥 Special Offer</h2>
            <p className="text-sm">List your machinery for free until end of month!</p>
          </div>
          <a href="/post-machinery" className="bg-white text-amber-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-50 transition-colors">Learn More</a>
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500">TM</span> {t("nav.browse")}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLoading ? "..." : `${displayedListings.length} ${t("status.available")}`}
          </p>
        </div>
      </header>

      {/* TRUST INDICATORS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8 bg-zinc-950 border border-zinc-900 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <div>
            <p className="text-xs text-zinc-400">Verified Sellers</p>
            <p className="text-sm font-bold text-white">100% ID Check</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-500 text-xl">🛡️</span>
          <div>
            <p className="text-xs text-zinc-400">Secure Escrow</p>
            <p className="text-sm font-bold text-white">Payment Protected</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-500 text-xl">📞</span>
          <div>
            <p className="text-xs text-zinc-400">24/7 Support</p>
            <p className="text-sm font-bold text-white">Dedicated Team</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-purple-500 text-xl">📊</span>
          <div>
            <p className="text-xs text-zinc-400">Market Insights</p>
            <p className="text-sm font-bold text-white">Real-time Pricing</p>
          </div>
        </div>
      </div>

      {/* MARKETPLACE STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8 bg-zinc-900/30 rounded-xl p-4 border border-zinc-800">
        <div className="text-center">
          <p className="text-2xl font-black text-white">{totalListings}</p>
          <p className="text-xs text-zinc-400">Total Listings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-green-400">{verifiedCount}</p>
          <p className="text-xs text-zinc-400">Verified Sellers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-amber-400">{avgPrice.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">Avg. Price (ETB)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 border-b border-zinc-900 pb-3">
            {t("actions.search")}
          </h3>

          {/* Search Term input */}
          <div>
            <TranslatedInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholderKey="placeholders.searchPlaceholder"
              labelKey="actions.search"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <TranslatedSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholderKey="placeholders.selectCategory"
              labelKey="placeholders.selectCategory"
              enableOther={true}
              otherValue={otherCategorySpecification}
              onOtherChange={setOtherCategorySpecification}
              otherPlaceholderKey="placeholders.searchPlaceholder"
              options={[
                { value: "excavator", labelKey: "categories.excavator" },
                { value: "loader", labelKey: "categories.loader" },
                { value: "dozer", labelKey: "categories.dozer" },
                { value: "crane", labelKey: "categories.crane" },
                { value: "grader", labelKey: "categories.grader" },
                { value: "roller", labelKey: "categories.roller" },
                { value: "dumpTruck", labelKey: "categories.dumpTruck" },
                { value: "generator", labelKey: "categories.generator" },
                { value: "backhoe", labelKey: "categories.backhoe" }
              ]}
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <TranslatedSelect
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholderKey="placeholders.selectLocation"
              labelKey="labels.location"
              enableOther={true}
              otherValue={otherLocationSpecification}
              onOtherChange={setOtherLocationSpecification}
              otherPlaceholderKey="placeholders.selectLocation"
              options={Object.keys(localizedLocations).map((key) => ({
                value: key,
                label: localizedLocations[key][currentLanguage] || localizedLocations[key]["en"]
              }))}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {t("actions.sell")}
            </span>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {(["all", "rent", "sale"] as const).map((type) => {
                let labelKey: any = "actions.filterAll";
                if (type === "rent") labelKey = "actions.filterRent";
                if (type === "sale") labelKey = "actions.filterBuy";

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRentFilter(type)}
                    className={`py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                      rentFilter === type
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t(labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <TranslatedInput
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholderKey="placeholders.priceMax"
              labelKey="placeholders.priceMax"
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
              <p className="text-zinc-400 text-sm font-semibold">
                No active machinery found matches your selected filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedListings.map((item) => {
                const translatedCategory = t(`categories.${item.categoryToken}` as any);
                const localizedCity = item.locationToken ? (localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"]) : "N/A";
                const currencyFormatter = new Intl.NumberFormat("en-US", { style: "decimal" });
                const displayPrice = item.isRentalOnly ? item.priceRentalDaily : item.priceSale;

                return (
                  <article
                    key={item.id}
                    className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-200"
                  >
                    {/* Visual Imagery Mock Container - Dynamically loads user image if present */}
                    <div className="relative h-48 bg-zinc-900 flex items-center justify-center border-b border-zinc-900 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.brand}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to text template if image load fails
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            {translatedCategory}
                          </span>
                          <span className="block text-lg font-black text-zinc-300">
                            {item.brand}
                          </span>
                        </div>
                      )}

                      {/* Trust Verification Badge */}
                      {item.verified && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest z-10">
                          {t("status.verified")}
                        </span>
                      )}

                      {/* Transaction Intent Badge */}
                      <span className="absolute top-3 right-3 bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-wider border border-zinc-800 z-10">
                        {item.isRentalOnly ? t("actions.rent") : t("actions.buy")}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-bold text-white">
                            {item.title}
                          </h4>
                          <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.modelYear}
                          </span>
                        </div>

                        {/* Localized Metadata Fields */}
                        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-zinc-400 border-t border-b border-zinc-900 py-3 my-3">
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.location")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {localizedCity}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.workingHours")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {item.engineHours || "N/A"} Hrs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Contact Unlock Button */}
                      <div className="mt-2">
                        <div className="mb-3">
                          <span className="text-xs text-zinc-500 block uppercase font-bold">
                            {item.isRentalOnly ? t("labels.dailyRate") : t("labels.salePrice")}
                          </span>
                          <span className="text-xl font-black text-white tracking-tight">
                            {displayPrice ? currencyFormatter.format(displayPrice) : "0"} <span className="text-sm font-bold text-zinc-400">ETB</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUnlockContact(item)}
                          className="w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          🔓 Unlock Opportunity (ETB 500)
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* OPPORTUNITY UNLOCK MODAL */}
      {showUnlockModal && selectedListingForUnlock && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl">

            {modalView === "loading" && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
              </div>
            )}

            {modalView === "needs_login" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Sign in to unlock this opportunity</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Create a free TM account or log in to submit your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot;.
                </p>
                <a
                  href="/login"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Log In / Sign Up
                </a>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full mt-4 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {(modalView === "form" || modalView === "submitting" || modalView === "rejected") && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Unlock This Opportunity</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Pay <strong className="text-amber-400">ETB 500</strong> to unlock &quot;{selectedListingForUnlock.title}&quot;.
                  This confirms your serious interest — TM will then personally facilitate the introduction
                  and release the seller&apos;s direct contact once verification and communication are complete.
                  It is not an instant contact reveal.
                </p>

                {modalView === "rejected" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-xs text-red-300">
                    Your previous payment submission was rejected{existingUnlock?.admin_notes ? `: ${existingUnlock.admin_notes}` : "."} Please submit valid payment details below.
                  </div>
                )}

                {submitError && (
                  <p className="text-red-400 text-xs mb-3">{submitError}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="telebirr">Telebirr</option>
                      <option value="cbe">CBE Birr</option>
                      <option value="chapa">Chapa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Payment Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TB123456789"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Receipt Screenshot (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={modalView === "submitting"}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {modalView === "submitting" ? "Submitting..." : "Submit Payment for Review"}
                </button>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full mt-3 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {modalView === "submitted" && (
              <>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Payment Submitted</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Thank you. Your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot; is now under review by
                  the TM team. Once confirmed, TM will personally facilitate an introduction between you and the
                  seller and release direct contact details.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "pending_review" && (
              <>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Payment Under Review</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot; is being reviewed by the TM
                  team. You&apos;ll be notified once it&apos;s confirmed and TM begins facilitating the introduction.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "awaiting_facilitation" && (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">TM Is Facilitating Your Introduction</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Your payment for &quot;{selectedListingForUnlock.title}&quot; is confirmed. The TM team is now
                  personally verifying and facilitating the introduction with the seller. Direct contact details
                  will be released here once that process is complete.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "released" && (
              <>
                <h3 className="text-xl font-bold text-green-400 mb-2">✓ Contact Released</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  TM has completed facilitation for &quot;{selectedListingForUnlock.title}&quot;. Seller contact
                  information:
                </p>
                <div className="bg-zinc-900 p-4 rounded-lg mb-4">
                  <p className="text-white font-semibold text-sm">{releasedContact?.name || "TM Verified Seller"}</p>
                  <p className="text-zinc-300 font-mono text-sm mt-1">{releasedContact?.phone || "Contact via TM"}</p>
                </div>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

'@
Write-TmFile "src/components/system/TMUniversalMarketplace.tsx" $f5

$f6 = @'
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
        location
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
        verified: true,
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
Write-TmFile "src/lib/db/machinery/search.ts" $f6

$f7 = @'
export type { SupportedLanguage } from "@/translations/keys";

export interface LocalizedListing {
  id: string;
  brand: string;
  model: string;
  categoryToken: string;
  modelYear: number;
  serialNumber: string;
  title: string;
  description: string;
  priceSale: number | null;
  priceRentalDaily: number | null;
  isRentalOnly: boolean;
  status: string;
  engineHours: number;
  locationToken: string;
  verified: boolean;
  imageUrl: string | null;
  ownerId: string | null;
  ownerName: string;
  ownerPhone: string;
}

'@
Write-TmFile "src/types/index.ts" $f7

$f8 = @'
"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/context/LanguageContext";
import TMLogo from "@/components/TMLogo";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();
  
  const marketplace = [
    { label: t("browse") || "Browse Machinery",     href: "/browse" },
    { label: t("requests") || "Post a Request",     href: "/post-request" },
    { label: t("services.jobs") || "Jobs",          href: "/jobs" },
    { label: t("nav.tenders") || "Tenders",                                   href: "/tenders" },
    { label: t("services.logistics") || "Transport", href: "/transport" },
    { label: t("services.spareParts") || "Spare Parts", href: "/spare-parts" },
    { label: t("services.escrow") || "Escrow",               href: "/escrow" },
  ];

  const company = [
    { label: t("nav.about") || "About TM",     href: "/about" },
    { label: t("nav.contact") || "Contact Us",   href: "/contact" },
    { label: t("nav.pricing") || "Pricing",      href: "/pricing" },
  ];

  const account = [
    { label: t("auth.login") || "Login",              href: "/login" },
    { label: t("footer.register") || "Sign Up",       href: "/register" },
    { label: t("dashboard") || "Dashboard",           href: "/dashboard" },
    { label: "List Machinery",                             href: "/post-machinery" },
    { label: "Seller Verification", href: "/seller/verify" },
  ];

  return (
    <footer style={{ backgroundColor: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            className="py-16 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <TMLogo size={48} />
              <div>
                <div className="text-white font-black text-sm font-noto-ethio">ታማኝ ማሽነሪ</div>
                <div className="text-blue-300 text-[9px] font-bold uppercase tracking-widest">
                  Trustworthy Machinery
                </div>
              </div>
            </Link>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-6">
              {t("footerDescription") || "Ethiopia's trusted heavy machinery marketplace — buy, sell, rent and operate."}
            </p>
            <div className="space-y-2 text-xs text-blue-300/60">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-blue-400 shrink-0" /> Addis Ababa, Ethiopia
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-blue-400 shrink-0" /> +251 911 000 000
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-blue-400 shrink-0" /> info@trustworthymachinery.com
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe size={12} className="text-blue-400" /> Marketplace
            </h4>
            <ul className="space-y-3">
              {marketplace.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">
              Account
            </h4>
            <ul className="space-y-3">
              {account.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { code: "EN", label: "English" },
            { code: "አማ", label: "አማርኛ" },
            { code: "OM", label: "Afaan Oromoo" },
            { code: "TI", label: "ትግርኛ" },
            { code: "SO", label: "Soomaali" },
          ].map((lang) => (
            <span key={lang.code}
              className="px-3 py-1 rounded-full text-[9px] font-black uppercase
                         border border-white/10 text-blue-300/60">
              {lang.code} · {lang.label}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between
                        items-center gap-4 text-[9px] text-blue-300/40 uppercase tracking-widest">
          <span>© 2026 Trustworthy Machinery (TM) · ታማኝ ማሽነሪ</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>Security: AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'@
Write-TmFile "src/components/Footer.tsx" $f8

$f9 = @'
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

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
          ታማኝ ማሽነሪ — TM
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500 mb-6">Last updated: July 2026 · Effective for users in Ethiopia and abroad</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200 leading-relaxed">
          <strong className="text-amber-300">Draft notice:</strong> This policy is a working draft prepared to reflect Ethiopia&apos;s
          Personal Data Protection Proclamation No. 1321/2024 and general international privacy practice. It is not a substitute for
          advice from an Ethiopian-licensed attorney, and Trustworthy Machinery (TM) should have it formally reviewed before treating
          it as final and binding.
        </div>

        <Section title="1. Who We Are">
          <p>
            Trustworthy Machinery (&quot;TM,&quot; &quot;we,&quot; &quot;us&quot;) operates a heavy machinery matchmaking marketplace
            connecting machinery owners, renters, operators, mechanics, transporters, and industrial businesses across Ethiopia and
            East Africa. TM is the data controller for personal data processed through this platform, as defined under the Personal
            Data Protection Proclamation No. 1321/2024 (the &quot;Proclamation&quot;).
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Account data:</strong> full name, phone number, email address, password (hashed), preferred language, user role (owner, renter, operator, mechanic, transporter, buyer).</li>
            <li><strong>Verification (KYC) data:</strong> identity documents, business registration details, and other information submitted for seller/agency verification.</li>
            <li><strong>Listing and transaction data:</strong> machinery details, pricing, deployment location, escrow and payment records, communications between users conducted through the platform.</li>
            <li><strong>Technical data:</strong> IP address, device and browser information, and usage data collected automatically when you use the platform.</li>
          </ul>
        </Section>

        <Section title="3. Legal Basis and Purpose of Processing">
          <p>
            We process personal data on the basis of your consent, the necessity of processing to perform our contract with you
            (matching, listings, escrow, communication), compliance with legal obligations (including KYC/anti-fraud checks), and our
            legitimate interest in operating and securing the platform — consistent with the lawful-processing principles set out in
            the Proclamation.
          </p>
        </Section>

        <Section title="4. Data Storage and Cross-Border Transfer">
          <p>
            In line with the data localization requirements of the Proclamation, personal data collected from users in Ethiopia is
            stored on servers located within Ethiopia where required, or with providers maintaining adequate safeguards. Where data
            must be transferred outside Ethiopia (for example, to a cloud infrastructure provider), we do so only where the receiving
            country offers adequate protection, where you have given explicit informed consent, where the transfer is necessary to
            perform our contract with you, or as otherwise permitted under the Proclamation.
          </p>
        </Section>

        <Section title="5. Your Rights as a Data Subject">
          <p>Under the Proclamation, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Be informed about how your personal data is processed;</li>
            <li>Access the personal data we hold about you;</li>
            <li>Request correction of inaccurate or incomplete data;</li>
            <li>Request erasure of your data, subject to legal retention requirements;</li>
            <li>Restrict or object to certain processing, including direct marketing;</li>
            <li>Receive your data in a portable format; and</li>
            <li>Lodge a complaint with the Ethiopian Communications Authority (ECA), the supervisory authority designated under the Proclamation.</li>
          </ul>
          <p>To exercise these rights, contact us using the details in Section 11.</p>
        </Section>

        <Section title="6. Data Sharing">
          <p>
            We share personal data with other users only as necessary to facilitate a listing, rental, sale, or service booking. For
            &quot;Unlock Opportunity&quot; requests, payment does not itself release a seller&apos;s contact details: TM first
            verifies the payment, then personally facilitates an introduction between buyer and seller, and only then releases
            direct contact information as a distinct step. We may also share data with payment and escrow processors, verification
            providers, and law enforcement or regulatory authorities where legally required. We do not sell personal data to third
            parties for their own marketing purposes.
          </p>
        </Section>

        <Section title="7. Data Security and Breach Notification">
          <p>
            We apply technical and organizational safeguards appropriate to the sensitivity of the data we hold, including encryption
            in transit and access controls. In the event of a data breach likely to result in risk to your rights, we will notify the
            ECA and affected users within the timeframe required under the Proclamation (currently 72 hours from becoming aware of the
            breach).
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes described in this policy, to comply with our
            legal and tax obligations, and to resolve disputes. KYC verification records may be retained for a longer period where
            required by anti-fraud or regulatory obligations.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            TM is intended for use by individuals and businesses aged 18 and above. We do not knowingly collect personal data from
            minors.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this policy from time to time to reflect changes in our practices or in Ethiopian law, including further
            implementing regulations issued under the Proclamation. Material changes will be posted on this page with an updated
            effective date.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            For privacy inquiries or to exercise your data subject rights, contact us at{" "}
            <a href="mailto:machinerymatchmaker@gmail.com" className="text-amber-400 hover:text-amber-300">
              machinerymatchmaker@gmail.com
            </a>{" "}
            or +251 911 000 000. You may also lodge a complaint directly with the Ethiopian Communications Authority.
          </p>
        </Section>
      </section>
    </div>
  );
}
'@
Write-TmFile "src/app/privacy/page.tsx" $f9

Write-Host ""
Write-Host "All 9 files written (UTF-8, no BOM). Run: git status" -ForegroundColor Green

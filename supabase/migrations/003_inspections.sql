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

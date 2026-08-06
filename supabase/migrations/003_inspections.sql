-- ============================================================================
-- TM: VERIFIED INSPECTION SERVICE — migration 003
-- Run in Supabase SQL Editor after 002_opportunity_unlocks.sql
--
-- Adds the paid inspection/verification product described in
-- TM_Verified_Inspection_Service_Spec.md. Reuses the same patterns already
-- proven in 002 (RLS checking role in ('ADMIN','admin') — not just 'ADMIN',
-- which was the exact bug fixed on commission_settings/deals earlier).
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
create table if not exists public.inspections (
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
    select 1 from pg_constraint where conname = 'inspections_status_check'
  ) then
    alter table public.inspections
      add constraint inspections_status_check
      check (status in ('pending_review','payment_rejected','payment_approved','scheduled','completed','published'));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'inspections_tier_check'
  ) then
    alter table public.inspections
      add constraint inspections_tier_check
      check (tier in ('basic','standard','premium'));
  end if;
end $$;

create index if not exists idx_inspections_status on public.inspections(status, created_at desc);
create index if not exists idx_inspections_listing on public.inspections(listing_id);
create index if not exists idx_inspections_requester on public.inspections(requested_by);

-- 2. ROW LEVEL SECURITY -------------------------------------------------------
alter table public.inspections enable row level security;

drop policy if exists "requester reads own inspections" on public.inspections;
create policy "requester reads own inspections" on public.inspections
  for select using (auth.uid() = requested_by);

drop policy if exists "requester creates own inspection request" on public.inspections;
create policy "requester creates own inspection request" on public.inspections
  for insert with check (auth.uid() = requested_by);

drop policy if exists "admin full access on inspections" on public.inspections;
create policy "admin full access on inspections" on public.inspections
  for all using (
    auth.uid() in (select id from public.profiles where role in ('ADMIN','admin'))
  );

-- Public can read published, passing reports (for displaying the badge/report
-- link on a listing to any visitor, not just the person who paid for it).
drop policy if exists "public reads published inspections" on public.inspections;
create policy "public reads published inspections" on public.inspections
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

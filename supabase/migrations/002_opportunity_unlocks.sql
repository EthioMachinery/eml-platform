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

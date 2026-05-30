-- =====================================
-- EML PRODUCTION SUPABASE BACKBONE
-- Run in Supabase SQL Editor
-- =====================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =====================================
-- profiles
-- =====================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  role text default 'buyer',
  verified boolean default false,
  language text default 'en',
  -- PRIORITY 6: TRUST LAYER & PLATFORM METRICS
  trust_score numeric(5,2) default 75.00,
  rating_avg numeric(3,2) default 0.00,
  total_deals int default 0,
  created_at timestamptz default now()
);

-- =====================================
-- machinery listings
-- =====================================
create table if not exists public.machinery (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text,
  type text,
  brand text,
  city text,
  region text,
  condition text,
  year int,
  price numeric default 0,
  rent_price numeric default 0,
  for_sale boolean default true,
  for_rent boolean default false,
  description text,
  image_url text,
  verified boolean default false,
  boosted boolean default false,
  status text default 'active',
  views int default 0,
  created_at timestamptz default now()
);

-- =====================================
-- service requests
-- =====================================
create table if not exists public.requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  category text,
  title text,
  city text,
  budget numeric default 0,
  details text,
  status text default 'open',
  created_at timestamptz default now()
);

-- =====================================
-- supplier quotes / bids
-- =====================================
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.requests(id) on delete cascade,
  supplier_id uuid references public.profiles(id) on delete set null,
  amount numeric default 0,
  eta text,
  note text,
  status text default 'active',
  created_at timestamptz default now()
);

-- =====================================
-- PRIORITY 3: DEALS / ESCROW INFRASTRUCTURE
-- =====================================
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  deal_code varchar(50) unique not null,
  deal_type varchar(30) not null,
  machinery_id uuid references public.machinery(id) on delete set null,
  buyer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,
  commission_rate numeric(5,2) not null,
  commission_amount numeric(15,2) not null,
  seller_receives numeric(15,2) not null,
  gross_amount numeric(15,2) not null,
  currency varchar(10) default 'ETB' not null,
  escrow_enabled boolean default false not null,
  is_completed boolean default false not null,
  is_cancelled boolean default false not null,
  payment_verified boolean default false not null,
  delivery_confirmed boolean default false not null,
  dispute_active boolean default false not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================
-- wallet
-- =====================================
create table if not exists public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text,
  amount numeric default 0,
  note text,
  status text default 'completed',
  created_at timestamptz default now()
);

-- =====================================
-- PRIORITY 1: GLOBAL TRANSACTION & FINANCIAL TRACKING BEDROCK
-- =====================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete set null,
  wallet_transaction_id uuid,
  payment_method varchar(50) not null,
  payment_reference varchar(100) unique,
  status varchar(30) default 'PENDING' not null,
  amount numeric(15,2) not null,
  currency varchar(10) default 'ETB' not null,
  verified_by uuid references public.profiles(id),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================
-- PRIORITY 1: CORE REVENUE & PLATFORM EARNINGS LEDGER
-- =====================================
create table if not exists public.revenue (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete set null,
  revenue_source varchar(50) not null,
  gross_collected numeric(15,2) not null,
  platform_net numeric(15,2) not null,
  tax_withheld numeric(15,2) default 0.00 not null,
  currency varchar(10) default 'ETB' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================
-- PRIORITY 5: COMMISSION SETTINGS & ADMIN ENGINE SEED
-- =====================================
create table if not exists public.commission_settings (
  id uuid primary key default gen_random_uuid(),
  machinery_sales_rate numeric(5,2) default 2.50,
  machinery_rental_rate numeric(5,2) default 5.00,
  transport_matching_rate numeric(5,2) default 3.00,
  spare_parts_rate numeric(5,2) default 8.00,
  escrow_fee_rate numeric(5,2) default 1.00,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.commission_settings (machinery_sales_rate, machinery_rental_rate, transport_matching_rate, spare_parts_rate, escrow_fee_rate)
values (2.50, 5.00, 3.00, 8.00, 1.00)
on conflict do nothing;

-- =====================================
-- PRIORITY 2: AI DECISION MEMORY STORAGE
-- =====================================
create table if not exists public.ai_decision_memory (
  id uuid primary key default gen_random_uuid(),
  engine_name varchar(50) not null,
  context_type varchar(50) not null,
  reference_id uuid,
  inputs jsonb default '{}'::jsonb not null,
  outputs jsonb default '{}'::jsonb not null,
  confidence_score numeric(5,2) not null,
  feedback_rating int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================
-- PRIORITY 4: EVENT INFRASTRUCTURE & OPERATIONAL OBSERVABILITY
-- =====================================
create table if not exists public.eml_events (
  id uuid primary key default gen_random_uuid(),
  event_name varchar(100) not null,
  actor_id uuid references public.profiles(id) on delete set null,
  payload jsonb default '{}'::jsonb not null,
  severity varchar(20) default 'INFO' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================
-- messages
-- =====================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  text text,
  read boolean default false,
  created_at timestamptz default now()
);

-- =====================================
-- notifications
-- =====================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  body text,
  -- compatibility with some API paths that write {content,type}
  content text,
  type text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

-- =====================================
-- reviews
-- =====================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete cascade,
  rating int default 5,
  comment text,
  created_at timestamptz default now()
);

-- =====================================
-- referrals
-- =====================================
create table if not exists public.referrals (
  id uuid primary key default uuid_generate_v4(),
  inviter_id uuid references public.profiles(id) on delete cascade,
  invited_id uuid references public.profiles(id) on delete cascade,
  reward numeric default 0,
  created_at timestamptz default now()
);

-- =====================================
-- subscriptions
-- =====================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan text,
  price numeric default 0,
  status text default 'active',
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- =====================================
-- saved searches
-- =====================================
create table if not exists public.saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  keyword text,
  city text,
  category text,
  max_price numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================================
-- ENTERPRISE COMPATIBILITY LAYER (non-destructive)
-- These additions align the SQL backbone with current TypeScript runtime
-- writes (transactionEngine.ts, revenue.ts, dealengine.ts, learningEngine.ts).
-- =====================================================================

-- ---- transactions: expected insert shape includes buyer/seller/machinery totals + metadata
alter table public.transactions
  add column if not exists buyer_id uuid references public.profiles(id) on delete set null,
  add column if not exists seller_id uuid references public.profiles(id) on delete set null,
  add column if not exists machinery_id uuid references public.machinery(id) on delete set null,
  add column if not exists service_id uuid,
  add column if not exists request_id uuid references public.requests(id) on delete set null,
  add column if not exists total_amount numeric(15,2),
  add column if not exists commission_amount numeric(15,2),
  add column if not exists seller_receives numeric(15,2),
  add column if not exists transaction_type text,
  add column if not exists payment_status text,
  add column if not exists notes text,
  add column if not exists metadata jsonb default '{}'::jsonb;

create index if not exists idx_transactions_deal_id on public.transactions(deal_id);
create index if not exists idx_transactions_buyer_id on public.transactions(buyer_id);
create index if not exists idx_transactions_seller_id on public.transactions(seller_id);
create index if not exists idx_transactions_type_status on public.transactions(transaction_type, status);

-- ---- revenue: some codepaths insert (transaction_id, amount, source)
alter table public.revenue
  add column if not exists amount numeric(15,2),
  add column if not exists source text;

create index if not exists idx_revenue_transaction_id on public.revenue(transaction_id);
create index if not exists idx_revenue_source_created on public.revenue(source, created_at desc);

-- ---- eml_earnings: commission ledger (lib/revenue.ts)
create table if not exists public.eml_earnings (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade,
  category text not null,
  gross_amount numeric(15,2) not null,
  commission_percent numeric(8,4) not null,
  commission_amount numeric(15,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_eml_earnings_tx_id on public.eml_earnings(transaction_id);
create index if not exists idx_eml_earnings_category_created on public.eml_earnings(category, created_at desc);

-- ---- commission_settings: runtime expects per-category rows
alter table public.commission_settings
  add column if not exists category text,
  add column if not exists commission_percent numeric(8,4);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'commission_settings_category_unique'
  ) then
    alter table public.commission_settings
      add constraint commission_settings_category_unique unique (category);
  end if;
end $$;

insert into public.commission_settings (category, commission_percent)
values
  ('machinery_sale', 3.0),
  ('machinery_rental', 5.0),
  ('transport_booking', 8.0),
  ('transport_service', 8.0),
  ('operator_service', 7.0),
  ('mechanic_service', 7.0),
  ('insurance', 10.0),
  ('financing', 12.0),
  ('parts_purchase', 6.0),
  ('boosted_listing', 15.0),
  ('premium_listing', 15.0),
  ('featured_listing', 15.0),
  ('subscription', 10.0),
  ('verification', 5.0),
  ('advertisement', 15.0),
  ('other', 5.0)
on conflict (category) do update
set commission_percent = excluded.commission_percent;

create index if not exists idx_commission_settings_category on public.commission_settings(category);

-- ---- ai_decision_memory: runtime learning engine writes (deal_id, decision, risk, score, outcome, timestamp)
alter table public.ai_decision_memory
  add column if not exists deal_id uuid references public.deals(id) on delete set null,
  add column if not exists decision text,
  add column if not exists risk text,
  add column if not exists score int,
  add column if not exists outcome text,
  add column if not exists timestamp bigint;

create index if not exists idx_ai_decision_memory_deal_id on public.ai_decision_memory(deal_id);
create index if not exists idx_ai_decision_memory_outcome on public.ai_decision_memory(outcome);

-- ---- eml_events: core engines insert (type,title,description,entity_id,metadata)
alter table public.eml_events
  add column if not exists type text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists entity_id uuid,
  add column if not exists metadata jsonb default '{}'::jsonb;

create index if not exists idx_eml_events_type_created on public.eml_events(type, created_at desc);
create index if not exists idx_eml_events_entity_id on public.eml_events(entity_id);

-- ---- deals: keep current enterprise columns; add compatibility fields used in older codepaths
alter table public.deals
  add column if not exists request_id uuid references public.requests(id) on delete set null,
  add column if not exists amount numeric(15,2),
  add column if not exists fee numeric(15,2),
  add column if not exists status text,
  add column if not exists payment_status text,
  add column if not exists title text,
  add column if not exists description text;

create index if not exists idx_deals_buyer_id on public.deals(buyer_id);
create index if not exists idx_deals_seller_id on public.deals(seller_id);
create index if not exists idx_deals_type on public.deals(deal_type);

-- ---- supporting runtime tables referenced by APIs/libs
create table if not exists public.premium_users (
  id uuid primary key references public.profiles(id) on delete cascade,
  plan text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  -- compatibility with app/api/manual-payments/route.ts
  payer_name text,
  reference_no text,
  payment_method text,
  amount numeric(15,2) not null,
  reference text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  -- compatibility with app/api/payments/route.ts
  payer_id uuid references public.profiles(id) on delete set null,
  commission numeric(15,2),
  idempotency_key text,
  amount numeric(15,2) not null,
  method text,
  reference text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- idempotency (safe): prevents duplicate payments submissions
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'payments_idempotency_unique'
  ) then
    alter table public.payments
      add constraint payments_idempotency_unique unique (idempotency_key);
  end if;
end $$;

-- transactions idempotency (safe): prevents double charging on retries
alter table public.transactions
  add column if not exists idempotency_key text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'transactions_idempotency_unique'
  ) then
    alter table public.transactions
      add constraint transactions_idempotency_unique unique (idempotency_key);
  end if;
end $$;

-- basic financial invariants (added as NOT VALID to avoid breaking existing rows)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'transactions_amounts_non_negative') then
    alter table public.transactions
      add constraint transactions_amounts_non_negative
      check (
        (total_amount is null or total_amount >= 0) and
        (commission_amount is null or commission_amount >= 0) and
        (seller_receives is null or seller_receives >= 0)
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'transactions_sum_invariant') then
    alter table public.transactions
      add constraint transactions_sum_invariant
      check (
        total_amount is null or commission_amount is null or seller_receives is null
        or abs(total_amount - (commission_amount + seller_receives)) < 0.01
      ) not valid;
  end if;
end $$;

create table if not exists public.provider_notifications (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.profiles(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete set null,
  target_id uuid references public.profiles(id) on delete set null,
  machinery_id uuid references public.machinery(id) on delete set null,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.deal_events (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete cascade,
  type text not null,
  note text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.revenue_records (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete cascade,
  amount numeric(15,2) not null,
  type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.automation_logs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.automation_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.deal_scores (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals(id) on delete cascade,
  score int,
  risk text,
  signal text,
  adjusted_price numeric(15,2),
  confidence numeric(8,4),
  created_at timestamptz default now()
);

-- ---- basic integrity constraints (added only if missing)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_rating_range') then
    alter table public.reviews
      add constraint reviews_rating_range check (rating >= 1 and rating <= 5);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check check (
        role in ('buyer','seller','operator','mechanic','transporter','insurer','supplier','admin','ADMIN')
      );
  end if;
end $$;

-- =====================================
-- indexes
-- =====================================
create index if not exists idx_machinery_city on public.machinery(city);
create index if not exists idx_machinery_created on public.machinery(created_at desc);
create index if not exists idx_requests_city on public.requests(city);
create index if not exists idx_quotes_request on public.quotes(request_id);
create index if not exists idx_messages_receiver on public.messages(receiver_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_ai_memory_engine_ref on public.ai_decision_memory (engine_name, reference_id);
create index if not exists idx_eml_events_name_created on public.eml_events (event_name, created_at desc);

-- =====================================
-- RLS ENABLE
-- =====================================
alter table public.profiles enable row level security;
alter table public.machinery enable row level security;
alter table public.requests enable row level security;
alter table public.quotes enable row level security;
alter table public.deals enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.referrals enable row level security;
alter table public.subscriptions enable row level security;
alter table public.saved_searches enable row level security;
alter table public.commission_settings enable row level security;
alter table public.transactions enable row level security;
alter table public.revenue enable row level security;
alter table public.eml_earnings enable row level security;
alter table public.ai_decision_memory enable row level security;
alter table public.eml_events enable row level security;
alter table public.premium_users enable row level security;
alter table public.payment_requests enable row level security;
alter table public.payments enable row level security;
alter table public.provider_notifications enable row level security;
alter table public.contact_requests enable row level security;
alter table public.deal_events enable row level security;
alter table public.revenue_records enable row level security;
alter table public.automation_logs enable row level security;
alter table public.automation_events enable row level security;
alter table public.deal_scores enable row level security;

-- =====================================
-- basic open read policies
-- =====================================
create policy "public read machinery" on public.machinery for select using (true);
create policy "public read requests" on public.requests for select using (true);
create policy "public read reviews" on public.reviews for select using (true);
create policy "Users can read commission settings" on public.commission_settings for select to authenticated using (true);
create policy "Users can read their own earnings" on public.eml_earnings for select using (transaction_id in (select id from public.transactions where buyer_id = auth.uid() or seller_id = auth.uid()));
create policy "Users can read their own revenue rows" on public.revenue for select using (transaction_id in (select id from public.transactions where buyer_id = auth.uid() or seller_id = auth.uid()));
create policy "Users can read their own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can read their own payment requests" on public.payment_requests for select using (auth.uid() = user_id);
create policy "Users can read their provider notifications" on public.provider_notifications for select using (auth.uid() = provider_id);
create policy "Users can read their contact requests" on public.contact_requests for select using (auth.uid() = sender_id or auth.uid() = target_id);
create policy "Users can read deal events of their deals" on public.deal_events for select using (deal_id in (select id from public.deals where buyer_id = auth.uid() or seller_id = auth.uid()));
create policy "Users can read revenue records of their deals" on public.revenue_records for select using (deal_id in (select id from public.deals where buyer_id = auth.uid() or seller_id = auth.uid()));
create policy "Users can read their own premium status" on public.premium_users for select using (auth.uid() = id);
create policy "Users can read their own deal scores" on public.deal_scores for select using (deal_id in (select id from public.deals where buyer_id = auth.uid() or seller_id = auth.uid()));

-- =====================================
-- own insert/update/select policies
-- =====================================
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own machinery" on public.machinery for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own requests" on public.requests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own saved searches" on public.saved_searches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "own wallet" on public.wallet_transactions for select using (auth.uid() = user_id);
create policy "own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can view their own deals" on public.deals for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Users can view their own transactions" on public.transactions for select using (deal_id in (select id from public.deals where buyer_id = auth.uid() or seller_id = auth.uid()));
create policy "Users can insert their own payment requests" on public.payment_requests for insert with check (auth.uid() = user_id);
create policy "Users can insert their own contact requests" on public.contact_requests for insert with check (auth.uid() = sender_id);

-- =====================================
-- admin specialized access policies
-- =====================================
create policy "Admin full access on commission settings" on public.commission_settings for all using (auth.uid() in (select id from public.profiles where role = 'ADMIN'));
create policy "Admin full access on AI memory" on public.ai_decision_memory for all using (auth.uid() in (select id from public.profiles where role = 'ADMIN'));
-- IMPORTANT: do not leave eml_events open-write in production.
-- Allow service role (backend) to write; users can read their own rows via existing policies.
drop policy if exists "System full access on events" on public.eml_events;
create policy "Service role write events"
on public.eml_events for insert
to authenticated
with check (auth.role() = 'service_role');
create policy "Admin full access on transactions" on public.transactions for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on revenue" on public.revenue for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on earnings" on public.eml_earnings for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on payments" on public.payments for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on payment requests" on public.payment_requests for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on provider notifications" on public.provider_notifications for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on deal events" on public.deal_events for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on revenue records" on public.revenue_records for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on automation logs" on public.automation_logs for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on automation events" on public.automation_events for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));
create policy "Admin full access on deal scores" on public.deal_scores for all using (auth.uid() in (select id from public.profiles where role in ('ADMIN','admin')));

-- =====================================
-- auto profile create
-- =====================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles(id, role, trust_score, rating_avg, total_deals)
  values (new.id, 'buyer', 75.00, 0.00, 0);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
-- ==========================================
-- EML SAFE MIGRATION SCRIPT
-- For Existing Supabase Database
-- Non-destructive / upgrade style
-- ==========================================

create extension if not exists "uuid-ossp";

-- ==========================================
-- MACHINERY TABLE UPGRADES
-- ==========================================
alter table if exists machinery
add column if not exists user_id uuid,
add column if not exists category text,
add column if not exists type text,
add column if not exists brand text,
add column if not exists city text,
add column if not exists region text,
add column if not exists condition text,
add column if not exists year int,
add column if not exists price numeric default 0,
add column if not exists rent_price numeric default 0,
add column if not exists for_sale boolean default true,
add column if not exists for_rent boolean default false,
add column if not exists description text,
add column if not exists image_url text,
add column if not exists verified boolean default false,
add column if not exists boosted boolean default false,
add column if not exists status text default 'active',
add column if not exists views int default 0,
add column if not exists created_at timestamptz default now();

-- ==========================================
-- PROFILES
-- ==========================================
create table if not exists profiles (
  id uuid primary key,
  full_name text,
  phone text,
  city text,
  role text default 'buyer',
  verified boolean default false,
  language text default 'en',
  created_at timestamptz default now()
);

-- ==========================================
-- REQUESTS
-- ==========================================
create table if not exists requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  category text,
  title text,
  city text,
  budget numeric default 0,
  details text,
  status text default 'open',
  created_at timestamptz default now()
);

alter table if exists requests
add column if not exists city text,
add column if not exists budget numeric default 0,
add column if not exists status text default 'open',
add column if not exists created_at timestamptz default now();

-- ==========================================
-- QUOTES
-- ==========================================
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid,
  supplier_id uuid,
  amount numeric default 0,
  eta text,
  note text,
  status text default 'active',
  created_at timestamptz default now()
);

-- ==========================================
-- DEALS / ESCROW
-- ==========================================
create table if not exists deals (
  id uuid primary key default uuid_generate_v4(),
  machine_id uuid,
  request_id uuid,
  buyer_id uuid,
  seller_id uuid,
  amount numeric default 0,
  fee numeric default 0,
  status text default 'funding',
  payment_status text default 'pending',
  created_at timestamptz default now()
);

-- ==========================================
-- WALLET
-- ==========================================
create table if not exists wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  type text,
  amount numeric default 0,
  note text,
  status text default 'completed',
  created_at timestamptz default now()
);

-- ==========================================
-- MESSAGES
-- ==========================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid,
  receiver_id uuid,
  text text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  title text,
  body text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ==========================================
-- REVIEWS
-- ==========================================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid,
  target_user_id uuid,
  rating int default 5,
  comment text,
  created_at timestamptz default now()
);

-- ==========================================
-- REFERRALS
-- ==========================================
create table if not exists referrals (
  id uuid primary key default uuid_generate_v4(),
  inviter_id uuid,
  invited_id uuid,
  reward numeric default 0,
  created_at timestamptz default now()
);

-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  plan text,
  price numeric default 0,
  status text default 'active',
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ==========================================
-- SAVED SEARCHES
-- ==========================================
create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  keyword text,
  city text,
  category text,
  max_price numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ==========================================
-- SAFE INDEXES
-- ==========================================
create index if not exists idx_machinery_city on machinery(city);
create index if not exists idx_machinery_created on machinery(created_at desc);
create index if not exists idx_requests_city on requests(city);
create index if not exists idx_quotes_request on quotes(request_id);
create index if not exists idx_messages_receiver on messages(receiver_id);
create index if not exists idx_notifications_user on notifications(user_id);

-- ==========================================
-- ENABLE RLS
-- ==========================================
alter table profiles enable row level security;
alter table machinery enable row level security;
alter table requests enable row level security;
alter table quotes enable row level security;
alter table deals enable row level security;
alter table wallet_transactions enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;
alter table referrals enable row level security;
alter table subscriptions enable row level security;
alter table saved_searches enable row level security;

-- =====================================================================
-- COMPATIBILITY ENGINE ADDITIONS (Syncing with active TypeScript queries)
-- =====================================================================

-- ---- profiles updates
alter table profiles
  add column if not exists phone_number text,
  add column if not exists primary_role text default 'buyer',
  add column if not exists is_verified boolean default false;

-- ---- listings table
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null,
  brand text,
  model text,
  category_token text,
  model_year int,
  serial_number text,
  title_am text,
  title_en text,
  description_am text,
  description_en text,
  localized_title jsonb default '{}'::jsonb,
  localized_description jsonb default '{}'::jsonb,
  price numeric default 0,
  price_sale numeric default 0,
  price_rental_daily numeric default 0,
  is_rental_only boolean default false,
  status text default 'active',
  image_url text,
  created_at timestamptz default now()
);

alter table listings enable row level security;
create policy "public read listings" on listings for select using (true);
create policy "own listings" on listings for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ---- tenders table
create table if not exists tenders (
  id uuid primary key default gen_random_uuid(),
  project_agency text,
  category text,
  location_token text,
  estimated_budget numeric default 0,
  deadline_date timestamptz,
  verified boolean default false,
  localized_title jsonb default '{}'::jsonb,
  localized_scope jsonb default '{}'::jsonb,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table tenders enable row level security;
create policy "public read tenders" on tenders for select using (true);

-- ---- jobs table
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  budget numeric default 0,
  duration text,
  created_at timestamptz default now()
);

alter table jobs enable row level security;
create policy "public read jobs" on jobs for select using (true);

-- ---- service_providers table
create table if not exists service_providers (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  city text,
  region text,
  category text,
  created_at timestamptz default now()
);

alter table service_providers enable row level security;
create policy "public read service_providers" on service_providers for select using (true);

-- ---- spare_parts table
create table if not exists spare_parts (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  price numeric default 0,
  category text,
  created_at timestamptz default now()
);

alter table spare_parts enable row level security;
create policy "public read spare_parts" on spare_parts for select using (true);

-- ---- transporters table
create table if not exists transporters (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  type text,
  capacity text,
  created_at timestamptz default now()
);

alter table transporters enable row level security;
create policy "public read transporters" on transporters for select using (true);

-- ---- finance_products table
create table if not exists finance_products (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  rate numeric default 0,
  term text,
  created_at timestamptz default now()
);

alter table finance_products enable row level security;
create policy "public read finance_products" on finance_products for select using (true);

-- ==========================================
-- DONE
-- ==========================================
select 'EML migration completed successfully' as result;
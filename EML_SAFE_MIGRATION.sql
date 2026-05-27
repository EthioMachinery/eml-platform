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

-- ==========================================
-- DONE
-- ==========================================
select 'EML migration completed successfully' as result;
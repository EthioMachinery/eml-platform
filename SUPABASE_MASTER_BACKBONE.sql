-- =====================================
-- EML PRODUCTION SUPABASE BACKBONE
-- Run in Supabase SQL Editor
-- =====================================

create extension if not exists "uuid-ossp";

-- =====================================
-- profiles
-- =====================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  role text default 'buyer',
  verified boolean default false,
  language text default 'en',
  created_at timestamptz default now()
);

-- =====================================
-- machinery listings
-- =====================================
create table if not exists machinery (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
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
create table if not exists requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
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
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references requests(id) on delete cascade,
  supplier_id uuid references profiles(id) on delete set null,
  amount numeric default 0,
  eta text,
  note text,
  status text default 'active',
  created_at timestamptz default now()
);

-- =====================================
-- deals / escrow
-- =====================================
create table if not exists deals (
  id uuid primary key default uuid_generate_v4(),
  machine_id uuid references machinery(id) on delete set null,
  request_id uuid references requests(id) on delete set null,
  buyer_id uuid references profiles(id) on delete set null,
  seller_id uuid references profiles(id) on delete set null,
  amount numeric default 0,
  fee numeric default 0,
  status text default 'funding',
  payment_status text default 'pending',
  created_at timestamptz default now()
);

-- =====================================
-- wallet
-- =====================================
create table if not exists wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  type text,
  amount numeric default 0,
  note text,
  status text default 'completed',
  created_at timestamptz default now()
);

-- =====================================
-- messages
-- =====================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  text text,
  read boolean default false,
  created_at timestamptz default now()
);

-- =====================================
-- notifications
-- =====================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  body text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

-- =====================================
-- reviews
-- =====================================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references profiles(id) on delete set null,
  target_user_id uuid references profiles(id) on delete cascade,
  rating int default 5,
  comment text,
  created_at timestamptz default now()
);

-- =====================================
-- referrals
-- =====================================
create table if not exists referrals (
  id uuid primary key default uuid_generate_v4(),
  inviter_id uuid references profiles(id) on delete cascade,
  invited_id uuid references profiles(id) on delete cascade,
  reward numeric default 0,
  created_at timestamptz default now()
);

-- =====================================
-- subscriptions
-- =====================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan text,
  price numeric default 0,
  status text default 'active',
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- =====================================
-- saved searches
-- =====================================
create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  keyword text,
  city text,
  category text,
  max_price numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- =====================================
-- indexes
-- =====================================
create index if not exists idx_machinery_city on machinery(city);
create index if not exists idx_machinery_created on machinery(created_at desc);
create index if not exists idx_requests_city on requests(city);
create index if not exists idx_quotes_request on quotes(request_id);
create index if not exists idx_messages_receiver on messages(receiver_id);
create index if not exists idx_notifications_user on notifications(user_id);

-- =====================================
-- RLS ENABLE
-- =====================================
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

-- =====================================
-- basic open read policies
-- =====================================
create policy "public read machinery"
on machinery for select
using (true);

create policy "public read requests"
on requests for select
using (true);

create policy "public read reviews"
on reviews for select
using (true);

-- =====================================
-- own insert/update policies
-- =====================================
create policy "own profile"
on profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "own machinery"
on machinery for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "own requests"
on requests for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "own saved searches"
on saved_searches for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "own notifications"
on notifications for select
using (auth.uid() = user_id);

create policy "own wallet"
on wallet_transactions for select
using (auth.uid() = user_id);

create policy "own subscriptions"
on subscriptions for select
using (auth.uid() = user_id);

-- =====================================
-- auto profile create
-- =====================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles(id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
-- ========================
-- TM SAFE MIGRATION v2.0
-- Run in Supabase SQL Editor
-- All statements use IF NOT EXISTS / DO NOTHING to be safe
-- ========================

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(user_id, read);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "users_own_notifications" ON notifications;
CREATE POLICY "users_own_notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- TM_EVENTS TABLE (renamed from eml_events)
CREATE TABLE IF NOT EXISTS tm_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  actor_id UUID REFERENCES auth.users(id),
  entity_id UUID,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tm_events_event_name_idx ON tm_events(event_name);
CREATE INDEX IF NOT EXISTS tm_events_created_at_idx ON tm_events(created_at DESC);

-- MACHINERY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS machinery_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  budget NUMERIC,
  currency TEXT DEFAULT 'ETB',
  location TEXT,
  duration_days INTEGER,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE machinery_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "requests_public_read" ON machinery_requests;
CREATE POLICY "requests_public_read" ON machinery_requests FOR SELECT USING (status = 'open');

DROP POLICY IF EXISTS "requests_owner_all" ON machinery_requests;
CREATE POLICY "requests_owner_all" ON machinery_requests FOR ALL USING (auth.uid() = user_id);

-- INQUIRIES TABLE (if not exists)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  machinery_id UUID,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_owner_id_idx ON inquiries(owner_id);
CREATE INDEX IF NOT EXISTS inquiries_sender_id_idx ON inquiries(sender_id);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inquiries_participants" ON inquiries;
CREATE POLICY "inquiries_participants" ON inquiries FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = owner_id);

-- COMMISSION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_type TEXT NOT NULL UNIQUE,
  rate NUMERIC NOT NULL DEFAULT 0.05,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO commission_settings (deal_type, rate) VALUES
  ('PURCHASE', 0.025),
  ('RENTAL', 0.05),
  ('LEASE', 0.035)
ON CONFLICT (deal_type) DO NOTHING;

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  machinery_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reviewer_name TEXT,
  seller_name TEXT,
  machinery_title TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "reviews_auth_insert" ON reviews;
CREATE POLICY "reviews_auth_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);


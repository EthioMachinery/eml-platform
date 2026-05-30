// src/lib/supabase/adminClient.ts
// EML — Centralized Administrative Supabase Client
//
// This is the ONLY place the Service Role key is used in this project.
// Import this client in all /api/* route handlers.
//
// NEVER import this into client components or pages.
// The service role key bypasses all Row Level Security (RLS) policies.
// It must only be used in server-side route handlers.
//
// Usage:
//   import { supabaseAdmin } from '@/lib/supabase/adminClient';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Validate environment variables at module load time.
// If either variable is missing, the server will throw a clear error
// rather than silently failing with a cryptic Supabase error later.
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    '[EML] Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
    'Add it to your .env.local file.'
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    '[EML] Missing environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
    'Add it to your .env.local file.\n' +
    'NEVER expose this key to the browser or commit it to Git.'
  );
}

// ---------------------------------------------------------------------------
// Singleton pattern — create the client once, reuse it across all requests.
// Next.js hot-reloads modules in development, so we use a global cache
// to prevent creating a new client on every file change.
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseClient | undefined;
}

export const supabaseAdmin: SupabaseClient =
  globalThis._supabaseAdmin ??
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // Never persist or auto-refresh sessions in server-side clients.
      // The service role does not operate as a user session.
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis._supabaseAdmin = supabaseAdmin;
}
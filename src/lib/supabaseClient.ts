import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "The app cannot connect to the database without these. Check your .env.local or deployment environment settings."
  );
}

/**
 * This file is imported both by browser ("use client") components and by
 * server-side API route handlers (src/app/api/**), so it must work in both
 * environments:
 *
 * - In the browser: createBrowserClient from @supabase/ssr stores the
 *   session in cookies (readable by middleware.ts on every subsequent
 *   request) instead of localStorage, which is invisible to the server.
 *   This is what makes /dashboard, /admin, and /founder-admin correctly
 *   recognize a logged-in user instead of bouncing back to /login.
 * - On the server (API routes): createBrowserClient depends on
 *   `document`/`window`, which don't exist there, so we fall back to the
 *   plain @supabase/supabase-js client exactly as before. API routes in
 *   this project don't rely on supabase.auth session state from this
 *   client, so this fallback preserves their existing behavior unchanged.
 */
export const supabase =
  typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createClient(supabaseUrl, supabaseAnonKey);
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

declare global {
  // eslint-disable-next-line no-var
  var supabaseClient: any | undefined;
}

const supabaseClient =
  globalThis.supabaseClient ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

export const supabase = supabaseClient as any;

if (process.env.NODE_ENV !== "production") {
  globalThis.supabaseClient = supabaseClient;
}
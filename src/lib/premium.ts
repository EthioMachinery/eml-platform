import { supabase } from "@/lib/supabaseClient";

export async function isPremiumUser() {
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return false;

  const { data } = await supabase
    .from("premium_users")
    .select("premium_status, expires_at")
    .eq("user_id", auth.user.id)
    .eq("premium_status", "active")
    .maybeSingle();

  if (!data) return false;

  if (data.expires_at) {
    const exp = new Date(data.expires_at);
    if (exp < new Date()) return false;
  }

  return true;
}
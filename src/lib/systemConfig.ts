import { supabaseAdmin } from "./supabase/adminClient";

/**
 * Retrieves a system configuration value by key using the administrative client.
 * If not found or on error, returns the provided default value.
 * Note: This helper must only be used in server-side contexts (API routes, server components).
 */
export async function getSystemConfig(key: string, defaultValue: string): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_config")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) {
      return defaultValue;
    }
    return String(data.value);
  } catch (err) {
    console.error(`Error loading system config for ${key}:`, err);
    return defaultValue;
  }
}

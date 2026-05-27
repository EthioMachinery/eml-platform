import { supabase } from "./supabase";

/* =========================
   LISTINGS
========================= */

export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getFeaturedListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data || [];
}

export async function createListing(payload: any) {
  const { data, error } = await supabase
    .from("listings")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* =========================
   JOBS
========================= */

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createJob(payload: any) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* =========================
   SERVICES
========================= */

export async function getServices() {
  const { data, error } = await supabase
    .from("service_providers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/* =========================
   PARTS
========================= */

export async function getParts() {
  const { data, error } = await supabase
    .from("spare_parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/* =========================
   TRANSPORT
========================= */

export async function getTransporters() {
  const { data, error } = await supabase
    .from("transporters")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/* =========================
   FINANCE
========================= */

export async function getFinanceProducts() {
  const { data, error } = await supabase
    .from("finance_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/* =========================
   DASHBOARD
========================= */

export async function getDashboardStats() {
  const [
    listings,
    users,
    payments,
    requests,
  ] = await Promise.all([
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("*", { count: "exact", head: true }),
    supabase.from("requests").select("*", { count: "exact", head: true }),
  ]);

  return {
    listings: listings.count || 0,
    users: users.count || 0,
    payments: payments.count || 0,
    requests: requests.count || 0,
  };
}
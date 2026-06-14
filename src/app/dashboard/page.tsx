"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import { supabase } from "@/lib/supabaseClient";

type UserProfile = {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
};

type Listing = {
  id: string;
  brand: string;
  model: string;
  status: string;
  price_sale: number;
  price_rental_daily: number;
  is_rental_only: boolean;
  created_at: string;
};

type Request = {
  id: string;
  title: string;
  category: string;
  status: string;
  budget: number;
  created_at: string;
};

export default function DashboardPage() {
  const { t } = useTranslate();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "requests" | "profile">("listings");

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(profileData);

      const { data: listingsData } = await supabase
        .from("listings")
        .select("id, brand, model, status, price_sale, price_rental_daily, is_rental_only, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setListings(listingsData || []);

      const { data: requestsData } = await supabase
        .from("requests")
        .select("id, title, category, status, budget, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(requestsData || []);

      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
      verified_available: "bg-green-500/20 text-green-400 border-green-500/30",
      pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      suspended: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      closed: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
        {status?.replace(/_/g, " ")}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">

      {/* Header */}
      <div className="border-b border-zinc-900 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.is_admin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-lg uppercase tracking-wider transition-all"
              >
                ⚡ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg uppercase tracking-wider transition-all"
            >
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">My Listings</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{listings.length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">Active</p>
            <p className="text-3xl font-black text-green-400 mt-1">{listings.filter(l => l.status === "verified_available").length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">Pending</p>
            <p className="text-3xl font-black text-yellow-400 mt-1">{listings.filter(l => l.status === "pending_review").length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">My Requests</p>
            <p className="text-3xl font-black text-blue-400 mt-1">{requests.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/post-machinery" className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
            ➕ List Machinery
          </Link>
          <Link href="/post-request" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            📋 Post Request
          </Link>
          <Link href="/browse" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            🔍 Browse
          </Link>
          <Link href="/escrow" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            🔒 Escrow
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
          {(["listings", "requests", "profile"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "listings" ? "My Listings" : tab === "requests" ? "My Requests" : "Profile"}
            </button>
          ))}
        </div>

        {/* My Listings */}
        {activeTab === "listings" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                <p className="text-zinc-500 text-sm mb-4">You have no listings yet.</p>
                <Link href="/post-machinery" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                  List Your First Machine
                </Link>
              </div>
            ) : listings.map(l => (
              <div key={l.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-white">{l.brand} {l.model}</h4>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-zinc-500 text-xs">
                    {l.is_rental_only ? `ETB ${l.price_rental_daily?.toLocaleString()}/day` : `ETB ${l.price_sale?.toLocaleString()}`}
                    {" • "}{new Date(l.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/edit/${l.id}`}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* My Requests */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                <p className="text-zinc-500 text-sm mb-4">You have no sourcing requests yet.</p>
                <Link href="/post-request" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                  Post a Request
                </Link>
              </div>
            ) : requests.map(r => (
              <div key={r.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-white">{r.title}</h4>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-zinc-500 text-xs">
                  {r.category} • Budget: ETB {r.budget?.toLocaleString()} • {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 max-w-lg space-y-4">
            <h3 className="font-black text-white text-lg">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: "Full Name", value: profile?.full_name || "—" },
                { label: "Email", value: user?.email || "—" },
                { label: "Phone", value: profile?.phone || "—" },
                { label: "Role", value: profile?.role || "—" },
                { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—" },
                { label: "Account Type", value: profile?.is_premium ? "Premium" : "Standard" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-zinc-900 pb-3">
                  <span className="text-zinc-500 text-sm">{label}</span>
                  <span className="text-white text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
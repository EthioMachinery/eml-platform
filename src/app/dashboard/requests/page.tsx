"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Request = {
  id: string;
  title: string;
  category: string;
  city: string;
  budget: number;
  details: string;
  status: string;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    closed: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export default function DashboardRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("requests")
      .select("id, title, category, city, budget, details, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setRequests(data || []);
    setLoading(false);
  }

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">My Requests</h1>
            <p className="text-zinc-500 mt-2">Sourcing requests you've submitted</p>
          </div>

          <Link
            href="/post-request"
            className="px-6 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black inline-flex items-center text-sm uppercase tracking-wider transition-all"
          >
            Post a Request
          </Link>
        </div>

        {loading ? (
          <div className="text-zinc-500 font-bold">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <h2 className="text-2xl font-black text-white">No Requests Yet</h2>
            <p className="text-zinc-500 mt-3">Post a sourcing request to find machinery, operators, or transport.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-black text-white">{r.title}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-zinc-500 text-sm">
                  {r.category} • {r.city} • Budget: ETB {formatter.format(r.budget || 0)}
                </p>
                {r.details && (
                  <p className="text-zinc-400 text-sm mt-3">{r.details}</p>
                )}
                <p className="text-zinc-600 text-xs mt-3">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
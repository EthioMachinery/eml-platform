"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Wrench, MapPin, DollarSign, Clock, ArrowRight, Tag } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Request = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  currency: string;
  location: string;
  duration_days: number;
  status: string;
  created_at: string;
  profiles?: { full_name: string; is_verified: boolean };
};

const CATEGORIES = ["All", "Excavator", "Crane", "Bulldozer", "Loader", "Truck", "Generator", "Other"];

export default function BrowseRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("machinery_requests")
      .select("*, profiles(full_name, is_verified)")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50);
    setRequests(data || []);
    setLoading(false);
  }

  const visible = requests.filter(r => {
    const matchSearch = search === "" || `${r.title} ${r.category} ${r.location}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || r.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Machinery Requests</h1>
        <p className="text-zinc-500 text-sm">Browse open requests from buyers looking for machinery</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search requests..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
              category === cat ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-zinc-500 py-20">Loading requests...</div>
      ) : visible.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No open requests found.</p>
          <Link href="/post-request" className="inline-block mt-4 px-5 py-2 bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-emerald-500 transition">
            Post a Request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map(r => (
            <div key={r.id} className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-black text-sm group-hover:text-emerald-400 transition">{r.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                    <Tag size={10} /> {r.category}
                    {r.profiles?.is_verified && <span className="text-emerald-400 ml-1">✓ Verified</span>}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-600">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>

              {r.description && <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">{r.description}</p>}

              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  <DollarSign size={11} />
                  <span>{r.budget ? `${r.currency || "ETB"} ${r.budget.toLocaleString()}` : "Open"}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <MapPin size={11} />
                  <span className="truncate">{r.location || "Ethiopia"}</span>
                </div>
                {r.duration_days && (
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Clock size={11} />
                    <span>{r.duration_days}d</span>
                  </div>
                )}
              </div>

              <Link
                href={`/dashboard/inquiries?request=${r.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold uppercase rounded-xl transition"
              >
                Respond to Request <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Listing = {
  id: string;
  brand: string;
  model: string;
  title_en: string;
  location: string;
  city: string;
  image_url: string;
  status: string;
  price_sale: number;
  price_rental_daily: number;
  is_rental_only: boolean;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    verified_available: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    suspended: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("listings")
      .select("id, brand, model, title_en, location, city, image_url, status, price_sale, price_rental_daily, is_rental_only, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    setListings(data || []);
    setLoading(false);
  }

  async function deleteListing(id: string) {
    const confirmDelete = confirm("Delete this listing? This cannot be undone.");
    if (!confirmDelete) return;

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete listing: " + error.message);
    }
  }

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">My Listings</h1>
            <p className="text-zinc-500 mt-2">Manage your machinery marketplace listings</p>
          </div>

          <Link
            href="/post-machinery"
            className="px-6 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black inline-flex items-center text-sm uppercase tracking-wider transition-all"
          >
            Upload Machinery
          </Link>
        </div>

        {loading ? (
          <div className="text-zinc-500 font-bold">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <h2 className="text-2xl font-black text-white">No Listings Yet</h2>
            <p className="text-zinc-500 mt-3">Upload your first machinery listing to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div key={item.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">

                <div className="h-48 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title_en || item.brand} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">🚜</div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-black text-white">{item.brand} {item.model}</h2>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="text-xl font-black text-amber-500">
                    ETB {item.is_rental_only
                      ? `${formatter.format(item.price_rental_daily || 0)}/day`
                      : formatter.format(item.price_sale || 0)}
                  </div>

                  <div className="mt-2 text-zinc-500 text-sm">
                    📍 {item.city || item.location || "Location not set"}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      href={`/dashboard/edit/${item.id}`}
                      className="h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-2 text-xs font-bold uppercase transition-all"
                    >
                      <Pencil size={14} /> Edit
                    </Link>

                    <button
                      onClick={() => deleteListing(item.id)}
                      className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 text-xs font-bold uppercase transition-all"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Review = {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  seller_name: string;
  machinery_title: string;
  created_at: string;
  helpful_count: number;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [stats, setStats] = useState({ avg: 0, total: 0, dist: [0,0,0,0,0] });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    const r = data || [];
    setReviews(r);

    if (r.length > 0) {
      const avg = r.reduce((s: number, x: Review) => s + x.rating, 0) / r.length;
      const dist = [5,4,3,2,1].map(star => r.filter((x: Review) => x.rating === star).length);
      setStats({ avg: Math.round(avg * 10) / 10, total: r.length, dist });
    }
    setLoading(false);
  }

  const visible = filter ? reviews.filter(r => r.rating === filter) : reviews;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Platform Reviews</h1>
        <p className="text-zinc-500 text-sm">Real feedback from verified TM users</p>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 text-center">
            <div className="text-5xl font-black text-emerald-400">{stats.avg}</div>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} className={s <= Math.round(stats.avg) ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"} />
              ))}
            </div>
            <p className="text-zinc-500 text-xs">{stats.total} reviews</p>
          </div>
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-2">
            {[5,4,3,2,1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 w-3">{star}</span>
                <Star size={10} className="fill-yellow-400 text-yellow-400 shrink-0" />
                <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-yellow-400 h-full rounded-full"
                    style={{ width: stats.total ? `${(stats.dist[i] / stats.total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-zinc-500 w-4">{stats.dist[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter(null)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${!filter ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}>
          All
        </button>
        {[5,4,3,2,1].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === s ? "bg-yellow-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}>
            {s} <Star size={10} className="fill-current" />
          </button>
        ))}
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="text-center text-zinc-500 py-20">Loading reviews...</div>
      ) : visible.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(r => (
            <div key={r.id} className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"} />
                    ))}
                  </div>
                  <p className="font-bold text-sm">{r.reviewer_name || "Verified User"}</p>
                  {r.machinery_title && <p className="text-xs text-zinc-500 mt-0.5">{r.machinery_title}</p>}
                </div>
                <span className="text-xs text-zinc-600">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{r.comment}</p>
              {r.helpful_count > 0 && (
                <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-500">
                  <ThumbsUp size={12} /> {r.helpful_count} found helpful
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellerReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
      setLoading(false);
    });
  }, []);

  async function submitReview() {
    if (!userId) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from("seller_reviews")
      .insert([{ seller_id: params.id, reviewer_id: userId, rating, comment }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setDone(true);
      setComment("");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">Sign in to leave a review for this seller.</p>
          <a href="/login" className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            Review Seller
          </h1>

          <p className="text-zinc-500 mb-8 text-sm">Seller ID: {params.id}</p>

          {done && (
            <div className="mb-6 bg-green-600 rounded-xl px-4 py-3 font-bold">
              Review submitted successfully!
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-600/20 border border-red-600/40 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <label className="block mb-2 text-zinc-400">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-6 text-white"
          >
            <option value={5}>5 ★★★★★</option>
            <option value={4}>4 ★★★★</option>
            <option value={3}>3 ★★★</option>
            <option value={2}>2 ★★</option>
            <option value={1}>1 ★</option>
          </select>

          <label className="block mb-2 text-zinc-400">Comment</label>
          <textarea
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your experience with this seller..."
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-8 text-white"
          />

          <button
            onClick={submitReview}
            disabled={submitting || done}
            className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
          >
            {submitting ? "Submitting..." : done ? "Review Submitted" : "Submit Review"}
          </button>

        </div>
      </div>
    </main>
  );
}

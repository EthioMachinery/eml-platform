"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

export default function SellerReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const [lang, setLang] =
    useState<Lang>("en");

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [done, setDone] =
    useState(false);

  useEffect(() => {
    setLang(getLang());
  }, []);

  async function submitReview() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        lang === "am"
          ? "እባክዎ ይግቡ"
          : "Please sign in"
      );
      setLoading(false);
      return;
    }

    await supabase
      .from("seller_reviews")
      .insert([
        {
          seller_id:
            params.id,
          reviewer_id:
            user.id,
          rating,
          comment,
        },
      ]);

    setDone(true);
    setComment("");
    setLoading(false);
  }

  const isAm =
    lang === "am";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {isAm
              ? "ሻጭን ገምግም"
              : "Review Seller"}
          </h1>

          <p className="text-zinc-400 mb-8 break-all">
            Seller ID: {params.id}
          </p>

          {done && (
            <div className="mb-6 bg-green-600 rounded-xl px-4 py-3 font-bold">
              {isAm
                ? "ግምገማዎ ተልኳል"
                : "Review submitted"}
            </div>
          )}

          {/* Rating */}
          <label className="block mb-2 text-zinc-400">
            {isAm
              ? "ደረጃ"
              : "Rating"}
          </label>

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-6"
          >
            <option value={5}>
              5 ★★★★★
            </option>
            <option value={4}>
              4 ★★★★
            </option>
            <option value={3}>
              3 ★★★
            </option>
            <option value={2}>
              2 ★★
            </option>
            <option value={1}>
              1 ★
            </option>
          </select>

          {/* Comment */}
          <label className="block mb-2 text-zinc-400">
            {isAm
              ? "አስተያየት"
              : "Comment"}
          </label>

          <textarea
            rows={6}
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            placeholder={
              isAm
                ? "ልምድዎን ይጻፉ..."
                : "Write your experience..."
            }
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 mb-8"
          />

          <button
            onClick={
              submitReview
            }
            disabled={
              loading
            }
            className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold text-lg"
          >
            {loading
              ? isAm
                ? "በመላክ ላይ..."
                : "Submitting..."
              : isAm
              ? "ግምገማ ላክ"
              : "Submit Review"}
          </button>

        </div>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at?: string;
};

export default function UserReviews({
  listingId,
}: {
  listingId: string;
}) {
  const [lang] = useState<Lang>(getLang());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: string) => {
    const dict: Record<string, string> = {
      reviews:
        lang === "am"
          ? "ግምገማዎች"
          : "Reviews",
      noReviews:
        lang === "am"
          ? "ምንም ግምገማ የለም"
          : "No reviews yet",
    };

    return dict[key] || key;
  };

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    setReviews(data || []);
    setLoading(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
      <h3 className="text-yellow-400 mb-3 font-bold">
        {t("reviews")}
      </h3>

      {loading && (
        <p className="text-zinc-400">...</p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-zinc-500">
          {t("noReviews")}
        </p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-800 p-3 rounded-xl"
          >
            <p className="text-yellow-400">
              {"⭐".repeat(r.rating)}
            </p>
            <p className="text-white">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

export default function LeaveReview({ listingId }: { listingId: string }) {
  const [lang] = useState<Lang>(getLang());
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const t = (key: string) => {
    const dict: Record<string, string> = {
      submitting:
        lang === "am"
          ? "በመላክ ላይ..."
          : "Submitting...",
      success:
        lang === "am"
          ? "ተሳክቷል"
          : "Review submitted successfully",
      error:
        lang === "am"
          ? "ስህተት ተፈጥሯል"
          : "Something went wrong",
      submit:
        lang === "am"
          ? "ላክ"
          : "Submit Review",
    };

    return dict[key] || key;
  };

  const submitReview = async () => {
    if (!comment) return;

    setLoading(true);
    setMessage(t("submitting"));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(t("error"));
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          listing_id: listingId,
          user_id: user.id,
          rating,
          comment,
        },
      ]);

    setLoading(false);

    if (error) {
      setMessage(t("error"));
      return;
    }

    setMessage(t("success"));
    setComment("");
    setRating(5);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3">
      <h2 className="text-xl font-bold">
        {t("submit")}
      </h2>

      <select
        className="w-full p-2 bg-zinc-800 rounded"
        value={rating}
        onChange={(e) =>
          setRating(Number(e.target.value))
        }
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} ⭐
          </option>
        ))}
      </select>

      <textarea
        className="w-full p-2 bg-zinc-800 rounded"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-green-600 px-4 py-2 rounded font-bold w-full"
      >
        {loading ? "..." : t("submit")}
      </button>

      {message && (
        <p className="text-yellow-400 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
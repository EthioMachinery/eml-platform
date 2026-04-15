"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function LeaveReview({ targetUserId }: { targetUserId: string }) {

  const { t } = useLanguage();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {

    setLoading(true);
    setMessage(t.submitting);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage(t.loginRequired);
      setLoading(false);
      return;
    }

    // 🔥 INSERT REVIEW
    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          reviewer_id: user.id,
          target_user_id: targetUserId,
          rating,
          comment,
        },
      ]);

    if (error) {
      setMessage(t.errorPosting);
      setLoading(false);
      return;
    }

    // 🔥 UPDATE USER RATING (AGGREGATION)
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("target_user_id", targetUserId);

    const avg =
      reviews?.reduce((sum, r) => sum + r.rating, 0) /
      (reviews?.length || 1);

    await supabase
      .from("machinery")
      .update({
        rating: avg,
        total_reviews: reviews?.length || 0,
      })
      .eq("user_id", targetUserId);

    setMessage(t.successPost);
    setLoading(false);
    setComment("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded mt-4">

      <h3 className="text-yellow-400 mb-2">
        {t.leaveReview}
      </h3>

      <select
        value={rating}
        onChange={(e)=>setRating(Number(e.target.value))}
        className="w-full p-2 mb-3 text-black rounded"
      >
        {[5,4,3,2,1].map(n => (
          <option key={n} value={n}>
            {n} ⭐
          </option>
        ))}
      </select>

      <textarea
        placeholder={t.comment}
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
        className="w-full p-3 mb-3 rounded text-black"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-yellow-500 text-black py-2 rounded"
      >
        {loading ? t.posting : t.submit}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
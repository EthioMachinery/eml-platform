"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function UserReviews({ userId }: { userId: string }) {

  const { t } = useLanguage();

  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("target_user_id", userId)
        .order("created_at", { ascending: false });

      setReviews(data || []);
    };

    fetchReviews();
  }, [userId]);

  return (
    <div className="mt-6">

      <h3 className="text-yellow-400 mb-3">
        {t.reviews}
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-400">{t.noReviews}</p>
      ) : (
        <div className="space-y-3">

          {reviews.map((r) => (
            <div key={r.id} className="bg-gray-800 p-3 rounded">

              <p className="text-yellow-400">
                {"⭐".repeat(r.rating)}
              </p>

              {r.comment && (
                <p className="text-sm mt-1">{r.comment}</p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.created_at).toLocaleDateString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
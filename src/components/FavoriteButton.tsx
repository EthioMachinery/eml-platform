"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  machineryId: string;
};

export default function FavoriteButton({
  machineryId,
}: Props) {
  const [userId, setUserId] =
    useState<string | null>(null);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /* GET USER */

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);

      checkFavorite(user.id);
    }
  }

  /* CHECK FAVORITE */

  async function checkFavorite(
    uid: string
  ) {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", uid)
      .eq("machinery_id", machineryId)
      .single();

    if (data) {
      setIsFavorite(true);
    }
  }

  /* TOGGLE FAVORITE */

  async function toggleFavorite() {
    if (!userId) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        /* REMOVE FAVORITE */

        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq(
            "machinery_id",
            machineryId
          );

        if (error) {
          console.error(error);
        } else {
          setIsFavorite(false);
        }
      } else {
        /* ADD FAVORITE */

        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: userId,
            machinery_id: machineryId,
          });

        if (error) {
          console.error(error);
        } else {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`w-full py-4 rounded-xl font-bold transition-all duration-200 ${
        isFavorite
          ? "bg-red-600 hover:bg-red-500 text-white"
          : "bg-zinc-800 hover:bg-zinc-700 text-white"
      }`}
    >
      {loading
        ? "Loading..."
        : isFavorite
        ? "❤️ Saved"
        : "🤍 Save Machine"}
    </button>
  );
}
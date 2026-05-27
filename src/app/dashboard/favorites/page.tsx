"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const [favorites, setFavorites] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } =
      await supabase
        .from("favorites")
        .select(`
          id,
          machinery (
            *
          )
        `)
        .eq("user_id", user.id);

    if (error) {
      console.error(error);
    } else {
      setFavorites(data || []);
    }

    setLoading(false);
  }

  async function removeFavorite(
    favoriteId: string
  ) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);

    if (!error) {
      setFavorites((prev) =>
        prev.filter(
          (item) =>
            item.id !== favoriteId
        )
      );
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <h1 className="text-4xl font-bold mb-8">
        Saved Machinery
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-zinc-400">
          No saved machinery yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {favorites.map((fav) => {
            const item =
              fav.machinery;

            if (!item) return null;

            return (
              <div
                key={fav.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              >

                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-60 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-60 bg-zinc-800 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-5">

                  <h2 className="text-2xl font-bold mb-2">
                    {item.title}
                  </h2>

                  <p className="text-zinc-400 mb-4">
                    {item.location}
                  </p>

                  <p className="text-yellow-400 text-2xl font-bold mb-5">
                    {item.price}
                  </p>

                  <div className="flex gap-3">

                    <Link
                      href={`/machinery/${item.id}`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-center"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        removeFavorite(
                          fav.id
                        )
                      }
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
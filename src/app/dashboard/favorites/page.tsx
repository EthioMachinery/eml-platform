"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type FavoriteRow = {
  id: string;
  listings: {
    id: string;
    brand: string;
    model: string;
    title_en: string;
    city: string;
    location: string;
    image_url: string;
    price_sale: number;
    price_rental_daily: number;
    is_rental_only: boolean;
  } | null;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }

    setSignedIn(true);

    const { data, error } = await supabase
      .from("favorites")
      .select("id, listings!machinery_id(id, brand, model, title_en, city, location, image_url, price_sale, price_rental_daily, is_rental_only)")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
    } else {
      setFavorites((data as unknown as FavoriteRow[]) || []);
    }

    setLoading(false);
  }

  async function removeFavorite(favoriteId: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);

    if (!error) {
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
    }
  }

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Saved Machinery</h1>
        <p className="text-zinc-500 mb-8">Listings you've bookmarked for later</p>

        {loading ? (
          <div className="text-zinc-500 font-bold">Loading...</div>
        ) : signedIn === false ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center max-w-md">
            <p className="text-zinc-300 mb-5">Please sign in to view your saved machinery.</p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-sm uppercase tracking-wider transition-all"
            >
              Sign In
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <h2 className="text-2xl font-black text-white">No Saved Machinery Yet</h2>
            <p className="text-zinc-500 mt-3">Browse listings and tap the save icon to bookmark them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const item = fav.listings;
              if (!item) return null;

              return (
                <div key={fav.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title_en || item.brand} className="w-full h-56 object-cover" />
                  ) : (
                    <div className="w-full h-56 bg-zinc-900 flex items-center justify-center text-6xl">🚜</div>
                  )}

                  <div className="p-5">
                    <h2 className="text-xl font-black mb-1">{item.brand} {item.model}</h2>
                    <p className="text-zinc-500 text-sm mb-3">{item.city || item.location}</p>
                    <p className="text-amber-500 text-xl font-black mb-5">
                      ETB {item.is_rental_only
                        ? `${formatter.format(item.price_rental_daily || 0)}/day`
                        : formatter.format(item.price_sale || 0)}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/machinery/${item.id}`}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-center text-sm uppercase"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-sm uppercase"
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
    </main>
  );
}
"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  Pencil,
  Trash2,
  Crown,
  Eye,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

type Machinery = {
  id: string;
  title: string;
  price: string;
  image_url: string;
  location: string;
  created_at: string;
  views: number;
  is_boosted: boolean;
  boost_level: number;
  boost_expires_at: string;
};

export default function ListingsPage() {
  const [listings, setListings] =
    useState<Machinery[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("machinery")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setListings(data || []);

    setLoading(false);
  }

  async function deleteListing(
    id: string
  ) {
    const confirmDelete =
      confirm(
        "Delete this listing?"
      );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("machinery")
      .delete()
      .eq("id", id);

    if (!error) {
      setListings((prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
      );
    }
  }

  async function boostListing(
    id: string
  ) {
    const expiryDate =
      new Date();

    expiryDate.setDate(
      expiryDate.getDate() + 7
    );

    const { error } = await supabase
      .from("machinery")
      .update({
        is_boosted: true,
        boost_level: 1,
        boost_expires_at:
          expiryDate.toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      alert(
        "Listing boosted successfully for 7 days."
      );

      loadListings();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-wrap gap-4 items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-black text-slate-900">
              My Listings
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your machinery marketplace listings
            </p>

          </div>

          <Link
            href="/upload"
            className="px-8 h-14 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black inline-flex items-center"
          >
            Upload Machinery
          </Link>

        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="text-2xl font-black text-blue-700">
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl border p-16 text-center">

            <h2 className="text-3xl font-black">
              No Listings Yet
            </h2>

            <p className="text-gray-500 mt-4">
              Upload your first machinery listing.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {listings.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm ${
                  item.is_boosted
                    ? "border-yellow-400 shadow-yellow-100 shadow-2xl"
                    : ""
                }`}
              >

                {/* IMAGE */}

                <div className="h-56 bg-slate-100 relative overflow-hidden">

                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={700}
                      height={500}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">
                      🚜
                    </div>
                  )}

                  {/* BOOSTED */}

                  {item.is_boosted && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black text-xs font-black shadow-xl">

                      <Crown size={14} />

                      BOOSTED

                    </div>
                  )}

                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <h2 className="text-2xl font-black leading-snug">
                    {item.title}
                  </h2>

                  <div className="mt-4 text-3xl font-black text-blue-700">
                    {item.price}
                  </div>

                  <div className="mt-4 text-gray-500">
                    📍 {item.location}
                  </div>

                  {/* STATS */}

                  <div className="mt-6 flex items-center gap-4 text-gray-500">

                    <div className="inline-flex items-center gap-2">

                      <Eye size={18} />

                      {item.views || 0}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-8 grid grid-cols-3 gap-3">

                    {/* EDIT */}

                    <Link
                      href={`/dashboard/edit/${item.id}`}
                      className="h-12 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center"
                    >

                      <Pencil size={18} />

                    </Link>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        deleteListing(
                          item.id
                        )
                      }
                      className="h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                    {/* BOOST */}

                    <button
                      onClick={() =>
                        boostListing(
                          item.id
                        )
                      }
                      className={`h-12 rounded-2xl flex items-center justify-center ${
                        item.is_boosted
                          ? "bg-yellow-400 text-black"
                          : "bg-slate-900 text-white hover:bg-black"
                      }`}
                    >

                      <Crown
                        size={18}
                      />

                    </button>

                  </div>

                  {/* BOOST STATUS */}

                  {item.is_boosted &&
                    item.boost_expires_at && (
                      <div className="mt-5 text-sm text-yellow-700 font-bold">

                        Boost expires:{" "}

                        {new Date(
                          item.boost_expires_at
                        ).toLocaleDateString()}

                      </div>
                    )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}
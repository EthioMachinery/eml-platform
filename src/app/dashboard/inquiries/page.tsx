"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  message: string;
  created_at: string;
  machinery_id: string | null;
  sender_id: string | null;
  listing_title: string | null;
  sender_email: string | null;
};

export default function DashboardInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("inquiries")
      .select("id, message, created_at, machinery_id, sender_id, owner_id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("inquiries fetch error:", error);
      setLoading(false);
      return;
    }

    const rows = data || [];

    // Enrich each inquiry with listing title and sender info separately,
    // since inquiries has no direct FK embed to profiles or auth.users.
    const enriched: Inquiry[] = await Promise.all(
      rows.map(async (row) => {
        let listing_title: string | null = null;
        let sender_email: string | null = null;

        if (row.machinery_id) {
          const { data: listing } = await supabase
            .from("listings")
            .select("title, title_en")
            .eq("id", row.machinery_id)
            .maybeSingle();
          if (listing) {
            listing_title = listing.title_en || listing.title || null;
          }
        }

        if (row.sender_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone_number, phone")
            .eq("id", row.sender_id)
            .maybeSingle();
          if (profile) {
            sender_email = profile.full_name || profile.phone_number || profile.phone || "Unknown sender";
          }
        }

        return {
          id: row.id,
          message: row.message,
          created_at: row.created_at,
          machinery_id: row.machinery_id,
          sender_id: row.sender_id,
          listing_title,
          sender_email,
        };
      })
    );

    setInquiries(enriched);
    setLoading(false);
  }

  if (!userId && !loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">
            Sign in to view inquiries about your machinery listings.
          </p>
          <a href="/login" className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-black px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-4xl font-bold">Inquiry Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Manage customer inquiries for your machinery listings.
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20 text-zinc-400">
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No inquiries yet</h2>
            <p className="text-zinc-400">
              When customers contact you about your machinery, inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {inquiry.machinery_id ? (
                        
                          href={"/machinery/" + inquiry.machinery_id}
                          className="hover:text-yellow-400 transition"
                        >
                          {inquiry.listing_title || "Untitled listing"}
                        </a>
                      ) : (
                        <span className="text-zinc-400">Listing unavailable</span>
                      )}
                    </h2>
                    <p className="text-zinc-400 mt-1">
                      Received on {new Date(inquiry.created_at).toLocaleString()}
                    </p>
                  </div>

                  {inquiry.sender_email && (
                    <div className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3">
                      <p className="text-zinc-400 text-sm">From</p>
                      <p className="font-bold">{inquiry.sender_email}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                  <p className="text-zinc-400 text-sm mb-3">Message</p>
                  <p className="text-zinc-200 whitespace-pre-line leading-relaxed">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

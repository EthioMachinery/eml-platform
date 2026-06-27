"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Phone, MessageCircle, ShieldCheck, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Seller = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  phone_number: string | null;
  bio: string | null;
  verified: boolean | null;
  is_verified: boolean | null;
  created_at: string;
};

type ListingItem = {
  id: string;
  title: string | null;
  title_en: string | null;
  price: number | null;
  price_sale: number | null;
  image_url: string | null;
  city: string | null;
  category: string | null;
  is_rental_only: boolean;
};

export default function SellerProfilePage() {
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) loadSeller(params.id as string);
  }, [params]);

  async function loadSeller(id: string) {
    setLoading(true);

    const { data: sellerData } = await supabase
      .from("profiles")
      .select("id, full_name, company_name, city, region, phone, phone_number, bio, verified, is_verified, created_at")
      .eq("id", id)
      .maybeSingle();

    if (sellerData) {
      setSeller(sellerData);

      const { data: listingData } = await supabase
        .from("listings")
        .select("id, title, title_en, price, price_sale, image_url, city, category, is_rental_only")
        .eq("owner_id", id)
        .eq("status", "verified_available")
        .order("created_at", { ascending: false });

      setListings(listingData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading seller profile...</p>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-black">Seller Not Found</h1>
        <p className="text-zinc-400">This seller profile may have been removed or does not exist.</p>
        <a href="/browse" className="inline-flex px-8 h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black items-center font-black">Back to Marketplace</a>
      </main>
    );
  }

  const sellerName = seller.company_name || seller.full_name || "Seller";
  const phone = seller.phone_number || seller.phone || "";
  const isVerified = seller.is_verified || seller.verified || false;
  const joinedYear = seller.created_at ? new Date(seller.created_at).getFullYear() : "";
  const whatsappNumber = phone.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent("Hello " + sellerName + ", I found your profile on EML and I am interested in your machinery listings.")
    : "#";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 items-center">

            <div className="flex justify-center md:justify-start">
              <div className="w-36 h-36 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-6xl font-black text-yellow-400">
                {sellerName.charAt(0)}
              </div>
            </div>

            <div className="md:col-span-2 text-center md:text-left">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-5">
                {isVerified && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black">
                    <ShieldCheck size={16} /> Verified Seller
                  </div>
                )}
                {seller.company_name && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-black">
                    <Building2 size={16} /> Company Account
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">{sellerName}</h1>

              <div className="mt-4 flex flex-wrap gap-5 justify-center md:justify-start text-zinc-400 text-lg">
                {(seller.region || seller.city) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    {seller.region || ""}{seller.city ? (seller.region ? ", " : "") + seller.city : ""}
                  </div>
                )}
                {joinedYear && <div>Member since {joinedYear}</div>}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                {phone && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black inline-flex items-center gap-3 transition"><MessageCircle size={22} /> WhatsApp</a>
                )}
                {phone && (
                  <a href={"tel:" + phone} className="px-8 py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black inline-flex items-center gap-3 transition"><Phone size={22} /> Call Seller</a>
                )}
                <a href="/browse" className="px-8 py-4 rounded-2xl border border-zinc-700 font-bold hover:bg-zinc-800 transition">Browse Marketplace</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-5 max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center">
            <div className="text-4xl font-black text-yellow-400">{listings.length}</div>
            <div className="text-zinc-400 mt-2">Active Listings</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center">
            <div className="text-4xl font-black text-green-400">{isVerified ? "Yes" : "No"}</div>
            <div className="text-zinc-400 mt-2">Verified</div>
          </div>
        </div>
      </section>

      {seller.bio && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">About</h2>
            <p className="text-zinc-300 leading-8 whitespace-pre-line">{seller.bio}</p>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-black mb-8">Listings by {sellerName}</h2>

        {listings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
            No active listings at this time.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {listings.map((item) => {
              const title = item.title_en || item.title || "Untitled";
              const price = item.price_sale || item.price;
              return (
                <a key={item.id} href={"/machinery/" + item.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300">
                  <div className="h-56 bg-zinc-800 relative overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-4xl">🚜</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {item.category && <span className="text-xs font-bold bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">{item.category}</span>}
                      <span className="text-xs font-bold text-zinc-400">{item.is_rental_only ? "Rental" : "For Sale"}</span>
                    </div>
                    <h3 className="text-xl font-black mt-2 leading-snug">{title}</h3>
                    <div className="mt-3 text-2xl font-black text-yellow-400">
                      {price ? "ETB " + price.toLocaleString() : "Contact for price"}
                    </div>
                    {item.city && (
                      <div className="flex items-center gap-2 text-zinc-400 mt-3 text-sm">
                        <MapPin size={14} />{item.city}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Phone, MessageCircle, Banknote, MapPin,
  Calendar, Settings, User, ChevronRight,
  CheckCircle2, Clock3, Briefcase, Building2,
  Truck, Wrench, ShieldCheck, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ListingDetail = {
  id: string;
  title: string;
  title_en: string | null;
  title_am: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  model_year: number | null;
  city: string | null;
  location: string | null;
  price: number | null;
  price_sale: number | null;
  price_rental_daily: number | null;
  is_rental_only: boolean;
  description_en: string | null;
  description_am: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  owner_id: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
    phone_number: string | null;
    trust_score: number | null;
    verified: boolean | null;
    is_verified: boolean | null;
  } | null;
};

function formatPrice(amount: number): string {
  if (amount >= 1_000_000) return "ETB " + (amount / 1_000_000).toFixed(1) + "M";
  if (amount >= 1_000) return "ETB " + (amount / 1_000).toFixed(0) + "K";
  return "ETB " + amount.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return days + " days ago";
  if (days < 365) return Math.floor(days / 30) + " months ago";
  return Math.floor(days / 365) + " years ago";
}

export default function MachineryDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) fetchListing(params.id as string);
  }, [params]);

  async function fetchListing(id: string) {
    setLoading(true);
    const { data } = await supabase
      .from("listings")
      .select("id, title, title_en, title_am, category, brand, model, model_year, city, location, price, price_sale, price_rental_daily, is_rental_only, description_en, description_am, image_url, status, created_at, owner_id, profiles:owner_id (full_name, phone, phone_number, trust_score, verified, is_verified)")
      .eq("id", id)
      .maybeSingle();

    setListing(data as ListingDetail);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 rounded-xl bg-zinc-800" />
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="h-[520px] rounded-3xl bg-zinc-800" />
              <div className="space-y-6">
                <div className="h-6 w-1/3 rounded bg-zinc-800" />
                <div className="h-12 w-3/4 rounded bg-zinc-800" />
                <div className="h-16 w-1/2 rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <Truck size={64} className="text-zinc-700" />
        <h1 className="text-3xl font-black">Listing Not Found</h1>
        <p className="text-zinc-400">This listing may have been removed or does not exist.</p>
        <a href="/browse" className="rounded-xl bg-yellow-500 px-6 py-3 font-black text-black hover:bg-yellow-400">Back to Marketplace</a>
      </main>
    );
  }

  const seller = listing.profiles;
  const phone = seller?.phone_number || seller?.phone || "";
  const displayTitle = listing.title_en || listing.title || listing.title_am || "Untitled";
  const displayDescription = listing.description_en || "";
  const salePrice = listing.price_sale || listing.price;
  const isVerified = seller?.is_verified || seller?.verified || false;
  const whatsappUrl = phone
    ? "https://wa.me/" + phone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I am interested in your EML listing: " + displayTitle)
    : "#";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-10">

          <a href="/browse" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition font-bold"><ArrowLeft size={18} /> Back to Marketplace</a>

          <div className="grid lg:grid-cols-2 gap-10 items-start">

            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
              {listing.image_url ? (
                <Image src={listing.image_url} alt={displayTitle} width={1200} height={900} priority unoptimized className="w-full h-[520px] object-cover" />
              ) : (
                <div className="w-full h-[520px] flex items-center justify-center"><Truck size={96} className="text-zinc-700" /></div>
              )}
              <div className="absolute top-5 left-5 flex flex-wrap gap-3">
                {!listing.is_rental_only && <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black">FOR SALE</span>}
                {listing.price_rental_daily && <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-black">FOR RENT</span>}
                {isVerified && <span className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-black">VERIFIED</span>}
              </div>
              <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-black">{timeAgo(listing.created_at)}</div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                {listing.category && <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">{listing.category}</span>}
              </div>

              <h1 className="text-4xl lg:text-5xl font-black leading-tight">{displayTitle}</h1>
              {listing.brand && <p className="mt-2 text-xl text-zinc-400 font-bold">{listing.brand} {listing.model || ""}</p>}

              <div className="flex items-center gap-2 text-zinc-400 mt-4">
                <MapPin size={18} />
                <span>{listing.city || listing.location || "Ethiopia"}</span>
              </div>

              <div className="mt-8 space-y-2">
                {salePrice && salePrice > 0 && !listing.is_rental_only && (
                  <div>
                    <div className="text-zinc-500 text-sm mb-1">Sale Price</div>
                    <div className="text-5xl font-black text-yellow-400">{formatPrice(salePrice)}</div>
                  </div>
                )}
                {listing.price_rental_daily && listing.price_rental_daily > 0 && (
                  <div>
                    <div className="text-zinc-500 text-sm mb-1">Rental Rate</div>
                    <div className="text-3xl font-black text-blue-400">{formatPrice(listing.price_rental_daily)}/day</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {phone && (
                  <a href={"tel:" + phone} className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center gap-3 font-black text-base transition"><Phone size={20} /> Call Seller</a>
                )}
                {phone && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="h-14 rounded-2xl bg-green-600 hover:bg-green-500 flex items-center justify-center gap-3 font-black text-base transition"><MessageCircle size={20} /> WhatsApp</a>
                )}
                <a href={"/payment/" + listing.id} className="h-14 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/60 flex items-center justify-center gap-3 font-black text-base transition"><Banknote size={20} /> Secure Payment</a>
                <a href="/logistics" className="h-14 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/60 flex items-center justify-center gap-3 font-black text-base transition"><Truck size={20} /> Request Transport</a>
              </div>

              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-green-400" size={22} />
                  <div className="text-lg font-black">EML Trust & Verification</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[isVerified ? "Verified Seller" : "Seller Profile", "EML Protected", "Inspection Available", "Escrow Option"].map((label) => (
                    <div key={label} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                      <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                      <span className="text-sm font-bold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid xl:grid-cols-3 gap-10">

          <div className="xl:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="text-yellow-400" />
                <h2 className="text-2xl font-black">Machinery Specifications</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <SpecCard icon={Building2} label="Brand" value={listing.brand} />
                <SpecCard icon={Settings} label="Model" value={listing.model} />
                <SpecCard icon={Calendar} label="Year" value={listing.model_year?.toString()} />
                <SpecCard icon={MapPin} label="City" value={listing.city} />
                <SpecCard icon={Truck} label="Category" value={listing.category} />
                <SpecCard icon={Clock3} label="Listed" value={timeAgo(listing.created_at)} />
              </div>
            </div>

            {displayDescription && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-6">Description</h2>
                <p className="text-zinc-300 leading-9 whitespace-pre-line text-lg">{displayDescription}</p>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-2xl font-black mb-6">EML Connected Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ServiceCard icon={Truck} title="Transport Providers" href="/logistics" />
                <ServiceCard icon={Wrench} title="Mechanics" href="/mechanics" />
                <ServiceCard icon={Briefcase} title="Operators" href="/operators" />
                <ServiceCard icon={Banknote} title="Financing" href="/financing" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-yellow-400" />
                <h2 className="text-xl font-black">Seller Information</h2>
              </div>
              <div className="space-y-4">
                <SidebarInfo label="Name" value={seller?.full_name} />
                <SidebarInfo label="Phone" value={seller?.phone_number || seller?.phone} />
                <SidebarInfo label="Trust Score" value={seller?.trust_score ? seller.trust_score + "/100" : undefined} />
                {isVerified && (
                  <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                    <CheckCircle2 size={16} /> Identity Verified
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8">
              <div className="text-yellow-400 font-black tracking-widest mb-2 text-sm">EML FINANCE</div>
              <h3 className="text-2xl font-black mb-4">Need Financing?</h3>
              <p className="text-zinc-300 leading-8 mb-6 text-sm">Apply for machinery loans, leasing and installment payments through EML partner banks.</p>
              <a href="/financing" className="inline-flex items-center gap-2 text-yellow-400 font-black hover:gap-3 transition-all">Apply Now <ChevronRight size={18} /></a>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-xl font-black mb-3">Ready to Buy?</h3>
              <p className="text-zinc-400 text-sm leading-6 mb-6">Start a secure escrow-protected deal. Pay only when you are satisfied.</p>
              <a href={"/payment/" + listing.id} className="block w-full h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center font-black transition">Start Secure Deal</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SpecCard({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="text-yellow-400" />
        <div className="text-zinc-400 text-sm font-bold">{label}</div>
      </div>
      <div className="text-lg font-black">{value || "-"}</div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, href }: { icon: any; title: string; href: string }) {
  return (
    <a href={href} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500/40 transition flex items-center gap-4">
      <Icon size={22} className="text-yellow-400 flex-shrink-0" />
      <span className="font-black">{title}</span>
      <ChevronRight size={16} className="ml-auto text-zinc-600" />
    </a>
  );
}

function SidebarInfo({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className="font-bold text-lg">{value || "-"}</div>
    </div>
  );
}

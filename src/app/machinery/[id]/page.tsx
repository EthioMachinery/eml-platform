"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Phone, MessageCircle, Banknote, MapPin,
  Calendar, Settings, User, ChevronRight,
  CheckCircle2, Clock3, Briefcase, Building2,
  Truck, Wrench, ShieldCheck, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types — matched to live Supabase schema
// ---------------------------------------------------------------------------
type MachineryDetail = {
  id: string;
  title: string;
  category: string;
  type: string | null;
  brand: string | null;
  city: string;
  region: string | null;
  condition: string | null;
  year: number | null;
  price: number;
  rent_price: number | null;
  for_sale: boolean;
  for_rent: boolean;
  description: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    phone: string | null;
    trust_score: number | null;
    verified: boolean;
  } | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatPrice(amount: number): string {
  if (amount >= 1_000_000) return `ETB ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `ETB ${(amount / 1_000).toFixed(0)}K`;
  return `ETB ${amount.toLocaleString()}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MachineryDetailPage() {
  const params = useParams();
  const [machinery, setMachinery] = useState<MachineryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) fetchMachinery(params.id as string);
  }, [params]);

  async function fetchMachinery(id: string) {
    setLoading(true);
    const { data } = await supabase
      .from("machinery")
      .select(`
        id, title, category, type, brand, city, region,
        condition, year, price, rent_price, for_sale, for_rent,
        description, image_url, status, created_at, user_id,
        profiles:user_id (full_name, phone, trust_score, verified)
      `)
      .eq("id", id)
      .single();

    setMachinery(data as MachineryDetail);
    setLoading(false);
  }

  // --- Loading ---
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

  // --- Not found ---
  if (!machinery) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <Truck size={64} className="text-zinc-700" />
        <h1 className="text-3xl font-black">Machinery Not Found</h1>
        <p className="text-zinc-400">This listing may have been removed or does not exist.</p>
        <Link href="/browse" className="rounded-xl bg-yellow-500 px-6 py-3 font-black text-black hover:bg-yellow-400">
          Back to Marketplace
        </Link>
      </main>
    );
  }

  const seller = machinery.profiles;
  const phone = seller?.phone ?? "";
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I am interested in your EML listing: ${machinery.title}`)}`
    : "#";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ── HERO ── */}
      <section className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-10">

          {/* Back link */}
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition font-bold"
          >
            <ArrowLeft size={18} /> Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* IMAGE */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
              {machinery.image_url ? (
                <Image
                  src={machinery.image_url}
                  alt={machinery.title}
                  width={1200}
                  height={900}
                  priority
                  unoptimized
                  className="w-full h-[520px] object-cover"
                />
              ) : (
                <div className="w-full h-[520px] flex items-center justify-center">
                  <Truck size={96} className="text-zinc-700" />
                </div>
              )}

              <div className="absolute top-5 left-5 flex flex-wrap gap-3">
                {machinery.for_sale && (
                  <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black">FOR SALE</span>
                )}
                {machinery.for_rent && (
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-black">FOR RENT</span>
                )}
                {seller?.verified && (
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-black">VERIFIED</span>
                )}
              </div>

              <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-black">
                {timeAgo(machinery.created_at)}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">
                  {machinery.category}
                </span>
                {machinery.condition && (
                  <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-bold">
                    {machinery.condition}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-black leading-tight">{machinery.title}</h1>

              {machinery.brand && (
                <p className="mt-2 text-xl text-zinc-400 font-bold">{machinery.brand}</p>
              )}

              <div className="flex items-center gap-2 text-zinc-400 mt-4">
                <MapPin size={18} />
                <span>{machinery.city}{machinery.region ? `, ${machinery.region}` : ""}</span>
              </div>

              {/* PRICE */}
              <div className="mt-8 space-y-2">
                {machinery.for_sale && machinery.price > 0 && (
                  <div>
                    <div className="text-zinc-500 text-sm mb-1">Sale Price</div>
                    <div className="text-5xl font-black text-yellow-400">{formatPrice(machinery.price)}</div>
                  </div>
                )}
                {machinery.for_rent && machinery.rent_price && machinery.rent_price > 0 && (
                  <div>
                    <div className="text-zinc-500 text-sm mb-1">Rental Rate</div>
                    <div className="text-3xl font-black text-blue-400">{formatPrice(machinery.rent_price)}/day</div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center gap-3 font-black text-base transition"
                  >
                    <Phone size={20} /> Call Seller
                  </a>
                )}

                {phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 rounded-2xl bg-green-600 hover:bg-green-500 flex items-center justify-center gap-3 font-black text-base transition"
                  >
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                )}

                <Link
                  href={`/payment/${machinery.id}`}
                  className="h-14 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/60 flex items-center justify-center gap-3 font-black text-base transition"
                >
                  <Banknote size={20} /> Secure Payment
                </Link>

                <Link
                  href="/logistics"
                  className="h-14 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/60 flex items-center justify-center gap-3 font-black text-base transition"
                >
                  <Truck size={20} /> Request Transport
                </Link>
              </div>

              {/* TRUST BADGES */}
              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-green-400" size={22} />
                  <div className="text-lg font-black">EML Trust & Verification</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    seller?.verified ? "Verified Seller" : "Seller Profile",
                    "EML Protected",
                    "Inspection Available",
                    "Escrow Option",
                  ].map((label) => (
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

      {/* ── DETAILS ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid xl:grid-cols-3 gap-10">

          {/* LEFT COLUMN */}
          <div className="xl:col-span-2 space-y-8">

            {/* SPECIFICATIONS */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="text-yellow-400" />
                <h2 className="text-2xl font-black">Machinery Specifications</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <SpecCard icon={Building2} label="Brand"     value={machinery.brand} />
                <SpecCard icon={Settings}  label="Type"      value={machinery.type} />
                <SpecCard icon={Calendar}  label="Year"      value={machinery.year?.toString()} />
                <SpecCard icon={MapPin}    label="City"      value={machinery.city} />
                <SpecCard icon={Truck}     label="Condition" value={machinery.condition} />
                <SpecCard icon={Clock3}    label="Listed"    value={timeAgo(machinery.created_at)} />
              </div>
            </div>

            {/* DESCRIPTION */}
            {machinery.description && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-6">Description</h2>
                <p className="text-zinc-300 leading-9 whitespace-pre-line text-lg">
                  {machinery.description}
                </p>
              </div>
            )}

            {/* EML SERVICES */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-2xl font-black mb-6">EML Connected Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ServiceCard icon={Truck}    title="Transport Providers" href="/logistics" />
                <ServiceCard icon={Wrench}   title="Mechanics"           href="/mechanics" />
                <ServiceCard icon={Briefcase} title="Operators"          href="/operators" />
                <ServiceCard icon={Banknote} title="Financing"           href="/financing" />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* SELLER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-yellow-400" />
                <h2 className="text-xl font-black">Seller Information</h2>
              </div>
              <div className="space-y-4">
                <SidebarInfo label="Name"  value={seller?.full_name} />
                <SidebarInfo label="Phone" value={seller?.phone} />
                <SidebarInfo
                  label="Trust Score"
                  value={seller?.trust_score ? `${seller.trust_score}/100` : undefined}
                />
                {seller?.verified && (
                  <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                    <CheckCircle2 size={16} /> Identity Verified
                  </div>
                )}
              </div>
            </div>

            {/* FINANCING */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8">
              <div className="text-yellow-400 font-black tracking-widest mb-2 text-sm">EML FINANCE</div>
              <h3 className="text-2xl font-black mb-4">Need Financing?</h3>
              <p className="text-zinc-300 leading-8 mb-6 text-sm">
                Apply for machinery loans, leasing and installment payments through EML&apos;s partner banks.
              </p>
              <Link
                href="/financing"
                className="inline-flex items-center gap-2 text-yellow-400 font-black hover:gap-3 transition-all"
              >
                Apply Now <ChevronRight size={18} />
              </Link>
            </div>

            {/* START DEAL */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-xl font-black mb-3">Ready to Buy?</h3>
              <p className="text-zinc-400 text-sm leading-6 mb-6">
                Start a secure escrow-protected deal. Pay only when you are satisfied.
              </p>
              <Link
                href={`/payment/${machinery.id}`}
                className="block w-full h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center font-black transition"
              >
                Start Secure Deal
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SpecCard({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="text-yellow-400" />
        <div className="text-zinc-400 text-sm font-bold">{label}</div>
      </div>
      <div className="text-lg font-black">{value || "—"}</div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, href }: { icon: any; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500/40 transition flex items-center gap-4"
    >
      <Icon size={22} className="text-yellow-400 flex-shrink-0" />
      <span className="font-black">{title}</span>
      <ChevronRight size={16} className="ml-auto text-zinc-600" />
    </Link>
  );
}

function SidebarInfo({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className="font-bold text-lg">{value || "—"}</div>
    </div>
  );
}
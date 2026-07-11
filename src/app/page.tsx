"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Activity, Shield, Search, Truck,
  Wrench, ShieldCheck, TrendingUp, Users, Star,
  ChevronRight, Zap, Globe, Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { EMLCore } from "@/core/emlCore";
import { useI18n } from "@/context/LanguageContext";
import TMLogo from "@/components/TMLogo";

export default function HomePage() {
  const { t } = useI18n();
  const [pulse, setPulse] = useState<any>({ growthIndex: "0.00", averageTransactionValue: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchMarketPulse() {
      try {
        const { data: deals, error } = await supabase
          .from("machinery")
          .select("*")
          .eq("status", "active");
        if (!error && deals) setPulse(EMLCore.getPulse(deals));
      } catch (e) {
        console.error("PULSE_ERROR", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMarketPulse();
  }, []);

  const categories = [
    { label: t("categories.excavator") || "Excavators", icon: "🏗️", href: "/browse?category=excavator" },
    { label: t("categories.loader") || "Loaders",       icon: "🚜", href: "/browse?category=loader" },
    { label: t("categories.crane") || "Cranes",         icon: "🏛️", href: "/browse?category=crane" },
    { label: t("categories.dozer") || "Bulldozers",     icon: "🚧", href: "/browse?category=dozer" },
    { label: t("categories.dumpTruck") || "Dump Trucks",icon: "🚛", href: "/browse?category=dump_truck" },
    { label: t("categories.grader") || "Graders",       icon: "⚙️", href: "/browse?category=grader" },
    { label: t("categories.generator") || "Generators", icon: "⚡", href: "/browse?category=generator" },
    { label: t("categories.roller") || "Rollers",       icon: "🛞", href: "/browse?category=roller" },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: t("services.escrow") || "Secure Escrow",
      desc: t("financeInsuranceDesc") || t("feat.escrowDesc") || "Every transaction protected by our verified escrow system.",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: Search,
      title: t("machineryMarketplace") || "Smart Matching",
      desc: t("machineryMarketplaceDesc") || t("feat.matchDesc") || "AI-powered matching connects buyers with the right machinery instantly.",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      icon: Truck,
      title: t("transportLogistics") || "Transport & Logistics",
      desc: t("transportLogisticsDesc") || t("feat.transportDesc") || "Low-bed, high-bed and heavy haulage logistics across Ethiopia.",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: Wrench,
      title: t("mechanicsWorkshops") || "Maintenance & Repair",
      desc: t("mechanicsWorkshopsDesc") || t("feat.mechanicsDesc") || "Certified mechanics and workshops for industrial equipment.",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      icon: Globe,
      title: t("bilingualPlatform") || "Multilingual Platform",
      desc: t("ecosystemDescription") || t("feat.langDesc") || "Available in English, Amharic, Afaan Oromoo, Tigrinya and Somali.",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
    {
      icon: Lock,
      title: t("verifiedSellers") || "Verified Sellers",
      desc: t("sparePartsDesc") || "All sellers go through TM KYC verification before listing.",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  const stats = [
    { label: t("machineryListings") || "Machinery Listings", value: t("stats.growing") || "Launching",    icon: Activity },
    { label: t("verifiedSellers") || "Verified Sellers",     value: "KYC ✓",                              icon: ShieldCheck },
    { label: t("industrialUsers") || "Coverage",             value: t("stats.ethiopia") || "Ethiopia",    icon: Users },
    { label: t("secureTransactions") || "Secure Escrow",     value: t("stats.protected") || "Protected",  icon: Star },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#050d1a", color: "#ffffff" }}>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-24 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]
                          bg-blue-600/15 blur-[140px] rounded-full" />
        </div>

        {/* Logo above headline */}
        <div className="flex justify-center mb-6">
          <TMLogo size={96} className="drop-shadow-2xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30
                          text-blue-300 px-4 py-2 rounded-full text-xs font-bold uppercase
                          tracking-widest mb-6">
            <Zap size={12} className="text-blue-400" />
            {t("trustEcosystem") || "Ethiopia's #1 Machinery Marketplace"}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4
                         leading-tight uppercase text-white">
            {t("heroTitle") || "TRUSTWORTHY MACHINERY (TM)"}
          </h1>

          <p className="text-xl md:text-2xl font-black text-blue-300 mb-3 font-noto-ethio">
            ታማኝ ማሽነሪ
          </p>

          <p className="text-sm md:text-base text-blue-200/70 max-w-2xl mx-auto mb-10
                        leading-relaxed font-medium uppercase tracking-[0.15em]">
            {t("heroSubtitle") || "Building the Future of East African Industry."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/browse"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl
                         font-black uppercase text-sm transition-all flex items-center gap-2
                         shadow-xl shadow-blue-900/40 group"
            >
              <Search size={16} />
              {t("browse") || "Browse Machinery"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/post-machinery"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white
                         px-8 py-4 rounded-xl font-black uppercase text-sm transition-all
                         flex items-center gap-2"
            >
              {t("listMachinery") || "List Your Machinery"}
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-black uppercase
                         text-sm transition-all hover:bg-blue-100 flex items-center gap-2"
            >
              {t("getStarted") || "Get Started Free"}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick links row */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {[
              { label: t("services.jobs") || "Operators & Jobs", href: "/jobs" },
              { label: t("services.logistics") || "Transport", href: "/transport" },
              { label: t("services.spareParts") || "Spare Parts", href: "/spare-parts" },
              { label: t("services.inspection") || "Inspection", href: "/services" },
              { label: "Escrow", href: "/escrow" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 border border-white/10 text-blue-300 hover:text-white
                           hover:border-white/30 rounded-full font-bold transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 border-y border-white/10" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon size={20} className="text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
                <div className="text-[10px] text-blue-300/70 uppercase font-bold tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
              {t("categories.excavator") ? t("browse") : "Browse by Category"}
            </h2>
            <p className="text-blue-300/70 text-sm">
              {t("heroDescription") || "Find the right machinery for your project"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10
                           hover:border-blue-400/50 hover:bg-blue-600/10 transition-all group"
                style={{ backgroundColor: "#0a1628" }}
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-xs font-black uppercase text-white group-hover:text-blue-300 transition-colors text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
              {t("everythingIndustrialBusinessesNeed") || "Everything You Need"}
            </h2>
            <p className="text-blue-300/70 text-sm max-w-xl mx-auto">
              {t("ecosystemDescription") || "TM connects the entire machinery ecosystem in one trusted platform."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-white/10 hover:border-white/20
                             transition-all group"
                  style={{ backgroundColor: "#050d1a" }}
                >
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={f.color} />
                  </div>
                  <h3 className="font-black text-white uppercase text-sm mb-2">{f.title}</h3>
                  <p className="text-blue-300/70 text-xs leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MARKET PULSE ── */}
      <section className="py-10 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-blue-400/70 text-[9px] uppercase font-black tracking-[0.2em] mb-2 flex items-center gap-2">
              <Activity size={12} /> Market Velocity
            </div>
            <div className="text-2xl font-black tabular-nums text-white">
              {loading ? "..." : `${pulse?.growthIndex || "0.00"}%`}
            </div>
          </div>
          <div>
            <div className="text-blue-400/70 text-[9px] uppercase font-black tracking-[0.2em] mb-2">
              {t("labels.salePrice") || "Avg. Price"}
            </div>
            <div className="text-2xl font-black tabular-nums text-white">
              {loading ? "..." : Math.round(pulse?.averageTransactionValue || 3250000).toLocaleString()}
              <span className="text-[10px] text-blue-400/50 ml-1">ETB</span>
            </div>
          </div>
          <div>
            <div className="text-blue-400/70 text-[9px] uppercase font-black tracking-[0.2em] mb-2">
              Security
            </div>
            <div className="text-xl font-black uppercase flex items-center gap-2 text-white">
              <Shield size={18} className="text-blue-400" /> Layer 7
            </div>
          </div>
          <div>
            <div className="text-blue-400/70 text-[9px] uppercase font-black tracking-[0.2em] mb-2">
              Platform Version
            </div>
            <div className="text-2xl font-black font-mono text-white">
              v{EMLCore?.version ? EMLCore.version.split("-")[0] : "3.0.4"}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: "#0f2040" }}>
        <div className="max-w-3xl mx-auto">
          <TrendingUp size={40} className="text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4">
            {t("startSelling") || "Ready to Get Started?"}
          </h2>
          <p className="text-blue-300/70 mb-10 text-sm leading-relaxed">
            {t("footerDescription") || "Join thousands of machinery owners, contractors and operators on Ethiopia's most trusted platform."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-blue-900 px-10 py-4 rounded-xl font-black uppercase
                         text-sm hover:bg-blue-100 transition-all"
            >
              {t("auth.createAccount") || "Create Free Account"}
            </Link>
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black uppercase
                         text-sm hover:bg-blue-500 transition-all"
            >
              {t("browseMarketplace") || "Browse Marketplace"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

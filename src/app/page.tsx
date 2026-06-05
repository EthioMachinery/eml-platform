"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import PushNotificationEngine from "@/components/PushNotificationEngine";

interface StakeholderItem {
  key: "owners" | "renters" | "contractors" | "miners" | "farmers" | "investors" | "operators" | "mechanics" | "transporters" | "insurers" | "parts" | "fuel";
  emoji: string;
  colorClass: string;
}

interface RevenueModule {
  key: "escrow" | "jobs" | "tenders" | "logistics" | "spareParts" | "inspection";
  desc: string;
  emoji: string;
  link: string;
}

export default function HomePage() {
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState<"all" | "supply" | "demand">("all");

  // Representing emojis as safe unicode escapes to prevent terminal copy-paste corruption
  const supplyStakeholders: StakeholderItem[] = [
    { key: "owners", emoji: "\u{1F3D7}\u{FE0F}", colorClass: "border-amber-500/20 hover:border-amber-500 bg-amber-500/5 text-amber-400" }, // 🏗️
    { key: "operators", emoji: "\u{1F477}", colorClass: "border-emerald-500/20 hover:border-emerald-500 bg-emerald-500/5 text-emerald-400" }, // 👷
    { key: "mechanics", emoji: "\u{1F527}", colorClass: "border-blue-500/20 hover:border-blue-500 bg-blue-500/5 text-blue-400" }, // 🔧
    { key: "transporters", emoji: "\u{1F69B}", colorClass: "border-cyan-500/20 hover:border-cyan-500 bg-cyan-500/5 text-cyan-400" }, // 🚛
    { key: "insurers", emoji: "\u{1F6E1}\u{FE0F}", colorClass: "border-violet-500/20 hover:border-violet-500 bg-violet-500/5 text-violet-400" }, // 🛡️
    { key: "parts", emoji: "\u{2699}\u{FE0F}", colorClass: "border-pink-500/20 hover:border-pink-500 bg-pink-500/5 text-pink-400" }, // ⚙️
    { key: "fuel", emoji: "\u{26FD}", colorClass: "border-teal-500/20 hover:border-teal-500 bg-teal-500/5 text-teal-400" } // ⛽
  ];

  const demandStakeholders: StakeholderItem[] = [
    { key: "renters", emoji: "\u{1F4BC}", colorClass: "border-indigo-500/20 hover:border-indigo-500 bg-indigo-500/5 text-indigo-400" }, // 💼
    { key: "contractors", emoji: "\u{1F6E3}\u{FE0F}", colorClass: "border-yellow-500/20 hover:border-yellow-500 bg-yellow-500/5 text-yellow-400" }, // 🛣️
    { key: "miners", emoji: "\u{26CF}\u{FE0F}", colorClass: "border-orange-500/20 hover:border-orange-500 bg-orange-500/5 text-orange-400" }, // ⛏️
    { key: "farmers", emoji: "\u{1F33E}", colorClass: "border-green-500/20 hover:border-green-500 bg-green-500/5 text-green-400" }, // 🌾
    { key: "investors", emoji: "\u{1F4C8}", colorClass: "border-sky-500/20 hover:border-sky-500 bg-sky-500/5 text-sky-400" } // 📈
  ];

  const automatedRevenueModules: RevenueModule[] = [
    { key: "escrow", desc: "Optional secure escrow processing with standard low-commission fee cuts on heavy equipment sales and rental contracts.", emoji: "\u{1F512}", link: "/escrow" }, // 🔐
    { key: "jobs", desc: "Passive listings and verification fee cuts connecting construction contractors directly with certified heavy vehicle operators.", emoji: "\u{1F4CB}", link: "/jobs" }, // 📋
    { key: "tenders", desc: "Tender bidding registration fees matching project contractors with active private/governmental infrastructure bids.", emoji: "\u{1F3DB}\u{FE0F}", link: "/tenders" }, // 🏛️
    { key: "logistics", desc: "Instant commissions collected on lowbed and heavy trailer matches dispatched to transport equipment across regions.", emoji: "\u{1F6A2}", link: "/transport" }, // 🚢
    { key: "spareParts", desc: "Brokerage model sourcing genuine spare parts from importers directly to mechanics and equipment fleet owners.", emoji: "\u{1F529}", link: "/spare-parts" }, // 🔩
    { key: "inspection", desc: "Direct, premium pre-purchase verification and engine assessment inspection fees verified on-site by certified EML inspectors.", emoji: "\u{1F50D}", link: "/services" } // 🔍
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
            {"\u{1F1EA}\u{1F1F9}"} {t("ecosystem.tagline")} {/* 🇪🇹 */}
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
            {t("ecosystem.title")}
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {t("ecosystem.subtitle")}
          </p>

          {/* Quick Action Navigation Grid */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 text-center"
            >
              {t("nav.browse")}
            </Link>
            <Link
              href="/post-request"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all border border-zinc-800 text-center"
            >
              {t("nav.postRequest")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Ecosystem Node Directory
            </h2>
            <p className="text-sm text-zinc-400">
              Browse through specialized actors registered under the EML industrial standard.
            </p>
          </div>

          <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
            {(["all", "supply", "demand"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeTab === tab
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab === "all" ? "All Nodes" : tab === "supply" ? t("ecosystem.supplyTitle") : t("ecosystem.demandTitle")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(activeTab === "all" || activeTab === "supply") &&
            supplyStakeholders.map((item) => (
              <div
                key={item.key}
                className={`flex flex-col p-6 rounded-2xl border transition-all duration-200 ${item.colorClass}`}
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                  {t("ecosystem.supplyTitle")}
                </span>
                <h4 className="text-base font-black text-white mb-2">
                  {t(`stakeholders.${item.key}` as any)}
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  {t(`stakeholders.${item.key}_desc` as any)}
                </p>
              </div>
            ))}

          {(activeTab === "all" || activeTab === "demand") &&
            demandStakeholders.map((item) => (
              <div
                key={item.key}
                className={`flex flex-col p-6 rounded-2xl border transition-all duration-200 ${item.colorClass}`}
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest block mb-1">
                  {t("ecosystem.demandTitle")}
                </span>
                <h4 className="text-base font-black text-white mb-2">
                  {t(`stakeholders.${item.key}` as any)}
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  {t(`stakeholders.${item.key}_desc` as any)}
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* Escrow Banner (Featuring Optional Choice) */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
              {"\u{1F512}"} {t("nav.escrow")} {/* 🔒 */}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Optional Secured Escrow Protection
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Renters and buyers can opt to secure transactions inside EML Escrow. If selected, payment is held safely and released to the machinery supplier only after construction crew inspection and verification on-site.
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10 w-full md:w-auto">
            <Link
              href="/escrow"
              className="block w-full md:w-auto text-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Revenue Sourcing */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="space-y-3 text-center mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            {t("ecosystem.revenueTitle")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Passive Ecosystem Revenues
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            {t("ecosystem.revenueSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automatedRevenueModules.map((mod) => (
            <div
              key={mod.key}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">
                  {mod.emoji}
                </div>
                <h4 className="text-base font-bold text-white">
                  {t(`services.${mod.key}` as any)}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-zinc-900">
                <Link
                  href={mod.link}
                  className="inline-flex items-center text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider gap-1"
                >
                  Explore Module &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive PWA Radar Alerts */}
      <section className="max-w-7xl mx-auto px-4 pb-24 sm:px-6 lg:px-8">
        <PushNotificationEngine />
      </section>

    </div>
  );
}
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";
import { fetchLocalizedProfessionals, LocalizedProfessional } from "@/lib/db/jobs/query";
import {
  Bell,
  Brain,
  Truck,
  Wallet,
  ShieldCheck,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Radio,
  Bot,
  Star,
  User,
  MapPin,
  Briefcase,
  Phone
} from "lucide-react";

// Localized geographic markers
const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "hawassa": { en: "Hawassa", am: "ሀዋሳ", om: "Hawaas", ti: "ሃዋሳ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" },
  "bahir_dar": { en: "Bahir Dar", am: "ባህር ዳር", om: "Baahir Daar", ti: "ባህር ዳር" }
};

export default function JobsPage() {
  const { t, currentLanguage } = useTranslate();
  const { language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  
  // Database States
  const [professionals, setProfessionals] = useState<LocalizedProfessional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering States
  const [selectedRole, setSelectedRole] = useState<"all" | "operator" | "mechanic">("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch live profiles on filter update
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchLocalizedProfessionals(
        currentLanguage,
        selectedRole,
        selectedLocation || undefined,
        searchTerm || undefined
      );
      setProfessionals(data);
      setIsLoading(false);
    }

    startTransition(() => {
      loadData();
    });
  }, [currentLanguage, selectedRole, selectedLocation, searchTerm]);

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-jobs-portal">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-zinc-900">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              💼 {t("services.jobs")}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {t("jobs.title")}
            </h1>
            <p className="text-sm text-zinc-400">
              {t("jobs.subtitle")}
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(["all", "operator", "mechanic"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  selectedRole === role
                    ? "bg-amber-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {role === "all" ? t("actions.filterAll") : role === "operator" ? t("stakeholders.operators") : t("stakeholders.mechanics")}
              </button>
            ))}
          </div>
        </header>

        {/* Dynamic Sidebar Filters and Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">
              {t("jobs.filterTalent")}
            </h3>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t("jobs.keywordSearch")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("jobs.searchPlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              />
            </div>

            {/* Location Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t("labels.location")}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              >
                <option value="" className="bg-zinc-950 text-white">{t("placeholders.selectLocation")}</option>
                {Object.keys(localizedLocations).map((key) => (
                  <option key={key} value={key} className="bg-zinc-950 text-white">
                    {localizedLocations[key][currentLanguage] || localizedLocations[key]["en"]}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Directory Listings Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
              </div>
            ) : professionals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
                <p className="text-zinc-400 text-sm font-semibold">
                  No active professionals found matching your selected criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professionals.map((item) => {
                  const localizedCity = localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"];
                  const currencyFormatter = new Intl.NumberFormat("en-US", { style: "decimal" });

                  return (
                    <article
                      key={item.id}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all duration-150"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">
                              {item.roleToken === "certified_operator" ? t("stakeholders.operators") : t("stakeholders.mechanics")}
                            </span>
                            <h3 className="text-lg font-black text-white">
                              {item.fullName}
                            </h3>
                          </div>
                          
                          {/* Trust Verification Badge */}
                          {item.verified && (
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                              {t("status.verified")}
                            </span>
                          )}
                        </div>

                        {/* Location & Experience tags */}
                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-zinc-900 py-3 text-zinc-400">
                          <div>
                            <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                              {t("labels.location")}
                            </span>
                            <span className="font-semibold text-zinc-200">{localizedCity}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                              {t("jobs.experience")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {item.experienceYears} {t("jobs.years")}
                            </span>
                          </div>
                        </div>

                        {/* Specialty Tags */}
                        <div className="space-y-1">
                          <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                            {t("jobs.specialties")}
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.specialtyTokens.map((tok, idx) => (
                              <span
                                key={idx}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded"
                              >
                                {t(tok as any)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Action Footer */}
                      <div className="pt-6 mt-6 border-t border-zinc-900 flex justify-between items-center gap-4">
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold">
                            {t("jobs.baseDailyRate")}
                          </span>
                          <span className="text-lg font-black text-white tracking-tight">
                            {currencyFormatter.format(item.dailyRate)} <span className="text-xs font-bold text-zinc-400">ETB</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                          onClick={() => alert(`Initiating direct booking with ${item.fullName}. EML logistics match active.`)}
                        >
                          {t("jobs.bookStaff")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
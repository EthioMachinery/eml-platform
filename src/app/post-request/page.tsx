"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { supabase } from "@/lib/supabaseClient";
import TranslatedInput from "@/components/ui/TranslatedInput";
import TranslatedSelect from "@/components/ui/TranslatedSelect";

const localizedLocations = [
  { value: "addis_ababa", label: "Addis Ababa / አዲስ አበባ" },
  { value: "hawassa", label: "Hawassa / ሀዋሳ" },
  { value: "adama", label: "Adama / አዲስ አበባ" },
  { value: "mekelle", label: "Mekelle / መቀሌ" },
  { value: "bahir_dar", label: "Bahir Dar / ባህር ዳር" },
  { value: "dire_dawa", label: "Dire Dawa / ድሬዳዋ" }
];

export default function PostRequestPage() {
  const { t } = useTranslate();
  const router = useRouter();

  // Form States
  const [title, setTitle] = useState("");
  const [categoryToken, setCategoryToken] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [locationToken, setLocationToken] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Resolve dynamic active user session
      const { data: { user } } = await supabase.auth.getUser();
      const finalUserId = user?.id || "00000000-0000-0000-0000-000000000000";

      // 2. Resolve custom 'other' specifications if populated
      const finalCategory = categoryToken === "other" ? otherCategory : categoryToken;
      const finalLocation = locationToken === "other" ? otherLocation : locationToken;

      // 3. Write data to public.requests
      const { error: insertError } = await supabase.from("requests").insert([
        {
          user_id: finalUserId,
          title,
          category: finalCategory,
          city: finalLocation,
          budget: budget ? Number(budget) : null,
          details,
          status: "active"
        }
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess("Sourcing request registered successfully in the ecosystem!");
      
      // Clear form inputs
      setTitle("");
      setCategoryToken("");
      setOtherCategory("");
      setLocationToken("");
      setOtherLocation("");
      setBudget("");
      setDetails("");

      setTimeout(() => {
        router.push("/browse");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An unexpected database write error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-post-request-portal">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-zinc-900 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {t("nav.postRequest")}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish your project requirements. Suppliers and haulers will respond with specialized quotes.
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs">
            {success}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">
          
          {/* Request Title */}
          <div>
            <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Request Title / Requirement Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need 3 Crawler Excavators for road clearing project"
              className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <TranslatedSelect
                value={categoryToken}
                onChange={(e) => setCategoryToken(e.target.value)}
                placeholderKey="placeholders.selectCategory"
                labelKey="placeholders.selectCategory"
                enableOther={true}
                otherValue={otherCategory}
                onOtherChange={setOtherCategory}
                options={[
                  { value: "excavator", labelKey: "categories.excavator" },
                  { value: "loader", labelKey: "categories.loader" },
                  { value: "dozer", labelKey: "categories.dozer" },
                  { value: "crane", labelKey: "categories.crane" },
                  { value: "grader", labelKey: "categories.grader" },
                  { value: "roller", labelKey: "categories.roller" },
                  { value: "dumpTruck", labelKey: "categories.dumpTruck" },
                  { value: "generator", labelKey: "categories.generator" },
                  { value: "backhoe", labelKey: "categories.backhoe" }
                ]}
              />
            </div>

            {/* Location Dropdown */}
            <div>
              <TranslatedSelect
                value={locationToken}
                onChange={(e) => setLocationToken(e.target.value)}
                placeholderKey="placeholders.selectLocation"
                labelKey="labels.location"
                enableOther={true}
                otherValue={otherLocation}
                onOtherChange={setOtherLocation}
                options={localizedLocations}
              />
            </div>
          </div>

          {/* Budget Limit Field */}
          <div>
            <TranslatedInput
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholderKey="placeholders.priceMax"
              labelKey="placeholders.priceMax"
            />
          </div>

          {/* Details / Scope specification */}
          <div>
            <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Project Details & Technical Scope
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t("placeholders.additionalDetails")}
              className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-zinc-900">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              {loading ? "Publishing Request..." : "Publish Sourcing Request"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
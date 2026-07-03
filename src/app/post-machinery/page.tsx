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

export default function PostMachineryPage() {
  const { t } = useTranslate();
  const router = useRouter();

  // Form Field States
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [categoryToken, setCategoryToken] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [locationToken, setLocationToken] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  
  // Multilingual Inputs
  const [titleAm, setTitleAm] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descAm, setDescAm] = useState("");
  const [descEn, setDescEn] = useState("");

  // Deal Type & Financial States
  const [isRentalOnly, setIsRentalOnly] = useState(false);
  const [priceSale, setPriceSale] = useState("");
  const [priceRentalDaily, setPriceRentalDaily] = useState("");

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/machinery-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image.");
      }

      setUploadedUrl(result.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!titleAm) {
      setError("Amharic Title (ርዕስ በአማርኛ) is required to satisfy database integrity.");
      setLoading(false);
      return;
    }

    try {
      // 1. Query the active authenticated session dynamically
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fallback to our verified supplier account if currently unauthenticated during testing
      const finalOwnerId = user?.id || "00000000-0000-0000-0000-000000000000";

      const finalCategory = categoryToken === "other" ? otherCategory : categoryToken;
      const finalLocation = locationToken === "other" ? otherLocation : locationToken;

      const localizedTitle = {
        en: titleEn || titleAm,
        am: titleAm,
        om: titleEn || titleAm,
        ti: titleAm
      };

      const localizedDescription = {
        en: descEn || descAm,
        am: descAm,
        om: descEn || descAm,
        ti: descAm
      };

      const { error: insertError } = await supabase.from("listings").insert([
        {
          owner_id: finalOwnerId,
          brand,
          model,
          category_token: finalCategory,
          model_year: Number(modelYear),
          serial_number: serialNumber,
          title_am: titleAm,
          title_en: titleEn || null,
          description_am: descAm || null,
          description_en: descEn || null,
          localized_title: localizedTitle,
          localized_description: localizedDescription,
          price: priceSale ? Number(priceSale) : (priceRentalDaily ? Number(priceRentalDaily) : null),
          price_sale: priceSale ? Number(priceSale) : null,
          price_rental_daily: priceRentalDaily ? Number(priceRentalDaily) : null,
          is_rental_only: isRentalOnly,
          location: finalLocation,
          image_url: uploadedUrl || null,
          status: "pending_review"
        }
      ]);

      if (insertError) {
        throw insertError;
      }

      router.push("/browse");
    } catch (err: any) {
      setError(err.message || "An unexpected database error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-post-portal">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-zinc-900 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {t("nav.postMachinery")}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Register your industrial equipment under the TM High-Trust Standard.
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Caterpillar, Komatsu"
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. 320D, D155AX"
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  { value: "roller", labelKey: "categories.roller" }
                ]}
              />
            </div>
            <div>
              <TranslatedSelect
                value={locationToken}
                onChange={(e) => setLocationToken(e.target.value)}
                placeholderKey="placeholders.selectLocation"
                labelKey="labels.location"
                enableOther={true}
                otherValue={otherLocation}
                onOtherChange={setOtherLocation} // Correctly bound to otherLocation setter
                options={localizedLocations}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Model Year</label>
              <input
                type="number"
                required
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                placeholder="e.g. 2021"
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Serial Number</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-90210A"
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
              />
            </div>
          </div>

          {/* Multilingual Title Fields */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <span className="block text-xs font-black text-amber-500 uppercase tracking-widest">
              Multilingual Specifications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">ርዕስ በአማርኛ (Amharic Title) *</label>
                <input
                  type="text"
                  required
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  placeholder="ምሳሌ፡ ካተርፒላር 320D ቁፋሮ"
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Title in English</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Caterpillar 320D Excavator"
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">ዝርዝር መግለጫ በአማርኛ (Amharic Description)</label>
                <textarea
                  rows={3}
                  value={descAm}
                  onChange={(e) => setDescAm(e.target.value)}
                  placeholder="ምሳሌ፡ በጥሩ ሁኔታ ላይ የሚገኝ፣ ሰርቪስ የተደረገ..."
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs resize-none"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Description in English</label>
                <textarea
                  rows={3}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="e.g. Great condition hydraulics, engine verified..."
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing Structure */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <span className="block text-xs font-black text-amber-500 uppercase tracking-widest">
              Pricing Options
            </span>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRentalOnly}
                  onChange={(e) => setIsRentalOnly(e.target.checked)}
                  className="rounded bg-black border-zinc-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span>This equipment is for RENTAL only</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {!isRentalOnly && (
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Fixed Sale Price (ETB)</label>
                  <input
                    type="number"
                    value={priceSale}
                    onChange={(e) => setPriceSale(e.target.value)}
                    placeholder="e.g. 6800000"
                    className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
                  />
                </div>
              )}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Daily Rental Rate (ETB/Day)</label>
                <input
                  type="number"
                  value={priceRentalDaily}
                  onChange={(e) => setPriceRentalDaily(e.target.value)}
                  placeholder="e.g. 8500"
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-xs"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <span className="block text-xs font-black text-amber-500 uppercase tracking-widest">
              Machinery Photo Sourcing
            </span>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-black hover:bg-zinc-900/40 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <span className="text-2xl mb-1">📷</span>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    {uploading ? "Uploading to TM Storage..." : "Click to Upload Machinery Image"}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {uploadedUrl && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold text-center">
                ✓ Image Sourced successfully!
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-zinc-900">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              {loading ? "Registering Machinery..." : t("actions.submit")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
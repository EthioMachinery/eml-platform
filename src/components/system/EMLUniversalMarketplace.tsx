"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { fetchLocalizedListings } from "@/lib/db/machinery/search";
import type { LocalizedListing } from "@/types";
import TranslatedInput from "@/components/ui/TranslatedInput";
import TranslatedSelect from "@/components/ui/TranslatedSelect";

const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "hawassa": { en: "Hawassa", am: "ሀዋሳ", om: "Hawaas", ti: "ሃዋሳ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" },
  "bahir_dar": { en: "Bahir Dar", am: "ባህር ዳር", om: "Baahir Daar", ti: "ባህር ዳር" },
  "dire_dawa": { en: "Dire Dawa", am: "ድሬዳዋ", om: "Dirree Dhawaa", ti: "ድሬዳዋ" }
};

export default function EMLUniversalMarketplace() {
  const { t, currentLanguage } = useTranslate();
  const [isPending, startTransition] = useTransition();
  
  const [listings, setListings] = useState<LocalizedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategorySpecification, setOtherCategorySpecification] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [otherLocationSpecification, setOtherLocationSpecification] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rentFilter, setRentFilter] = useState<"all" | "rent" | "sale">("all");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const targetCategory = selectedCategory === "other" ? otherCategorySpecification : selectedCategory;
      const targetLocation = selectedLocation === "other" ? otherLocationSpecification : selectedLocation;

      const data = await fetchLocalizedListings(currentLanguage, {
        category: targetCategory || undefined,
        location: targetLocation || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        intent: rentFilter
      });
      setListings(data);
      setIsLoading(false);
    }
    
    startTransition(() => {
      loadData();
    });
  }, [currentLanguage, selectedCategory, otherCategorySpecification, selectedLocation, otherLocationSpecification, maxPrice, rentFilter]);

  const displayedListings = listings.filter((item) => {
    return `${item.brand} ${item.model}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" id="eml-marketplace-app">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500">EML</span> {t("nav.browse")}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLoading ? "..." : `${displayedListings.length} ${t("status.available")}`}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 border-b border-zinc-900 pb-3">
            {t("actions.search")}
          </h3>

          {/* Search Term input */}
          <div>
            <TranslatedInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholderKey="placeholders.searchPlaceholder"
              labelKey="actions.search"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <TranslatedSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholderKey="placeholders.selectCategory"
              labelKey="placeholders.selectCategory"
              enableOther={true}
              otherValue={otherCategorySpecification}
              onOtherChange={setOtherCategorySpecification}
              otherPlaceholderKey="placeholders.searchPlaceholder"
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
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholderKey="placeholders.selectLocation"
              labelKey="labels.location"
              enableOther={true}
              otherValue={otherLocationSpecification}
              onOtherChange={setOtherLocationSpecification}
              otherPlaceholderKey="placeholders.selectLocation"
              options={Object.keys(localizedLocations).map((key) => ({
                value: key,
                label: localizedLocations[key][currentLanguage] || localizedLocations[key]["en"]
              }))}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {t("actions.sell")}
            </span>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {(["all", "rent", "sale"] as const).map((type) => {
                let labelKey: any = "actions.filterAll";
                if (type === "rent") labelKey = "actions.filterRent";
                if (type === "sale") labelKey = "actions.filterBuy";

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRentFilter(type)}
                    className={`py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                      rentFilter === type
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t(labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <TranslatedInput
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholderKey="placeholders.priceMax"
              labelKey="placeholders.priceMax"
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
              <p className="text-zinc-400 text-sm font-semibold">
                No active machinery found matches your selected filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedListings.map((item) => {
                const translatedCategory = t(`categories.${item.categoryToken}` as any);
                const localizedCity = item.locationToken ? (localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"]) : "N/A";
                const currencyFormatter = new Intl.NumberFormat("en-US", { style: "decimal" });
                const displayPrice = item.isRentalOnly ? item.priceRentalDaily : item.priceSale;
                
                return (
                  <article
                    key={item.id}
                    className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-200"
                  >
                    {/* Visual Imagery Mock Container - Dynamically loads user image if present */}
                    <div className="relative h-48 bg-zinc-900 flex items-center justify-center border-b border-zinc-900 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.brand}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to text template if image load fails
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            {translatedCategory}
                          </span>
                          <span className="block text-lg font-black text-zinc-300">
                            {item.brand}
                          </span>
                        </div>
                      )}

                      {/* Trust Verification Badge */}
                      {item.verified && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest z-10">
                          {t("status.verified")}
                        </span>
                      )}

                      {/* Transaction Intent Badge */}
                      <span className="absolute top-3 right-3 bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-wider border border-zinc-800 z-10">
                        {item.isRentalOnly ? t("actions.rent") : t("actions.buy")}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-bold text-white">
                            {item.title}
                          </h4>
                          <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.modelYear}
                          </span>
                        </div>

                        {/* Localized Metadata Fields */}
                        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-zinc-400 border-t border-b border-zinc-900 py-3 my-3">
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.location")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {localizedCity}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.workingHours")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {item.engineHours || "N/A"} Hrs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Intent Action */}
                      <div className="mt-2">
                        <div className="mb-3">
                          <span className="text-xs text-zinc-500 block uppercase font-bold">
                            {item.isRentalOnly ? t("labels.dailyRate") : t("labels.salePrice")}
                          </span>
                          <span className="text-xl font-black text-white tracking-tight">
                            {displayPrice ? currencyFormatter.format(displayPrice) : "0"} <span className="text-sm font-bold text-zinc-400">ETB</span>
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          {item.isRentalOnly ? t("actions.rent") : t("actions.buy")}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
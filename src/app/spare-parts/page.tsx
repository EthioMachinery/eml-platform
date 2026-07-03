"use client";

import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";

interface SparePart {
  id: string;
  partName: string;
  localizedName: Record<string, string>;
  partNumber: string;
  brandCompatibility: string;
  price: number;
  locationToken: string;
  importerName: string;
  verified: boolean;
  category: "engine" | "hydraulics" | "undercarriage" | "filters";
}

const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" }
};

const initialParts: SparePart[] = [
  {
    id: "part-1",
    partName: "Hydraulic Pump Assembly",
    localizedName: {
      en: "Hydraulic Pump Assembly (CAT 320D compatible)",
      am: "የሃይድሮሊክ ፓምፕ አስለቃቂ (ለካተርፒላር 320D የሚሆን)",
      or: "Haayidirooliki Paampii CAT 320D",
      ti: "ሃይድሮሊክ ፓምፕ አስለቃቂ (ንካተርፒላር 320D)"
    },
    partNumber: "CAT-320D-90218-HP",
    brandCompatibility: "Caterpillar",
    price: 320000,
    locationToken: "addis_ababa",
    importerName: "Kality Parts Importers",
    verified: true,
    category: "hydraulics"
  },
  {
    id: "part-2",
    partName: "Cylinder Liner Kit",
    localizedName: {
      en: "Komatsu Engine Cylinder Liner Kit",
      am: "የኮማትሱ ሞተር ሲሊንደር ላይነር ኪት",
      or: "Siliindara Mootora Komatsu",
      ti: "ናይ ኮማትሱ ሞተር ሲሊንደር ላይነር ኪት"
    },
    partNumber: "KOM-D155-6112-CYL",
    brandCompatibility: "Komatsu",
    price: 185000,
    locationToken: "addis_ababa",
    importerName: "Admas Imports",
    verified: true,
    category: "engine"
  },
  {
    id: "part-3",
    partName: "Undercarriage Track Roller",
    localizedName: {
      en: "Excavator Undercarriage Track Roller",
      am: "የኤክስካቫተር ታችኛው ክፍል የመንኮራኩር ሮለር (Track Roller)",
      or: "Roolerii Eskavaatarii Track",
      ti: "ናይ መኹዓቲ ታሕተዋይ ክፋል መንኮራኩር ሮለር"
    },
    partNumber: "SANY-SY215-TRACK",
    brandCompatibility: "Sany",
    price: 45000,
    locationToken: "adama",
    importerName: "Nile Equipment Parts",
    verified: false,
    category: "undercarriage"
  }
];

export default function SparePartsPage() {
  const { t, currentLanguage } = useTranslate();
  
  const [selectedCategory, setSelectedCategory] = useState<"all" | "engine" | "hydraulics" | "undercarriage">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParts = initialParts.filter((item) => {
    let matchesCategory = true;
    if (selectedCategory !== "all") matchesCategory = item.category === selectedCategory;

    const title = item.localizedName[currentLanguage] || item.localizedName["en"];
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandCompatibility.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-parts-portal">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-zinc-900">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              ⚙️ {t("services.spareParts")}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Spare Parts Hub
            </h1>
            <p className="text-sm text-zinc-400">
              Source genuine heavy machinery engine components, undercarriage tracks, and hydraulic lines under TM Escrow protection.
            </p>
          </div>

          <div className="flex flex-wrap bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(["all", "engine", "hydraulics", "undercarriage"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "All Parts" : cat}
              </button>
            ))}
          </div>
        </header>

        {/* Filters and List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">
              Search Parts
            </h3>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Part Keyword</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search part number, brand..."
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>
          </aside>

          <main className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredParts.map((item) => {
              const localizedTitle = item.localizedName[currentLanguage] || item.localizedName["en"];
              const city = localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"];

              return (
                <article
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all duration-150"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-black text-white mt-1.5">
                          {localizedTitle}
                        </h3>
                        <span className="text-xs text-zinc-500 block mt-1">Part No: {item.partNumber}</span>
                      </div>
                      {item.verified && (
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          {t("status.verified")}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-zinc-900 py-3 text-zinc-400">
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-600 uppercase">Importer</span>
                        <span className="font-semibold text-zinc-300">{item.importerName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-600 uppercase">Hub Location</span>
                        <span className="font-semibold text-zinc-300">{city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-900 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold">Price</span>
                      <span className="text-xl font-black text-white tracking-tight">
                        {formatter.format(item.price)} <span className="text-xs font-bold text-zinc-400">ETB</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      onClick={() => alert(`Redirecting to Secure Escrow checkout for ${item.partName}.`)}
                    >
                      Checkout Parts
                    </button>
                  </div>
                </article>
              );
            })}
          </main>
        </div>

      </div>
    </div>
  );
}
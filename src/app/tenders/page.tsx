"use client";

import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";

interface TenderListing {
  id: string;
  projectAgency: string;
  category: "civil_works" | "mechanized_agriculture" | "mining_infrastructure";
  localizedTitle: Record<string, string>;
  localizedScope: Record<string, string>;
  locationToken: string;
  estimatedBudget: number;
  deadlineDate: string;
  verified: boolean;
}

// Localized Geographic Map Helper
const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "hawassa": { en: "Hawassa", am: "ሀዋሳ", om: "Hawaas", ti: "ሃዋሳ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" },
  "bahir_dar": { en: "Bahir Dar", am: "ባህር ዳር", om: "Baahir Daar", ti: "ባህር ዳር" }
};

// Mock dataset representing active public and private tenders in Ethiopia
const initialTenders: TenderListing[] = [
  {
    id: "tender-001",
    projectAgency: "Ethiopian Roads Administration (ERA)",
    category: "civil_works",
    localizedTitle: {
      en: "Addis Ababa - Adama Expressway Phase 3 Expansion",
      am: "የአዲስ አበባ - አዳማ የፍጥነት መንገድ 3ኛ ምዕራፍ ማስፋፊያ",
      om: "Ijaarsa Babal’isuu Daandii Saffisaa Finfinnee - Adaamaa Marsaa 3ffaa",
      ti: "ህንጸት መጋፍሒ መገዲ ቅልጣፈ ኣዲስ ኣበባ - ኣዳማ ሳልሳይ ምዕራፍ"
    },
    localizedScope: {
      en: "Requires deployment of 12 crawler excavators, 8 graders, and 14 heavy dump trucks. Escrow billing option integrated.",
      am: "፲፪ ኤክስካቫተሮች፣ ፰ ግሬደሮች እና ፲፬ ከባድ ገልባጭ መኪናዎችን ማሰማራት ይጠይቃል። ታማኝ የክፍያ ዋስትና ተካቷል።",
      om: "Eskavaatarii 12, Gireederii 8 fi Daampii 14 bobbaasuu gaafata. Kafaltiin wabii of keessaa qaba.",
      ti: "፲፪ መኹዓቲ ማሽናት፣ ፰ ግሬደራት ከምኡ እውን ፲፬ ዱምፕ ትራክታት ምውፋር ዝሓትት። ውሑስ ክፍሊት ዝተሓወሶ እዩ።"
    },
    locationToken: "adama",
    estimatedBudget: 85000000, // 85M ETB
    deadlineDate: "2026-08-15",
    verified: true
  },
  {
    id: "tender-002",
    projectAgency: "Afar Potash Mining & Sourcing Corp",
    category: "mining_infrastructure",
    localizedTitle: {
      en: "Afar Salt Plain Quarry Digging & Heavy Sourcing Contract",
      am: "የአፋር የጨው ሜዳ ቁፋሮ እና የከባድ ማሽነሪ አቅርቦት ስምምነት",
      om: "Kiraa Qotama Lafa Soogidda Afaar fi Dhiyeessii Maashinarii Ulfaataa",
      ti: "ናይ ዓፋር ጨው ጐልጐል መኹዓትን ቀረብ ከበድቲ ማሽነሪታትን ስምምዕ"
    },
    localizedScope: {
      en: "Bidding open for 30-ton heavy mining loaders, stone crushers, and bulk diesel transport operators.",
      am: "ለባለ 30 ቶን ሎደሮች፣ ለድንጋይ መፍጫ ማሽኖች እና ለነዳጅ ማጓጓዣዎች ክፍት የሆነ የጨረታ ጥሪ።",
      om: "Loodaroota Toonii 30, maashinii dhagaa daakuufi dhiyeessitoota boba’aaf caalbaasiin qophaayeera.",
      ti: "ንናይ 30 ቶን ሎደራት፣ መፍጨቒ ኣእማንን መጓዓዝቲ ነዳድን ዝተዳለወ ክፉት ጨረታ።"
    },
    locationToken: "addis_ababa",
    estimatedBudget: 142000000, // 142M ETB
    deadlineDate: "2026-09-01",
    verified: true
  },
  {
    id: "tender-003",
    projectAgency: "Oromia Mechanized Sugarcane Sourcing",
    category: "mechanized_agriculture",
    localizedTitle: {
      en: "Wonji Sugarcane Estate Irrigation & Harvesting Contract",
      am: "የወንጂ ስኳር ፋብሪካ የሸንኮራ አገዳ የመስኖ ቦይ እና የመኸር ግንባታ",
      om: "Ijaarsa Jallisiifi Haama Shonkooraa Warshaa Wonjii",
      ti: "ናይ ወንጂ ሽኮር ፋብሪካ መትረብ መስኖን ዕደናን ህንጸት"
    },
    localizedScope: {
      en: "Requires agricultural tractors, land clearers, and heavy lowbeds to transport equipment dynamically.",
      am: "የግብርና ትራክተሮች፣ የጫካ መመንጠሪያ ማሽኖች እና የከባድ ጭነት መኪናዎችን ማሰማራት ይጠይቃል።",
      om: "Tiraaktaroota qonnaa, maashinii lafa qulqulleessuufi geessitoota maashinarii ulfaatoo gaafata.",
      ti: "ናይ ሕርሻ ትራክተራት፣ መመንጠሪ መሬትን ከበድቲ መጓዓዝቲ መኪናታትን ምውፋር ዝሓትት።"
    },
    locationToken: "hawassa",
    estimatedBudget: 45000000, // 45M ETB
    deadlineDate: "2026-07-20",
    verified: false
  }
];

export default function TendersPage() {
  const { t, currentLanguage } = useTranslate();
  
  // States
  const [selectedCategory, setSelectedCategory] = useState<"all" | "civil" | "agro" | "mining">("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenders = initialTenders.filter((item) => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory === "civil") matchesCategory = item.category === "civil_works";
    if (selectedCategory === "agro") matchesCategory = item.category === "mechanized_agriculture";
    if (selectedCategory === "mining") matchesCategory = item.category === "mining_infrastructure";

    // Location match
    const matchesLocation = selectedLocation ? item.locationToken === selectedLocation : true;

    // Search query match
    const title = item.localizedTitle[currentLanguage] || item.localizedTitle["en"];
    const scope = item.localizedScope[currentLanguage] || item.localizedScope["en"];
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectAgency.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-tenders-portal">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-zinc-900">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              🏛️ {t("services.tenders")}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {t("tenders.title")}
            </h1>
            <p className="text-sm text-zinc-400">
              {t("tenders.subtitle")}
            </p>
          </div>

          {/* Category Quick Filter */}
          <div className="flex flex-wrap bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(["all", "civil", "agro", "mining"] as const).map((cat) => (
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
                {cat === "all" ? t("tenders.allTenders") : cat === "civil" ? t("tenders.civilWorks") : cat === "agro" ? t("tenders.agriculture") : t("tenders.mining")}
              </button>
            ))}
          </div>
        </header>

        {/* Filters and List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">
              {t("tenders.filterTenders")}
            </h3>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t("tenders.keywordSearch")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("tenders.searchPlaceholder")}
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

          {/* Tenders Directory */}
          <main className="lg:col-span-3 space-y-6">
            {filteredTenders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
                <p className="text-zinc-400 text-sm font-semibold">
                  {t("tenders.noResults")}
                </p>
              </div>
            ) : (
              filteredTenders.map((item) => {
                const localizedTitle = item.localizedTitle[currentLanguage] || item.localizedTitle["en"];
                const localizedScope = item.localizedScope[currentLanguage] || item.localizedScope["en"];
                const localizedCity = localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"];
                const currencyFormatter = new Intl.NumberFormat("en-US", { style: "decimal" });

                return (
                  <article
                    key={item.id}
                    className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 md:p-8 hover:border-zinc-800 transition-all duration-150 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-4 flex-grow max-w-2xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.category.replace("_", " ")}
                          </span>
                          
                          {item.verified && (
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                              {t("tenders.verifiedAgency")}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                          {localizedTitle}
                        </h3>
                        <span className="block text-xs font-bold text-zinc-500">
                          {t("tenders.issuedBy")} {item.projectAgency}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {localizedScope}
                      </p>

                      {/* Details Strip */}
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pt-2">
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase block">{t("tenders.deploymentSite")}</span>
                          <span className="font-semibold text-zinc-300">{localizedCity}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase block">{t("tenders.submissionDeadline")}</span>
                          <span className="font-semibold text-zinc-300">{item.deadlineDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Action Footer */}
                    <div className="flex flex-col justify-between items-start md:items-end min-w-[200px] border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-6">
                      <div className="mb-4 md:text-right">
                        <span className="text-[9px] text-zinc-500 block uppercase font-bold">
                          {t("tenders.estimatedBudget")}
                        </span>
                        <span className="text-xl font-black text-white tracking-tight">
                          {currencyFormatter.format(item.estimatedBudget)} <span className="text-xs font-bold text-zinc-400">ETB</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        onClick={() => alert(`TM Tender Registration. Processing administrative bidding document entry fee of 500 ETB.`)}
                      >
                        {t("tenders.registerToBid")}
                      </button>
                    </div>

                  </article>
                );
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
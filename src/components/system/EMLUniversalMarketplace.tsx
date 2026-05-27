"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Search,
  Filter,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  EML_CATEGORIES,
} from "@/lib/emlCategories";

import {
  generateSmartSuggestions,
} from "@/lib/emlMarketplaceEngine";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  title?: string;

  subtitle?: string;

  showFeatured?: boolean;
}

export default function EMLUniversalMarketplace({
  title,

  subtitle,

  showFeatured = true,
}: Props) {
  const { t } =
    useLanguage();

  const [search, setSearch] =
    useState("");

  const [selectedCategory,
    setSelectedCategory] =
    useState("all");

  const suggestions =
    useMemo(() => {
      if (!search)
        return [];

      return generateSmartSuggestions(
        search
      );
    }, [search]);

  const filteredCategories =
    useMemo(() => {
      if (
        selectedCategory ===
        "all"
      ) {
        return EML_CATEGORIES;
      }

      return EML_CATEGORIES.filter(
        (item) =>
          item.id ===
          selectedCategory
      );
    }, [selectedCategory]);

  return (
    <section className="relative">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-[40px] border border-yellow-500/10 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-zinc-900">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,208,0,0.15),transparent_35%)]" />

        <div className="relative p-8 md:p-14">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black mb-6">

              <Sparkles size={16} />

              {t(
                "AI Powered Machinery Ecosystem",
                "AI የተጎለበተ የማሽነሪ ስርዓት"
              )}

            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">

              {title ||
                t(
                  "Discover Ethiopia’s Machinery Economy",
                  "የኢትዮጵያን የማሽነሪ ኢኮኖሚ ያግኙ"
                )}

            </h1>

            <p className="text-zinc-300 text-lg leading-8 max-w-3xl">

              {subtitle ||
                t(
                  "Buy, rent, transport, repair, insure and finance machinery across Ethiopia through one intelligent ecosystem.",
                  "በአንድ ዘመናዊ ስርዓት ማሽነሪ ይግዙ፣ ይከራዩ፣ ያጓጉዙ፣ ያስጠግኑ፣ ያስመዝግቡ እና ፋይናንስ ያግኙ።"
                )}

            </p>

            {/* SEARCH */}

            <div className="mt-10 grid lg:grid-cols-[1fr_240px] gap-4">

              <div className="relative">

                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={22}
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "Search machinery, transport, operators, mechanics...",
                    "ማሽነሪ፣ ትራንስፖርት፣ ኦፕሬተሮች፣ መካኒኮች..."
                  )}
                  className="w-full h-16 rounded-3xl bg-zinc-950/80 border border-zinc-800 pl-16 pr-6 text-white outline-none focus:border-yellow-500 transition"
                />

                {/* SUGGESTIONS */}

                {suggestions.length >
                  0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden z-30 shadow-2xl">

                    {suggestions.map(
                      (item) => (
                        <button
                          key={
                            item.id
                          }
                          onClick={() =>
                            setSearch(
                              item.name_en
                            )
                          }
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-900 transition text-left"
                        >

                          <div className="flex items-center gap-4">

                            <div className="text-2xl">
                              {
                                item.icon
                              }
                            </div>

                            <div>

                              <div className="font-bold">
                                {
                                  item.name_en
                                }
                              </div>

                              <div className="text-sm text-zinc-500">
                                {
                                  item.name_am
                                }
                              </div>

                            </div>

                          </div>

                          <ChevronRight
                            size={18}
                          />

                        </button>
                      )
                    )}

                  </div>
                )}

              </div>

              <button className="h-16 rounded-3xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition flex items-center justify-center gap-3">

                <Filter size={20} />

                {t(
                  "Advanced Search",
                  "የላቀ ፍለጋ"
                )}

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* CATEGORY GRID */}

      <div className="mt-14">

        <div className="flex flex-wrap gap-3 mb-10">

          <button
            onClick={() =>
              setSelectedCategory(
                "all"
              )
            }
            className={`px-5 h-12 rounded-2xl font-bold transition ${
              selectedCategory ===
              "all"
                ? "bg-yellow-500 text-black"
                : "bg-zinc-900 border border-zinc-800"
            }`}
          >
            {t(
              "All",
              "ሁሉም"
            )}
          </button>

          {EML_CATEGORIES.map(
            (item) => (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedCategory(
                    item.id
                  )
                }
                className={`px-5 h-12 rounded-2xl font-bold transition ${
                  selectedCategory ===
                  item.id
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-900 border border-zinc-800"
                }`}
              >
                {
                  item.name_en
                }
              </button>
            )
          )}

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {filteredCategories.map(
            (item) => (
              <Link
                key={item.id}
                href={`/browse?category=${item.id}`}
                className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-2"
              >

                <div
                  className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}
                />

                <div className="relative">

                  <div className="flex items-start justify-between mb-8">

                    <div className="text-6xl">
                      {
                        item.icon
                      }
                    </div>

                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">

                      <ShieldCheck
                        size={14}
                      />

                      VERIFIED

                    </div>

                  </div>

                  <h3 className="text-3xl font-black leading-tight mb-3">

                    {
                      item.name_en
                    }

                  </h3>

                  <div className="text-zinc-500 font-semibold mb-6">

                    {
                      item.name_am
                    }

                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 mb-8">

                    <MapPin
                      size={18}
                    />

                    {t(
                      "Available across Ethiopia",
                      "በመላው ኢትዮጵያ ይገኛል"
                    )}

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="text-yellow-400 font-black">

                      {t(
                        "Explore",
                        "ይመልከቱ"
                      )}

                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition">

                      <ChevronRight
                        size={22}
                      />

                    </div>

                  </div>

                </div>

              </Link>
            )
          )}

        </div>

      </div>

      {/* FEATURED SECTION */}

      {showFeatured && (

        <div className="mt-20 bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 md:p-12">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-4">

                {t(
                  "ENTERPRISE EML",
                  "ኢንተርፕራይዝ EML"
                )}

              </div>

              <h2 className="text-4xl font-black leading-tight mb-5">

                {t(
                  "One Platform. Entire Machinery Economy.",
                  "አንድ ስርዓት። ሙሉ የማሽነሪ ኢኮኖሚ።"
                )}

              </h2>

              <p className="text-zinc-400 max-w-3xl leading-8">

                {t(
                  "EML intelligently connects machinery owners, transport providers, operators, mechanics, financiers, insurers and buyers into one digital infrastructure.",
                  "EML የማሽነሪ ባለቤቶችን፣ አጓጓዦችን፣ ኦፕሬተሮችን፣ መካኒኮችን፣ ፋይናንስ ተቋማትን፣ ኢንሹራንስን እና ገዥዎችን በአንድ ዲጂታል መሰረተ ልማት ያገናኛል።"
                )}

              </p>

            </div>

            <div className="flex flex-wrap gap-4">

              <Link
                href="/upload"
                className="px-8 h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center transition"
              >
                {t(
                  "Post Listing",
                  "ዝርዝር ያስገቡ"
                )}
              </Link>

              <Link
                href="/ecosystem"
                className="px-8 h-14 rounded-2xl border border-zinc-700 hover:border-yellow-500 font-bold flex items-center transition"
              >
                {t(
                  "Explore Ecosystem",
                  "ስርዓቱን ይመልከቱ"
                )}
              </Link>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}
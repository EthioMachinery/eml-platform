"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  MapPin,
  Search,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

import TranslatedSelect from "@/components/TranslatedSelect";

import {
  listingTypes,
  machineryCategories,
  machineryConditions,
} from "@/constants/options";

type Machinery = {
  id: string;

  title: string;

  category: string;

  listing_type: string;

  condition: string;

  price: string;

  location: string;

  image_url: string;
};

export default function BrowsePage() {
  const { t } =
    useLanguage();

  const [loading, setLoading] =
    useState(true);

  const [machines, setMachines] =
    useState<Machinery[]>(
      []
    );

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    listingType,
    setListingType,
  ] = useState("");

  const [condition, setCondition] =
    useState("");

  useEffect(() => {
    loadMachinery();
  }, []);

  async function loadMachinery() {
    setLoading(true);

    const { data } =
      await supabase
        .from("machinery")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    setMachines(data || []);

    setLoading(false);
  }

  const filtered =
    useMemo(() => {
      return machines.filter(
        (item) => {
          const keyword =
            `${item.title} ${item.category} ${item.location}`
              .toLowerCase();

          const matchesSearch =
            keyword.includes(
              search.toLowerCase()
            );

          const matchesCategory =
            !category ||
            item.category ===
              category;

          const matchesListing =
            !listingType ||
            item.listing_type ===
              listingType;

          const matchesCondition =
            !condition ||
            item.condition ===
              condition;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesListing &&
            matchesCondition
          );
        }
      );
    }, [
      machines,
      search,
      category,
      listingType,
      condition,
    ]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="border-b border-zinc-800 bg-zinc-950">

        <div className="mx-auto max-w-7xl px-4 py-20">

          <div className="max-w-4xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-black text-yellow-400">

              🚜 EML MARKETPLACE

            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">

              {t(
                "Browse Machinery",
                "ማሽነሪዎችን ይመልከቱ"
              )}

            </h1>

            <p className="mt-8 text-xl leading-9 text-zinc-400">

              {t(
                "Find machinery, rentals, transport equipment and industrial assets across Ethiopia.",
                "በመላው ኢትዮጵያ ማሽነሪዎችን፣ የኪራይ እቃዎችን፣ የትራንስፖርት መሳሪያዎችን እና የኢንዱስትሪ ንብረቶችን ያግኙ።"
              )}

            </p>

          </div>

        </div>

      </section>

      {/* FILTERS */}

      <section className="border-b border-zinc-800 bg-zinc-900/40">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* SEARCH */}

            <div className="space-y-3">

              <label className="text-sm font-black">

                {t(
                  "Search",
                  "ፈልግ"
                )}

              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4">

                <Search
                  size={20}
                  className="text-zinc-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(
                    e
                  ) =>
                    setSearch(
                      e.target
                        .value
                    )
                  }
                  placeholder={t(
                    "Search machinery...",
                    "ማሽነሪ ይፈልጉ..."
                  )}
                  className="w-full bg-transparent outline-none"
                />

              </div>

            </div>

            {/* CATEGORY */}

            <TranslatedSelect
              label={t(
                "Category",
                "ምድብ"
              )}
              value={category}
              onChange={
                setCategory
              }
              options={
                machineryCategories
              }
            />

            {/* LISTING */}

            <TranslatedSelect
              label={t(
                "Listing Type",
                "የማስታወቂያ አይነት"
              )}
              value={listingType}
              onChange={
                setListingType
              }
              options={
                listingTypes
              }
            />

            {/* CONDITION */}

            <TranslatedSelect
              label={t(
                "Condition",
                "ሁኔታ"
              )}
              value={condition}
              onChange={
                setCondition
              }
              options={
                machineryConditions
              }
            />

          </div>

        </div>

      </section>

      {/* RESULTS */}

      <section className="mx-auto max-w-7xl px-4 py-16">

        {/* TOP */}

        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">

          <div>

            <div className="text-sm font-black tracking-widest text-yellow-400">

              {t(
                "LIVE MARKETPLACE",
                "ቀጥታ ገበያ"
              )}

            </div>

            <h2 className="mt-3 text-4xl font-black">

              {filtered.length}{" "}

              {t(
                "Machinery Listings",
                "የማሽነሪ ዝርዝሮች"
              )}

            </h2>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="py-24 text-center text-zinc-400">

            {t(
              "Loading marketplace...",
              "ገበያው በመጫን ላይ..."
            )}

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filtered.length ===
            0 && (
            <div className="rounded-[40px] border border-zinc-800 bg-zinc-900 p-20 text-center">

              <Truck
                size={70}
                className="mx-auto mb-8 text-zinc-700"
              />

              <h3 className="text-3xl font-black">

                {t(
                  "No machinery found",
                  "ማሽነሪ አልተገኘም"
                )}

              </h3>

              <p className="mt-5 text-zinc-400">

                {t(
                  "Try changing filters or search keywords.",
                  "ማጣሪያዎቹን ወይም የፍለጋ ቃላትን ይቀይሩ።"
                )}

              </p>

            </div>
          )}

        {/* GRID */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map(
            (item) => (
              <Link
                key={item.id}
                href={`/machinery/${item.id}`}
                className="overflow-hidden rounded-[35px] border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500/40"
              >

                {/* IMAGE */}

                <div className="relative h-64 overflow-hidden bg-zinc-800">

                  {item.image_url ? (
                    <img
                      src={
                        item.image_url
                      }
                      alt={
                        item.title
                      }
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-8xl">

                      🚜

                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black">

                    {
                      item.listing_type
                    }

                  </div>

                </div>

                {/* BODY */}

                <div className="p-7">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-400">

                      {
                        item.category
                      }

                    </div>

                    <div className="text-sm text-zinc-500">

                      {
                        item.condition
                      }

                    </div>

                  </div>

                  <h3 className="text-2xl font-black leading-snug">

                    {item.title}

                  </h3>

                  <div className="mt-5 flex items-center gap-2 text-zinc-400">

                    <MapPin
                      size={16}
                    />

                    {item.location}

                  </div>

                  <div className="mt-8 flex items-center justify-between">

                    <div className="text-3xl font-black text-yellow-400">

                      {item.price}

                    </div>

                    <div className="text-yellow-400">

                      →

                    </div>

                  </div>

                </div>

              </Link>
            )
          )}

        </div>

      </section>

    </main>
  );
}
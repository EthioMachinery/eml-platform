"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Briefcase,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { useLanguage } from "@/context/LanguageContext";

import TranslatedSelect from "@/components/TranslatedSelect";

const operatorSpecialties = [
  {
    value: "Excavator Operator",
    en: "Excavator Operator",
    am: "የኤክስካቫተር ኦፕሬተር",
  },

  {
    value: "Bulldozer Operator",
    en: "Bulldozer Operator",
    am: "የቡልዶዘር ኦፕሬተር",
  },

  {
    value: "Loader Operator",
    en: "Loader Operator",
    am: "የሎደር ኦፕሬተር",
  },

  {
    value: "Crane Operator",
    en: "Crane Operator",
    am: "የክሬን ኦፕሬተር",
  },

  {
    value: "Dump Truck Driver",
    en: "Dump Truck Driver",
    am: "የዳምፕ ትራክ ሾፌር",
  },

  {
    value: "Mechanic",
    en: "Mechanic",
    am: "መካኒክ",
  },

  {
    value: "Other",
    en: "Other",
    am: "ሌላ",
  },
];

type Operator = {
  id: string;

  full_name: string;

  specialty: string;

  phone: string;

  location: string;

  experience_years: number;

  bio: string;

  verified: boolean;

  avatar_url: string;
};

export default function OperatorsPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings
  const t = (en, am) => {
    return language === "am" ? am : en;
  };

  const [loading, setLoading] =
    useState(true);

  const [operators, setOperators] =
    useState<Operator[]>(
      []
    );

  const [search, setSearch] =
    useState("");

  const [specialty, setSpecialty] =
    useState("");

  useEffect(() => {
    loadOperators();
  }, []);

  async function loadOperators() {
    setLoading(true);

    const { data } =
      await supabase
        .from("operators")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    setOperators(data || []);

    setLoading(false);
  }

  const filtered =
    useMemo(() => {
      return operators.filter(
        (item) => {
          const keyword =
            `${item.full_name} ${item.specialty} ${item.location}`
              .toLowerCase();

          const matchesSearch =
            keyword.includes(
              search.toLowerCase()
            );

          const matchesSpecialty =
            !specialty ||
            item.specialty ===
              specialty;

          return (
            matchesSearch &&
            matchesSpecialty
          );
        }
      );
    }, [
      operators,
      search,
      specialty,
    ]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="border-b border-zinc-800 bg-zinc-950">

        <div className="mx-auto max-w-7xl px-4 py-20">

          <div className="max-w-4xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-black text-yellow-400">

              👷 TM OPERATORS

            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">

              {t(
                "Operators & Workforce",
                "ኦፕሬተሮች እና የሰው ኃይል"
              )}

            </h1>

            <p className="mt-8 text-xl leading-9 text-zinc-400">

              {t(
                "Find verified machinery operators, drivers, mechanics and industrial professionals.",
                "የተረጋገጡ የማሽነሪ ኦፕሬተሮችን፣ ሾፌሮችን፣ መካኒኮችን እና የኢንዱስትሪ ባለሙያዎችን ያግኙ።"
              )}

            </p>

          </div>

        </div>

      </section>

      {/* FILTERS */}

      <section className="border-b border-zinc-800 bg-zinc-900/40">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="grid gap-5 md:grid-cols-2">

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
                    "Search operators...",
                    "ኦፕሬተሮችን ይፈልጉ..."
                  )}
                  className="w-full bg-transparent outline-none"
                />

              </div>

            </div>

            {/* SPECIALTY */}

            <TranslatedSelect
              label={t(
                "Specialty",
                "ሙያ"
              )}
              value={specialty}
              onChange={
                setSpecialty
              }
              options={
                operatorSpecialties
              }
            />

          </div>

        </div>

      </section>

      {/* RESULTS */}

      <section className="mx-auto max-w-7xl px-4 py-16">

        <div className="mb-12 flex flex-wrap items-center justify-between gap-5">

          <div>

            <div className="text-sm font-black tracking-widest text-yellow-400">

              {t(
                "INDUSTRIAL WORKFORCE",
                "የኢንዱስትሪ የሰው ኃይል"
              )}

            </div>

            <h2 className="mt-3 text-4xl font-black">

              {filtered.length}{" "}

              {t(
                "Operators Available",
                "የሚገኙ ኦፕሬተሮች"
              )}

            </h2>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="py-24 text-center text-zinc-400">

            {t(
              "Loading operators...",
              "ኦፕሬተሮች በመጫን ላይ..."
            )}

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filtered.length ===
            0 && (
            <div className="rounded-[40px] border border-zinc-800 bg-zinc-900 p-20 text-center">

              <User
                size={70}
                className="mx-auto mb-8 text-zinc-700"
              />

              <h3 className="text-3xl font-black">

                {t(
                  "No operators found",
                  "ኦፕሬተሮች አልተገኙም"
                )}

              </h3>

              <p className="mt-5 text-zinc-400">

                {t(
                  "Try adjusting filters or search keywords.",
                  "ማጣሪያዎቹን ወይም የፍለጋ ቃላትን ይቀይሩ።"
                )}

              </p>

            </div>
          )}

        {/* GRID */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="rounded-[35px] border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500/40"
              >

                {/* TOP */}

                <div className="mb-8 flex items-start justify-between">

                  <div className="flex items-center gap-5">

                    {/* AVATAR */}

                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-zinc-800">

                      {item.avatar_url ? (
                        <img
                          src={
                            item.avatar_url
                          }
                          alt={
                            item.full_name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User
                          size={38}
                          className="text-zinc-600"
                        />
                      )}

                    </div>

                    <div>

                      <h3 className="text-2xl font-black leading-snug">

                        {
                          item.full_name
                        }

                      </h3>

                      <div className="mt-2 text-yellow-400 font-bold">

                        {
                          item.specialty
                        }

                      </div>

                    </div>

                  </div>

                  {item.verified && (
                    <div className="rounded-full bg-green-500/10 px-3 py-2 text-green-400">

                      <ShieldCheck
                        size={18}
                      />

                    </div>
                  )}

                </div>

                {/* INFO */}

                <div className="space-y-4">

                  <div className="flex items-center gap-3 text-zinc-300">

                    <MapPin
                      size={18}
                      className="text-yellow-400"
                    />

                    {item.location}

                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">

                    <Briefcase
                      size={18}
                      className="text-yellow-400"
                    />

                    {
                      item.experience_years
                    }{" "}

                    {t(
                      "Years Experience",
                      "የስራ ልምድ ዓመት"
                    )}

                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">

                    <Phone
                      size={18}
                      className="text-yellow-400"
                    />

                    {item.phone}

                  </div>

                </div>

                {/* BIO */}

                <div className="mt-7 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 text-sm leading-8 text-zinc-400">

                  {item.bio ||
                    t(
                      "No biography available.",
                      "መግለጫ የለም።"
                    )}

                </div>

                {/* BUTTONS */}

                <div className="mt-8 flex gap-4">

                  <button className="flex-1 rounded-2xl bg-yellow-500 py-4 font-black text-black transition hover:bg-yellow-400">

                    {t(
                      "Hire Operator",
                      "ኦፕሬተር ይቅጠሩ"
                    )}

                  </button>

                  <button className="rounded-2xl border border-zinc-700 px-6 transition hover:border-yellow-500">

                    <Star
                      size={22}
                    />

                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </section>

    </main>
  );
}
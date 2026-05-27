"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  Wrench,
  Banknote,
  Briefcase,
  ChevronRight,
  Users,
  Building2,
  BadgeCheck,
  MapPin,
  ArrowRight,
  Settings,
  Fuel,
  Warehouse,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import {
  useEnterpriseTranslation,
} from "@/hooks/useEnterpriseTranslation";

type Machinery = {
  id: string;

  title: string;

  listing_type: string;

  condition: string;

  price: string;

  category: string;

  location: string;

  image_url: string;
};

export default function HomePage() {
  const { t } =
    useEnterpriseTranslation();

  const [
    featuredMachines,
    setFeaturedMachines,
  ] = useState<Machinery[]>(
    []
  );

  const [
    latestRentals,
    setLatestRentals,
  ] = useState<Machinery[]>(
    []
  );

  const [stats, setStats] =
    useState({
      machinery: 0,

      rentals: 0,

      sellers: 0,

      verified: 98,
    });

  useEffect(() => {
    initializeHomepage();
  }, []);

  async function initializeHomepage() {
    await Promise.all([
      loadFeaturedMachines(),

      loadLatestRentals(),

      loadStats(),
    ]);
  }

  async function loadFeaturedMachines() {
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
        )
        .limit(6);

    setFeaturedMachines(
      data || []
    );
  }

  async function loadLatestRentals() {
    const { data } =
      await supabase
        .from("machinery")
        .select("*")
        .eq(
          "listing_type",
          "Rental"
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(4);

    setLatestRentals(
      data || []
    );
  }

  async function loadStats() {
    const {
      count: machineryCount,
    } = await supabase
      .from("machinery")
      .select("*", {
        count: "exact",

        head: true,
      });

    const {
      count: rentalCount,
    } = await supabase
      .from("machinery")
      .select("*", {
        count: "exact",

        head: true,
      })
      .eq(
        "listing_type",
        "Rental"
      );

    const {
      count: sellerCount,
    } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",

        head: true,
      });

    setStats({
      machinery:
        machineryCount || 0,

      rentals:
        rentalCount || 0,

      sellers:
        sellerCount || 0,

      verified: 98,
    });
  }

  const ecosystemCards = [
    {
      title: t(
        "machineryMarketplace"
      ),

      description: t(
        "machineryMarketplaceDesc"
      ),

      icon: Truck,
    },

    {
      title: t(
        "transportLogistics"
      ),

      description: t(
        "transportLogisticsDesc"
      ),

      icon: Warehouse,
    },

    {
      title: t(
        "operatorsJobs"
      ),

      description: t(
        "operatorsJobsDesc"
      ),

      icon: Briefcase,
    },

    {
      title: t(
        "mechanicsWorkshops"
      ),

      description: t(
        "mechanicsWorkshopsDesc"
      ),

      icon: Wrench,
    },

    {
      title: t(
        "spareParts"
      ),

      description: t(
        "sparePartsDesc"
      ),

      icon: Settings,
    },

    {
      title: t(
        "financeInsurance"
      ),

      description: t(
        "financeInsuranceDesc"
      ),

      icon: Banknote,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">

      {/* HERO */}

      <section className="relative border-b border-yellow-500/10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-yellow-500/5 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full text-sm font-black mb-8">

                🇪🇹 ETHIOPIA MACHINERY LINK

              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">

                {t(
                  "heroTitle"
                )}

              </h1>

              <h2 className="text-3xl md:text-5xl font-black text-yellow-400 mt-5 leading-tight">

                {t(
                  "heroSubtitle"
                )}

              </h2>

              <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">

                {t(
                  "heroDescription"
                )}

              </p>

              <div className="flex flex-wrap gap-4 mt-12">

                <Link
                  href="/browse"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-5 rounded-2xl font-black transition text-lg"
                >

                  {t(
                    "findMachinery"
                  )}

                </Link>

                <Link
                  href="/upload"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-5 rounded-2xl font-black transition text-lg"
                >

                  {t(
                    "listMachinery"
                  )}

                </Link>

                <Link
                  href="/dashboard"
                  className="border border-yellow-500/30 hover:border-yellow-400 px-8 py-5 rounded-2xl font-black transition text-lg"
                >

                  {t(
                    "openDashboard"
                  )}

                </Link>

              </div>

            </div>

            {/* RIGHT */}

            <div className="grid grid-cols-2 gap-5">

              <StatCard
                icon={Truck}
                value={`${stats.machinery}+`}
                label={t(
                  "machineryListings"
                )}
              />

              <StatCard
                icon={Users}
                value={`${stats.sellers}+`}
                label={t(
                  "industrialUsers"
                )}
              />

              <StatCard
                icon={BadgeCheck}
                value={`${stats.verified}%`}
                label={t(
                  "trustEcosystem"
                )}
              />

              <StatCard
                icon={
                  Building2
                }
                value={`${stats.rentals}+`}
                label={t(
                  "rentalListings"
                )}
              />

            </div>

          </div>

        </div>

      </section>

      {/* TRUST */}

      <section className="border-b border-zinc-800 bg-zinc-900/40">

        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="grid md:grid-cols-4 gap-6 text-center">

            <TrustItem
              icon={
                ShieldCheck
              }
              label={t(
                "verifiedSellers"
              )}
            />

            <TrustItem
              icon={
                Banknote
              }
              label={t(
                "secureTransactions"
              )}
            />

            <TrustItem
              icon={Fuel}
              label={t(
                "industrialEcosystem"
              )}
            />

            <TrustItem
              icon={Users}
              label={t(
                "bilingualPlatform"
              )}
            />

          </div>

        </div>

      </section>

      {/* ECOSYSTEM */}

      <section className="max-w-7xl mx-auto px-4 py-24">

        <div className="text-center mb-16">

          <div className="text-yellow-400 font-black tracking-widest mb-4">

            {t(
              "ecosystem"
            )}

          </div>

          <h2 className="text-5xl font-black leading-tight">

            {t(
              "everythingIndustrialBusinessesNeed"
            )}

          </h2>

          <p className="text-zinc-400 text-xl mt-6 max-w-4xl mx-auto leading-9">

            {t(
              "ecosystemDescription"
            )}

          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {ecosystemCards.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={
                    index
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-2"
                >

                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-6">

                    <Icon
                      size={
                        32
                      }
                    />

                  </div>

                  <h3 className="text-3xl font-black mb-5">

                    {item.title}

                  </h3>

                  <p className="text-zinc-400 leading-8 text-lg mb-8">

                    {
                      item.description
                    }

                  </p>

                  <button className="text-yellow-400 font-black flex items-center gap-2">

                    {t(
                      "explore"
                    )}

                    <ArrowRight
                      size={18}
                    />

                  </button>

                </div>
              );
            }
          )}

        </div>

      </section>

    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: any) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">

      <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-5">

        <Icon size={28} />

      </div>

      <div className="text-4xl font-black">

        {value}

      </div>

      <div className="text-zinc-400 mt-2">

        {label}

      </div>

    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: any) {
  return (
    <div className="flex items-center justify-center gap-3">

      <Icon className="text-yellow-400" />

      <span className="font-bold">

        {label}

      </span>

    </div>
  );
}
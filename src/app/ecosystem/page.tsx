"use client";

import Link from "next/link";

import {
  Truck,
  Wrench,
  ShieldCheck,
  Banknote,
  Briefcase,
  Package,
  Fuel,
  Building2,
  ChevronRight,
  Users,
  Settings,
  Hammer,
  Cpu,
  PhoneCall,
  MapPinned,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function EcosystemPage() {
  const { t } = useLanguage();

  const ecosystem = [
    {
      title: t(
        "Machinery Marketplace",
        "የማሽነሪ ገበያ"
      ),

      description: t(
        "Buy, sell and rent excavators, loaders, graders, bulldozers, cranes and trucks.",
        "ኤክስካቫተሮች፣ ሎደሮች፣ ግሬደሮች፣ ቡልዶዘሮች፣ ክሬኖች እና ትራኮችን ይግዙ፣ ይሽጡ እና ይከራዩ።"
      ),

      icon: Truck,
    },

    {
      title: t(
        "Machinery Rental System",
        "የማሽነሪ ኪራይ ስርዓት"
      ),

      description: t(
        "Connect machinery owners with contractors and project-based renters.",
        "የማሽነሪ ባለቤቶችን ከኮንትራክተሮችና ከፕሮጀክት ተከራዮች ጋር ያገናኙ።"
      ),

      icon: Building2,
    },

    {
      title: t(
        "Mechanics & Workshops",
        "መካኒኮች እና ጋራጆች"
      ),

      description: t(
        "Heavy equipment repair centers, maintenance teams and diagnostics.",
        "የከባድ ማሽነሪ ጥገና ማዕከላት፣ ጥገና ቡድኖች እና ዲያግኖስቲክ አገልግሎቶች።"
      ),

      icon: Wrench,
    },

    {
      title: t(
        "Spare Parts Marketplace",
        "የመለዋወጫ ገበያ"
      ),

      description: t(
        "Engines, hydraulic systems, undercarriage parts and heavy equipment accessories.",
        "ሞተሮች፣ ሃይድሮሊክ ስርዓቶች፣ የታችኛው ክፍል እቃዎች እና የማሽነሪ አክሰሰሪዎች።"
      ),

      icon: Package,
    },

    {
      title: t(
        "Operators & Jobs",
        "ኦፕሬተሮች እና ስራዎች"
      ),

      description: t(
        "Excavator operators, drivers, technicians and machinery employment system.",
        "የኤክስካቫተር ኦፕሬተሮች፣ ሾፌሮች፣ ቴክኒሻኖች እና የማሽነሪ ስራ ስርዓት።"
      ),

      icon: Briefcase,
    },

    {
      title: t(
        "Transport & Logistics",
        "ትራንስፖርት እና ሎጂስቲክስ"
      ),

      description: t(
        "Low-bed, high-bed and machinery transportation providers.",
        "ሎው-ቤድ፣ ሀይ-ቤድ እና የማሽነሪ መጓጓዣ አቅራቢዎች።"
      ),

      icon: MapPinned,
    },

    {
      title: t(
        "Fuel & Lubricants",
        "ነዳጅ እና ቅባቶች"
      ),

      description: t(
        "Diesel supply, lubricants and industrial fuel partners.",
        "የዲዝል አቅርቦት፣ ቅባቶች እና የኢንዱስትሪ ነዳጅ አቅራቢዎች።"
      ),

      icon: Fuel,
    },

    {
      title: t(
        "Insurance & Financing",
        "ኢንሹራንስ እና ፋይናንስ"
      ),

      description: t(
        "Equipment loans, machinery leasing, escrow and insurance ecosystem.",
        "የማሽነሪ ብድር፣ ሊዝ፣ ኤስክሮው እና ኢንሹራንስ ስርዓት።"
      ),

      icon: Banknote,
    },

    {
      title: t(
        "Verified Seller System",
        "የተረጋገጠ የሻጭ ስርዓት"
      ),

      description: t(
        "Secure transactions, trusted sellers and fraud prevention.",
        "ደህንነቱ የተጠበቀ ግብይት፣ የታመኑ ሻጮች እና ማጭበርበር መከላከል።"
      ),

      icon: ShieldCheck,
    },

    {
      title: t(
        "Construction Companies",
        "የግንባታ ኩባንያዎች"
      ),

      description: t(
        "Contractors and project owners seeking machinery and operators.",
        "ማሽነሪ እና ኦፕሬተሮችን የሚፈልጉ ኮንትራክተሮች እና ፕሮጀክት ባለቤቶች።"
      ),

      icon: Hammer,
    },

    {
      title: t(
        "Machinery Intelligence",
        "የማሽነሪ ቴክኖሎጂ"
      ),

      description: t(
        "Future AI inspection, telematics and machine monitoring ecosystem.",
        "የወደፊት AI ምርመራ፣ ቴሌማቲክስ እና የማሽነሪ ክትትል ስርዓት።"
      ),

      icon: Cpu,
    },

    {
      title: t(
        "Support & Emergency Services",
        "ድጋፍ እና አስቸኳይ አገልግሎት"
      ),

      description: t(
        "On-site repair, emergency mechanics and rapid support network.",
        "የቦታ ላይ ጥገና፣ አስቸኳይ መካኒኮች እና ፈጣን የድጋፍ አውታረ መረብ።"
      ),

      icon: PhoneCall,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-yellow-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-black mb-8">

              🌍 ETHIOPIA MACHINERY ECOSYSTEM

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "One Digital Ecosystem For Everything Machinery",
                "ለማሽነሪ ሁሉ አንድ ዲጂታል ስርዓት"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              {t(
                "EML connects machinery owners, buyers, renters, operators, mechanics, transport providers, spare part suppliers, insurers, financiers and construction companies into one trusted bilingual ecosystem.",
                "EML የማሽነሪ ባለቤቶችን፣ ገዥዎችን፣ ተከራዮችን፣ ኦፕሬተሮችን፣ መካኒኮችን፣ አጓጓዦችን፣ የመለዋወጫ አቅራቢዎችን፣ ኢንሹራንስ እና ፋይናንስ ተቋማትን በአንድ የታመነ ባለ ሁለት ቋንቋ ስርዓት ያገናኛል።"
              )}

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/browse"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t(
                  "Explore Marketplace",
                  "ገበያውን ይመልከቱ"
                )}
              </Link>

              <Link
                href="/upload"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Upload Machinery",
                  "ማሽነሪ ይጨምሩ"
                )}
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="max-w-7xl mx-auto px-4 py-14">

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">
              12+
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Integrated Ecosystems",
                "የተዋሃዱ ስርዓቶች"
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">
              24/7
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Revenue Opportunities",
                "የገቢ እድሎች"
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">
              100%
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Bilingual Experience",
                "ባለ ሁለት ቋንቋ ስርዓት"
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl font-black text-yellow-400">
              🇪🇹
            </div>

            <div className="mt-3 text-zinc-400">
              {t(
                "Built For Ethiopia",
                "ለኢትዮጵያ የተገነባ"
              )}
            </div>
          </div>

        </div>

      </section>

      {/* ECOSYSTEM GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="mb-14">

          <div className="text-yellow-400 font-black tracking-widest mb-4">
            EML ECOSYSTEM
          </div>

          <h2 className="text-5xl font-black">

            {t(
              "Connected Stakeholders",
              "የተገናኙ ባለድርሻዎች"
            )}

          </h2>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {ecosystem.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1"
              >

                <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-6">
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-black mb-4">
                  {item.title}
                </h3>

                <p className="text-zinc-400 leading-8 mb-8">
                  {item.description}
                </p>

                <button className="inline-flex items-center gap-2 text-yellow-400 font-bold">
                  {t(
                    "Explore",
                    "ይመልከቱ"
                  )}

                  <ChevronRight size={18} />
                </button>

              </div>
            );
          })}

        </div>

      </section>

      {/* REVENUE SYSTEM */}

      <section className="border-t border-zinc-800 bg-zinc-900/50">

        <div className="max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-4xl">

            <div className="text-yellow-400 font-black tracking-widest mb-4">
              EML BUSINESS ENGINE
            </div>

            <h2 className="text-5xl font-black leading-tight">

              {t(
                "Built To Generate Revenue Even While You Sleep",
                "እርስዎ በሚተኙበት ጊዜም ገቢ ለማመንጨት የተገነባ"
              )}

            </h2>

            <div className="mt-10 grid md:grid-cols-2 gap-6">

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <div className="font-black text-yellow-400 text-xl mb-3">
                  {t(
                    "Core Revenue",
                    "ዋና ገቢ"
                  )}
                </div>

                <ul className="space-y-3 text-zinc-400 leading-7">

                  <li>• Machinery sales commission</li>
                  <li>• Machinery rental commission</li>
                  <li>• Featured premium listings</li>
                  <li>• Seller verification fees</li>

                </ul>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <div className="font-black text-yellow-400 text-xl mb-3">
                  {t(
                    "Future Revenue",
                    "የወደፊት ገቢ"
                  )}
                </div>

                <ul className="space-y-3 text-zinc-400 leading-7">

                  <li>• Spare part marketplace</li>
                  <li>• Logistics booking fees</li>
                  <li>• Insurance partnerships</li>
                  <li>• Financing & escrow service</li>

                </ul>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Truck,
  Construction,
  BadgeCheck,
  ChevronRight,
  BriefcaseBusiness,
  FileSignature,
  Handshake,
  Scale,
  Wallet,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

export default function ContractsPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    setLoading(true);

    const { data } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    setContracts(data || []);
    setLoading(false);
  }

  const contractTypes = [
    {
      title: t(
        "Machinery Sale Contract",
        "የማሽነሪ ሽያጭ ውል"
      ),
      description: t(
        "Secure buyer and seller agreements for machinery transactions.",
        "ለማሽነሪ ግብይቶች የገዢና ሻጭ ውል ስርዓት።"
      ),
      icon: Construction,
    },
    {
      title: t(
        "Rental Agreement",
        "የኪራይ ውል"
      ),
      description: t(
        "Rental protection for machinery owners and renters.",
        "ለኪራይ ባለቤቶች እና ተከራዮች የጥበቃ ውል።"
      ),
      icon: Handshake,
    },
    {
      title: t(
        "Transport Contract",
        "የመጓጓዣ ውል"
      ),
      description: t(
        "Logistics and cargo movement agreements.",
        "የሎጂስቲክስ እና ጭነት መጓጓዣ ውል።"
      ),
      icon: Truck,
    },
    {
      title: t(
        "Operator Agreement",
        "የኦፕሬተር ውል"
      ),
      description: t(
        "Protect machine operators and field workers.",
        "ኦፕሬተሮችን እና የመስክ ሰራተኞችን የሚጠብቅ ውል።"
      ),
      icon: ShieldCheck,
    },
    {
      title: t(
        "Service Agreement",
        "የአገልግሎት ውል"
      ),
      description: t(
        "Formal agreements for repair and maintenance services.",
        "ለጥገና እና ለሰርቪስ አገልግሎቶች የተደራጀ ውል።"
      ),
      icon: BriefcaseBusiness,
    },
    {
      title: t(
        "Financing Agreement",
        "የፋይናንስ ውል"
      ),
      description: t(
        "Structured financing and leasing contracts.",
        "የፋይናንስ እና ሊዝ ውል ስርዓት።"
      ),
      icon: Wallet,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-emerald-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-full font-black mb-8">
              📄 {t(
                "TM Smart Contract Infrastructure",
                "የTM ዘመናዊ የውል ስርዓት"
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {t(
                "Enterprise Contract Ecosystem",
                "የድርጅት የውል ስርዓት"
              )}
            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-3xl">
              {t(
                "TM provides trusted contract infrastructure for machinery transactions, rentals, logistics, financing and enterprise operations.",
                "TM ለማሽነሪ ግብይት፣ ለኪራይ፣ ለሎጂስቲክስ፣ ለፋይናንስ እና ለድርጅት ስራዎች የታመነ የውል ስርዓት ያቀርባል።"
              )}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/post-request"
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-black transition flex items-center gap-3"
              >
                <FileSignature size={20} />
                {t(
                  "Create Contract",
                  "ውል ይፍጠሩ"
                )}
              </Link>

              <Link
                href="/dashboard/deals"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition"
              >
                {t(
                  "Manage Deals",
                  "ግብይቶችን ያስተዳድሩ"
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTRACT TYPES */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <div className="text-emerald-400 font-black tracking-widest mb-4">
            {t("CONTRACT TYPES", "የውል አይነቶች")}
          </div>
          <h2 className="text-4xl font-black">
            {t(
              "Enterprise Legal Infrastructure",
              "የድርጅት ህጋዊ መሠረት"
            )}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contractTypes.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Icon className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mb-4">
                  {item.title}
                </h3>
                <p className="text-zinc-400 leading-8">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACTIVE CONTRACTS */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-emerald-400 font-black tracking-widest mb-3">
                {t("ACTIVE CONTRACTS", "ንቁ ውሎች")}
              </div>
              <h2 className="text-4xl font-black">
                {t(
                  "Enterprise Transactions",
                  "የድርጅት ግብይቶች"
                )}
              </h2>
            </div>

            <Link
              href="/dashboard/deals"
              className="text-emerald-400 font-bold flex items-center gap-2"
            >
              {t("View All Deals", "ሁሉንም ግብይቶች ይመልከቱ")}
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-500">
              {t("Loading contracts...", "ውሎች በመጫን ላይ...")}
            </div>
          ) : contracts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">
              <div className="text-2xl font-black mb-4">
                {t("No contracts available", "ምንም ውሎች የሉም")}
              </div>
              <p className="text-zinc-400 mb-8">
                {t(
                  "Start your first enterprise contract through TM.",
                  "የመጀመሪያውን የድርጅት ውል በTM ይጀምሩ።"
                )}
              </p>
              <Link
                href="/post-request"
                className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-black transition"
              >
                {t("Create Contract", "ውል ይፍጠሩ")}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {contracts.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-black">
                      {item.contract_type || t("Contract", "ውል")}
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                      <BadgeCheck size={16} />
                      VERIFIED
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
                    <FileText className="text-emerald-400" />
                  </div>

                  <h3 className="text-2xl font-black mb-4">
                    {item.title || "TM Contract"}
                  </h3>

                  <div className="space-y-4 text-zinc-300">
                    <div>
                      <div className="text-zinc-500 text-sm mb-1">
                        {t("Client", "ደንበኛ")}
                      </div>
                      <div className="font-bold">
                        {item.client_name || "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-sm mb-1">
                        {t("Provider", "አቅራቢ")}
                      </div>
                      <div className="font-bold">
                        {item.provider_name || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 text-sm">
                        {t("Contract Value", "የውል ዋጋ")}
                      </div>
                      <div className="text-emerald-400 font-black text-2xl">
                        ETB {Number(item.amount || 0).toLocaleString()}
                      </div>
                    </div>

                    <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-3 rounded-2xl font-black transition">
                      {t("View", "ይመልከቱ")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] p-10">
            <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="text-emerald-400 font-black tracking-widest mb-4">
                  {t("TM LEGAL TRUST", "የTM ህጋዊ እምነት")}
                </div>
                <h2 className="text-4xl font-black mb-6">
                  {t(
                    "Structured Enterprise Agreements",
                    "የተደራጀ የድርጅት ውል ስርዓት"
                  )}
                </h2>
                <p className="text-zinc-300 leading-8 text-lg">
                  {t(
                    "TM helps reduce disputes, improve trust and protect transactions through enterprise-level contract systems.",
                    "TM በድርጅት ደረጃ የውል ስርዓት በመጠቀም ክርክሮችን ይቀንሳል፣ እምነትን ያሳድጋል እና ግብይቶችን ይጠብቃል።"
                  )}
                </p>
              </div>

              <div className="w-28 h-28 rounded-[32px] bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Scale size={60} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
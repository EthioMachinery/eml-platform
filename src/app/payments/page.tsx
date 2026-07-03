"use client";

import Link from "next/link";
import {
  Smartphone,
  Landmark,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function PaymentsPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings (strictly typed to prevent implicit 'any' warnings)
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const methods = [
    {
      title: "Telebirr",
      description: t(
        "Fast mobile money transfers across Ethiopia.",
        "ፈጣን የቴሌብር ክፍያዎች።"
      ),
      icon: Smartphone,
    },
    {
      title: t(
        "Bank Transfer",
        "የባንክ ዝውውር"
      ),
      description: t(
        "Commercial Bank, Awash, Dashen and other banks.",
        "ንግድ ባንክ፣ አዋሽ፣ ዳሸን እና ሌሎች ባንኮች።"
      ),
      icon: Landmark,
    },
    {
      title: t(
        "Mobile Banking",
        "ሞባይል ባንኪንግ"
      ),
      description: t(
        "Secure digital banking ecosystem.",
        "ዘመናዊ የዲጂታል ባንኪንግ ስርዓት።"
      ),
      icon: CreditCard,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="max-w-4xl mb-16">
          <div className="text-yellow-400 font-black tracking-widest mb-4">
            ታማኝ ማሽነሪ
          </div>

          <h1 className="text-6xl font-black leading-tight mb-6">
            Trustworthy Machinery
          </h1>

          <div className="text-3xl font-black text-yellow-400 mb-8">
            {t(
              "Secure Payment Infrastructure",
              "የደህንነት ክፍያ ስርዓት"
            )}
          </div>

          <p className="text-zinc-400 text-xl leading-9">
            {t(
              "TM supports Telebirr, mobile banking, bank transfers and enterprise-level commission management built for the Ethiopian machinery ecosystem.",
              "TM ለኢትዮጵያ የማሽነሪ ስርዓት የተገነባ ቴሌብር፣ ሞባይል ባንኪንግ፣ ባንክ ዝውውር እና የኮሚሽን ስርዓትን ይደግፋል።"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {methods.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 hover:border-yellow-500/30 transition"
              >
                <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">
                  <Icon className="text-yellow-400" size={30} />
                </div>

                <h3 className="text-3xl font-black mb-5">
                  {item.title}
                </h3>

                <p className="text-zinc-400 leading-8">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[36px] p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-green-400 font-bold mb-4">
              <ShieldCheck size={22} />
              {t(
                "Protected Transactions",
                "የተጠበቁ ግብይቶች"
              )}
            </div>

            <h2 className="text-4xl font-black mb-4">
              {t(
                "Open TM Payment Center",
                "የTM ክፍያ ማዕከል ይክፈቱ"
              )}
            </h2>

            <p className="text-zinc-400 max-w-3xl leading-8">
              {t(
                "Escrow is optional. TM is optimized for Ethiopian payment realities while maintaining enterprise-level transaction protection.",
                "ኤስክሮው አማራጭ ነው። TM ለኢትዮጵያ የክፍያ ሁኔታዎች ተስማሚ ሆኖ በኢንተርፕራይዝ ደረጃ የግብይት ጥበቃ ያቀርባል።"
              )}
            </p>
          </div>

          <Link
            href="/payment"
            className="h-16 px-10 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center gap-3 transition"
          >
            {t(
              "Proceed to Payments",
              "ወደ ክፍያ ይቀጥሉ"
            )}
            <ChevronRight size={20} />
          </Link>
        </div>

      </section>

    </main>
  );
}
"use client";

import {
  Landmark,
  Smartphone,
  Upload,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function ManualPaymentsPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings (strictly typed to prevent implicit 'any' warnings)
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="max-w-5xl mx-auto px-4 py-20">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[36px] p-10">

          <div className="flex items-center gap-5 mb-10">

            <div className="w-20 h-20 rounded-[28px] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <ShieldCheck className="text-yellow-400" size={38} />
            </div>

            <div>
              <div className="text-yellow-400 font-black tracking-widest mb-2">
                ኢትዮ ማሽነሪ አገናኝ
              </div>

              <h1 className="text-5xl font-black">
                {t(
                  "Manual Payment Verification",
                  "የእጅ ክፍያ ማረጋገጫ"
                )}
              </h1>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                <Smartphone className="text-yellow-400" />
              </div>

              <h2 className="text-3xl font-black mb-5">
                Telebirr
              </h2>

              <div className="space-y-4 text-zinc-300">
                <div>
                  <span className="text-zinc-500">
                    Account:
                  </span>{" "}
                  EML Official
                </div>

                <div>
                  <span className="text-zinc-500">
                    Number:
                  </span>{" "}
                  09XXXXXXXX
                </div>
              </div>

            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                <Landmark className="text-yellow-400" />
              </div>

              <h2 className="text-3xl font-black mb-5">
                {t(
                  "Bank Transfer",
                  "የባንክ ዝውውር"
                )}
              </h2>

              <div className="space-y-4 text-zinc-300">
                <div>
                  <span className="text-zinc-500">
                    Bank:
                  </span>{" "}
                  Commercial Bank
                </div>

                <div>
                  <span className="text-zinc-500">
                    Account:
                  </span>{" "}
                  EML Machinery
                </div>
              </div>

            </div>

          </div>

          <div className="bg-zinc-950 border border-dashed border-yellow-500/30 rounded-3xl p-10 text-center">

            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-8">
              <Upload className="text-yellow-400" size={36} />
            </div>

            <h3 className="text-3xl font-black mb-5">
              {t(
                "Upload Payment Receipt",
                "የክፍያ ደረሰኝ ይላኩ"
              )}
            </h3>

            <p className="text-zinc-400 max-w-2xl mx-auto leading-8 mb-10">
              {t(
                "Enterprise-level receipt verification and anti-fraud checking will validate your transaction before approval.",
                "የኢንተርፕራይዝ ደረጃ የደረሰኝ ማረጋገጫ እና የማጭበርበር መከላከያ ስርዓት ግብይቱን ያረጋግጣል።"
              )}
            </p>

            <button className="h-16 px-10 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition">
              {t(
                "Upload Receipt",
                "ደረሰኝ ይላኩ"
              )}
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
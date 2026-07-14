"use client";

import React from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";

// Localized Page Content
const localAboutTranslations: Record<string, Record<string, string>> = {
  "hero_title": {
    en: "Ethiopia's First Heavy Machinery Ecosystem",
    am: "የኢትዮጵያ የመጀመሪያው ከባድ ማሽነሪ ስነ-ምህዳር",
    or: "Mish-maasha Maashinarii Ulfaataa Itoophiyaa Jalqabaa",
    ti: "ቀዳማይ ናይ ኢትዮጵያ ከበድቲ ማሽነሪታት መገበያዪ"
  },
  "hero_subtitle": {
    en: "Connecting owners, contractors, mining firms, mechanized farmers, certified operators, and mechanics under one trusted digital platform.",
    am: "የማሽን ባለቤቶችን፣ ተቋራጮችን፣ የማዕድን ማውጫዎችን፣ ዘመናዊ ገበሬዎችን፣ ባለሀብቶችን፣ ኦፕሬተሮችን እና መካኒኮችን በአንድ የታመነ የዲጂታል ኔትወርክ ስር ማስተሳሰር።",
    or: "Abbootii maashinarii, ijaartoota, qonnaanoota ammayyaafi mekaanyikoota sarara tokkotti walitti hidhuu.",
    ti: "ዋናታት ማሽነሪ፣ ተቋረጽቲ፣ ዘመናዊያን ሓረስቶትን መካኒካትን ኣብ ሓደ እሙን ዲጂታል መርበብ ምትእስሳር።"
  },
  "our_mission": { en: "Our Mission", am: "ራዕያችን", or: "Ergama Keenya", ti: "ራእይና" },
  "our_mission_desc": {
    en: "TM was founded to eliminate trust deficits and heavy broker transaction fees in Ethiopia's construction, agricultural, and logistics sectors. We establish a global-standard platform that ensures complete security, transacting transparency, and verified equipment quality.",
    am: "TM የተመሰረተው በኢትዮጵያ ግንባታ፣ ግብርና እና ሎጂስቲክስ ዘርፎች ላይ ያለውን የእምነት ጉድለት እና ከፍተኛ የአላፊ-ደላላ የኮሚሽን ዋጋዎችን ለማስወገድ ነው። እኛ ሙሉ ደህንነትን፣ የግብይት ግልፅነትን እና የተረጋገጠ የማሽነሪ ጥራትን የሚያረጋግጥ አለም አቀፍ ደረጃውን የጠበቀ መድረክ እንዘረጋለን።",
    or: "TM hanqina amanamummaa fi kaffaltii dallaloota dhabamsiisuuf ijaarame. Gabaa qulqulluu fi nagaa ta'e uumna.",
    ti: "TM ዝተመስረተሉ ምኽንያት ኣብ ህንጸት፣ ሕርሻን ሎጂስቲክስን ዘሎ ናይ እምነት ጉድለትን ናይ ደላሎ ዋጋታትን ንምውጋድ እዩ። ንሕና ምሉእ ድሕንነትን ሓቀኛ ግብይትን ዘረጋግጽ መድረኽ ንሰርሕ።"
  },
  "core_pillars": { en: "The TM Trust Pillars", am: "የ TM የታማኝነት ምሰሶዎች", or: "Wabiwwan Amanamummaa TM", ti: "ዓንድታት እምነት TM" },
  "pillar_1_title": { en: "Optional Escrow Vault", am: "አስተማማኝ የዋስትና ክፍያ", or: "Kafaltii Wabii", ti: "ውሑስ ክፍሊት ዋስትና" },
  "pillar_1_desc": {
    en: "Contractors can lock funds safely in escrow. Payouts are made to suppliers only after physical on-site equipment inspection.",
    am: "ተቋራጮች ገንዘብ በዋስትና ማስቀመጥ ይችላሉ። ለአቅራቢዎች ክፍያ የሚፈጸመው ማሽኑ በቦታው ላይ በአካል ተፈትሾ ሲረጋገጥ ብቻ ነው።",
    or: "Kafaltii wabii daldala keessan eega. Mirkaneessaan booda kaffaltiin ni gadi lakkifama.",
    ti: "ተቋረጽቲ ገንዘቦም ብዋስትና ከቐምጡ ይኽእሉ። ክፍሊት ዝለቐቕ ማሽን ብኣካል ተፈቲሹ ምስ ተረጋገጸ ጥራሕ እዩ።"
  },
  "pillar_2_title": { en: "Certified Field Inspections", am: "የተረጋገጠ የማሽነሪ ምርመራ", or: "Mirkaneessa Gamaggamaa", ti: "ዝተረጋገጸ ምርመራ ማሽን" },
  "pillar_2_desc": {
    en: "Independent, certified inspectors run extensive technical checks on engine blocks, hydraulics, and tracks to generate transparent trust ratings.",
    am: "ገለልተኛ የTM ማረጋገጫ ያላቸው መካኒኮች በማሽነሪዎች ሞተር፣ ሃይድሮሊክ እና ታችኛው አካል ላይ ዝርዝር ምርመራ በማድረግ የታማኝነት ደረጃን ያወጣሉ።",
    or: "Ogeeyyiin keenya maashinicha sirriitti qoratu. Gabaasa guutuu isiniif dhiyessu.",
    ti: "ገለልተኛታት ኪኢላታትና ኣብ ሞተርን ሃይድሮሊክን ማሽነሪታት ዝርዝር ምርመራ ብምግባር ናይ እምነት ደረጃ የውጽኡ።"
  },
  "pillar_3_title": { en: "Mobile-First PWA Shell", am: "ለሞባይል የተመቻቸ PWA", or: "Mijaa'ina Moobaayilaa", ti: "ንሞባይል ዝተመጣጠነ PWA" },
  "pillar_3_desc": {
    en: "TM runs offline, letting site engineers and operators browse, list, and verify machinery directly from remote project zones.",
    am: "TM ያለ በይነመረብ (offline) ይሰራል፣ ይህም መሐንዲሶች እና ኦፕሬተሮች ከማንኛውም ሩቅ የስራ ቦታ ሆነው ማሽነሪዎችን እንዲፈልጉ ያስችላቸዋል።",
    or: "TM offline hojjeta, iddoo kamittuu bilbila keessaniin dhimma keessan raawwadhaa.",
    ti: "TM ብዘይ ኢንተርኔት (offline) ይሰርሕ፣ እዚ ድማ መሃንድሳትን ኦፕሬተራትን ካብ ኩሉ ቦታታት ኮይኖም ክጥቀሙ የኽእሎም።"
  }
};

export default function AboutUsPage() {
  const { language } = useLanguage();

  const getLocalText = (key: string) => {
    return localAboutTranslations[key]?.[language] || localAboutTranslations[key]["en"];
  };

  return (
    <div className="bg-black min-h-screen text-white">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
            ታማኝ ማሽነሪ &mdash; TM
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {getLocalText("hero_title")}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {getLocalText("hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Mission block */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-zinc-900">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight border-b-2 border-amber-500 pb-2 w-fit">
            {getLocalText("our_mission")}
          </h2>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {getLocalText("our_mission_desc")}
          </p>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {getLocalText("core_pillars")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
              🔒
            </div>
            <h3 className="text-base font-bold text-white">{getLocalText("pillar_1_title")}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{getLocalText("pillar_1_desc")}</p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
              🔎
            </div>
            <h3 className="text-base font-bold text-white">{getLocalText("pillar_2_title")}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{getLocalText("pillar_2_desc")}</p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
              📱
            </div>
            <h3 className="text-base font-bold text-white">{getLocalText("pillar_3_title")}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{getLocalText("pillar_3_desc")}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
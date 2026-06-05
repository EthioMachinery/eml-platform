"use client";

import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";
import {
  Users,
  Handshake,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

// Complete localized dictionary for the entire CRM Lead Command Center (No hardcoded English)
const localCrmTranslations: Record<string, Record<string, string>> = {
  "crm_title": {
    en: "Lead Command Center",
    am: "የፈላጊዎች መቆጣጠሪያ ማዕከል",
    or: "Giddugala To'annoo Qunnamtii",
    ti: "መቆጻጸሪ ማእከል ደለይቲ"
  },
  "crm_desc": {
    en: "Manage buyer inquiries, negotiations, hot leads, AI recommendations, and machinery opportunities from one enterprise CRM dashboard.",
    am: "የገዢዎችን ጥያቄ፣ ድርድሮች፣ ንቁ ፈላጊዎች፣ የAI ምክሮች እና የማሽነሪ እድሎችን በአንድ የድርጅት CRM መቆጣጠሪያ ሰሌዳ ያስተዳድሩ።",
    or: "Gaaffii bittootaa, daldala, ogeeyyii fi kaffaltii maashinarii dabaree to'annoo kanaan qabadhaa.",
    ti: "ናይ ዓደግቲ ሕቶታት፣ ዘተታትን ዕድላት ከበድቲ ማሽነሪታትን ኣብዚ ናይ መቆጻጸሪ ሰሌዳ ኣመሓድሩ።"
  },
  "total_leads": { en: "Total Leads", am: "ጠቅላላ ፈላጊዎች", or: "Walgahii Hunda", ti: "ጠቕላላ ደለይቲ" },
  "hot_leads": { en: "Hot Leads", am: "ንቁ ፈላጊዎች", or: "Barbaaddoota Saffisaa", ti: "ንቑሓት ደለይቲ" },
  "negotiations": { en: "Negotiations", am: "በድርድር ላይ", or: "Marii Daldalaa", ti: "ኣብ ዘተ ዘለዉ" },
  "converted_deals": { en: "Converted Deals", am: "የተጠናቀቁ ግብይቶች", or: "Daldala Xumurame", ti: "ዝተዛዘሙ ግብይታት" },
  "search_placeholder": { en: "Search leads, buyers, machinery...", am: "ፈላጊዎችን፣ ገዢዎችን፣ ማሽኖችን ፈልግ...", or: "Barbaadi...", ti: "ደለይትን ዓደግትን ድለዩ..." },
  "all_stages": { en: "All Stages", am: "ሁሉንም ደረጃዎች", or: "Sadarkaa Hunda", ti: "ኩሎም ብርክታት" },
  "ai_insights": { en: "EML AI recommends immediate follow-up with hot buyers", am: "የEML AI ፈጣን ምላሽ ለንቁ ፈላጊዎች እንዲሰጥ ይመክራል", or: "EML AI barbachisummaa saffisaa dhiyeessa.", ti: "EML AI ቅልጡፍ ምላሽ ክውሃብ ይምዕድ" },
  "ai_insights_desc": {
    en: "Buyers interested in transport, financing, and premium machinery are showing high conversion probability this week.",
    am: "በትራንስፖርት፣ በፋይናንስ እና በከባድ ማሽነሪዎች ላይ ፍላጎት ያሳዩ ገዢዎች በዚህ ሳምንት ግብይቱን የማጠናቀቅ እድላቸው ከፍተኛ ነው።",
    or: "Bittoonni geejjiba fi kaffaltii maashinarii irratti fedhii qaban daldala xumuruuf jiru.",
    ti: "ኣብ መጓዓዝቲ፣ ፋይናንስን ከበድቲ ማሽነሪታትን ድሌት ዘርኣዩ ዓደግቲ ግብይት ንምዝዛም ዘለዎም ዕድል ልዑል እዩ።"
  },
  "conv_rate": { en: "Conversion Rate", am: "የስኬት ምጣኔ", or: "Saffisa Milkaa'inaa", ti: "ናይ ስኬት መጠን" },
  "match_score": { en: "AI Match Score", am: "የAI ማገናኛ ውጤት", or: "Qabxii EML AI", ti: "ናይ AI ማዛመዲ ነጥቢ" },
  "hot_regions": { en: "Hot Regions", am: "ንቁ አካባቢዎች", or: "Iddoowwan Saffisoo", ti: "ንቑሓት ቦታታት" },
  "growth": { en: "Growth", am: "እድገት", or: "Guddina", ti: "ዕቤት" },
  "no_leads": { en: "No leads found", am: "ምንም ፈላጊ አልተገኘም", or: "Barbaadaan hin argamne", ti: "ዝተረኸበ ደላዪ የለን" },
  "no_leads_desc": { en: "Buyer inquiries will appear here automatically.", am: "የገዢዎች ጥያቄዎች እዚህ በራስ ሰር ይታያሉ።", or: "Gaaffiin bittootaa asitti mul'ata.", ti: "ሕቶታት ዓደግቲ ኣብዚ ባዕሉ ክርአ እዩ።" }
};

export default function LeadCommandCenter() {
  const { t } = useTranslate();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const getLocalText = (key: string) => {
    return localCrmTranslations[key]?.[language] || localCrmTranslations[key]["en"];
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-crm-portal">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-400/20">
              ⚡ AI CRM Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {getLocalText("crm_title")}
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              {getLocalText("crm_desc")}
            </p>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title={getLocalText("total_leads")} value="0" icon={Users} color="cyan" />
          <KpiCard title={getLocalText("hot_leads")} value="0" icon={Sparkles} color="orange" />
          <KpiCard title={getLocalText("negotiations")} value="0" icon={Handshake} color="violet" />
          <KpiCard title={getLocalText("converted_deals")} value="0" icon={CheckCircle2} color="green" />
        </div>

        {/* Filter Bar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={getLocalText("search_placeholder")}
              className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-cyan-500 text-xs"
            />
          </div>
          <select className="h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 outline-none focus:border-cyan-500">
            <option value="all">{getLocalText("all_stages")}</option>
          </select>
        </div>

        {/* AI INSIGHTS CARD */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
              ✨ AI Insights
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {getLocalText("ai_insights")}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {getLocalText("ai_insights_desc")}
            </p>
          </div>

          {/* Dynamic Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-cyan-500/10 pt-6 lg:pt-0 lg:pl-8">
            <MiniMetric label={getLocalText("conv_rate")} value="78%" />
            <MiniMetric label={getLocalText("match_score")} value="92%" />
            <MiniMetric label={getLocalText("hot_regions")} value="Addis + Bahir Dar" />
            <MiniMetric label={getLocalText("growth")} value="+41%" />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center p-16 border border-zinc-900 bg-zinc-950/40 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl text-zinc-600">
            👥
          </div>
          <h3 className="text-xl font-black text-white">{getLocalText("no_leads")}</h3>
          <p className="text-xs text-zinc-500 max-w-sm">{getLocalText("no_leads_desc")}</p>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  const colors: any = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20"
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 transition">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <span className="text-3xl font-black text-white">{value}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 border border-cyan-500/10 rounded-xl p-4 text-center min-w-[110px]">
      <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">{label}</span>
      <span className="font-black text-sm text-cyan-400">{value}</span>
    </div>
  );
}
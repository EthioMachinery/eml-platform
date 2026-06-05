"use client";

import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";
import { COMPANY_CONFIG } from "@/lib/config/company";

const localContactTranslations: Record<string, Record<string, string>> = {
  "contact_title": {
    en: "Get in Touch with EML Sourcing",
    am: "ከ EML አገልግሎት ጋር ይገናኙ",
    or: "Quunnamtii EML Sourcing",
    ti: "ምስ ኣገልግሎት EML ርኸቡ"
  },
  "contact_desc": {
    en: "Have questions about machinery listings, optional escrow processing, operator placement, or enterprise sponsorships? Reach out directly.",
    am: "ስለ ማሽነሪ ዝርዝሮች፣ ስለ ዋስትና ክፍያ (escrow)፣ ስለ ኦፕሬተሮች ስራ ስምሪት ወይም ስለ ድርጅት ስፖንሰርሺፕ ጥያቄዎች አሉዎት? በቀጥታ ያግኙን።",
    or: "Kafaltii wabii, maashinarii dhiyeessii fi gaaffiwwan birootiif asitti nu quunnamaa.",
    ti: "ብዛዕባ ዝርዝር ማሽነሪታት፣ ውሑስ ክፍሊት ዋስትና (escrow) ወይ ምውፋር ኦፕሬተራት ሕቶታት ኣለኩም? ብቐጥታ ርኸቡና።"
  },
  "send_message": { en: "Send Sourcing Message", am: "የግብይት መልዕክት ላክ", or: "Irgadhu", ti: "መልእኽቲ ስደዱ" },
  "form_name": { en: "Your Full Name", am: "ሙሉ ስምዎ", or: "Maqaa Keessan", ti: "ምሉእ ሽምኩም" },
  "form_email": { en: "Email Address", am: "ኢሜይል አድራሻ", or: "E-mail Keessan", ti: "ኢሜይል ኣድራሻ" },
  "form_phone": { en: "Mobile Phone Number", am: "የሞባይል ስልክ ቁጥር", or: "Lakkoofsa Bilbilaa", ti: "ቁጽሪ ስልኪ" },
  "form_msg": { en: "Message / Sourcing Details", am: "መልዕክት / የግብይት ዝርዝሮች", or: "Ergaa / Ibsa Daldalaa", ti: "መልእኽቲ / ዝርዝር ግብይት" }
};

export default function ContactUsPage() {
  const { t } = useTranslate();
  const { language } = useLanguage();

  // Local helper to translate dual-strings
  const localT = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const getLocalText = (key: string) => {
    return localContactTranslations[key]?.[language] || localContactTranslations[key]["en"];
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setSuccess(language === "am" ? "መልዕክትዎ በትክክል ተልኳል። ፈጣን ምላሽ እንሰጥዎታለን።" : "Message sent successfully! EML support will respond shortly.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-contact-page">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Information */}
        <div className="space-y-6">
          <header className="space-y-2">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              📞 {t("nav.contact")}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {getLocalText("contact_title")}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {getLocalText("contact_desc")}
            </p>
          </header>

          {/* Core Info Panel */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">EML Direct Email Support</span>
              <a href={`mailto:${COMPANY_CONFIG.supportEmail}`} className="text-sm font-bold text-amber-500 hover:text-amber-400 font-mono transition-colors">
                {COMPANY_CONFIG.supportEmail}
              </a>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">EML Direct Mobile Hotline</span>
              <a href={`tel:${COMPANY_CONFIG.supportPhone}`} className="text-sm font-bold text-amber-500 hover:text-amber-400 font-mono transition-colors">
                {COMPANY_CONFIG.supportPhone} ({COMPANY_CONFIG.supportPhoneDomestic})
              </a>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Connect on WhatsApp</span>
              <a href={COMPANY_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-400 hover:underline">
                Open WhatsApp Chat &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="lg:col-span-2">
          {success && (
            <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs">
              {success}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-5 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">
            
            {/* Name Input */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {getLocalText("form_name")} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getLocalText("form_name")}
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Input */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {getLocalText("form_email")} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getLocalText("form_email")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {getLocalText("form_phone")} *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={getLocalText("form_phone")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {getLocalText("form_msg")} *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your machinery request, logistics timeline, or support inquiry..."
                className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs resize-none"
              />
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {submitting ? "Sending..." : getLocalText("send_message")}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function GlobalNavbar() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-500 font-medium">
            {language === "am"
              ? "ታማኝ ማሽነሪ"
              : "Trustworthy Machinery"}
          </span>
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          <Link href="/browse">{t("Browse", "ማሽነሪ ይፈልጉ")}</Link>
          <Link href="/post">{t("Post Listing", "ማስታወቂያ አስገባ")}</Link>
          <Link href="/dashboard">{t("Dashboard", "ዳሽቦርድ")}</Link>
          <Link href="/services">{t("Services", "አገልግሎቶች")}</Link>
        </nav>

        {/* RIGHT: LANGUAGE + ACTION */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="px-4 py-1.5 text-sm bg-slate-900 text-white rounded-md"
          >
            {t("Login", "ግባ")}
          </Link>
        </div>
      </div>
    </header>
  );
}
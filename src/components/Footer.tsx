"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/context/LanguageContext";
import TMLogo from "@/components/TMLogo";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();
  
  const marketplace = [
    { label: t("browse") || "Browse Machinery",     href: "/browse" },
    { label: t("requests") || "Post a Request",     href: "/post-request" },
    { label: t("services.jobs") || "Jobs",          href: "/jobs" },
    { label: t("nav.tenders") || "Tenders",                                   href: "/tenders" },
    { label: t("services.logistics") || "Transport", href: "/transport" },
    { label: t("services.spareParts") || "Spare Parts", href: "/spare-parts" },
    { label: t("services.escrow") || "Escrow",               href: "/escrow" },
  ];

  const company = [
    { label: t("nav.about") || "About TM",     href: "/about" },
    { label: t("nav.contact") || "Contact Us",   href: "/contact" },
    { label: t("nav.pricing") || "Pricing",      href: "/pricing" },
  ];

  const account = [
    { label: t("auth.login") || "Login",              href: "/login" },
    { label: t("footer.register") || "Sign Up",       href: "/register" },
    { label: t("dashboard") || "Dashboard",           href: "/dashboard" },
    { label: "List Machinery",                             href: "/post-machinery" },
    { label: "Seller Verification", href: "/seller/verify" },
  ];

  return (
    <footer style={{ backgroundColor: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            className="py-16 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <TMLogo size={48} />
              <div>
                <div className="text-white font-black text-sm font-noto-ethio">á‰³áˆ›áŠ áˆ›áˆ½áŠáˆª</div>
                <div className="text-blue-300 text-[9px] font-bold uppercase tracking-widest">
                  Trustworthy Machinery
                </div>
              </div>
            </Link>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-6">
              {t("footerDescription") || "Ethiopia's trusted heavy machinery marketplace â€” buy, sell, rent and operate."}
            </p>
            <div className="space-y-2 text-xs text-blue-300/60">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-blue-400 shrink-0" /> Addis Ababa, Ethiopia
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-blue-400 shrink-0" /> +251 911 000 000
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-blue-400 shrink-0" /> info@trustworthymachinery.com
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe size={12} className="text-blue-400" /> Marketplace
            </h4>
            <ul className="space-y-3">
              {marketplace.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">
              Account
            </h4>
            <ul className="space-y-3">
              {account.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-xs text-blue-300/60 hover:text-white font-bold uppercase
                               transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { code: "EN", label: "English" },
            { code: "áŠ áˆ›", label: "áŠ áˆ›áˆ­áŠ›" },
            { code: "OM", label: "Afaan Oromoo" },
            { code: "TI", label: "á‰µáŒáˆ­áŠ›" },
            { code: "SO", label: "Soomaali" },
          ].map((lang) => (
            <span key={lang.code}
              className="px-3 py-1 rounded-full text-[9px] font-black uppercase
                         border border-white/10 text-blue-300/60">
              {lang.code} Â· {lang.label}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between
                        items-center gap-4 text-[9px] text-blue-300/40 uppercase tracking-widest">
          <span>Â© 2026 Trustworthy Machinery (TM) Â· á‰³áˆ›áŠ áˆ›áˆ½áŠáˆª</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>Security: AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

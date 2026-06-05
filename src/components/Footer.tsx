"use client";

import React from "react";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";

export default function Footer() {
  const { t } = useTranslate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 py-12" id="eml-global-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info & Logo - Stacked Amharic on Top, English below */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 select-none w-fit">
              <img
                src="/logo.png"
                alt="EML Logo"
                className="h-10 w-auto object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-amber-500 text-sm font-black leading-tight tracking-wide">
                  ኢትዮ ማሽነሪ አገናኝ
                </span>
                <span className="text-zinc-500 text-[9px] font-bold leading-none tracking-widest uppercase mt-0.5">
                  Ethio Machinery Link
                </span>
              </div>
            </Link>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Column 1: Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {t("footer.marketplace")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  {t("nav.browse")}
                </Link>
              </li>
              <li>
                <Link href="/post-machinery" className="hover:text-white transition-colors">
                  {t("footer.upload")}
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-white transition-colors">
                  {t("footer.fleet")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-white transition-colors">
                  {t("footer.enterprise")}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-zinc-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-600 tracking-wider">
            &copy; {currentYear} EML &mdash; {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-4 text-[10px] text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
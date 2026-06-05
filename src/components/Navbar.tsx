"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslate, TranslationPath } from "@/hooks/useTranslate";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavItem {
  token: TranslationPath;
  href: string;
}

export default function Navbar() {
  const { t } = useTranslate();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Added About and Contact links to the primary menu array
  const navigationItems: NavItem[] = [
    { token: "nav.home", href: "/" },
    { token: "nav.browse", href: "/browse" },
    { token: "nav.postMachinery", href: "/post-machinery" },
    { token: "nav.postRequest", href: "/post-request" },
    { token: "nav.escrow", href: "/escrow" },
    { token: "nav.about", href: "/about" },   // Added
    { token: "nav.contact", href: "/contact" }, // Added
    { token: "nav.dashboard", href: "/dashboard" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50 w-full" id="eml-global-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Stacked Brand Name - Amharic on Top, English below */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 select-none">
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
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {t(item.token)}
                </Link>
              );
            })}
          </div>

          {/* Right Action Elements */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-950 text-xs font-bold uppercase tracking-wider transition-all"
            >
              {t("nav.login")}
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle Main Menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      <div
        className={`lg:hidden transition-all duration-200 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-black border-t border-zinc-950">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {t(item.token)}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-zinc-900 px-4">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-bold uppercase tracking-wider transition-all"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TMLogo from "@/components/TMLogo";
import {
  LayoutDashboard, Search, Bell, Menu, X,
  User as UserIcon, Home, Info, Phone,
  DollarSign, ChevronLeft, ChevronRight,
  LogIn, UserPlus, Truck, Wrench, FileText,
} from "lucide-react";

export default function Navbar() {
  const { t } = useI18n();
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const safeT = (key: string) => (typeof t === "function" ? t(key) : key);

  const navLinks = [
    { href: "/",          label: safeT("home") || "Home",         icon: Home },
    { href: "/browse",    label: safeT("browse") || "Browse",     icon: Search },
    { href: "/jobs",      label: safeT("jobs") || "Jobs",         icon: Wrench },
    { href: "/tenders",   label: "Tenders",                        icon: FileText },
    { href: "/transport", label: safeT("transport") || "Transport",icon: Truck },
    { href: "/pricing",   label: "Pricing",                        icon: DollarSign },
    { href: "/about",     label: "About Us",                       icon: Info },
    { href: "/contact",   label: "Contact",                        icon: Phone },
  ];

  // Active link: exact match for "/" else starts-with
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-lg text-[11px] font-bold uppercase transition-all ${
      isActive(href)
        ? "bg-white text-blue-900 shadow-sm"
        : "text-blue-200 hover:text-white hover:bg-white/10"
    }`;

  const mobileLinkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
      isActive(href)
        ? "bg-white text-blue-900"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-white/10
        ${scrolled ? "bg-blue-950/98 shadow-[0_4px_32px_rgba(0,0,0,0.5)]" : "bg-blue-950"}`}>

        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* BRAND — logo + fixed bilingual name */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <TMLogo size={40} />
            <div className="flex flex-col leading-tight">
              {/* These two lines are ALWAYS in Amharic + English regardless of language toggle */}
              <span className="text-white font-black text-[13px] tracking-tight" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                ታማኝ ማሽነሪ
              </span>
              <span className="text-blue-300 font-bold text-[9px] tracking-widest uppercase">
                Trustworthy Machinery
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Back / Forward */}
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
              <button onClick={() => window.history.back()}
                className="p-2 text-blue-300 hover:text-white hover:bg-white/10 transition-all" title="Back">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => window.history.forward()}
                className="p-2 text-blue-300 hover:text-white hover:bg-white/10 border-l border-white/10 transition-all" title="Forward">
                <ChevronRight size={14} />
              </button>
            </div>

            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-3 border-l border-white/20 pl-3">
                <Link href="/dashboard" className={linkClass("/dashboard") + " flex items-center gap-1.5"}>
                  <LayoutDashboard size={13} /> {safeT("dashboard") || "Dashboard"}
                </Link>
                <Link href="/notifications" className="p-2 text-blue-200 hover:text-white transition-colors relative">
                  <Bell size={18} />
                </Link>
                <Link href="/profile"
                  className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center border border-white/20 hover:border-white transition-all">
                  <UserIcon size={15} className="text-white" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-white/20 pl-3">
                <Link href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <LogIn size={13} /> {safeT("auth.login") || "Login"}
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 bg-white text-blue-900 text-[11px] font-black uppercase px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                  <UserPlus size={13} /> {safeT("auth.signUp") || "Sign Up"}
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen((p) => !p)}
              className="p-2 text-white rounded-lg hover:bg-white/10 transition-all" aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-[99] bg-blue-950 border-b border-white/10 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className={mobileLinkClass(link.href)}>
                  <Icon size={16} className={isActive(link.href) ? "text-blue-700" : "text-blue-300"} />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-white/10 my-2" />
            <div className="flex gap-2 px-2">
              <button onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-blue-200 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                <ChevronLeft size={14} /> {safeT("back") || "Back"}
              </button>
              <button onClick={() => window.history.forward()}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-blue-200 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                Forward <ChevronRight size={14} />
              </button>
            </div>
            <div className="border-t border-white/10 my-2" />
            {user ? (
              <>
                <Link href="/dashboard" className={mobileLinkClass("/dashboard")}>
                  <LayoutDashboard size={16} /> {safeT("dashboard") || "Dashboard"}
                </Link>
                <Link href="/notifications" className={mobileLinkClass("/notifications")}>
                  <Bell size={16} /> {safeT("notifications") || "Notifications"}
                </Link>
                <Link href="/profile" className={mobileLinkClass("/profile")}>
                  <UserIcon size={16} /> Profile
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-2 py-2">
                <Link href="/login" className="flex items-center justify-center gap-2 py-3 text-sm font-black text-white bg-white/10 rounded-xl hover:bg-white/20">
                  <LogIn size={16} /> {safeT("auth.login") || "Login"}
                </Link>
                <Link href="/register" className="flex items-center justify-center gap-2 py-3 text-sm font-black text-blue-900 bg-white rounded-xl hover:bg-blue-100">
                  <UserPlus size={16} /> {safeT("auth.signUp") || "Sign Up Free"}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

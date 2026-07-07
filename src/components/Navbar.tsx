"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LayoutDashboard, Search, Bell, Menu, X, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const safeT = (key: string) => (typeof t === "function" ? t(key) : key);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-blue-950 border-b border-white/10 shadow-[0_2px_24px_rgba(0,0,0,0.4)] h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          {/* BRAND */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/TM_logo.png"
                alt="ታማኝ ማሽነሪ Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-black text-[13px] tracking-tight">
                ታማኝ ማሽነሪ
              </span>
              <span className="text-blue-300 font-bold text-[10px] tracking-widest uppercase">
                Trustworthy Machinery
              </span>
            </div>
          </Link>

          {/* DESKTOP */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/browse" className="text-[11px] font-bold uppercase text-blue-200 hover:text-white transition-colors flex items-center gap-1.5">
              <Search size={13} /> {safeT("browse")}
            </Link>
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-5">
                <Link href="/dashboard" className="text-[11px] font-bold uppercase text-blue-200 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard size={13} /> {safeT("dashboard")}
                </Link>
                <Link href="/notifications" className="text-blue-200 hover:text-white transition-colors">
                  <Bell size={18} />
                </Link>
                <Link href="/profile" className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center border border-white/20 hover:border-white transition-all">
                  <UserIcon size={15} className="text-white" />
                </Link>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-blue-900 text-[11px] font-black uppercase px-5 py-2 rounded-xl hover:bg-blue-100 transition-all">
                LOGIN
              </Link>
            )}
          </div>

          {/* MOBILE */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen((p) => !p)} className="text-white p-1">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-[99] bg-blue-950 border-b border-white/10 shadow-xl lg:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/browse" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-bold text-white py-2 border-b border-white/10">
              <Search size={16} /> {safeT("browse")}
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-bold text-white py-2 border-b border-white/10">
                  <LayoutDashboard size={16} /> {safeT("dashboard")}
                </Link>
                <Link href="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-bold text-white py-2 border-b border-white/10">
                  <Bell size={16} /> {safeT("notifications")}
                </Link>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-bold text-white py-2">
                  <UserIcon size={16} /> Profile
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="bg-white text-blue-900 text-sm font-black uppercase px-5 py-3 rounded-xl text-center">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
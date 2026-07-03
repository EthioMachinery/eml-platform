"use client";

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { useAuth } from '@/components/AuthProvider';
import { LayoutDashboard, Search, Bell, Menu, User as UserIcon, Globe } from 'lucide-react';

export default function Navbar() {
  const { t, lang, setLanguage } = useI18n();
  const { user } = useAuth();

  const safeT = (key: string) => typeof t === 'function' ? t(key) : key;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-black text-white italic group-hover:bg-emerald-500 transition-colors">E</div>
          <span className="font-black text-sm tracking-tighter uppercase hidden lg:block">
            Trustworthy Machinery
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/browse" className="text-[10px] font-bold uppercase text-zinc-400 hover:text-emerald-500 transition-colors flex items-center gap-2">
            <Search size={14} /> <span className="hidden sm:inline">{safeT('browse')}</span>
          </Link>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase text-emerald-500 hover:border-emerald-500/50 transition-all"
          >
            <Globe size={12} /> {lang === 'en' ? 'AM' : 'EN'}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-8">
              <Link href="/dashboard" className="text-[10px] font-bold uppercase text-zinc-400 hover:text-emerald-500 transition-colors flex items-center gap-2">
                <LayoutDashboard size={14} /> <span className="hidden sm:inline">{safeT('dashboard')}</span>
              </Link>
              <Link href="/notifications" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Bell size={18} />
              </Link>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 hover:border-emerald-500 transition-all overflow-hidden">
                <UserIcon size={16} className="text-zinc-500" />
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-emerald-600 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
              Login
            </Link>
          )}
          
          <button className="lg:hidden text-white">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
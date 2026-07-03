"use client";

import React from 'react';
import { useI18n } from '@/context/LanguageContext';

/**
 * TM GLOBAL FOOTER — V3.0
 * Fully synchronized with Unified Language Engine.
 */
export default function Footer() {
  const { t } = useI18n();

  // Helper to ensure 't' is safe to call
  const safeT = (key: string) => typeof t === 'function' ? t(key) : key;

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-4 text-white">
            Trustworthy Machinery
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            ታማኝ ማሽነሪ - Ethiopia's premier autonomous marketplace for heavy equipment and industrial parts.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Marketplace</h4>
          <ul className="space-y-3 text-zinc-500 text-xs uppercase font-bold">
            <li><a href="/browse" className="hover:text-emerald-500 transition-colors">{safeT('browse')}</a></li>
            <li><a href="/requests" className="hover:text-emerald-500 transition-colors">{safeT('requests')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">System</h4>
          <ul className="space-y-3 text-zinc-500 text-xs uppercase font-bold">
            <li><a href="/about" className="hover:text-emerald-500 transition-colors">About TM</a></li>
            <li><a href="/pricing" className="hover:text-emerald-500 transition-colors">Platform Rates</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-zinc-600 uppercase tracking-widest">
        <span>© 2026 TM Industrial Ecosystem</span>
        <div className="flex gap-6">
          <span>Addis Ababa, Ethiopia</span>
          <span>Security: MIL-SPEC AES-256</span>
        </div>
      </div>
    </footer>
  );
}
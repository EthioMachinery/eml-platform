"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { 
  Cpu, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Navigation,
  Loader2,
  Shield
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { TMCore } from "@/core/tmCore";
import { useI18n } from "@/context/LanguageContext"; // NEW UNIFIED PATH
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function HomePage() {
  const { t } = useI18n();
  const [pulse, setPulse] = useState<any>({ growthIndex: "0.00", averageTransactionValue: 0 });
  const [loading, setLoading] = useState(true);

  // Helper to ensure 't' is safe to call
  const safeT = (key: string) => typeof t === 'function' ? t(key) : key;

  useEffect(() => {
    async function fetchMarketPulse() {
      try {
        const { data: deals, error } = await supabase
          .from('machinery')
          .select('*')
          .eq('status', 'active');
        
        if (!error && deals) {
          setPulse(TMCore.getPulse(deals));
        }
      } catch (e) {
        console.error("PULSE_ERROR", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMarketPulse();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full -z-10" />
        
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight uppercase">
          Trustworthy Machinery (TM) <br/>
          <span className="text-emerald-500 block mt-2 font-noto-ethio">ታማኝ ማሽነሪ</span>
        </h1>
        
        <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-bold uppercase tracking-[0.2em]">
          Building the Future of East African Industry.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/browse" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2 group shadow-xl shadow-emerald-900/20"
          >
            {safeT('browseTitle')} <ArrowRight size={16} />
          </Link>
          <a 
            href="https://t.me/EthioMachineryLinkBot" 
            target="_blank"
            className="bg-zinc-900 border border-white/10 text-white px-8 py-4 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2"
          >
            <Navigation size={16} className="text-blue-400" /> Telegram Marketplace
          </a>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 border-y border-white/5 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2 flex items-center gap-2">
              <Activity size={12} className="text-emerald-500" /> Velocity
            </div>
            <div className="text-2xl font-black tabular-nums">{loading ? '...' : `${pulse?.growthIndex || '0.00'}%`}</div>
          </div>
          
          <div>
            <div className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Avg. Price</div>
            <div className="text-2xl font-black tabular-nums">
              {loading ? '...' : Math.round(pulse?.averageTransactionValue || 0).toLocaleString()} 
              <span className="text-[10px] text-zinc-600 ml-1">ETB</span>
            </div>
          </div>

          <div>
            <div className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2 text-emerald-500">Security</div>
            <div className="text-xl font-black uppercase flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" /> Layer 7
            </div>
          </div>

          <div>
            <div className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Kernel</div>
            <div className="text-2xl font-black font-mono">
              v{TMCore?.version ? TMCore.version.split('-')[0] : '3.0.0'}
            </div>
          </div>
        </div>
      </section>

      <PWAInstallPrompt />
    </main>
  );
}
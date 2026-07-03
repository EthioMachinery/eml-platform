"use client";

import React, { useState } from 'react';
import { 
  Send, 
  Smartphone, 
  ShieldCheck, 
  Star, 
  Zap, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

/**
 * TM INDUSTRIAL NOTIFICATION TEST CONSOLE — V3.0
 * Verified for Next.js 16 / Turbopack
 * Use this to verify the Telegram Bridge is operational.
 */

export default function TestNotifyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerTest = async (type: 'INQUIRY' | 'REVIEW' | 'PAYMENT' | 'MATCH') => {
    if (!user) {
      alert("You must be logged in to test notifications.");
      return;
    }
    
    setLoading(true);
    setResult(null);

    // Mock data based on TM Industrial Standards
    const testData = {
      INQUIRY: { 
        buyer: "Abebe Kebede", 
        machine: "CAT 320D Excavator", 
        purpose: "Short-term Rental" 
      },
      REVIEW: { 
        buyer: "Sara Tekle", 
        rating: 5, 
        comment: "Excellent machine condition, highly recommended!" 
      },
      PAYMENT: { 
        ref: "CBE-TX-992384", 
        amount: 450000 
      },
      MATCH: { 
        machine: "Komatsu D155 Dozer", 
        location: "Addis Ababa / Bole" 
      }
    };

    try {
      const response = await fetch('/api/auto-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_user_id: user.id,
          type: type,
          data: testData[type]
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Transmission Error:", err);
      setResult({ success: false, error: "Network/Bridge Failure" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-32 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-2xl mx-auto border border-white/5 bg-zinc-900/40 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Background Aesthetic */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Terminal size={120} />
        </div>

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Smartphone size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Notification Node</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono">TM-INDUSTRIAL-LINK-01 // ADDIS ABABA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
          <TestButton 
            onClick={() => triggerTest('INQUIRY')} 
            label="Inquiry Alert" 
            icon={<Send size={18} />} 
            loading={loading}
          />
          <TestButton 
            onClick={() => triggerTest('REVIEW')} 
            label="Review Signal" 
            icon={<Star size={18} />} 
            loading={loading}
          />
          <TestButton 
            onClick={() => triggerTest('PAYMENT')} 
            label="Payment Ledger" 
            icon={<ShieldCheck size={18} />} 
            loading={loading}
          />
          <TestButton 
            onClick={() => triggerTest('MATCH')} 
            label="AI Match Logic" 
            icon={<Zap size={18} />} 
            loading={loading}
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-8 animate-pulse">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Transmitting_to_Satellite...</span>
          </div>
        )}

        {result && (
          <div className={`p-6 rounded-2xl border transition-all duration-700 animate-in fade-in slide-in-from-top-4 ${result.success ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
            <div className="flex items-center gap-3">
              {result.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-xs font-black uppercase tracking-widest">
                {result.success ? `LINK STABLE: MSG_ID ${result.data?.message_id || 'N/A'}` : `LINK ERROR: ${result.error}`}
              </span>
            </div>
            {result.success && (
              <p className="text-[10px] text-zinc-500 mt-2 ml-8 uppercase font-bold">Check your mobile Telegram app for the industrial payload.</p>
            )}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-white/5 text-[9px] text-zinc-600 leading-relaxed uppercase font-bold tracking-widest">
          SYSTEM_USER_UID: <span className="text-zinc-400 select-all font-mono">{user?.id || 'NOT_AUTHENTICATED'}</span> <br/>
          PROTOCOL: TELEGRAM_BOT_API_V6
        </div>
      </div>
    </div>
  );
}

/**
 * REUSABLE TEST BUTTON COMPONENT
 */
function TestButton({ onClick, label, icon, loading }: any) {
  return (
    <button 
      disabled={loading}
      onClick={onClick}
      className="p-5 bg-zinc-800/50 hover:bg-emerald-600 border border-white/5 hover:border-emerald-400 transition-all rounded-2xl flex items-center justify-between group"
    >
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      <div className="p-2 bg-black/20 rounded-lg group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
    </button>
  );
}
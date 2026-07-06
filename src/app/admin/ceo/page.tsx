"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Zap, 
  BarChart3, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { CEOAutopilot, AutopilotMode } from '@/core/ceoAutopilot';
import { RevenueEngine, DealRevenueScore } from '@/core/revenueEngine';
import { CEOIntelligence } from '@/core/ceoIntelligence';
import { DealIntelligence } from '@/core/dealIntelligence';
import { MarketStream } from '@/core/marketStream';
import { supabase } from '@/lib/supabaseClient';
import LiveEventStream from '@/components/admin/LiveEventStream';

/**
 * TM CEO COMMAND CENTER — V2.0 (WAR ROOM)
 * The central nervous system for the Global Machinery Ecosystem.
 */

export default function CEOCommandCenter() {
  const [mode, setMode] = useState<AutopilotMode>("SAFE");
  const [metrics, setMetrics] = useState<any>(null);
  const [topOpportunities, setTopOpportunities] = useState<DealRevenueScore[]>([]);
  const [riskSummary, setRiskSummary] = useState<any>(null);
  const [rankedDeals, setRankedDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshIntelligence();
    const interval = setInterval(refreshIntelligence, 30000);

    // Real-time market stream for live deal updates
    MarketStream.init().catch(console.error);

    return () => {
      clearInterval(interval);
      MarketStream.channel?.unsubscribe?.();
    };
  }, []);

  async function refreshIntelligence() {
    try {
      const { data: deals } = await supabase
        .from('deals')
        .select('*')
        .neq('status', 'completed_payout');

      if (deals) {
        // Revenue + financial opportunities
        const opportunity = await RevenueEngine.marketOpportunity(deals);
        setMetrics(opportunity);
        setTopOpportunities(opportunity.topFinancialOpportunities);

        // CEO-level risk + revenue intelligence
        const risk = CEOIntelligence.riskSummary(deals);
        setRiskSummary(risk);

        // Deal priority ranking for triage
        const analysis = DealIntelligence.analyzeDeals(deals);
        setRankedDeals(analysis.topDeals);
      }

      setMode(CEOAutopilot.getMode());
      setLoading(false);
    } catch (err) {
      console.error("Intelligence Fetch Error:", err);
    }
  }

  const toggleAutopilot = () => {
    const newMode = mode === "SAFE" ? "LIVE" : "SAFE";
    CEOAutopilot.setMode(newMode);
    setMode(newMode);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center font-mono text-emerald-500 animate-pulse">
      INITIALIZING_TM_ENGINE...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* --- TOP HUD (Heads-Up Display) --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">E</span>
            CEO Command Center
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">
            Autonomous OS v2.4 // Global Node: Addis Ababa
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-white/5">
          <div className="flex flex-col items-end px-3">
            <span className="text-[10px] text-zinc-500 uppercase">System Status</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ENCRYPTED_LINK
            </span>
          </div>
          
          <button 
            onClick={toggleAutopilot}
            className={`flex items-center gap-3 px-6 py-3 rounded-md transition-all duration-500 ${
              mode === 'LIVE' 
              ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' 
              : 'bg-zinc-800 text-zinc-400 grayscale'
            }`}
          >
            <Microchip className={`w-4 h-4 ${mode === 'LIVE' ? 'animate-spin' : ''}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase leading-none opacity-70">AI Autopilot</div>
              <div className="text-sm font-black tracking-widest">{mode}</div>
            </div>
          </button>
        </div>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FINANCIAL INTELLIGENCE (4/12) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Pipeline Gross Value</h3>
            <div className="text-4xl font-black text-white tabular-nums">
              {metrics?.pipelineGrossValue.toLocaleString()} <span className="text-sm text-zinc-500">ETB</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs">
              <ArrowUpRight className="w-4 h-4" /> 
              <span>+12.4% vs last period</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Risk-Adjusted Forecast</h3>
            <div className="text-4xl font-black text-purple-400 tabular-nums">
              {metrics?.realisticForecast.toLocaleString()} <span className="text-sm text-zinc-500">ETB</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 italic leading-relaxed">
              *Calculated using probability weighting and seller trust scores.
            </p>
          </div>

          {/* High Liquidity Hot-List */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" /> High Liquidity Deals
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {topOpportunities.map((deal) => (
                <div key={deal.dealId} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{deal.dealId.split('-')[0]}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Liquidity: {deal.liquidityScore}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-500">{deal.projectedNetProfit.toLocaleString()}</div>
                    <div className="text-[9px] text-zinc-600 uppercase">Est. Comm.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: LIVE TELEMETRY STREAM (5/12) */}
        <div className="col-span-12 lg:col-span-5 h-[calc(100vh-200px)]">
           <LiveEventStream />
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE + RISK (3/12) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">

          {/* Risk Summary — powered by CEOIntelligence */}
          {riskSummary && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-xs font-bold text-white uppercase">Risk Overview</h3>
              </div>
              <div className="space-y-2 text-[10px] uppercase">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Deals</span>
                  <span className="text-white font-bold">{riskSummary.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">At Risk</span>
                  <span className="text-red-400 font-bold">{riskSummary.risky}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">High Value</span>
                  <span className="text-yellow-400 font-bold">{riskSummary.highValue}</span>
                </div>
                <div className="mt-3 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${riskSummary.total > 0 ? Math.round(((riskSummary.total - riskSummary.risky) / riskSummary.total) * 100) : 100}%` }}
                  />
                </div>
                <div className="text-zinc-500 text-center">
                  {riskSummary.total > 0
                    ? `${Math.round(((riskSummary.total - riskSummary.risky) / riskSummary.total) * 100)}% clean`
                    : 'No deals yet'}
                </div>
              </div>
            </div>
          )}

          {/* Top Priority Deals — powered by DealIntelligence */}
          {rankedDeals.length > 0 && (
            <div className="bg-zinc-900/40 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase">Priority Queue</h3>
              </div>
              <div className="space-y-2">
                {rankedDeals.map((deal: any, i: number) => (
                  <div key={deal.id || i} className="flex justify-between text-[10px] p-2 bg-zinc-800/50 rounded">
                    <span className="text-zinc-300 truncate max-w-[120px]">{deal.id?.slice(0, 8) || `Deal ${i + 1}`}</span>
                    <span className={`font-bold ${deal.risk === 'DANGEROUS' ? 'text-red-400' : deal.risk === 'RISKY' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                      {deal.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Quick Actions */}
          <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl">
            <h3 className="text-xs font-bold text-white uppercase mb-4 tracking-tighter">AI Quick Actions</h3>
            <button
              onClick={refreshIntelligence}
              className="w-full py-2 mb-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase rounded transition-colors"
            >
              Re-Run Intelligence
            </button>
            <button
              onClick={() => setRankedDeals([])}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase rounded transition-colors"
            >
              Clear Queue
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
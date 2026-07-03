"use client";

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Package, 
  UserCheck, 
  Clock, 
  ExternalLink,
  PlusCircle,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
import Link from 'next/link';

/**
 * TM SELLER TRUST DASHBOARD — V3.0
 * The hub for verified machinery owners.
 */

export default function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ totalListings: 0, activeDeals: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSellerData();
  }, [user]);

  async function fetchSellerData() {
    // 1. Fetch Profile & Trust Score
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    // 2. Fetch Fleet Stats
    const { count: listingsCount } = await supabase
      .from('machinery')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    // 3. Fetch Revenue (Calculated from completed deals)
    const { data: deals } = await supabase
      .from('deals')
      .select('seller_receives')
      .eq('seller_id', user?.id)
      .eq('status', 'completed_payout');

    const totalRevenue = deals?.reduce((sum, d) => sum + (d.seller_receives || 0), 0) || 0;

    setProfile(profileData);
    setStats({
      totalListings: listingsCount || 0,
      activeDeals: 0, // Logic for active deals can be added here
      revenue: totalRevenue
    });
    setLoading(false);
  }

  if (loading) return <div className="h-screen bg-black flex items-center justify-center font-mono text-emerald-500">SYNCHRONIZING_SELLER_NODE...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER: TRUST IDENTITY --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-3xl font-black text-white relative">
              {profile?.full_name?.[0]}
              {profile?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1 rounded-full border-4 border-black">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                {profile?.full_name || 'Machinery Owner'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  Trust Score: {profile?.trust_score || 50}%
                </span>
                {profile?.verified ? (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                    <UserCheck size={12} /> Verified Seller
                  </span>
                ) : (
                  <Link href="/seller/verify" className="text-[10px] font-bold text-amber-500 uppercase hover:underline flex items-center gap-1">
                    <ShieldAlert size={12} /> Apply for Verification
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/post-machinery" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2">
              <PlusCircle size={16} /> {t('postMachine')}
            </Link>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <Package className="text-zinc-500" size={20} />
              <TrendingUp className="text-emerald-500" size={16} />
            </div>
            <div className="text-3xl font-black text-white">{stats.totalListings}</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Active Fleet Listings</div>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <Clock className="text-zinc-500" size={20} />
              <span className="text-[10px] font-bold text-blue-500 uppercase">Processing</span>
            </div>
            <div className="text-3xl font-black text-white">{stats.activeDeals}</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Pending Escrow Deals</div>
          </div>

          <div className="bg-emerald-600/5 border border-emerald-500/10 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <FileText className="text-emerald-500" size={20} />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Total Earnings</span>
            </div>
            <div className="text-3xl font-black text-white">
              {stats.revenue.toLocaleString()} <span className="text-xs text-zinc-600">ETB</span>
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Life-time Platform Payout</div>
          </div>
        </div>

        {/* --- RECENT ACTIVITY SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Marketplace Performance</h3>
              <button className="text-[10px] text-zinc-500 uppercase hover:text-white transition-colors">View All</button>
            </div>
            <div className="p-12 text-center opacity-20">
              <TrendingUp size={48} className="mx-auto mb-4" />
              <p className="text-xs uppercase font-bold tracking-widest">Analytics initializing...</p>
            </div>
          </div>

          <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Global Opportunities</h3>
            </div>
            <div className="p-8 space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-500/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">High Demand: Dozers</div>
                    <div className="text-[10px] text-zinc-500">AI predicts 15% price surge in Addis.</div>
                  </div>
                </div>
                <ArrowRight className="text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={16} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ArrowRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}
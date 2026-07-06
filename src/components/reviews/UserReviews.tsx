"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Star, User, CheckCircle2, MessageSquare } from 'lucide-react';
import { useI18n } from '@/context/LanguageContext';

export default function UserReviews({ sellerId }: { sellerId: string }) {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeT = (key: string) => typeof t === 'function' ? t(key) : key;

  useEffect(() => {
    async function fetchReviews() {
      if (!sellerId) return;
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles:buyer_id(full_name)')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      
      setReviews(data || []);
      setLoading(false);
    }
    fetchReviews();
  }, [sellerId]);

  if (loading) return <div className="p-4 animate-pulse bg-white/5 rounded-xl text-[10px] uppercase font-bold text-zinc-600">Loading Trust Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <MessageSquare className="text-emerald-500 w-4 h-4" /> {safeT('reviews.title')}
        </h3>
        <span className="text-[9px] font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded uppercase tracking-widest">{reviews.length} Verified Deals</span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-12 border border-dashed border-white/5 rounded-[2rem] text-center opacity-20">
          <p className="text-[10px] uppercase font-bold tracking-widest">{safeT('reviews.noReviews')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User size={14} className="text-zinc-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white uppercase tracking-tight">
                      {review.profiles?.full_name || 'Anonymous Buyer'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold uppercase mt-0.5">
                      <CheckCircle2 size={10} /> {safeT('reviews.verified')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < review.rating ? "#10b981" : "transparent"} 
                      className={i < review.rating ? "text-emerald-500" : "text-zinc-800"} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed italic font-light">"{review.comment}"</p>
              <div className="mt-4 text-[9px] text-zinc-600 font-mono uppercase border-t border-white/5 pt-3">
                Transaction ID: {review.id.split('-')[0]} // {new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
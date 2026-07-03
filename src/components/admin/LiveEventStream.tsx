"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Terminal, ShieldAlert, Cpu, CircleDollarSign, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * TM LIVE EVENT STREAM — V2.1
 * Listening to physical storage tables for real-time telemetry.
 */

export default function LiveEventStream() {
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    // 1. Initial Fetch from the VIEW (The view is fine for reading history)
    const fetchInitialEvents = async () => {
      const { data, error } = await supabase
        .from('admin_event_monitor') // Reading from view is fine
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (!error && data) setEvents(data);
      setStatus('connected');
    };

    fetchInitialEvents();

    // 2. Real-time Subscription to the PHYSICAL TABLE
    // We listen to 'eml_events' because that's where the POST route inserts data.
    const channel = supabase
      .channel('admin_live_feed')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'eml_events' // WATCH THE PHYSICAL TABLE
        },
        (payload) => {
          const newRow = payload.new;
          // Transform the raw table row into the View format for the UI
          const mappedEvent = {
            id: newRow.id,
            event_name: newRow.event_name || 'SYSTEM_EVENT',
            severity: newRow.severity || 'INFO',
            actor_name: 'LIVE_UPDATE',
            payload: newRow.payload,
            timestamp: newRow.created_at || new Date().toISOString()
          };
          
          setEvents((prev) => [mappedEvent, ...prev].slice(0, 50));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setStatus('connected');
        if (status === 'CHANNEL_ERROR') setStatus('error');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // UI Helper for styles
  const getSeverityStyles = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
    if (severity === 'WARNING') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (severity === 'AI_DECISION') return 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  return (
    <div className="flex flex-col h-full bg-black border border-white/10 rounded-xl overflow-hidden font-mono shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <h2 className="text-xs font-bold tracking-widest text-zinc-100 uppercase">Live Telemetry</h2>
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">TM-NODE-01</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide bg-[#050505]">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-[10px] uppercase">Syncing with industrial grid...</p>
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className={`p-3 border rounded-lg transition-all duration-700 flex items-start gap-4 ${getSeverityStyles(event.severity)}`}
            >
              <div className="mt-1">
                {event.severity === 'AI_DECISION' ? <Cpu className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-black uppercase text-white tracking-wide">
                    {event.event_name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[9px] opacity-50">
                    {formatDistanceToNow(new Date(event.timestamp))}
                  </span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed truncate">
                  {JSON.stringify(event.payload)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 px-4 bg-zinc-900 border-t border-white/5 flex justify-between text-[9px] text-zinc-500">
        <span>STATUS: {status.toUpperCase()}</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
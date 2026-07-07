"use client";

import { useEffect, useState } from "react";
import { Inbox, Phone, User, Wrench, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Lead = {
  id: string;
  message: string;
  status: string;
  created_at: string;
  sender_id: string;
  machinery_id: string;
  profiles: { full_name: string; phone: string; is_verified: boolean } | null;
  listings: { brand: string; model: string; price_sale: number } | null;
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  negotiating: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  closed: "bg-zinc-800 text-zinc-400 border-white/5",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadInboxPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("inquiries")
      .select("*, profiles!sender_id(full_name, phone, is_verified), listings(brand, model, price_sale)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    setLeads(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  const filters = ["all", "new", "contacted", "negotiating", "closed"];
  const visible = filter === "all" ? leads : leads.filter(l => l.status === filter);
  const newCount = leads.filter(l => l.status === "new").length;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Inbox className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Lead Inbox
            {newCount > 0 && <span className="ml-2 bg-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{newCount} new</span>}
          </h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${filter === f ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 py-20">Loading leads...</div>
      ) : visible.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter !== "all" ? filter : ""} leads yet.</p>
          <p className="text-xs text-zinc-600 mt-1">Leads appear when buyers inquire about your listings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(lead => (
            <div key={lead.id} className={`p-5 rounded-2xl border ${lead.status === "new" ? "bg-zinc-900/70 border-emerald-500/20" : "bg-zinc-900/30 border-white/5"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{lead.profiles?.full_name || "Anonymous"}</span>
                    {lead.profiles?.is_verified && <span className="text-[10px] text-emerald-400 font-bold">✓ VERIFIED</span>}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                      {lead.status || "new"}
                    </span>
                  </div>
                  {lead.listings && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
                      <Wrench size={11} /> {lead.listings.brand} {lead.listings.model}
                      {lead.listings.price_sale && <span className="text-yellow-400 ml-1">ETB {lead.listings.price_sale.toLocaleString()}</span>}
                    </div>
                  )}
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{lead.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1">
                    <Clock size={10} /> {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
                {lead.profiles?.phone && (
                  <a href={`tel:${lead.profiles.phone}`} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white text-xs font-bold rounded-xl transition">
                    <Phone size={12} /> Call
                  </a>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                {["contacted", "negotiating", "closed", "rejected"].map(s => (
                  lead.status !== s && (
                    <button key={s} onClick={() => updateStatus(lead.id, s)}
                      className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">
                      → {s}
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

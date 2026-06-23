"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Users, Handshake, CheckCircle2, Search, Clock } from "lucide-react";

type CrmStats = {
  totalInquiries: number;
  totalLeads: number;
  unlockedContacts: number;
  pendingReview: number;
};

type InquiryRow = {
  id: string;
  message: string;
  created_at: string;
  machinery_id: string | null;
  listing_title: string | null;
  sender_name: string | null;
};

export default function LeadCommandCenter() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CrmStats>({
    totalInquiries: 0,
    totalLeads: 0,
    unlockedContacts: 0,
    pendingReview: 0,
  });
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUserId(null); setLoading(false); return; }
    setUserId(user.id);
    await Promise.all([loadStats(user.id), loadInquiries(user.id)]);
    setLoading(false);
  }

  async function loadStats(uid: string) {
    const [
      { count: totalInquiries },
      { count: totalLeads },
      { count: unlockedContacts },
      { count: pendingReview },
    ] = await Promise.all([
      supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("owner_id", uid),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("seller_id", uid),
      supabase.from("lead_unlocks").select("*", { count: "exact", head: true }).eq("buyer_id", uid).eq("status", "approved"),
      supabase.from("lead_unlocks").select("*", { count: "exact", head: true }).eq("buyer_id", uid).eq("status", "pending_review"),
    ]);
    setStats({
      totalInquiries: totalInquiries || 0,
      totalLeads: totalLeads || 0,
      unlockedContacts: unlockedContacts || 0,
      pendingReview: pendingReview || 0,
    });
  }

  async function loadInquiries(uid: string) {
    const { data, error } = await supabase
      .from("inquiries")
      .select("id, message, created_at, machinery_id, sender_id")
      .eq("owner_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error || !data) return;
    const enriched: InquiryRow[] = await Promise.all(
      data.map(async (row) => {
        let listing_title: string | null = null;
        let sender_name: string | null = null;
        if (row.machinery_id) {
          const { data: listing } = await supabase.from("listings").select("title, title_en").eq("id", row.machinery_id).maybeSingle();
          if (listing) listing_title = listing.title_en || listing.title || null;
        }
        if (row.sender_id) {
          const { data: profile } = await supabase.from("profiles").select("full_name, phone_number, phone").eq("id", row.sender_id).maybeSingle();
          if (profile) sender_name = profile.full_name || profile.phone_number || profile.phone || null;
        }
        return { id: row.id, message: row.message, created_at: row.created_at, machinery_id: row.machinery_id, listing_title, sender_name };
      })
    );
    setInquiries(enriched);
  }

  if (!userId && !loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">Sign in to access your CRM dashboard.</p>
          <a href="/login" className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </main>
    );
  }

  const filtered = inquiries.filter((i) => {
    const q = searchTerm.toLowerCase();
    return (i.listing_title?.toLowerCase().includes(q) || i.sender_name?.toLowerCase().includes(q) || i.message?.toLowerCase().includes(q));
  });

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="border-b border-zinc-900 pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">Lead Command Center</h1>
          <p className="text-sm text-zinc-400 max-w-2xl">Manage buyer inquiries, active leads, and contact unlocks from one dashboard.</p>
        </header>

        {loading ? (
          <div className="text-center py-10 text-zinc-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="Total Inquiries" value={String(stats.totalInquiries)} icon={Users} color="cyan" />
            <KpiCard title="Buyer Leads" value={String(stats.totalLeads)} icon={Handshake} color="violet" />
            <KpiCard title="Unlocked Contacts" value={String(stats.unlockedContacts)} icon={CheckCircle2} color="green" />
            <KpiCard title="Pending Review" value={String(stats.pendingReview)} icon={Clock} color="orange" />
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inquiries, buyers, machinery..."
              className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 pl-12 pr-4 outline-none focus:border-cyan-500 text-sm text-white"
            />
          </div>
        </div>

        {!loading && (filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-zinc-900 bg-zinc-950/40 rounded-3xl text-center space-y-4">
            <h3 className="text-xl font-black text-white">{searchTerm ? "No matching inquiries" : "No inquiries yet"}</h3>
            <p className="text-xs text-zinc-500 max-w-sm">{searchTerm ? "Try a different search term." : "Buyer inquiries about your listings will appear here automatically."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((inquiry) => (
              <div key={inquiry.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{inquiry.listing_title || "Untitled listing"}</h3>
                    <p className="text-zinc-400 text-sm mt-1">From: {inquiry.sender_name || "Unknown"} &mdash; {new Date(inquiry.created_at).toLocaleString()}</p>
                  </div>
                  {inquiry.machinery_id && (
                    <a href={"/machinery/" + inquiry.machinery_id} className="text-cyan-400 text-sm underline shrink-0">View listing</a>
                  )}
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed">{inquiry.message}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  const colors: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
  };
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 transition">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className={"w-10 h-10 rounded-xl flex items-center justify-center border " + colors[color]}>
          <Icon size={18} />
        </div>
      </div>
      <span className="text-3xl font-black text-white">{value}</span>
    </div>
  );
}

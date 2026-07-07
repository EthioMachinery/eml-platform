"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Banknote, Briefcase, CheckCircle2, Clock3, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function DealsDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUserId(null); setLoading(false); return; }
    setUserId(user.id);
    await loadEscrows(user.id);
    setLoading(false);
  }

  async function loadEscrows(uid: string) {
    const { data, error } = await supabase
      .from("escrows")
      .select("id, total_amount, tm_commission_fee, supplier_payout_balance, current_stage, created_at, listing_id")
      .or("buyer_id.eq." + uid + ",seller_id.eq." + uid)
      .order("created_at", { ascending: false });

    if (error) { console.error("escrows fetch error:", error); return; }
    setEscrows(data || []);
  }

  const filteredDeals = useMemo(() => {
    if (activeTab === "all") return escrows;
    return escrows.filter((d) => d.current_stage === activeTab);
  }, [escrows, activeTab]);

  const totalRevenue = escrows.reduce((sum, d) => sum + Number(d.total_amount || 0), 0);
  const totalCommission = escrows.reduce((sum, d) => sum + Number(d.tm_commission_fee || 0), 0);
  const totalNet = escrows.reduce((sum, d) => sum + Number(d.supplier_payout_balance || 0), 0);

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  const tabs = [
    { key: "all", label: "All Deals" },
    { key: "awaiting_funding", label: "Pending" },
    { key: "funded", label: "Funded" },
    { key: "completed_payout", label: "Completed" },
  ];

  if (!userId && !loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">Sign in to view your deals dashboard.</p>
          <a href="/login" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-32">

      <section className="border-b border-zinc-800 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-zinc-500 font-bold mb-4">ETHIO MACHINERY LINK</p>
              <h1 className="text-5xl font-black leading-tight">Enterprise Deals Command Center</h1>
              <p className="mt-5 text-zinc-400 text-lg leading-8 max-w-4xl">
                Manage machinery sales, rentals, transport coordination, payments, and secure transaction workflows.
              </p>
            </div>
            <a href="/browse" className="h-14 px-7 rounded-2xl bg-yellow-500 hover:bg-yellow-400 transition flex items-center font-black text-black self-start">Browse Machinery</a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-10 text-zinc-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <KpiCard title="Total Deals" value={String(escrows.length)} icon={Briefcase} />
            <KpiCard title="Gross Revenue" value={"ETB " + formatter.format(totalRevenue)} icon={Banknote} />
            <KpiCard title="TM Commission" value={"ETB " + formatter.format(totalCommission)} icon={ShieldCheck} />
            <KpiCard title="Seller Net" value={"ETB " + formatter.format(totalNet)} icon={CheckCircle2} />
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={"px-6 h-12 rounded-2xl whitespace-nowrap font-bold transition " + (activeTab === tab.key ? "bg-yellow-500 text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-300")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        {loading ? null : filteredDeals.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">
            <h2 className="text-3xl font-black mb-4">No Deals Yet</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-8">
              Start building your machinery business by buying, selling, renting or transporting machinery.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-7 border-b border-zinc-800">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-4 py-2 rounded-full border text-sm font-black bg-zinc-800 text-yellow-400 border-zinc-700">
                          {String(deal.current_stage).replace(/_/g, " ")}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black mb-4">Deal #{deal.id.slice(0, 8)}</h2>
                      <div className="flex flex-wrap gap-5 text-zinc-400">
                        <div className="flex items-center gap-2"><Banknote size={18} />ETB {formatter.format(deal.total_amount)}</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={18} />Commission: ETB {formatter.format(deal.tm_commission_fee)}</div>
                        <div className="flex items-center gap-2"><Clock3 size={18} />{new Date(deal.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href={"/payment?deal=" + deal.id + "&amount=" + deal.total_amount} className="h-12 px-5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center gap-2"><CreditCard size={18} />Payment</a>
                      <a href="/logistics" className="h-12 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-bold flex items-center gap-2"><Truck size={18} />Logistics</a>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <WorkflowStep title="Sourced" active={true} />
                    <WorkflowStep title="Payment" active={deal.current_stage !== "awaiting_funding"} />
                    <WorkflowStep title="Delivery" active={deal.current_stage === "completed_payout"} />
                    <WorkflowStep title="Released" active={deal.current_stage === "completed_payout"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function KpiCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="text-zinc-400 font-semibold">{title}</div>
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center"><Icon size={26} /></div>
      </div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}

function WorkflowStep({ title, active }: any) {
  return (
    <div className={"rounded-2xl p-5 border " + (active ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-zinc-950 border-zinc-800 text-zinc-500")}>
      <div className="flex items-center justify-between">
        <div className="font-bold">{title}</div>
        <ArrowRight size={18} />
      </div>
    </div>
  );
}

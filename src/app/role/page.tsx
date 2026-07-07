"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Truck, Wrench, ShieldCheck, Building2, Users, ArrowRight } from "lucide-react";

const ROLES = [
  { id: "buyer", label: "Machinery Buyer", desc: "Browse and rent or buy heavy equipment", icon: Truck, color: "emerald" },
  { id: "seller", label: "Machinery Owner", desc: "List your machinery for rent or sale", icon: Building2, color: "blue" },
  { id: "agent", label: "Broker / Agent", desc: "Connect buyers and sellers for commission", icon: Users, color: "purple" },
  { id: "mechanic", label: "Mechanic / Technician", desc: "Offer maintenance and repair services", icon: Wrench, color: "yellow" },
];

export default function RolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirm() {
    if (!selected) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from("profiles").upsert({ id: user.id, role: selected });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white mx-auto mb-4">TM</div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">What best describes you?</h1>
          <p className="text-zinc-500 text-sm">Choose your role to personalise your TM experience</p>
        </div>

        <div className="space-y-3 mb-8">
          {ROLES.map(role => {
            const Icon = role.icon;
            const active = selected === role.id;
            return (
              <button key={role.id} onClick={() => setSelected(role.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition text-left ${
                  active ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{role.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{role.desc}</p>
                </div>
                {active && <ShieldCheck size={18} className="text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <button onClick={confirm} disabled={!selected || saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase text-sm rounded-2xl transition">
          {saving ? "Saving..." : "Continue to Dashboard"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

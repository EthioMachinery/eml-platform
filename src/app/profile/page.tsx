"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, Phone, Mail, ShieldCheck, Edit3, Save, X } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  bio: string;
  location: string;
  is_verified: boolean;
  is_premium: boolean;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
    setForm(data || {});
    setLoading(false);
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone,
      bio: form.bio,
      location: form.location,
    }).eq("id", profile.id);
    setProfile(prev => prev ? { ...prev, ...form } : prev);
    setEditing(false);
    setSaving(false);
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 hover:text-emerald-300 transition">
            <Edit3 size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"><X size={16} /></button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-lg transition">
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
        <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl font-black">
          {profile.full_name?.[0]?.toUpperCase() || "T"}
        </div>
        <div>
          <h2 className="text-xl font-black">{profile.full_name || "TM User"}</h2>
          <p className="text-zinc-400 text-sm capitalize">{profile.role || "Member"}</p>
          <div className="flex gap-2 mt-2">
            {profile.is_verified && <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400"><ShieldCheck size={10} /> Verified</span>}
            {profile.is_premium && <span className="text-[10px] font-bold uppercase text-yellow-400">⭐ Premium</span>}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {[
          { label: "Full Name", field: "full_name", icon: User },
          { label: "Phone", field: "phone", icon: Phone },
          { label: "Location", field: "location", icon: null },
        ].map(({ label, field, icon: Icon }) => (
          <div key={field} className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-2">{label}</label>
            {editing ? (
              <input
                value={(form as any)[field] || ""}
                onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-emerald-500"
              />
            ) : (
              <p className="text-sm text-white">{(profile as any)[field] || "—"}</p>
            )}
          </div>
        ))}

        <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-2">Email</label>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Mail size={14} className="text-zinc-500" /> {profile.email}
          </div>
        </div>

        <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-2">Bio</label>
          {editing ? (
            <textarea
              value={form.bio || ""}
              onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-emerald-500 resize-none"
              placeholder="Tell buyers about yourself..."
            />
          ) : (
            <p className="text-sm text-zinc-300">{profile.bio || "No bio yet."}</p>
          )}
        </div>

        <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-2">Member Since</label>
          <p className="text-sm text-zinc-300">{new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

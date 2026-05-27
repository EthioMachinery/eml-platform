"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type MatchItem = {
  id: string;
  title: string;
  type: string;
  location: string;
  price?: string;
  budget?: string;
  contact?: string;
  matchScore?: number;
};

export default function MatchCenterPage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [premium, setPremium] =
    useState(false);

  const [unlocked, setUnlocked] =
    useState<string[]>([]);

  const [sellerMatches, setSellerMatches] =
    useState<MatchItem[]>([]);

  const [buyerMatches, setBuyerMatches] =
    useState<MatchItem[]>([]);

  useEffect(() => {
    setLang(getLang());
    loadAll();
  }, []);

  async function loadAll() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    /* PREMIUM */
    const { data: p } =
      await supabase
        .from("premium_users")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .maybeSingle();

    setPremium(!!p);

    /* UNLOCKED LEADS */
    const { data: unlocks } =
      await supabase
        .from("lead_unlocks")
        .select("lead_id")
        .eq("user_id", user.id);

    setUnlocked(
      (unlocks || []).map(
        (x: any) => x.lead_id
      )
    );

    /* SIMPLE DATA */
    const { data: reqs } =
      await supabase
        .from("machinery_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const { data: mach } =
      await supabase
        .from("machinery")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setSellerMatches(
      (reqs || []).slice(0, 12)
    );

    setBuyerMatches(
      (mach || []).slice(0, 12)
    );
  }

  async function unlockLead(
    item: MatchItem
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("lead_unlocks")
      .insert([
        {
          user_id: user.id,
          lead_id: item.id,
          amount: 100,
        },
      ]);

    await supabase
      .from("payments")
      .insert([
        {
          user_id: user.id,
          amount: 100,
          method: "Telebirr",
          status: "pending",
          note:
            "Lead Unlock " +
            item.title,
        },
      ]);

    setUnlocked([
      ...unlocked,
      item.id,
    ]);
  }

  function canSee(id: string) {
    return (
      premium ||
      unlocked.includes(id)
    );
  }

  const isAm = lang === "am";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          {isAm
            ? "ስማርት ማች ማዕከል"
            : "Smart Match Center"}
        </h1>

        {/* SELLER LEADS */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">
            {isAm
              ? "የገዢ ሊዶች"
              : "Buyer Leads"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {sellerMatches.map(
              (item) => (
                <Card
                  key={item.id}
                  item={item}
                  canSee={canSee(
                    item.id
                  )}
                  unlockLead={
                    unlockLead
                  }
                  lang={lang}
                />
              )
            )}
          </div>
        </section>

        {/* BUYER MATCHES */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            {isAm
              ? "ተስማሚ ማሽነሪ"
              : "Matching Machinery"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {buyerMatches.map(
              (item) => (
                <Card
                  key={item.id}
                  item={item}
                  canSee={canSee(
                    item.id
                  )}
                  unlockLead={
                    unlockLead
                  }
                  lang={lang}
                />
              )
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

function Card({
  item,
  canSee,
  unlockLead,
  lang,
}: any) {
  const isAm =
    lang === "am";

  return (
    <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
      <h3 className="text-2xl font-bold mb-3">
        {item.title}
      </h3>

      <p className="text-zinc-400 mb-2">
        📍 {item.location}
      </p>

      <p className="text-zinc-400 mb-2">
        💰 {item.price ||
          item.budget}
      </p>

      <p className="text-zinc-400 mb-4">
        🎯 {item.matchScore || 90}%
      </p>

      {canSee ? (
        <>
          <p className="mb-4 text-green-400 font-bold">
            📞 {item.contact}
          </p>

          <a
            href={`https://wa.me/${item.contact}`}
            target="_blank"
            className="block text-center bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold"
          >
            WhatsApp
          </a>
        </>
      ) : (
        <>
          <p className="mb-4 text-red-400 font-bold">
            🔒 {isAm
              ? "100 ETB ክፈል"
              : "Pay 100 ETB"}
          </p>

          <button
            onClick={() =>
              unlockLead(
                item
              )
            }
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold"
          >
            {isAm
              ? "ክፈት"
              : "Unlock Lead"}
          </button>
        </>
      )}
    </div>
  );
}
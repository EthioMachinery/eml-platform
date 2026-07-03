"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Lang = "en" | "am";

type UserRef = {
  id: string;
  name: string;
  city: string;
  joined: number;
  reward: number;
};

export default function ReferralPage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [code] =
    useState("TM-BT-2026");

  const [copied,
    setCopied] =
    useState(false);

  const isAm =
    lang === "am";

  const referrals: UserRef[] = [
    {
      id: "1",
      name: "Abebe Transport",
      city: "Adama",
      joined: 4,
      reward: 400,
    },
    {
      id: "2",
      name: "Habesha Rentals",
      city: "Addis Ababa",
      joined: 7,
      reward: 700,
    },
    {
      id: "3",
      name: "North Parts",
      city: "Bahir Dar",
      joined: 2,
      reward: 200,
    },
  ];

  const stats =
    useMemo(() => {
      const totalUsers =
        referrals.reduce(
          (a, b) =>
            a + b.joined,
          0
        );

      const totalReward =
        referrals.reduce(
          (a, b) =>
            a + b.reward,
          0
        );

      return {
        totalUsers,
        totalReward,
      };
    }, []);

  async function copyCode() {
    await navigator.clipboard.writeText(
      code
    );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(
          false
        ),
      1500
    );
  }

  const t = {
    title: isAm
      ? "የግብዣ እና ሪፈራል ሞተር"
      : "Referral Growth Engine",

    sub: isAm
      ? "ተጠቃሚ ተጠቃሚን ያመጣ"
      : "Users Bring Users",

    yourCode: isAm
      ? "የእርስዎ ኮድ"
      : "Your Code",

    copy: isAm
      ? "ኮፒ"
      : "Copy",

    copied: isAm
      ? "ተኮፒ ተደርጓል"
      : "Copied",

    invite: isAm
      ? "ግብዣ ላክ"
      : "Invite",

    joined: isAm
      ? "ተቀላቀሉ"
      : "Joined",

    reward: isAm
      ? "ሽልማት"
      : "Reward",

    totalUsers: isAm
      ? "ጠቅላላ ሪፈራሎች"
      : "Total Referrals",

    totalReward: isAm
      ? "ጠቅላላ ሽልማት"
      : "Total Rewards",

    boost: isAm
      ? "ነፃ Boost"
      : "Free Boost",

    wallet: isAm
      ? "ቦርሳ"
      : "Wallet",
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* LANG */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() =>
              setLang("en")
            }
            className={`px-4 py-2 rounded-xl ${
              lang === "en"
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            EN
          </button>

          <button
            onClick={() =>
              setLang("am")
            }
            className={`px-4 py-2 rounded-xl ${
              lang === "am"
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            አማ
          </button>
        </div>

        {/* HERO */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <p className="text-zinc-400 text-xl">
            {t.sub}
          </p>
        </div>

        {/* CODE */}
        <div className="bg-zinc-900 rounded-3xl p-6 mb-8">
          <p className="text-zinc-400 mb-2">
            {t.yourCode}
          </p>

          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="text-3xl font-black text-green-400">
              {code}
            </div>

            <button
              onClick={
                copyCode
              }
              className="bg-green-600 py-3 rounded-2xl font-bold"
            >
              {copied
                ? t.copied
                : t.copy}
            </button>

            <button className="bg-cyan-600 py-3 rounded-2xl font-bold">
              {t.invite}
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              {t.totalUsers}
            </p>

            <p className="text-4xl font-black">
              {
                stats.totalUsers
              }
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              {t.totalReward}
            </p>

            <p className="text-4xl font-black text-yellow-400">
              {
                stats.totalReward
              } ETB
            </p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-zinc-900 rounded-3xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-5">
            Leaderboard
          </h3>

          <div className="space-y-4">
            {referrals.map(
              (r, i) => (
                <div
                  key={r.id}
                  className="grid md:grid-cols-4 gap-4 bg-zinc-800 rounded-2xl p-4"
                >
                  <div>
                    #{i + 1}{" "}
                    {r.name}
                  </div>

                  <div>
                    {r.city}
                  </div>

                  <div>
                    {t.joined}:{" "}
                    {
                      r.joined
                    }
                  </div>

                  <div className="text-green-400 font-bold">
                    {
                      r.reward
                    } ETB
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4">

          <Link
            href="/wallet"
            className="bg-yellow-500 text-black text-center py-3 rounded-2xl font-bold"
          >
            {t.wallet}
          </Link>

          <Link
            href="/machines"
            className="bg-green-600 text-center py-3 rounded-2xl font-bold"
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard"
            className="bg-cyan-600 text-center py-3 rounded-2xl font-bold"
          >
            {t.boost}
          </Link>

        </div>

      </div>
    </main>
  );
}
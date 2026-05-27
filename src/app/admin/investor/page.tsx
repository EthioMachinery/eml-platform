"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type Listing = {
  id: string;
  owner_id?: string;
  price?: number;
  created_at?: string;
};

type Payment = {
  id: string;
  amount?: number;
  created_at?: string;
};

type Profile = {
  id: string;
  created_at?: string;
};

export default function InvestorMetricsPage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [loading, setLoading] =
    useState(true);

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [profiles, setProfiles] =
    useState<Profile[]>([]);

  const [messagesCount,
    setMessagesCount] =
    useState(0);

  useEffect(() => {
    setLang(getLang());
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const {
      data: mach,
    } =
      await supabase
        .from(
          "machinery"
        )
        .select(
          "id,owner_id,price,created_at"
        );

    const {
      data: pay,
    } =
      await supabase
        .from(
          "premium_payments"
        )
        .select(
          "id,amount,created_at"
        )
        .eq(
          "status",
          "approved"
        );

    const {
      data: prof,
    } =
      await supabase
        .from(
          "profiles"
        )
        .select(
          "id,created_at"
        );

    const {
      count,
    } =
      await supabase
        .from(
          "messages"
        )
        .select(
          "*",
          {
            count:
              "exact",
            head: true,
          }
        );

    setListings(
      mach || []
    );

    setPayments(
      pay || []
    );

    setProfiles(
      prof || []
    );

    setMessagesCount(
      count || 0
    );

    setLoading(false);
  }

  const isAm =
    lang === "am";

  const now =
    new Date();

  const currentMonth =
    now
      .toISOString()
      .slice(
        0,
        7
      );

  const prevMonthDate =
    new Date(
      now.getFullYear(),
      now.getMonth() -
        1,
      1
    );

  const prevMonth =
    prevMonthDate
      .toISOString()
      .slice(
        0,
        7
      );

  const gmv =
    listings.reduce(
      (
        a,
        b
      ) =>
        a +
        Number(
          b.price ||
            0
        ),
      0
    );

  const mrr =
    payments
      .filter(
        (
          x
        ) =>
          x.created_at?.startsWith(
            currentMonth
          )
      )
      .reduce(
        (
          a,
          b
        ) =>
          a +
          Number(
            b.amount ||
              0
          ),
        0
      );

  const prevMRR =
    payments
      .filter(
        (
          x
        ) =>
          x.created_at?.startsWith(
            prevMonth
          )
      )
      .reduce(
        (
          a,
          b
        ) =>
          a +
          Number(
            b.amount ||
              0
          ),
        0
      );

  const growth =
    prevMRR > 0
      ? Math.round(
          ((mrr -
            prevMRR) /
            prevMRR) *
            100
        )
      : 100;

  const activeSellers =
    new Set(
      listings.map(
        (
          x
        ) =>
          x.owner_id
      )
    ).size;

  const totalUsers =
    profiles.length;

  const newUsersThisMonth =
    profiles.filter(
      (
        x
      ) =>
        x.created_at?.startsWith(
          currentMonth
        )
    ).length;

  const retention =
    totalUsers > 0
      ? Math.round(
          (activeSellers /
            totalUsers) *
            100
        )
      : 0;

  const cac =
    totalUsers > 0
      ? Math.round(
          5000 /
            totalUsers
        )
      : 0;

  const conversion =
    totalUsers > 0
      ? Math.round(
          (messagesCount /
            totalUsers) *
            100
        )
      : 0;

  const cards = [
    [
      isAm
        ? "ግምት GMV"
        : "Estimated GMV",
      `${gmv} ETB`,
      "text-green-400",
    ],
    [
      "MRR",
      `${mrr} ETB`,
      "text-yellow-400",
    ],
    [
      isAm
        ? "ወርሃዊ እድገት"
        : "Monthly Growth",
      `${growth}%`,
      "text-cyan-400",
    ],
    [
      isAm
        ? "ንቁ ሻጮች"
        : "Active Sellers",
      `${activeSellers}`,
      "",
    ],
    [
      isAm
        ? "Retention"
        : "Retention",
      `${retention}%`,
      "",
    ],
    [
      "CAC",
      `${cac} ETB`,
      "",
    ],
    [
      isAm
        ? "አዲስ ተጠቃሚዎች"
        : "New Users This Month",
      `${newUsersThisMonth}`,
      "",
    ],
    [
      isAm
        ? "Engagement"
        : "Lead Engagement",
      `${conversion}%`,
      "",
    ],
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {isAm
              ? "የኢንቨስተር መለኪያዎች"
              : "Investor Metrics"}
          </h1>

          <p className="text-zinc-400">
            {isAm
              ? "EML የእድገት ምልክቶች"
              : "Growth indicators for EML"}
          </p>
        </div>

        {loading && (
          <p>
            {isAm
              ? "በመጫን ላይ..."
              : "Loading..."
            }
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map(
            (
              c
            ) => (
              <div
                key={
                  c[0]
                }
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <p className="text-zinc-400">
                  {c[0]}
                </p>

                <h2
                  className={`text-4xl font-bold mt-2 ${c[2]}`}
                >
                  {c[1]}
                </h2>
              </div>
            )
          )}

        </div>

      </div>
    </main>
  );
}
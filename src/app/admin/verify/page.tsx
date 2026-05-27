"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type Row = {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  company?: string;
  status?: string;
  created_at?: string;
};

export default function AdminVerifyPage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [items, setItems] =
    useState<Row[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [msg, setMsg] =
    useState("");

  useEffect(() => {
    setLang(getLang());
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data } =
      await supabase
        .from("seller_verifications")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setItems(data || []);
    setLoading(false);
  }

  async function approve(
    id: string
  ) {
    await supabase
      .from(
        "seller_verifications"
      )
      .update({
        status:
          "approved",
      })
      .eq("id", id);

    setMsg(
      lang === "am"
        ? "ጸድቋል"
        : "Approved"
    );

    loadData();
  }

  async function reject(
    id: string
  ) {
    await supabase
      .from(
        "seller_verifications"
      )
      .update({
        status:
          "rejected",
      })
      .eq("id", id);

    setMsg(
      lang === "am"
        ? "ውድቅ ተደርጓል"
        : "Rejected"
    );

    loadData();
  }

  const isAm =
    lang === "am";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {isAm
              ? "ሻጭ ማረጋገጫ"
              : "Seller Verification"}
          </h1>

          <p className="text-zinc-400">
            {isAm
              ? "ታማኝ ሻጮችን ያጽድቁ"
              : "Approve trusted sellers"}
          </p>
        </div>

        {msg && (
          <div className="mb-6 bg-green-600 px-4 py-3 rounded-xl">
            {msg}
          </div>
        )}

        {loading && (
          <p>
            {isAm
              ? "በመጫን ላይ..."
              : "Loading..."}
          </p>
        )}

        <div className="space-y-5">

          {items.map(
            (
              item
            ) => (
              <div
                key={
                  item.id
                }
                className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800"
              >
                <div className="grid md:grid-cols-5 gap-4 mb-5">

                  <div>
                    <p className="text-zinc-500 text-sm">
                      USER
                    </p>
                    <p className="font-bold break-all">
                      {
                        item.user_id
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      NAME
                    </p>
                    <p>
                      {
                        item.full_name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      PHONE
                    </p>
                    <p>
                      {
                        item.phone
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      COMPANY
                    </p>
                    <p>
                      {
                        item.company
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      STATUS
                    </p>
                    <p className={
                      item.status ===
                      "approved"
                        ? "text-green-400"
                        : item.status ===
                          "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }>
                      {
                        item.status ||
                        "pending"
                      }
                    </p>
                  </div>

                </div>

                {(item.status ===
                  "pending" ||
                  !item.status) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        approve(
                          item.id
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold"
                    >
                      {isAm
                        ? "አጽድቅ"
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        reject(
                          item.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold"
                    >
                      {isAm
                        ? "ውድቅ"
                        : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            )
          )}

        </div>

      </div>
    </main>
  );
}
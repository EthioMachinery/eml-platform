"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type Machinery = {
  id: string;
  title: string;
  created_at?: string;
};

export default function MyMachineryPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [machines, setMachines] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setLang(getLang());
    init();
  }, []);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const uid = user?.id || "";
    setUserId(uid);

    if (!uid) {
      setLoading(false);
      return;
    }

    await fetchMachines(uid);
  }

  async function fetchMachines(uid: string) {
    setLoading(true);

    const { data } = await supabase
      .from("machinery")
      .select("*")
      .eq("owner_id", uid)
      .order("created_at", { ascending: false });

    setMachines(data || []);
    setLoading(false);
  }

  const t = (key: string) => {
    const dict: Record<string, string> = {
      deleteConfirm: lang === "am"
        ? "እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?"
        : "Are you sure you want to delete this item?",
      delete: lang === "am" ? "ሰርዝ" : "Delete",
      title: lang === "am" ? "የእኔ ማሽኖች" : "My Machinery",
    };

    return dict[key] || key;
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    await supabase.from("machinery").delete().eq("id", id);
    await fetchMachines(userId);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          {t("title")}
        </h1>

        {loading && (
          <p className="text-zinc-400">Loading...</p>
        )}

        {!loading && machines.length === 0 && (
          <p className="text-zinc-500">
            No machinery found
          </p>
        )}

        <div className="space-y-4">
          {machines.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{m.title}</p>
                <p className="text-zinc-500 text-sm">{m.id}</p>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold"
              >
                {t("delete")}
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
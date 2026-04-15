"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function MyMachinery() {

  const { t } = useLanguage();

  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data } = await supabase
      .from("machinery")
      .select("*")
      .eq("user_id", user.id);

    setMachines(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;

    await supabase.from("machinery").delete().eq("id", id);
    fetchMachines();
  };

  if (loading) {
    return <div className="text-white p-10">{t.loading}</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-8 text-center">
        {t.myMachinery}
      </h1>

      {machines.map((m) => (

        <div key={m.id} className="bg-gray-900 p-5 mb-4 rounded">

          <h2 className="text-yellow-400">{m.title}</h2>

          <p>{t.type}: {m.type}</p>
          <p>{t.location}: {m.location}</p>
          <p>{t.price}: {m.price}</p>

          <button
            onClick={() => handleDelete(m.id)}
            className="bg-red-500 px-4 py-2 mt-3 rounded"
          >
            {t.delete}
          </button>

        </div>

      ))}

    </main>
  );
}
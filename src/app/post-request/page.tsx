"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function PostRequest() {
  const router = useRouter();
  const { t } = useLanguage();

  const [machineType, setMachineType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [operatorRequired, setOperatorRequired] = useState(false);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!machineType || !location || !contact) {
      setMessage(t.fillRequired);
      return;
    }

    setLoading(true);
    setMessage(t.submitting);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage(t.loginRequired);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("machine_requests")
      .insert([
        {
          user_id: user.id,
          machine_type: machineType,
          location,
          budget,
          duration,
          operator_required: operatorRequired,
          description,
          contact,
        },
      ]);

    if (error) {
      setMessage(t.errorPosting);
      setLoading(false);
      return;
    }

    setMessage(t.successPost);
    setLoading(false);

    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      <h1 className="text-3xl text-yellow-400 mb-6">
        {t.postRequest}
      </h1>

      <div className="w-full max-w-sm">

        <input placeholder={t.type} value={machineType} onChange={(e)=>setMachineType(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input placeholder={t.location} value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input placeholder={t.budget} value={budget} onChange={(e)=>setBudget(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input placeholder={t.duration} value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input placeholder={t.contact} value={contact} onChange={(e)=>setContact(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <textarea placeholder={t.description} value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-3 mb-3 rounded bg-white text-black" />

        <label className="flex items-center mb-4">
          <input type="checkbox" checked={operatorRequired} onChange={()=>setOperatorRequired(!operatorRequired)} className="mr-2"/>
          {t.operator}
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-yellow-500 text-black rounded"
        >
          {loading ? t.posting : t.submit}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </main>
  );
}
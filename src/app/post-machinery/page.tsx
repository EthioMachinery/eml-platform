"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function PostMachinery() {

  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [demandScore, setDemandScore] = useState(0);

  const [loading, setLoading] = useState(false);

  // 🤖 SMART PRICING
  const fetchSmartPrice = async () => {
    if (!type || !location) return;

    const res = await fetch("/api/smart-pricing", {
      method: "POST",
      body: JSON.stringify({ type, location }),
    });

    const data = await res.json();

    setSuggestedPrice(data.suggestedPrice);
    setDemandScore(data.demandScore);
  };

  useEffect(() => {
    fetchSmartPrice();
  }, [type, location]);

  const handleSubmit = async () => {

    if (!title || !type || !location || !price) {
      alert(t.fillRequired);
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert(t.loginRequired);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("machinery")
      .insert([
        {
          user_id: user.id,
          title,
          type,
          location,
          price,
          smart_price: suggestedPrice,
          demand_score: demandScore,
          availability: "available",
        },
      ]);

    if (error) {
      console.error(error);
      alert(t.errorPosting);
    } else {
      alert(t.successPost);
      setTitle("");
      setType("");
      setLocation("");
      setPrice("");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-6 text-center">
        {t.postMachine}
      </h1>

      <div className="max-w-md mx-auto space-y-4">

        <input
          placeholder={t.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 text-black rounded"
        />

        <input
          placeholder={t.type}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 text-black rounded"
        />

        <input
          placeholder={t.location}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 text-black rounded"
        />

        <input
          placeholder={t.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 text-black rounded"
        />

        {/* 🤖 AI INSIGHT */}
        {suggestedPrice > 0 && (
          <div className="bg-yellow-100 text-black p-3 rounded">
            💡 Suggested Price: {suggestedPrice} ETB  
            <br />
            🔥 Demand Score: {demandScore}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-3 rounded"
        >
          {loading ? t.submitting : t.submit}
        </button>

      </div>

    </main>
  );
}
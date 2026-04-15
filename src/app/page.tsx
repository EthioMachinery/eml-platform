"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { AIEngine } from "@/lib/aiEngine";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const [machines, setMachines] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [recommended, setRecommended] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [best, setBest] = useState<any[]>([]);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: auth } = await supabase.auth.getUser();
    setUser(auth.user);

    const { data: machinesData } = await supabase
      .from("machines")
      .select("*");

    const { data: dealsData } = await supabase
      .from("deals")
      .select("*");

    setMachines(machinesData || []);
    setDeals(dealsData || []);

    applyAI(machinesData || [], dealsData || []);
  };

  // =========================
  // AI LOGIC
  // =========================
  const applyAI = (machines: any[], deals: any[]) => {
    const preference = {
      category: "",
      location: "Addis Ababa",
      budget: 100000000,
    };

    setRecommended(
      AIEngine.matchMachines(machines, preference).slice(0, 6)
    );

    setTrending(
      AIEngine.trendingMachines(machines, deals).slice(0, 6)
    );

    setBest(
      AIEngine.bestDeals(machines).slice(0, 6)
    );
  };

  // =========================
  // UI COMPONENT
  // =========================
  const Section = ({ title, data }: any) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {data.map((m: any) => (
          <Link key={m.id} href={`/machinery/${m.id}`}>
            <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">

              <img
                src={m.image_url || "/placeholder.jpg"}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-bold">{m.name}</h3>

              <p className="text-sm text-gray-600">{m.location}</p>

              <p className="text-yellow-600 font-bold">
                {m.price} ETB
              </p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            ኢትዮ ማሽነሪ አገናኝ
          </h1>
          <p className="text-gray-600">
            Smart Machinery Marketplace for Ethiopia
          </p>
        </div>

        {/* AI SECTIONS */}
        <Section title="🤖 Recommended for You" data={recommended} />
        <Section title="🔥 Trending Machines" data={trending} />
        <Section title="💰 Best Deals" data={best} />

      </div>

    </div>
  );
}
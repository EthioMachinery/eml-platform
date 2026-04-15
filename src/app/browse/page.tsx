"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { AIEngine } from "@/lib/aiEngine";
import { useLanguage } from "@/lib/LanguageContext";

export default function BrowsePage() {
  const { t } = useLanguage();

  const [machines, setMachines] = useState<any[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(100000000);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    applySmartFilter();
  }, [machines, category, location, maxPrice]);

  const fetchMachines = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("machines")
      .select("*")
      .order("created_at", { ascending: false });

    setMachines(data || []);
    setLoading(false);
  };

  // =========================
  // AI SMART FILTER
  // =========================
  const applySmartFilter = () => {
    const smart = AIEngine.matchMachines(machines, {
      category: category || "",
      location: location || "",
      budget: maxPrice || 0,
    });

    setFilteredMachines(smart);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {t.browse || "Browse Machinery"}
          </h1>
          <p className="text-gray-600 text-sm">
            Find machines to buy, rent, or service
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Category (e.g Excavator)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Location (e.g Addis Ababa)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="border p-2 rounded"
          />

          <button
            onClick={applySmartFilter}
            className="bg-black text-white rounded px-4 py-2"
          >
            Apply Filter
          </button>

        </div>

        {/* LIST */}
        {loading ? (
          <div>Loading machines...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {filteredMachines.length === 0 && (
              <div className="col-span-3 text-center bg-white p-6 rounded shadow">
                No machines found
              </div>
            )}

            {filteredMachines.map((machine) => (
              <Link key={machine.id} href={`/machinery/${machine.id}`}>
                <div className="bg-white rounded shadow hover:shadow-lg transition p-4 cursor-pointer">

                  {/* IMAGE */}
                  <img
                    src={machine.image_url || "/placeholder.jpg"}
                    alt={machine.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />

                  {/* INFO */}
                  <h2 className="font-bold text-lg mb-1">
                    {machine.name}
                  </h2>

                  <p className="text-sm text-gray-600 mb-2">
                    {machine.location}
                  </p>

                  <p className="text-yellow-600 font-bold">
                    {machine.price} ETB
                  </p>

                  {/* AI SCORE */}
                  {machine.score !== undefined && (
                    <p className="text-xs text-green-600 mt-1">
                      Match Score: {machine.score}
                    </p>
                  )}

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
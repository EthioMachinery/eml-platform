"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AIEngine } from "../../lib/aiEngine";
import { matchingEngine } from "../../lib/matchingEngine";
import { useLanguage } from "../../lib/LanguageContext";

interface Machinery {
  id: string;
  title: string | null;
  type: string | null;
  location: string | null;
  price: string | null;
  price_value: number | null;
  image_url: string | null;
}

export default function BrowsePage() {
  const [machines, setMachines] = useState<Machinery[]>([]);
  const [filtered, setFiltered] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { lang } = useLanguage();

  useEffect(() => {
    fetchMachines();
  }, []);

  async function fetchMachines() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machinery") // ✅ FIXED TABLE NAME
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching machinery:", error);
    } else {
      setMachines(data || []);
      setFiltered(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    applyFilters();
  }, [typeFilter, locationFilter, maxPrice, machines]);

  function applyFilters() {
    let result = [...machines];

    if (typeFilter) {
      result = result.filter((m) =>
        m.type?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter((m) =>
        m.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (maxPrice) {
      result = result.filter((m) => {
        const price = m.price_value ?? parseFloat(m.price || "0");
        return price <= parseFloat(maxPrice);
      });
    }

    // ✅ AI ranking (safe fallback)
    try {
      result = AIEngine.rankMachines(result, {
        category: typeFilter,
        location: locationFilter,
      });
    } catch (e) {
      console.warn("AI ranking skipped:", e);
    }

    setFiltered(result);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "ማሽነሪ ፈልግ" : "Browse Machinery"}
      </h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder={lang === "am" ? "አይነት (Type)" : "Type"}
          className="p-2 rounded bg-gray-800"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />

        <input
          placeholder={lang === "am" ? "አካባቢ" : "Location"}
          className="p-2 rounded bg-gray-800"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <input
          type="number"
          placeholder={lang === "am" ? "ከፍተኛ ዋጋ" : "Max Price"}
          className="p-2 rounded bg-gray-800"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <p>
          {lang === "am"
            ? "ምንም ማሽነሪ አልተገኘም"
            : "No machines found."}
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((machine) => (
            <div
              key={machine.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
            >
              {machine.image_url && (
                <img
                  src={machine.image_url}
                  alt="machinery"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h3 className="text-lg font-semibold">
                {machine.title || "Machinery"}
              </h3>

              <p className="text-sm text-gray-400">
                {machine.type || "Unknown type"}
              </p>

              <p className="text-sm">
                📍 {machine.location || "Unknown location"}
              </p>

              <p className="text-sm font-bold mt-2">
                💰{" "}
                {machine.price_value ??
                  machine.price ??
                  0}{" "}
                ETB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
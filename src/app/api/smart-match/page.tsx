"use client";

import { useState } from "react";

type MatchItem = {
  candidate: {
    id: string;
    title: string;
    category: string;
    location: string;
    price?: number;
    verified?: boolean;
  };
  score: number;
  reasons: string[];
};

export default function SmartMatchPage() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchItem[]>([]);

  async function handleSearch() {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/smart-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: {
            id: crypto.randomUUID(),
            category,
            location,
            budget: Number(budget || 0)
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.matches || []);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Smart Match
          </h1>

          <p className="mt-3 text-gray-600">
            Instantly find the best machinery providers,
            rentals, transporters, and services.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-4 gap-4">

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Machinery Type"
            className="border rounded-lg px-4 py-3 w-full"
          />

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="border rounded-lg px-4 py-3 w-full"
          />

          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="border rounded-lg px-4 py-3 w-full"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-900 text-white rounded-lg px-4 py-3 font-medium"
          >
            {loading ? "Searching..." : "Find Matches"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="mt-8 space-y-4">

          {!loading && results.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No matches yet. Start your search.
            </div>
          )}

          {results.map((item) => (
            <div
              key={item.candidate.id}
              className="bg-white rounded-xl border shadow-sm p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div>
                  <h2 className="text-xl font-semibold">
                    {item.candidate.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {item.candidate.category} • {item.candidate.location}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">
                    Score {item.score}
                  </div>

                  {item.candidate.price && (
                    <div className="text-sm text-gray-500">
                      ETB {item.candidate.price.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* BADGES */}
              <div className="mt-3 flex flex-wrap gap-2">
                {item.candidate.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}

                {item.reasons.map((reason, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}
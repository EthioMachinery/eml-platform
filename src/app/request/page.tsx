"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function submitRequest() {
    setLoading(true);
    setSuccess("");

    const { error } = await supabase
      .from("requests")
      .insert([
        {
          title,
          city,
          category,
          budget: Number(budget),
          details,
        },
      ]);

    setLoading(false);

    if (!error) {
      setSuccess("Request posted successfully.");
      setTitle("");
      setCity("");
      setCategory("");
      setBudget("");
      setDetails("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Post Request</h1>

        <div className="space-y-4">
          <input
            placeholder="Need Excavator..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 p-4 rounded-2xl"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-zinc-900 p-4 rounded-2xl"
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-900 p-4 rounded-2xl"
          />

          <input
            placeholder="Budget ETB"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-zinc-900 p-4 rounded-2xl"
          />

          <textarea
            placeholder="Describe your need..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full bg-zinc-900 p-4 rounded-2xl h-32"
          />

          <button
            onClick={submitRequest}
            disabled={loading}
            className="w-full bg-green-600 rounded-2xl py-4 font-bold"
          >
            {loading ? "Posting..." : "Submit Request"}
          </button>

          {success && (
            <p className="text-green-400">{success}</p>
          )}
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type Machine = {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  available: boolean;
};

type Props = {
  data: Machine[];
  onFilter: (filtered: Machine[]) => void;
};

export default function SmartSearch({ data, onFilter }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let filtered = data;

    // 🔍 Search
    if (query) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 📦 Category
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    // 📍 Location
    if (location) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 💰 Price
    if (maxPrice) {
      filtered = filtered.filter((item) => item.price <= Number(maxPrice));
    }

    // ✅ Availability
    if (availableOnly) {
      filtered = filtered.filter((item) => item.available);
    }

    onFilter(filtered);
  }, [query, category, location, maxPrice, availableOnly, data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 border p-2 rounded-lg mb-4">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search machinery..."
          className="w-full outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-5 gap-3">

        {/* CATEGORY */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="excavator">Excavator</option>
          <option value="crane">Crane</option>
          <option value="loader">Loader</option>
        </select>

        {/* LOCATION */}
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Max Price (ETB)"
          className="border p-2 rounded"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        {/* AVAILABILITY */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available Only
        </label>

        {/* RESET */}
        <button
          onClick={() => {
            setQuery("");
            setCategory("");
            setLocation("");
            setMaxPrice("");
            setAvailableOnly(false);
          }}
          className="bg-black text-white rounded px-3 py-2"
        >
          Reset
        </button>

      </div>
    </div>
  );
}
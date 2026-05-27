"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  title: string;
  category: string;
  href: string;
  location: string;
};

export default function UniversalSearchEngine() {
  const [query, setQuery] =
    useState("");

  const [searched, setSearched] =
    useState(false);

  const data = useMemo<Item[]>(
    () => [
      {
        title:
          "CAT Excavator 320D",
        category:
          "Machinery",
        href: "/machines",
        location:
          "Addis Ababa",
      },
      {
        title:
          "Certified Excavator Operator",
        category:
          "Operator",
        href: "/jobs",
        location:
          "Adama",
      },
      {
        title:
          "Low-bed Transport 40 Ton",
        category:
          "Transport",
        href: "/transport",
        location:
          "Modjo",
      },
      {
        title:
          "Hydraulic Pump Spare Parts",
        category:
          "Parts",
        href: "/parts",
        location:
          "Addis Ababa",
      },
      {
        title:
          "Construction Insurance Package",
        category:
          "Insurance",
        href: "/insurance",
        location:
          "Addis Ababa",
      },
    ],
    []
  );

  const results =
    data.filter((x) =>
      x.title
        .toLowerCase()
        .includes(
          query.toLowerCase()
        ) ||
      x.category
        .toLowerCase()
        .includes(
          query.toLowerCase()
        ) ||
      x.location
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
    );

  function searchNow() {
    setSearched(true);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

      <h2 className="text-3xl font-black mb-4 text-white">
        Universal Smart Search
      </h2>

      <p className="text-zinc-400 mb-6">
        Search machinery, operators,
        transport, spare parts,
        insurance and more.
      </p>

      {/* INPUT */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">

        <input
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          placeholder="Search excavator, operator, low-bed..."
          className="md:col-span-4 bg-black border border-zinc-700 rounded-2xl px-4 py-4 text-white outline-none"
        />

        <button
          onClick={
            searchNow
          }
          className="bg-green-600 hover:bg-green-700 rounded-2xl font-bold"
        >
          Search
        </button>

      </div>

      {/* RESULTS */}
      {searched && (
        <div className="space-y-4">

          {query.trim() &&
          results.length >
            0 ? (
            results.map(
              (
                item,
                i
              ) => (
                <Link
                  key={i}
                  href={
                    item.href
                  }
                  className="block bg-zinc-800 hover:bg-zinc-700 rounded-2xl p-4"
                >
                  <p className="font-bold text-white">
                    {
                      item.title
                    }
                  </p>

                  <p className="text-sm text-zinc-400">
                    {
                      item.category
                    } •{" "}
                    {
                      item.location
                    }
                  </p>
                </Link>
              )
            )
          ) : (
            <div className="bg-zinc-800 rounded-2xl p-5">

              <p className="font-bold text-white mb-2">
                No exact results found
              </p>

              <p className="text-zinc-400 mb-4">
                Post your demand and suppliers
                will respond.
              </p>

              <Link
                href="/request"
                className="inline-block bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl font-bold"
              >
                Post Request
              </Link>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
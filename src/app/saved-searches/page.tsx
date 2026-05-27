"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "am";

type AlertItem = {
  id: string;
  keyword: string;
  city: string;
  type: string;
  maxPrice: string;
  instant: boolean;
  active: boolean;
  matches: number;
};

export default function SavedSearchesPage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const [keyword, setKeyword] =
    useState("");

  const [city, setCity] =
    useState("");

  const [type, setType] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [instant, setInstant] =
    useState(true);

  const [items, setItems] =
    useState<AlertItem[]>([
      {
        id: "1",
        keyword: "Excavator",
        city: "Addis Ababa",
        type: "Heavy",
        maxPrice: "8000000",
        instant: true,
        active: true,
        matches: 3,
      },
      {
        id: "2",
        keyword: "Lowbed",
        city: "Hawassa",
        type: "Transport",
        maxPrice: "",
        instant: true,
        active: true,
        matches: 1,
      },
    ]);

  const isAm =
    lang === "am";

  const t = {
    title: isAm
      ? "የተቀመጡ ፍለጋዎች"
      : "Saved Search Alerts",

    sub: isAm
      ? "አዲስ ማቻዎችን በራስ-ሰር ያግኙ"
      : "Get new matching listings automatically",

    keyword: isAm
      ? "ቃል / ማሽን"
      : "Keyword / Machine",

    city: isAm
      ? "ከተማ"
      : "City",

    type: isAm
      ? "አይነት"
      : "Type",

    max: isAm
      ? "ከፍተኛ ዋጋ"
      : "Max Price",

    create: isAm
      ? "ማንቂያ ፍጠር"
      : "Create Alert",

    all: isAm
      ? "ሁሉም"
      : "All",

    other: isAm
      ? "ሌላ"
      : "Other",

    heavy: isAm
      ? "ከባድ"
      : "Heavy",

    transport: isAm
      ? "ትራንስፖርት"
      : "Transport",

    operator: isAm
      ? "ኦፕሬተር"
      : "Operator",

    parts: isAm
      ? "ክፍሎች"
      : "Parts",

    on: isAm
      ? "ንቁ"
      : "Active",

    off: isAm
      ? "ቆሟል"
      : "Paused",

    instant: isAm
      ? "ፈጣን ማሳወቂያ"
      : "Instant Alert",

    found: isAm
      ? "ማቻዎች"
      : "Matches",

    pause: isAm
      ? "አቁም"
      : "Pause",

    start: isAm
      ? "ጀምር"
      : "Start",

    delete: isAm
      ? "ሰርዝ"
      : "Delete",
  };

  const totalMatches =
    useMemo(
      () =>
        items.reduce(
          (sum, x) =>
            sum +
            x.matches,
          0
        ),
      [items]
    );

  function addAlert() {
    if (!keyword.trim())
      return;

    const row: AlertItem =
      {
        id: Date.now().toString(),
        keyword,
        city:
          city ||
          "All",
        type:
          type ||
          "All",
        maxPrice,
        instant,
        active: true,
        matches: 0,
      };

    setItems([
      row,
      ...items,
    ]);

    setKeyword("");
    setCity("");
    setType("");
    setMaxPrice("");
    setInstant(true);
  }

  function toggle(
    id: string
  ) {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              active:
                !x.active,
            }
          : x
      )
    );
  }

  function remove(
    id: string
  ) {
    setItems((prev) =>
      prev.filter(
        (x) =>
          x.id !== id
      )
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-5">
      <div className="max-w-6xl mx-auto">

        {/* top */}
        <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black">
              {t.title}
            </h1>
            <p className="text-zinc-400">
              {t.sub}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setLang(
                  "en"
                )
              }
              className={`px-3 py-2 rounded-xl ${
                lang ===
                "en"
                  ? "bg-green-600"
                  : "bg-zinc-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() =>
                setLang(
                  "am"
                )
              }
              className={`px-3 py-2 rounded-xl ${
                lang ===
                "am"
                  ? "bg-green-600"
                  : "bg-zinc-800"
              }`}
            >
              አማ
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-3xl p-5">
            <p className="text-zinc-400">
              Alerts
            </p>
            <p className="text-3xl font-black">
              {items.length}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-5">
            <p className="text-zinc-400">
              {t.found}
            </p>
            <p className="text-3xl font-black text-yellow-400">
              {totalMatches}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-5">
            <p className="text-zinc-400">
              Instant
            </p>
            <p className="text-3xl font-black text-green-400">
              {
                items.filter(
                  (
                    x
                  ) =>
                    x.instant
                ).length
              }
            </p>
          </div>
        </div>

        {/* form */}
        <div className="bg-zinc-900 rounded-3xl p-5 mb-6 grid md:grid-cols-5 gap-4">
          <input
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target
                  .value
              )
            }
            placeholder={
              t.keyword
            }
            className="bg-black border border-zinc-700 rounded-2xl px-4 py-3"
          />

          <select
            value={city}
            onChange={(e) =>
              setCity(
                e.target
                  .value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-4 py-3"
          >
            <option value="">
              {t.all}
            </option>
            <option>
              Addis Ababa
            </option>
            <option>
              Adama
            </option>
            <option>
              Hawassa
            </option>
            <option>
              Gondar
            </option>
            <option value="other">
              {t.other}
            </option>
          </select>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target
                  .value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-4 py-3"
          >
            <option value="">
              {t.all}
            </option>
            <option>
              {t.heavy}
            </option>
            <option>
              {t.transport}
            </option>
            <option>
              {t.operator}
            </option>
            <option>
              {t.parts}
            </option>
            <option value="other">
              {t.other}
            </option>
          </select>

          <input
            value={
              maxPrice
            }
            onChange={(e) =>
              setMaxPrice(
                e.target
                  .value
              )
            }
            placeholder={
              t.max
            }
            className="bg-black border border-zinc-700 rounded-2xl px-4 py-3"
          />

          <button
            onClick={
              addAlert
            }
            className="bg-green-600 rounded-2xl font-bold"
          >
            {t.create}
          </button>

          <label className="md:col-span-5 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={
                instant
              }
              onChange={(e) =>
                setInstant(
                  e.target
                    .checked
                )
              }
            />
            {t.instant}
          </label>
        </div>

        {/* list */}
        <div className="space-y-4">
          {items.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800"
              >
                <div className="flex flex-wrap gap-4 justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {
                        item.keyword
                      }
                    </h3>

                    <p className="text-zinc-400 mt-1">
                      📍 {
                        item.city
                      } •{" "}
                      {
                        item.type
                      }
                    </p>

                    {item.maxPrice && (
                      <p className="text-sm mt-1">
                        ≤{" "}
                        {
                          item.maxPrice
                        }{" "}
                        ETB
                      </p>
                    )}

                    <p className="text-sm mt-2 text-yellow-400">
                      {
                        item.matches
                      }{" "}
                      {t.found}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        item.active
                          ? "text-green-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {item.active
                        ? t.on
                        : t.off}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() =>
                          toggle(
                            item.id
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-cyan-600 text-sm"
                      >
                        {item.active
                          ? t.pause
                          : t.start}
                      </button>

                      <button
                        onClick={() =>
                          remove(
                            item.id
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-red-600 text-sm"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </main>
  );
}
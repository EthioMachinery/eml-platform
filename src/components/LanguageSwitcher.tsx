"use client";

import {
  LANGUAGES,
} from "@/constants/languages";

import {
  useLanguage,
} from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const {
    language,
    setLanguage,
  } = useLanguage();

  return (
    <div className="flex items-center gap-2">

      {LANGUAGES.map(
        (lang) => (
          <button
            key={lang.code}
            onClick={() =>
              setLanguage(
                lang.code
              )
            }
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all duration-200 ${
              language ===
              lang.code
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {lang.label}
          </button>
        )
      )}

    </div>
  );
}
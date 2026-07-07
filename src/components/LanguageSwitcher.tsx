"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { type SupportedLanguage } from "@/translations/keys";

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  native: string;
  subLabel: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English",      native: "English",      subLabel: "EN" },
  { code: "am", label: "Amharic",      native: "አማርኛ",         subLabel: "AM" },
  { code: "or", label: "Afaan Oromoo", native: "Afaan Oromoo", subLabel: "OM" },
  { code: "ti", label: "Tigrinya",     native: "ትግርኛ",         subLabel: "TI" },
  { code: "so", label: "Somali",       native: "Soomaali",     subLabel: "SO" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const active = languageOptions.find((o) => o.code === language) ?? languageOptions[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-blue-700 hover:bg-blue-600 border border-blue-500
                   text-white font-bold text-xs transition-all
                   focus:outline-none focus:ring-2 focus:ring-white"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="bg-white text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
          {active.subLabel}
        </span>
        <span className="text-white">{active.native}</span>
        <svg
          className={`h-4 w-4 text-blue-200 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-lg shadow-xl
                        bg-blue-800 border border-blue-600 z-50 overflow-hidden">
          {languageOptions.map((opt) => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                onClick={() => { setLanguage(opt.code as any); setIsOpen(false); }}
                type="button"
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold
                            flex items-center justify-between transition-colors
                            ${isSelected
                              ? "bg-blue-600 text-white"
                              : "text-blue-100 hover:bg-blue-700 hover:text-white"
                            }`}
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-black text-white">{opt.native}</span>
                  <span className="text-blue-300 text-[10px] uppercase tracking-wider">{opt.label}</span>
                </span>
                {isSelected && (
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
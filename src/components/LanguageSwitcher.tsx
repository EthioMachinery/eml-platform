"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/translations/keys";

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  subLabel: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", subLabel: "EN" },
  { code: "am", label: "አማርኛ", subLabel: "AM" },
  { code: "or", label: "Afaan Oromoo", subLabel: "OM" },
  { code: "ti", label: "ትግርኛ", subLabel: "TI" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, isPending } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of the element
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeOption = languageOptions.find((opt) => opt.code === language) || languageOptions[0];

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex justify-between items-center w-36 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            <span className="text-amber-500 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {activeOption.subLabel}
            </span>
            <span>{activeOption.label}</span>
          </span>
          <svg
            className={`h-4 w-4 ml-1 text-zinc-500 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1.5 w-40 rounded-lg shadow-lg bg-zinc-950 border border-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languageOptions.map((option) => {
              const isSelected = option.code === language;
              return (
                <button
                  key={option.code}
                  onClick={() => handleLanguageSelect(option.code)}
                  type="button"
                  className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-zinc-900 text-amber-500"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                  role="menuitem"
                >
                  <span className="flex flex-col">
                    <span>{option.label}</span>
                  </span>
                  {isSelected && (
                    <svg
                      className="h-4 w-4 text-amber-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
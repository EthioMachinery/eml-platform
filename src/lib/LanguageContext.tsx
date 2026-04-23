"use client";

import { createContext, useContext, useState } from "react";

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("en");

  const t = (key: string) => {
    return key; // simple fallback (can expand later)
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ✅ SAFE HOOK (THIS FIXES EVERYTHING)
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  // 🔥 THIS IS THE FIX: NEVER RETURN NULL
  if (!context) {
    return {
      lang: "en",
      setLang: () => {},
      t: (key: string) => key,
    };
  }

  return context;
}
"use client";
import { createContext, useContext, useState } from "react";

const translations: any = {
  en: {
    browse: "Browse Machines",
  },
  am: {
    browse: "ማሽኖችን ይመልከቱ",
  },
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: any) => {
  const [lang, setLang] = useState("en");

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
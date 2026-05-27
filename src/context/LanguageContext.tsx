"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  LanguageCode,
} from "@/constants/languages";

type LanguageContextType = {
  language: LanguageCode;

  setLanguage: (
    lang: LanguageCode
  ) => void;
};

const LanguageContext =
  createContext<
    LanguageContextType | undefined
  >(undefined);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language,
    setLanguageState,
  ] = useState<LanguageCode>(
    "en"
  );

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "eml-language"
      ) as LanguageCode | null;

    if (savedLanguage) {
      setLanguageState(
        savedLanguage
      );
    }
  }, []);

  function setLanguage(
    lang: LanguageCode
  ) {
    setLanguageState(lang);

    localStorage.setItem(
      "eml-language",
      lang
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,

        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
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

import en from "@/translations/en";
import am from "@/translations/am";
import or from "@/translations/or";
import ti from "@/translations/ti";

type LanguageContextType = {
  language: LanguageCode;

  setLanguage: (
    lang: LanguageCode
  ) => void;

  translations: Record<string, any>;

  t: (key: string, fallback?: string) => string;
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

  const dictionaries = {
    en,
    am,
    or,
    ti,
  } as const;

  function t(key: string, fallback = key) {
    const dictionary = dictionaries[
      language as keyof typeof dictionaries
    ];

    return (
      dictionary[key as keyof typeof dictionary] || fallback
    );
  }

  const translations = dictionaries[
    language as keyof typeof dictionaries
  ];

  return (
    <LanguageContext.Provider
      value={{
        language,

        setLanguage,

        translations,

        t,
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
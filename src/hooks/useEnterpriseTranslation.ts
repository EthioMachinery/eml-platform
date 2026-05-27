"use client";

import { useLanguage }
  from "@/context/LanguageContext";

import en
  from "@/translations/en";

import am
  from "@/translations/am";

import or
  from "@/translations/or";

import ti
  from "@/translations/ti";

const dictionaries = {
  en,
  am,
  or,
  ti,
};

export function useEnterpriseTranslation() {
  const {
    language,
    setLanguage,
  } = useLanguage();

  function t(key: string) {
    const dictionary =
      dictionaries[
        language as keyof typeof dictionaries
      ];

    if (!dictionary) {
      return key;
    }

    return (
      dictionary[
        key as keyof typeof dictionary
      ] || key
    );
  }

  return {
    t,
    language,
    setLanguage,
  };
}
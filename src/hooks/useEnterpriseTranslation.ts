"use client";

import { useLanguage }
  from "@/context/LanguageContext";

import { enterprise } from "@/lib/i18n/dictionary";

const dictionaries = enterprise;

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
      return (dictionaries.en as Record<string, any>)[key] || key;
    }

    return (
      dictionary[
        key as keyof typeof dictionary
      ] ||
      (dictionaries.en as Record<string, any>)[key] ||
      key
    );
  }

  return {
    t,
    tr: t,
    language,
    setLanguage,
  };
}
"use client";

import {
  useContext,
} from "react";

import {
  LanguageContext,
} from "@/providers/language-provider";

import {
  translations,
} from "@/lib/i18n/translations";

export function useTranslation() {
  const {
    language,
  } = useContext(
    LanguageContext
  );

  function t(
    path: string
  ) {
    const keys =
      path.split(".");

    let value: any =
      translations[
        language as keyof typeof translations
      ];

    for (const key of keys) {
      value =
        value?.[key];
    }

    return (
      value ||
      path
    );
  }

  return {
    t,
    language,
  };
}
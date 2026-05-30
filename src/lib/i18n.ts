import en from "@/translations/en";
import am from "@/translations/am";
import or from "@/translations/or";
import ti from "@/translations/ti";

export type Language = "en" | "am" | "or" | "ti";
export type Lang = Language;

export const translations: Record<string, any> = {
  en,
  am,
  or,
  ti,
};

export function getLang(): Lang {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLang = window.localStorage.getItem("lang");

  if (
    storedLang === "en" ||
    storedLang === "am" ||
    storedLang === "or" ||
    storedLang === "ti"
  ) {
    return storedLang;
  }

  if (typeof navigator !== "undefined") {
    if (navigator.language?.startsWith("am")) {
      return "am";
    }

    if (navigator.language?.startsWith("om")) {
      return "or";
    }

    if (navigator.language?.startsWith("ti")) {
      return "ti";
    }

    return "en";
  }

  return "en";
}

export function getNestedValue(
  obj: any,
  path: string
): string | null {
  return path
    .split(".")
    .reduce(
      (acc, part) =>
        acc && acc[part] !== undefined
          ? acc[part]
          : null,
      obj
    );
}

export function translate(
  key: string | Record<Language, string>,
  language: Language,
  fallback?: string
): string {
  try {
    if (
      typeof key === "object" &&
      key !== null
    ) {
      return (
        key[language] ||
        fallback ||
        key.en ||
        key.am ||
        key.or ||
        key.ti ||
        ""
      );
    }

    const langPack =
      translations[language];

    const value =
      getNestedValue(
        langPack,
        key as string
      );

    if (
      value !== null &&
      value !== undefined
    ) {
      return value;
    }

    const englishFallback =
      getNestedValue(
        translations.en,
        key as string
      );

    if (
      englishFallback !== null &&
      englishFallback !==
        undefined
    ) {
      return englishFallback;
    }

    return (
      fallback ||
      (typeof key === "string"
        ? key
        : key.en ||
          key.am ||
          key.or ||
          key.ti ||
          "")
    );
  } catch {
    return (
      fallback ||
      (typeof key === "string"
        ? key
        : key.en ||
          key.am ||
          key.or ||
          key.ti ||
          "")
    );
  }
}
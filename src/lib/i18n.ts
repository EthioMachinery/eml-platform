import en from "@/translations/en";
import am from "@/translations/am";

export type Language = "en" | "am";

export const translations = {
  en,
  am,
};

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
  language: Language,
  key: string,
  fallback?: string
): string {
  try {
    const langPack =
      translations[language];

    const value =
      getNestedValue(
        langPack,
        key
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
        key
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
      key
    );
  } catch {
    return (
      fallback ||
      key
    );
  }
}
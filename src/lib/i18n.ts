import en from "@/translations/en";
import am from "@/translations/am";
import or from "@/translations/or";
import ti from "@/translations/ti";
import so from "@/translations/so";

export type Language = "en" | "am" | "or" | "ti" | "so";
export type Lang = Language;

export const translations: Record<string, any> = { en, am, or, ti, so };

export function getLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("eml_lang") ||
                 window.localStorage.getItem("eml_locale") ||
                 window.localStorage.getItem("lang");
  if (stored === "en" || stored === "am" || stored === "or" || stored === "ti" || stored === "so") {
    return stored as Lang;
  }
  if (typeof navigator !== "undefined") {
    if (navigator.language?.startsWith("am")) return "am";
    if (navigator.language?.startsWith("om") || navigator.language?.startsWith("or")) return "or";
    if (navigator.language?.startsWith("ti")) return "ti";
    if (navigator.language?.startsWith("so")) return "so";
  }
  return "en";
}

export function getNestedValue(obj: any, path: string): string | null {
  // Try literal flat key first (e.g. "nav.tenders")
  if (obj && typeof obj[path] === "string") return obj[path];
  // Then try dot-path traversal
  return path.split(".").reduce((acc, part) =>
    acc && acc[part] !== undefined ? acc[part] : null, obj);
}

export function translate(
  key: string | Record<Language, string>,
  language: Language,
  fallback?: string
): string {
  try {
    if (typeof key === "object" && key !== null) {
      return key[language] || fallback || key.en || key.am || key.or || key.ti || key.so || "";
    }
    const value = getNestedValue(translations[language], key as string);
    if (value !== null && value !== undefined) return value;
    const enFallback = getNestedValue(translations.en, key as string);
    if (enFallback !== null && enFallback !== undefined) return enFallback;
    return fallback || (typeof key === "string" ? key : "");
  } catch {
    return fallback || (typeof key === "string" ? key : "");
  }
}

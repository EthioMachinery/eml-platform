import en from "@/translations/en";
import am from "@/translations/am";
import or from "@/translations/or";
import ti from "@/translations/ti";

export type Language =
  | "en"
  | "am"
  | "or"
  | "ti";

const dictionaries = {
  en,
  am,
  or,
  ti,
};

export function translate(
  language: Language,
  key: keyof typeof en
): string {
  const dict =
    dictionaries[language];

  return (
    dict?.[key] ||
    en[key] ||
    String(key)
  );
}
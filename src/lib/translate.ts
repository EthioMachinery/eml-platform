import en from "@/translations/en";
import am from "@/translations/am";
import om from "@/translations/or"; // Imports from 'or' folder and binds to 'or'
import ti from "@/translations/ti";

export type Language =
  | "en"
  | "am"
  | "or" // Aligned to 'or'
  | "ti";

const dictionaries = {
  en,
  am,
  or: om, // Aligned to 'or'
  ti,
};

export function translate(
  language: Language,
  key: keyof typeof en
): string {
  const dict = dictionaries[language];

  return (
    dict?.[key] ||
    en[key] ||
    String(key)
  );
}
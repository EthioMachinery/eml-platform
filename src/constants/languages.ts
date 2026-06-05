export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "or", label: "Afaan Oromoo" },
  { code: "ti", label: "ትግርኛ" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
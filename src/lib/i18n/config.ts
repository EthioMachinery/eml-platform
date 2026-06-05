export const LANGUAGES = [
  "en",
  "am",
  "or", // Updated from 'or' to 'or' for strict standard alignment
  "ti",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE = "en";
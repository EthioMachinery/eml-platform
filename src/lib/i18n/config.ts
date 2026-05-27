export const LANGUAGES = [
  "en",
  "am",
  "or",
  "ti",
] as const;

export type Language =
  (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE =
  "en";
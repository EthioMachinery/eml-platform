"use client";

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/i18n/translations';
import { TranslationSchema } from '../translations/keys';

// Nested Key extraction helper types for strict path typing
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? R extends string[]
      ? `${F}${D}${Join<R, D>}`
      : never
    : never
  : string;

export type TranslationPath = Join<PathsToStringProps<TranslationSchema>, '.'>;

export function useTranslate() {
  const { language } = useLanguage();

  const t = (path: TranslationPath): string => {
    const keys = path.split('.');
    
    // Attempt dynamic lookup inside the selected language state
    let resolved: any = translations[language];
    for (const key of keys) {
      if (resolved && key in resolved) {
        resolved = resolved[key];
      } else {
        resolved = undefined;
        break;
      }
    }

    if (typeof resolved === 'string') {
      return resolved;
    }

    // Fail-safe fallback: Attempt English translation lookup
    let fallback: any = translations['en'];
    for (const key of keys) {
      if (fallback && key in fallback) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
        break;
      }
    }

    if (typeof fallback === 'string') {
      return fallback;
    }

    // Ultimate fallback returning original raw path tokens
    return path;
  };

  return { t, currentLanguage: language };
}
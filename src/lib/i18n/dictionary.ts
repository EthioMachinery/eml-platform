/**
 * TM CANONICAL TRANSLATION DICTIONARY — 5 languages
 * en | am | or | ti | so
 *
 * Sources:
 *  - src/translations/{lang}/index.ts  → flat keys (heroTitle, browse, etc.)
 *  - src/lib/i18n/translations.ts      → nested keys (categories.excavator, nav.home, etc.)
 */
import enEnterprise from "@/translations/en";
import amEnterprise from "@/translations/am";
import orEnterprise from "@/translations/or";
import tiEnterprise from "@/translations/ti";
import soEnterprise from "@/translations/so";
import { translations } from "@/lib/i18n/translations";

export type Language = 'en' | 'am' | 'or' | 'ti' | 'so';

// Flat translations (from src/translations/)
const flat: Record<Language, Record<string, any>> = {
  en: enEnterprise,
  am: amEnterprise,
  or: orEnterprise,
  ti: tiEnterprise,
  so: soEnterprise,
};

// Nested translations (from src/lib/i18n/translations.ts)
const nested: Record<Language, Record<string, any>> = translations as any;

export const dictionaries: Record<Language, Record<string, any>> = {
  en: { ...nested['en'], ...flat['en'] },
  am: { ...nested['am'], ...flat['am'] },
  or: { ...nested['or'] ?? {}, ...flat['or'] },
  ti: { ...nested['ti'] ?? {}, ...flat['ti'] },
  so: { ...nested['so'] ?? {}, ...flat['so'] },
};

/**
 * translate(lang, path)
 * Supports flat keys ("browse") and dot-path keys ("categories.excavator").
 * Falls back: requested lang → English → the key itself.
 */
export function translate(lang: Language, path: string): string {
  const dict = dictionaries[lang] ?? dictionaries['en'];
  const enDict = dictionaries['en'];

  const parts = path.split('.');

  // Try in requested language
  let val: any = dict;
  for (const part of parts) { val = val?.[part]; }
  if (typeof val === 'string') return val;

  // Try English fallback
  let enVal: any = enDict;
  for (const part of parts) { enVal = enVal?.[part]; }
  if (typeof enVal === 'string') return enVal;

  // Last resort: return the key
  return path;
}

// Backward-compat alias — several files import { enterprise } from here
export const enterprise = dictionaries;

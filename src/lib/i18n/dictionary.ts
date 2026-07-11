/**
 * TM CANONICAL TRANSLATION DICTIONARY — 5 languages
 * en | am | or | ti | so
 */
import enEnterprise from "@/translations/en";
import amEnterprise from "@/translations/am";
import orEnterprise from "@/translations/or";
import tiEnterprise from "@/translations/ti";
import soEnterprise from "@/translations/so";
import { translations } from "@/lib/i18n/translations";

export type Language = 'en' | 'am' | 'or' | 'ti' | 'so';

// Flat keys from src/translations/{lang}/index.ts
const flat: Record<Language, Record<string, any>> = {
  en: enEnterprise,
  am: amEnterprise,
  or: orEnterprise,
  ti: tiEnterprise,
  so: soEnterprise,
};

// Nested keys from src/lib/i18n/translations.ts
const nested: Record<string, Record<string, any>> = translations as any;

export const dictionaries: Record<Language, Record<string, any>> = {
  en: { ...(nested['en'] ?? {}), ...flat['en'] },
  am: { ...(nested['am'] ?? {}), ...flat['am'] },
  or: { ...(nested['or'] ?? {}), ...flat['or'] },
  ti: { ...(nested['ti'] ?? {}), ...flat['ti'] },
  so: { ...(nested['so'] ?? {}), ...flat['so'] },
};

// Backward-compat alias used by LanguageContext, useEnterpriseTranslation, lib/i18n.ts
export const enterprise = dictionaries;

/**
 * translate(lang, path)
 *
 * Resolution order (first match wins):
 *  1. Literal flat key in target lang   e.g. dict["nav.tenders"]
 *  2. Dot-path traversal in target lang e.g. dict.categories.excavator
 *  3. Literal flat key in English
 *  4. Dot-path traversal in English
 *  5. The raw key (never blank)
 */
export function translate(lang: Language, path: string): string {
  const dict = dictionaries[lang] ?? dictionaries['en'];
  const enDict = dictionaries['en'];
  const parts = path.split('.');

  // 1. Literal flat key in target lang
  if (typeof dict[path] === 'string') return dict[path] as string;

  // 2. Dot-path traversal in target lang
  let val: any = dict;
  for (const part of parts) { val = val?.[part]; }
  if (typeof val === 'string') return val;

  // 3. Literal flat key in English
  if (typeof enDict[path] === 'string') return enDict[path] as string;

  // 4. Dot-path traversal in English
  let enVal: any = enDict;
  for (const part of parts) { enVal = enVal?.[part]; }
  if (typeof enVal === 'string') return enVal;

  // 5. Return the key itself
  return path;
}

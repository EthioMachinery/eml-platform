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
 * IMPORTANT: this resolves against `flat` and `nested` SEPARATELY (never
 * against the shallow-merged `dictionaries` object above). Several top-level
 * names exist in BOTH sources with different shapes — e.g. flat['jobs'] is
 * the bare string "Jobs" (nav label) while nested['jobs'] is an object
 * ({ title, subtitle, ... }) used by the Jobs page. A shallow merge lets
 * whichever source is spread last silently clobber the other's data, which
 * previously made every nested `jobs.*`, `dashboard.*`, and `home.*` lookup
 * fail and fall through to the raw key. Resolving separately keeps both
 * shapes intact regardless of merge order.
 *
 * Resolution order (first match wins):
 *  1. Literal flat key in target lang        e.g. flat["nav.tenders"]
 *  2. Dot-path traversal within flat          e.g. flat.auth.signIn
 *  3. Dot-path traversal within nested        e.g. nested.jobs.title
 *  4. Literal flat key in English
 *  5. Dot-path traversal within flat (English)
 *  6. Dot-path traversal within nested (English)
 *  7. The raw key (never blank)
 */
function dotPath(obj: any, parts: string[]): string | undefined {
  let val: any = obj;
  for (const part of parts) { val = val?.[part]; }
  return typeof val === 'string' ? val : undefined;
}

export function translate(lang: Language, path: string): string {
  const flatDict = flat[lang] ?? flat['en'];
  const nestedDict = nested[lang] ?? nested['en'];
  const flatEn = flat['en'];
  const nestedEn = nested['en'];
  const parts = path.split('.');

  // 1. Literal flat key in target lang
  if (typeof flatDict[path] === 'string') return flatDict[path] as string;

  // 2. Dot-path traversal within flat (target lang) — e.g. auth.signIn, register.title
  const flatVal = dotPath(flatDict, parts);
  if (flatVal !== undefined) return flatVal;

  // 3. Dot-path traversal within nested (target lang) — e.g. jobs.title, dashboard.title
  const nestedVal = dotPath(nestedDict, parts);
  if (nestedVal !== undefined) return nestedVal;

  // 4. Literal flat key in English
  if (typeof flatEn[path] === 'string') return flatEn[path] as string;

  // 5. Dot-path traversal within flat (English)
  const flatEnVal = dotPath(flatEn, parts);
  if (flatEnVal !== undefined) return flatEnVal;

  // 6. Dot-path traversal within nested (English)
  const nestedEnVal = dotPath(nestedEn, parts);
  if (nestedEnVal !== undefined) return nestedEnVal;

  // 7. Return the key itself
  return path;
}
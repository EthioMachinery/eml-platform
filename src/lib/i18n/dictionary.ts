/**
 * TM CANONICAL TRANSLATION DICTIONARY
 *
 * This file consolidates what used to be two separate translation systems
 * (lib/translations.ts and src/translations/{lang}/index.ts) into one
 * physical source of truth, organized as two namespaces:
 *
 *  - `legacy`     -> content originally in lib/translations.ts (en/am only).
 *                    Consumed by useTranslate() (17 pages).
 *  - `enterprise` -> content originally in src/translations/{lang}/index.ts
 *                    (en/am/or/ti). Consumed by translate()/getLang() in
 *                    lib/i18n.ts (10 files) and useEnterpriseTranslation() (1 file).
 *
 * NOTE: 9 keys exist in both namespaces with DIFFERENT wording (loading,
 * submit, cancel, dashboard, browse, notifications, available, rented, sold).
 * They were kept separate on purpose rather than silently picking a winner -
 * that's a brand-voice decision for a human to make, not something to
 * auto-resolve. See the README note at the bottom of this file.
 */
import legacyData from "./legacy";
import enEnterprise from "@/translations/en";
import amEnterprise from "@/translations/am";
import orEnterprise from "@/translations/or";
import tiEnterprise from "@/translations/ti";

export const legacy = legacyData;

export const enterprise: Record<string, any> = {
  en: enEnterprise,
  am: amEnterprise,
  or: orEnterprise,
  ti: tiEnterprise,
};

/**
 * TODO (product decision needed): these 9 keys have different copy in
 * `legacy` vs `enterprise`. Pick one wording per key, then this list (and
 * the duplicate key) can be deleted:
 *   loading, submit, cancel, dashboard, browse, notifications,
 *   available, rented, sold
 */
export const KNOWN_COLLISIONS = [
  "loading", "submit", "cancel", "dashboard", "browse",
  "notifications", "available", "rented", "sold",
];

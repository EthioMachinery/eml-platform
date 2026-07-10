"use client";

// Generic string alias — satisfies components that import TranslationPath
export type TranslationPath = string;
import { useState, useEffect } from 'react';
import { translate, type Language } from '@/lib/i18n/dictionary';

/**
 * EML GLOBALIZATION HOOK
 * Single canonical translation hook. Supports en, am, or, ti.
 * Falls back to English (then the raw key) for anything not yet
 * translated in the active language - never fails silently.
 */
export function useTranslate() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('eml_lang') as Language | null;
    if (savedLang && ['en', 'am', 'or', 'ti', 'so'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const t = (key: string): string => translate(lang, key);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('eml_lang', newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  return { t, lang, changeLanguage, currentLanguage: lang };
}

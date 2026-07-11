"use client";

// Generic string alias — satisfies components that import TranslationPath
export type TranslationPath = string;

import { useState, useEffect } from 'react';
import { translate, type Language } from '@/lib/i18n/dictionary';

const VALID_LANGS: Language[] = ['en', 'am', 'or', 'ti', 'so'];

function getStoredLang(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('eml_lang') as Language | null;
  return saved && VALID_LANGS.includes(saved) ? saved : 'en';
}

/**
 * useTranslate — canonical translation hook.
 * Stays in sync with LanguageSwitcher via the 'languageChange' window event.
 * Works alongside useI18n/useLanguage — both read the same localStorage key.
 */
export function useTranslate() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Set on mount
    setLang(getStoredLang());

    // Update whenever LanguageSwitcher fires the event
    const handler = () => setLang(getStoredLang());
    window.addEventListener('languageChange', handler);
    return () => window.removeEventListener('languageChange', handler);
  }, []);

  const t = (key: string): string => translate(lang, key);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('eml_lang', newLang);
    localStorage.setItem('eml_locale', newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  return { t, lang, changeLanguage, currentLanguage: lang };
}

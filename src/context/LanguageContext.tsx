"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dictionaries, translate, type Language } from '@/lib/i18n/dictionary';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
  lang: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const VALID_LANGS: Language[] = ['en', 'am', 'or', 'ti', 'so'];
const STORAGE_KEY = 'eml_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && VALID_LANGS.includes(saved)) setLanguageState(saved);

    // Stay in sync if useTranslate or another hook changes language
    const handler = () => {
      const updated = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (updated && VALID_LANGS.includes(updated)) setLanguageState(updated);
    };
    window.addEventListener('languageChange', handler);
    return () => window.removeEventListener('languageChange', handler);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem('eml_locale', lang);
    window.dispatchEvent(new Event('languageChange'));
  }, []);

  const t = useCallback((path: string): string => translate(language, path), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, lang: language }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { language: 'en', lang: 'en', setLanguage: () => {}, t: (s) => s };
  return ctx;
}

export function useI18n() { return useLanguage(); }

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { enterprise as translations } from '@/lib/i18n/dictionary';
import { LANGUAGES, Language } from '@/lib/i18n/config';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tm_lang') as Language;
    if (saved && translations[saved]) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tm_lang', lang);
  };

  // Safe translation helper inside the provider
  const t = (path: string): string => {
    try {
      const keys = path.split('.');
      let current: any = translations[language] || translations['en'];

      for (const key of keys) {
        if (current && current[key] !== undefined) {
          current = current[key];
        } else {
          const fallback = (translations['en'] as any)[key];
          return typeof fallback === 'string' ? fallback : path;
        }
      }
      return typeof current === 'string' ? current : path;
    } catch (e) {
      return path;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ✅ Proper hook export
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (s: string) => s,
      lang: 'en' as Language
    };
  }
  return { ...context, lang: context.language };
}

// ✅ Alias for backward compatibility
export const useI18n = useLanguage;

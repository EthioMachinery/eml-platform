"use client";
import { useState, useEffect } from 'react';
import { legacy as translations } from '@/lib/i18n/dictionary';

/**
 * TM GLOBALIZATION HOOK
 * Optimized for Amharic (Ethiopic) and Global Latin scripts.
 */

type Language = 'en' | 'am' | 'or' | 'ti';

export function useTranslate() {
  // 1. Initialize language from local storage or default to English
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('eml_lang') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  /**
   * Main translation function
   * @param key The key from the translations object
   * @returns The translated string or the key itself if missing
   */
  const t = (key: string): string => {
    try {
      // Access the language object, fallback to English if the current lang is missing
      const dictionary = translations[lang] || translations['en'];
      
      // Handle deep-nested keys (e.g., 'auth.login_success')
      const value = key.split('.').reduce((obj: any, i) => obj?.[i], dictionary);
      
      return value || translations['en'][key as keyof typeof translations['en']] || key;
    } catch (e) {
      return key; // Return the key as a fallback
    }
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('eml_lang', newLang);
    // Optional: Refresh or notify the system for AI-context updates
    window.dispatchEvent(new Event('languageChange'));
  };

  return { t, lang, changeLanguage };
}
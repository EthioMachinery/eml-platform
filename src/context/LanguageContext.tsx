"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '@/constants/languages';

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // 1. Resolve client language on mount
    const savedLang = localStorage.getItem('eml_locale') as LanguageCode;
    if (savedLang && ['en', 'am', 'or', 'ti'].includes(savedLang)) {
      setLanguageState(savedLang);
      document.documentElement.setAttribute('lang', savedLang);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      const defaultLang: LanguageCode = ['am', 'or', 'ti'].includes(browserLang) 
        ? (browserLang as LanguageCode) 
        : 'en';
      setLanguageState(defaultLang);
      document.documentElement.setAttribute('lang', defaultLang);
    }
    setIsPending(false);

    // 2. Register EML PWA Service Worker for offline resilience
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('EML Service Worker registered successfully. Scope:', registration.scope);
          })
          .catch((error) => {
            console.error('EML Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setIsPending(true);
    setLanguageState(lang);
    localStorage.setItem('eml_locale', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Notify other windows/instances
    window.dispatchEvent(new Event('eml_language_changed'));
    setIsPending(false);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isPending }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be utilized within a LanguageProvider wrapper.');
  }
  return context;
}
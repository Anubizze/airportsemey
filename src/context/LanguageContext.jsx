'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved && translations[saved]) setLang(saved);
  }, []);

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

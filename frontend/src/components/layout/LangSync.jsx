'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getHtmlLang } from '@/lib/locale';

export default function LangSync() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(lang);
    document.title = t.meta.title;
  }, [lang, t]);

  return null;
}

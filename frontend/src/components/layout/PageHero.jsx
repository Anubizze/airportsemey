'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PageHero({ title, subtitle, crumbs = [] }) {
  const { t } = useLanguage();

  return (
    <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">{t.home}</Link>
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.href ?? crumb.label}-${index}`} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-blue-200 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

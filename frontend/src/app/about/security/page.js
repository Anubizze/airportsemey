'use client';

import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import { useLanguage } from '@/context/LanguageContext';

export default function SecurityPage() {
  const { t } = useLanguage();
  const p = t.pages.security;

  return (
    <>
      <PageHero
        title={p.title}
        subtitle={p.subtitle}
        crumbs={[
          { label: t.nav.about, href: '/about' },
          { label: p.title },
        ]}
      />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-6">
            <p className="text-gray-700 leading-relaxed">{p.intro}</p>
          </div>

          {p.sections.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{p.relatedTitle}</h3>
            <p className="text-sm text-gray-600 mb-4">{p.relatedText}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/passengers/baggage" className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-950">
                {t.nav.baggage}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/contacts" className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-950">
                {t.nav.contacts}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import PageHero from '@/components/layout/PageHero';
import { useLanguage } from '@/context/LanguageContext';

export default function PartnerContentPage({ pageKey, parentCrumb }) {
  const { t } = useLanguage();
  const p = t.pages[pageKey];

  return (
    <>
      <PageHero
        title={p.title}
        subtitle={p.subtitle}
        crumbs={[
          { label: t.nav.partners, href: '/partners' },
          { label: parentCrumb ?? p.title },
        ]}
      />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {p.intro && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-6">
              <p className="text-gray-700 leading-relaxed">{p.intro}</p>
            </div>
          )}

          {p.sections?.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                {section.text && <p className="text-sm text-gray-700 leading-relaxed mb-4">{section.text}</p>}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {p.table && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {p.table.headers.map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.table.rows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-5 py-3 text-gray-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {p.tableNote && <p className="px-5 py-3 text-xs text-gray-500 bg-gray-50">{p.tableNote}</p>}
            </div>
          )}

          {(p.externalLink || p.contactText) && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              {p.contactText && <p className="text-sm text-gray-700 mb-3">{p.contactText}</p>}
              {p.externalLink && (
                <a
                  href={p.externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
                >
                  {p.externalLink.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

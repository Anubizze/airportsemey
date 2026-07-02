'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import { useLanguage } from '@/context/LanguageContext';
import { fetchFuelStorageContent } from '@/lib/fuelStorageApi';

function DataTable({ headers, rows, note }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h) => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-700 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 text-gray-700 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="px-5 py-3 text-xs text-gray-500 bg-gray-50">{note}</p>}
    </div>
  );
}

export default function FuelStoragePage() {
  const { t, lang } = useLanguage();
  const p = t.pages.fuel;
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFuelStorageContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const capacityRows = useMemo(() => {
    if (!content) return p.capacityRows;
    return [[content.capacityDate || '—', content.capacityTons || '—']];
  }, [content, p.capacityRows]);

  const priceRows = useMemo(() => {
    const byLang =
      lang === 'kz'
        ? content?.priceRowsKz
        : lang === 'en'
          ? content?.priceRowsEn
          : content?.priceRowsRu ?? content?.priceRows;
    if (!byLang?.length) return p.priceRows;
    return byLang.map((row) => [row.name, row.unit, row.price]);
  }, [content, p.priceRows, lang]);

  const documents = useMemo(() => {
    const byLang =
      lang === 'kz'
        ? content?.documentsKz
        : lang === 'en'
          ? content?.documentsEn
          : content?.documentsRu ?? content?.documents;
    if (!byLang?.length) return p.documents;
    return byLang;
  }, [content, p.documents, lang]);

  const submitEmail = content?.submitEmail || p.submitEmail;
  const contactText = useMemo(() => {
    if (!content?.contactPhone) return p.contactText;
    const separatorIndex = p.contactText.indexOf(':');
    if (separatorIndex === -1) {
      return `${p.contactText} ${content.contactPhone}`;
    }
    return `${p.contactText.slice(0, separatorIndex + 1)} ${content.contactPhone}`;
  }, [content, p.contactText]);

  return (
    <>
      <PageHero
        title={p.title}
        subtitle={p.subtitle}
        crumbs={[
          { label: t.nav.partners, href: '/partners' },
          { label: p.title },
        ]}
      />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {p.standardContract && (
            <div className="mb-6">
              <a
                href={p.standardContract.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
              >
                {p.standardContract.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{p.capacityTitle}</h2>
            <DataTable headers={p.capacityHeaders} rows={capacityRows} note={p.capacityNote} />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{p.priceTitle}</h2>
            <DataTable headers={p.priceHeaders} rows={priceRows} note={p.priceNote} />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{p.documentsTitle}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <ol className="space-y-4">
                {documents.map((item, index) => (
                  <li key={item} className="flex items-start gap-4 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-800 font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <p className="text-sm text-gray-700 mb-2">
              {p.submitHint}{' '}
              <a href={`mailto:${submitEmail}`} className="font-semibold text-blue-800 hover:text-blue-950">
                {submitEmail}
              </a>
            </p>
            {contactText && <p className="text-sm text-gray-700 mb-4">{contactText}</p>}
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
            >
              {p.contactsLink}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

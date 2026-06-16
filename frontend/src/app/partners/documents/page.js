'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import DocumentPreviewModal from '@/components/partners/DocumentPreviewModal';
import { useLanguage } from '@/context/LanguageContext';
import {
  fetchPartnerDocumentsGrouped,
  getDocumentTitle,
  resolveUploadUrl,
} from '@/lib/documentsApi';

export default function PartnerDocumentsPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.documents;
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchPartnerDocumentsGrouped()
      .then((data) => {
        if (!cancelled) setGroups(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setGroups([]);
          setError(err.message || p.loadError);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [p.loadError]);

  const openPreview = (doc) => {
    setPreview({
      title: getDocumentTitle(doc, lang),
      url: resolveUploadUrl(doc.url),
    });
  };

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
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8">
            <p className="text-gray-700 leading-relaxed">{p.intro}</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
              {p.loading}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-red-600">
              {error}
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
              {p.empty}
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map(({ year, documents }) => (
                <section
                  key={year}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      {p.yearLabel} {year}
                    </h2>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {documents.map((doc) => {
                      const fileUrl = resolveUploadUrl(doc.url);
                      const title = getDocumentTitle(doc, lang);

                      return (
                        <li key={doc.id}>
                          <div className="flex items-center gap-3 px-6 py-4 hover:bg-blue-50/50 transition-colors group">
                            <button
                              type="button"
                              onClick={() => openPreview(doc)}
                              className="flex items-center gap-4 flex-1 min-w-0 text-left"
                            >
                              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 group-hover:text-blue-800 line-clamp-2">
                                  {title}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{p.previewHint}</div>
                              </div>
                            </button>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => openPreview(doc)}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                title={p.preview}
                                aria-label={p.preview}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                title={p.download}
                                aria-label={p.download}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <DocumentPreviewModal
        open={Boolean(preview)}
        title={preview?.title ?? ''}
        url={preview?.url ?? ''}
        onClose={() => setPreview(null)}
        labels={{
          close: p.close,
          download: p.download,
          previewTitle: p.previewTitle,
          previewUnavailable: p.previewUnavailable,
          openExternal: p.openExternal,
        }}
      />
    </>
  );
}

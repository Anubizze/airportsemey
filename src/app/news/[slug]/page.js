'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NEWS } from '@/data/news';
import { formatDateLong } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORY_LABELS = {
  news: { label: 'Новость', style: 'bg-blue-100 text-blue-700' },
  announcement: { label: 'Объявление', style: 'bg-orange-100 text-orange-700' },
  service: { label: 'Сервис', style: 'bg-green-100 text-green-700' },
  compliance: { label: 'Комплаенс', style: 'bg-purple-100 text-purple-700' },
};

export default function NewsArticlePage({ params }) {
  const { lang, t } = useLanguage();
  const article = NEWS.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const category = CATEGORY_LABELS[article.category] ?? { label: 'Новость', style: 'bg-gray-100 text-gray-600' };
  const related = NEWS.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/news" className="hover:text-white transition-colors">{t.nav.news}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white truncate max-w-xs">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div
                  className="h-56 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #003087 0%, #0056b3 100%)' }}
                >
                  <svg className="w-20 h-20 text-white/15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.style}`}>
                      {category.label}
                    </span>
                    <span className="text-sm text-gray-400">{formatDateLong(article.date)}</span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
                    {article.title}
                  </h1>

                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                    {article.content.split('\n\n').filter(Boolean).map((paragraph, i) => (
                      <p key={i}>{paragraph.trim()}</p>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {t.news.all}
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">
                {lang === 'kz' ? 'Басқа жаңалықтар' : lang === 'en' ? 'Other News' : 'Другие новости'}
              </h3>
              <div className="space-y-3">
                {related.map((rel) => {
                  const relCat = CATEGORY_LABELS[rel.category] ?? { label: 'Новость', style: 'bg-gray-100 text-gray-600' };
                  return (
                    <Link key={rel.id} href={`/news/${rel.slug}`} className="group block">
                      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${relCat.style}`}>
                            {relCat.label}
                          </span>
                          <span className="text-xs text-gray-400">{formatDateLong(rel.date)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-800 transition-colors line-clamp-2">
                          {rel.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

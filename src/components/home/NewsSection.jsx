'use client';

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

function NewsCard({ article, readMoreLabel }) {
  const category = CATEGORY_LABELS[article.category] ?? { label: 'Новость', style: 'bg-gray-100 text-gray-700' };

  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div
          className="h-44 flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #003087 0%, #0056b3 100%)' }}
        >
          <svg className="w-16 h-16 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${category.style}`}>
              {category.label}
            </span>
            <span className="text-xs text-gray-400">{formatDateLong(article.date)}</span>
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug group-hover:text-blue-800 transition-colors line-clamp-2 flex-1">
            {article.title}
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:gap-2 transition-all mt-auto">
            {readMoreLabel}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function NewsSection() {
  const { t } = useLanguage();
  const featured = NEWS.slice(0, 3);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.news.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">{t.news.subtitle}</p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            {t.news.all}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((article) => (
            <NewsCard key={article.id} article={article} readMoreLabel={t.news.readMore} />
          ))}
        </div>
      </div>
    </section>
  );
}

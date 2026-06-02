'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  formatNewsDate,
  getNewsCategory,
  getNewsSourceLabel,
  NEWS_SOURCE_FILTERS,
} from '@/lib/newsLabels';
import { fetchAbayNews, fetchAviationNews, fetchAkordaNews, fetchTransportNews, getFallbackNews } from '@/lib/newsApi';
import kzGerb from '@/public/KZgerb.png';

function NewsCard({ article, readMoreLabel, t, lang }) {
  const category = getNewsCategory(t, article.category);
  const sourceLabel = getNewsSourceLabel(t, article.source);
  const dateText = formatNewsDate(article, lang);
  const imageSrc = article.image ?? kzGerb;

  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-56 flex-shrink-0 bg-slate-100">
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-contain object-center p-2"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${category.style}`}>
              {category.label}
            </span>
            <span className="text-xs text-slate-500">{sourceLabel}</span>
            {dateText ? <span className="text-xs text-gray-400">{dateText}</span> : null}
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
  const { t, lang } = useLanguage();
  const [news, setNews] = useState(getFallbackNews());
  const [activeSource, setActiveSource] = useState('akorda');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data =
          activeSource === 'abay'
            ? await fetchAbayNews(9)
            : activeSource === 'transport'
              ? await fetchTransportNews(9)
              : activeSource === 'aviation'
                ? await fetchAviationNews(9)
            : await fetchAkordaNews(9);
        if (!cancelled) setNews(data);
      } catch {
        if (!cancelled) setNews([]);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [activeSource]);

  const featured = news.slice(0, 3);

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
        <div className="flex flex-wrap gap-2 mb-6">
          {NEWS_SOURCE_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSource(item.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeSource === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {t.news.sources[item.labelKey]}
            </button>
          ))}
        </div>

        {featured.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                readMoreLabel={t.news.readMore}
                t={t}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-6 text-sm text-blue-900">
            {t.news.emptySource}
          </div>
        )}
      </div>
    </section>
  );
}

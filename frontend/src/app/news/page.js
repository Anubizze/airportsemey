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

export default function NewsPage() {
  const { t, lang } = useLanguage();
  const p = t.pages.news;
  const [news, setNews] = useState(getFallbackNews());
  const [activeSource, setActiveSource] = useState('akorda');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data =
          activeSource === 'abay'
            ? await fetchAbayNews(24)
            : activeSource === 'transport'
              ? await fetchTransportNews(24)
              : activeSource === 'aviation'
                ? await fetchAviationNews(24)
            : await fetchAkordaNews(24);
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

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{t.nav.news}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
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
          {news.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => {
                const category = getNewsCategory(t, article.category);
                const sourceLabel = getNewsSourceLabel(t, article.source);
                const dateText = formatNewsDate(article, lang);
                const imageSrc = article.image ?? kzGerb;
                return (
                <Link key={article.id} href={`/news/${article.slug}`} className="group block">
                  <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-56 flex-shrink-0 bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt={article.title}
                        fill
                        className="object-contain object-center p-2"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-slate-500">{sourceLabel}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.style}`}>
                          {category.label}
                        </span>
                        {dateText ? <span className="text-xs text-gray-400">{dateText}</span> : null}
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug group-hover:text-blue-800 transition-colors line-clamp-2 flex-1">
                        {article.title}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">{article.excerpt}</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:gap-2 transition-all mt-auto">
                        {p.readMore}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-6 text-sm text-blue-900">
              {t.news.emptySource}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

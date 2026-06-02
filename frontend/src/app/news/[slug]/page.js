'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  formatNewsDate,
  getNewsCategory,
  getNewsSourceLabel,
} from '@/lib/newsLabels';
import { useLanguage } from '@/context/LanguageContext';
import { fetchAbayNews, fetchAviationNews, fetchAkordaNews, fetchTransportNews, getFallbackNews } from '@/lib/newsApi';
import kzGerb from '@/public/KZgerb.png';

export default function NewsArticlePage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const { lang, t } = useLanguage();
  const [news, setNews] = useState(getFallbackNews());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [akorda, abay, transport, aviation] = await Promise.all([
          fetchAkordaNews(40).catch(() => []),
          fetchAbayNews(40).catch(() => []),
          fetchTransportNews(40).catch(() => []),
          fetchAviationNews(40).catch(() => []),
        ]);
        const merged = [...akorda, ...abay, ...transport, ...aviation];
        if (!cancelled && merged.length) setNews(merged);
      } catch {
        // keep fallback
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const article = useMemo(
    () => news.find((a) => a.slug === slug),
    [news, slug],
  );
  if (!article) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.news.notFound}</h1>
          <Link href="/news" className="text-blue-700 hover:text-blue-900 font-medium">
            {t.news.backToNews}
          </Link>
        </div>
      </div>
    );
  }

  const category = getNewsCategory(t, article.category);
  const related = news.filter((a) => a.id !== article.id).slice(0, 3);
  const sourceSiteLabel = getNewsSourceLabel(t, article.source);
  const articleDateText = formatNewsDate(article, lang);
  const articleImageSrc = article.image ?? kzGerb;

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
                <div className="relative h-[360px] sm:h-[460px] bg-slate-100">
                  <Image
                    src={articleImageSrc}
                    alt={article.title}
                    fill
                    className="object-contain object-center p-3"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.style}`}>
                      {category.label}
                    </span>
                    {articleDateText ? <span className="text-sm text-gray-400">{articleDateText}</span> : null}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
                    {article.title}
                  </h1>

                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                    {article.content.split('\n\n').filter(Boolean).map((paragraph, i) => (
                      <p key={i}>{paragraph.trim()}</p>
                    ))}
                  </div>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex mt-4 text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      {t.news.readOnSite} {sourceSiteLabel}
                    </a>
                  )}

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
              <h3 className="font-bold text-gray-900 mb-4">{t.news.otherNews}</h3>
              <div className="space-y-3">
                {related.map((rel) => {
                  const relCat = getNewsCategory(t, rel.category);
                  const relDateText = formatNewsDate(rel, lang);
                  return (
                    <Link key={rel.id} href={`/news/${rel.slug}`} className="group block">
                      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${relCat.style}`}>
                            {relCat.label}
                          </span>
                          {relDateText ? <span className="text-xs text-gray-400">{relDateText}</span> : null}
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

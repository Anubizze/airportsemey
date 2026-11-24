'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/layout/PageHero';
import { useLanguage } from '@/context/LanguageContext';
import { fetchAnnouncements, getAnnouncementText } from '@/lib/announcementsApi';

export default function AnnouncementsPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.announcements;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    fetchAnnouncements().then((data) => {
      if (!Array.isArray(data)) throw new Error('Invalid announcement list');
      if (!cancelled) setItems(data);
    }).catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reload]);

  return (
    <>
      <PageHero title={p.title} subtitle={p.subtitle} crumbs={[{ label: t.nav.partners, href: '/partners' }, { label: p.title }]} />
      <div className="min-h-[45vh] bg-gray-50 py-10">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          {loading ? (
            <p role="status" className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">{p.loading}</p>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center">
              <p className="text-red-600">{p.loadError}</p>
              <button type="button" onClick={() => setReload((value) => value + 1)} className="mt-4 font-medium text-blue-900 underline">{p.retry}</button>
            </div>
          ) : !items.length ? (
            <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">{p.empty}</p>
          ) : (
            <div className="space-y-5">
              {items.map((item) => {
                const { title, content } = getAnnouncementText(item, lang);
                const date = item.publishedAt || item.createdAt;
                return (
                  <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                    <time dateTime={date} className="text-sm text-gray-500">{new Date(date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Almaty' })}</time>
                    <h2 className="mt-2 break-words text-xl font-bold text-gray-900">{title}</h2>
                    <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-gray-700">{content}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

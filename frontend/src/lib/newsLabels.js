import { formatDayMonth, formatLocalizedDate } from '@/lib/locale';

const CATEGORY_STYLES = {
  news: 'bg-blue-100 text-blue-700',
  announcement: 'bg-orange-100 text-orange-700',
  service: 'bg-green-100 text-green-700',
  compliance: 'bg-purple-100 text-purple-700',
};

export function getNewsCategory(t, category) {
  const key = category && t.news.categories[category] ? category : 'news';
  return {
    label: t.news.categories[key],
    style: CATEGORY_STYLES[key] ?? 'bg-gray-100 text-gray-600',
  };
}

export function getNewsSourceLabel(t, source) {
  if (source === 'abay') return t.news.sources.abay;
  if (source === 'transport') return t.news.sources.transport;
  if (source === 'aviation') return t.news.sources.aviationShort;
  return t.news.sources.akorda;
}

export function formatNewsDate(article, lang) {
  if (!article?.date) return article?.dateLabel ?? '';
  if (article.source === 'transport' || article.source === 'aviation') {
    return formatDayMonth(article.date, lang);
  }
  return article.dateLabel ?? formatLocalizedDate(article.date, lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const NEWS_SOURCE_FILTERS = [
  { key: 'akorda', labelKey: 'akorda' },
  { key: 'abay', labelKey: 'abay' },
  { key: 'transport', labelKey: 'transport' },
  { key: 'aviation', labelKey: 'aviation' },
];

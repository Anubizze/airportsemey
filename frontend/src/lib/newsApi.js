import { NEWS as fallbackNews } from '@/data/news';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export async function fetchAkordaNews(limit = 12) {
  const response = await fetch(`${API_BASE}/news/akorda?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Akorda news (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return mapApiNews(data, 'akorda');
}

export async function fetchAbayNews(limit = 12) {
  const response = await fetch(`${API_BASE}/news/abay?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Abay news (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return mapApiNews(data, 'abay');
}

export async function fetchTransportNews(limit = 12) {
  const response = await fetch(`${API_BASE}/news/transport?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Transport news (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return mapApiNews(data, 'transport');
}

export async function fetchAviationNews(limit = 12) {
  const response = await fetch(`${API_BASE}/news/aviation?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Aviation news (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return mapApiNews(data, 'aviation');
}

export async function fetchNewsBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE}/news/article/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      if (data?.article) {
        return {
          article: mapApiNews([data.article], data.article.source ?? 'akorda')[0],
          related: mapApiNews(data.related ?? [], data.article.source ?? 'akorda'),
        };
      }
    }
  } catch {
    // fall through to list search
  }

  const [akorda, abay, transport, aviation] = await Promise.all([
    fetchAkordaNews(50).catch(() => []),
    fetchAbayNews(50).catch(() => []),
    fetchTransportNews(50).catch(() => []),
    fetchAviationNews(50).catch(() => []),
  ]);
  const merged = [...akorda, ...abay, ...transport, ...aviation];
  const article = merged.find((item) => item.slug === slug);
  if (!article) return null;

  const related = merged
    .filter((item) => item.slug !== slug && item.source === article.source)
    .slice(0, 3);

  return { article, related };
}

function mapApiNews(items, fallbackSource) {
  return items.map((item, idx) => ({
    id: item.id ?? `${fallbackSource}-${idx}`,
    slug: item.slug ?? `${fallbackSource}-${idx}`,
    title: item.title ?? 'Новость',
    excerpt: item.excerpt ?? item.title ?? '',
    content:
      item.content ??
      item.excerpt ??
      'Для полного текста новости перейдите на официальный источник по ссылке ниже.',
    date: item.date ?? new Date().toISOString().slice(0, 10),
    dateLabel: item.dateLabel ?? null,
    category: 'news',
    source: item.source ?? fallbackSource,
    sourceUrl:
      item.sourceUrl ??
      (fallbackSource === 'abay'
        ? 'https://www.gov.kz/memleket/entities/abay/press/news/news/1?lang=ru'
        : fallbackSource === 'transport'
          ? 'https://www.gov.kz/memleket/entities/transport/press/news/news/1?lang=ru'
          : fallbackSource === 'aviation'
            ? 'https://www.gov.kz/memleket/entities/aviation/press/news/1?lang=ru'
        : 'https://www.akorda.kz/ru/events'),
    image: item.imageUrl ?? null,
  }));
}

export function getFallbackNews() {
  return fallbackNews.map((item) => ({
    ...item,
    source: 'akorda',
    sourceUrl: null,
    image: item.image ?? null,
    dateLabel: null,
  }));
}

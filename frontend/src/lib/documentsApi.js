import { resolveUploadUrl } from '@/lib/servicesApi';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export { resolveUploadUrl };

export async function fetchPartnerDocumentsGrouped() {
  const response = await fetch(`${API_BASE}/partner-documents`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить документы');
  }
  return response.json();
}

export async function fetchAdminPartnerDocuments(token) {
  const response = await fetch(`${API_BASE}/partner-documents/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить документы');
  }
  return data;
}

export async function uploadPartnerDocument(token, { year, file, titleRu, titleKz, titleEn, sortOrder, isPublished }) {
  const formData = new FormData();
  formData.append('year', String(year));
  formData.append('file', file);
  formData.append('titleRu', titleRu);
  if (titleKz) formData.append('titleKz', titleKz);
  if (titleEn) formData.append('titleEn', titleEn);
  if (sortOrder !== undefined && sortOrder !== '') {
    formData.append('sortOrder', String(sortOrder));
  }
  formData.append('isPublished', isPublished ? 'true' : 'false');

  const response = await fetch(`${API_BASE}/partner-documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка загрузки',
    );
  }
  return data;
}

export async function deletePartnerDocument(token, id) {
  const response = await fetch(`${API_BASE}/partner-documents/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка удаления');
  }
  return data;
}

export function getDocumentTitle(doc, lang) {
  if (lang === 'kz') return doc.titleKz || doc.titleRu;
  if (lang === 'en') return doc.titleEn || doc.titleRu;
  return doc.titleRu;
}

export function groupDocumentsByYear(documents) {
  const grouped = new Map();
  for (const doc of documents) {
    const list = grouped.get(doc.year) ?? [];
    list.push(doc);
    grouped.set(doc.year, list);
  }
  return Array.from(grouped.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, documents: items }));
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

async function request(path = '', options = {}) {
  const response = await fetch(`${API_BASE}/announcements${path}`, { cache: 'no-store', ...options });
  const data = await response.json().catch(() => null);
  if (response.status === 401) throw new Error('SESSION_EXPIRED');
  if (!response.ok) {
    throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Не удалось выполнить действие с объявлениями');
  }
  if (data === null) throw new Error('Некорректный ответ сервера');
  return data;
}

export function fetchAnnouncements() { return request(); }

export function fetchAdminAnnouncements(token) {
  return request('/admin/all', { headers: { Authorization: `Bearer ${token}` } });
}

export function saveAnnouncement(token, payload, id) {
  return request(id ? `/${encodeURIComponent(id)}` : '', {
    method: id ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteAnnouncement(token, id) {
  return request(`/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}

export function getAnnouncementText(announcement, lang) {
  const suffix = lang === 'kz' ? 'Kz' : lang === 'en' ? 'En' : 'Ru';
  return {
    title: announcement[`title${suffix}`] || announcement.titleRu,
    content: announcement[`content${suffix}`] || announcement.contentRu,
  };
}

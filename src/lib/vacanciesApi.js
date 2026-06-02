const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export function formatContactPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `8 (${digits.slice(1, 5)}) ${digits.slice(5, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 11 && digits.startsWith('7')) {
    return `8 (${digits.slice(1, 5)}) ${digits.slice(5, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  return phone || '8 (7222) 36-00-33';
}

export function phoneHref(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return 'tel:+77222360033';
  if (digits.startsWith('8')) return `tel:+7${digits.slice(1)}`;
  if (digits.startsWith('7')) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export async function fetchVacancies() {
  const response = await fetch(`${API_BASE}/vacancies`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить вакансии');
  }
  return response.json();
}

export async function submitVacancyApplication(vacancyId, payload) {
  const response = await fetch(`${API_BASE}/vacancies/${vacancyId}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка отправки',
    );
  }
  return data;
}

export async function fetchAdminVacancies(token) {
  const response = await fetch(`${API_BASE}/vacancies/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить вакансии');
  }
  return data;
}

export async function fetchVacancyApplications(token) {
  const response = await fetch(`${API_BASE}/vacancies/admin/applications`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить отклики');
  }
  return data;
}

export async function saveVacancy(token, payload, id) {
  const response = await fetch(`${API_BASE}/vacancies${id ? `/${id}` : ''}`, {
    method: id ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка сохранения',
    );
  }
  return data;
}

export async function deleteVacancy(token, id) {
  const response = await fetch(`${API_BASE}/vacancies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка удаления');
  }
  return data;
}

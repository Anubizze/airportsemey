const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export async function fetchFuelStorageContent() {
  const response = await fetch(`${API_BASE}/fuel-storage-content`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные хранения топлива');
  }
  return response.json();
}

export async function fetchAdminFuelStorageContent(token) {
  const response = await fetch(`${API_BASE}/fuel-storage-content/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить данные хранения топлива');
  }
  return data;
}

export async function saveFuelStorageContent(token, payload) {
  const response = await fetch(`${API_BASE}/fuel-storage-content/admin`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка сохранения',
    );
  }
  return data;
}

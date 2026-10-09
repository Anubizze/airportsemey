const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api';

export const DEFAULT_SERVICE_PRICES = {
  vipOne: '5 000 тг',
  vipFew: '4 000 тг',
  vipGroup: 'от 3 000 тг/чел',
  luggage: '1 000 тенге/сутки',
  tariffs: [],
};

export async function fetchServicePrices() {
  const response = await fetch(`${API_BASE}/service-prices`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Не удалось загрузить цены');
  return response.json();
}

export async function saveServicePrices(token, prices) {
  const response = await fetch(`${API_BASE}/service-prices`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prices),
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    const error = new Error('SESSION_EXPIRED');
    throw error;
  }
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Не удалось сохранить цены',
    );
  }
  return data;
}

export function tariffCells(row, lang) {
  const suffix = lang === 'kz' ? 'Kz' : lang === 'en' ? 'En' : 'Ru';
  const name = row[`name${suffix}`] || row.nameRu;
  const unit = row[`unit${suffix}`] || row.unitRu;
  const price = row[`price${suffix}`] || row.priceRu;
  return [name, unit, price];
}

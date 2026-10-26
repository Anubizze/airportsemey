const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api';

export async function fetchSchedule() {
  const response = await fetch(`${API_BASE}/schedule`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Не удалось загрузить расписание');
  const data = await response.json();
  if (!Array.isArray(data.entries)) throw new Error('Некорректное расписание');
  return data;
}

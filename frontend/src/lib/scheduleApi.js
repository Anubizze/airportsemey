import { upgradeLegacyWinterSchedule } from '@/lib/legacySchedule';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api';

export function normalizeScheduleBoard(data) {
  if (!Array.isArray(data?.entries)) throw new Error('Некорректное расписание');
  const entries = Number(data.schemaVersion) >= 2 ? data.entries : upgradeLegacyWinterSchedule(data.entries) || data.entries;
  for (const entry of entries) {
    if (!entry || !Number.isInteger(Number(entry.weekday)) || Number(entry.weekday) < 0 || Number(entry.weekday) > 6
      || !['departure', 'arrival'].includes(entry.direction) || typeof entry.flightNumber !== 'string'
      || typeof entry.city !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.time)) throw new Error('Некорректное расписание');
  }
  return { ...data, entries };
}

export async function fetchSchedule({ signal } = {}) {
  const response = await fetch(`${API_BASE}/schedule`, { cache: 'no-store', signal });
  if (!response.ok) throw new Error('Не удалось загрузить расписание');
  return normalizeScheduleBoard(await response.json());
}

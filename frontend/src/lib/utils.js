import { getLocale } from '@/lib/locale';

export function formatDate(dateStr, lang = 'ru') {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getLocale(lang), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateLong(dateStr, lang = 'ru') {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getLocale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getAirlineInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const AIRLINE_COLORS = {
  KC: { bg: 'bg-blue-900', text: 'text-white' },
  DV: { bg: 'bg-red-700', text: 'text-white' },
  FS: { bg: 'bg-orange-500', text: 'text-white' },
  IQ: { bg: 'bg-blue-600', text: 'text-white' },
};

export const STATUS_STYLES = {
  scheduled: 'bg-blue-50 text-blue-700',
  checkin: 'bg-green-100 text-green-800',
  boarding: 'bg-orange-100 text-orange-800',
  departed: 'bg-gray-100 text-gray-500',
  delayed: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-200 text-red-900',
  landing: 'bg-purple-100 text-purple-800',
  landed: 'bg-gray-100 text-gray-500',
  arrived: 'bg-gray-100 text-gray-500',
};

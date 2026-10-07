import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';
import hiSkyLogo from '@/public/hisky.png';

import { resolveUploadUrl } from '@/lib/servicesApi';

export const BUILTIN_AIRLINES = [
  {
    code: 'FS',
    name: 'FlyArystan',
    websiteUrl: 'https://www.flyarystan.com',
    logo: flyarystanLogo,
    descriptionKey: 'flyarystan',
    sortOrder: 1,
    aliases: ['KC'],
  },
  {
    code: 'DV',
    name: 'SCAT Airlines',
    websiteUrl: 'https://www.scat.kz',
    logo: scatLogo,
    descriptionKey: 'scat',
    sortOrder: 2,
    aliases: [],
  },
  {
    code: 'IH',
    name: 'Hi Sky',
    websiteUrl: 'https://hisky.kz/',
    logo: hiSkyLogo,
    descriptionKey: 'hisky',
    sortOrder: 3,
    aliases: [],
  },
];

export function mergeAirlines(apiRows) {
  const list = BUILTIN_AIRLINES.map((item) => ({
    ...item,
    id: null,
    logoUrl: '',
    description: '',
    builtin: true,
  }));

  for (const row of apiRows || []) {
    const code = String(row.code || '').trim().toUpperCase();
    if (!code) continue;
    const index = list.findIndex((item) => item.code === code);
    const logoUrl = row.logoUrl ? resolveUploadUrl(row.logoUrl) : '';
    const next = {
      id: row.id,
      code,
      name: row.name || code,
      websiteUrl: row.websiteUrl || (index >= 0 ? list[index].websiteUrl : ''),
      logoUrl,
      logo: index >= 0 ? list[index].logo : null,
      description: row.description || '',
      descriptionKey: index >= 0 ? list[index].descriptionKey : '',
      aliases: index >= 0 ? list[index].aliases : [],
      builtin: index >= 0,
      sortOrder: Number(row.sortOrder ?? (index >= 0 ? list[index].sortOrder : 100)),
    };
    if (index >= 0) {
      list[index] = next;
    } else {
      list.push(next);
    }
  }

  return list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'ru'));
}

export function findAirline(airlines, code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return null;
  return (
    airlines.find(
      (item) => item.code === normalized || (item.aliases || []).includes(normalized),
    ) || null
  );
}

export function airlineText(airline, dictionary, section) {
  if (!airline) return '';
  if (airline.description) return airline.description;
  const key = airline.descriptionKey ? `${airline.descriptionKey}Desc` : '';
  return key && dictionary?.[section]?.[key] ? dictionary[section][key] : '';
}

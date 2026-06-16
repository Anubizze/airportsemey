export const LOCALE_BY_LANG = {
  ru: 'ru-RU',
  kz: 'kk-KZ',
  en: 'en-US',
};

export const HTML_LANG_BY_KEY = {
  ru: 'ru',
  kz: 'kk',
  en: 'en',
};

export function getLocale(lang) {
  return LOCALE_BY_LANG[lang] ?? 'ru-RU';
}

export function getHtmlLang(lang) {
  return HTML_LANG_BY_KEY[lang] ?? 'ru';
}

export function formatLocalizedDate(dateInput, lang, options = {}) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(getLocale(lang), options);
}

export function formatDayMonth(dateInput, lang) {
  return formatLocalizedDate(dateInput, lang, { day: 'numeric', month: 'long' });
}

const CITY_KEYS = {
  astana: 'Astana',
  'nur-sultan': 'Astana',
  астана: 'Astana',
  almaty: 'Almaty',
  алматы: 'Almaty',
  karagandy: 'Karagandy',
  karaganda: 'Karagandy',
  караганда: 'Karagandy',
  қарағанды: 'Karagandy',
  urzhar: 'Urzhar',
  урджар: 'Urzhar',
  үржар: 'Urzhar',
};

export function translateCity(name, cities) {
  if (!name) return name;
  const key = CITY_KEYS[String(name).trim().toLowerCase()] ?? name;
  return cities[key] ?? name;
}

/** Pick localized string/object field: lang → en → ru → kz */
export function pickLocalized(record, lang) {
  if (!record || typeof record !== 'object') return record;
  return record[lang] ?? record.en ?? record.ru ?? record.kz ?? '';
}

const EMPLOYMENT_TYPE_KEYS = {
  'полная занятость': 'fullTime',
  'частичная занятость': 'partTime',
  'удалённая работа': 'remote',
  'удаленная работа': 'remote',
  'стажировка': 'internship',
  'контракт': 'contract',
};

export function translateEmploymentType(value, employmentTypes) {
  if (!value) return value;
  const key = EMPLOYMENT_TYPE_KEYS[String(value).trim().toLowerCase()];
  return key ? (employmentTypes[key] ?? value) : value;
}

'use client';

import { useEffect, useState } from 'react';
import {
  fetchAdminFuelStorageContent,
  saveFuelStorageContent,
} from '@/lib/fuelStorageApi';

function toPriceLines(priceRows) {
  if (!Array.isArray(priceRows)) return '';
  return priceRows
    .map((row) => `${row.name ?? ''} | ${row.unit ?? ''} | ${row.price ?? ''}`.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

function parsePriceLines(value) {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length < 3) {
      throw new Error(
        `Строка цены №${index + 1} должна быть в формате: Наименование | Единица | Цена`,
      );
    }
    return {
      name: parts[0],
      unit: parts[1],
      price: parts.slice(2).join(' | '),
      sortOrder: index,
    };
  });
}

export default function FuelStorageAdminSection({ token, onMessage, onAuthError }) {
  const [activeLang, setActiveLang] = useState('ru');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [capacityDate, setCapacityDate] = useState('');
  const [capacityTons, setCapacityTons] = useState('');
  const [submitEmail, setSubmitEmail] = useState('airportsemey@mail.kz');
  const [contactPhone, setContactPhone] = useState('8 (7222) 36-00-33');
  const [priceRowsRuText, setPriceRowsRuText] = useState('');
  const [priceRowsKzText, setPriceRowsKzText] = useState('');
  const [priceRowsEnText, setPriceRowsEnText] = useState('');
  const [documentsRuText, setDocumentsRuText] = useState('');
  const [documentsKzText, setDocumentsKzText] = useState('');
  const [documentsEnText, setDocumentsEnText] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const languageTabs = [
    { id: 'ru', label: 'RU' },
    { id: 'kz', label: 'KZ' },
    { id: 'en', label: 'EN' },
  ];

  useEffect(() => {
    let cancelled = false;
    if (!token) return undefined;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminFuelStorageContent(token);
        if (cancelled) return;
        setCapacityDate(data?.capacityDate ?? '');
        setCapacityTons(data?.capacityTons ?? '');
        setSubmitEmail(data?.submitEmail ?? 'airportsemey@mail.kz');
        setContactPhone(data?.contactPhone ?? '8 (7222) 36-00-33');
        setPriceRowsRuText(toPriceLines(data?.priceRowsRu ?? data?.priceRows));
        setPriceRowsKzText(toPriceLines(data?.priceRowsKz ?? data?.priceRows));
        setPriceRowsEnText(toPriceLines(data?.priceRowsEn ?? data?.priceRows));
        setDocumentsRuText(
          Array.isArray(data?.documentsRu ?? data?.documents)
            ? (data.documentsRu ?? data.documents).join('\n')
            : '',
        );
        setDocumentsKzText(
          Array.isArray(data?.documentsKz ?? data?.documents)
            ? (data.documentsKz ?? data.documents).join('\n')
            : '',
        );
        setDocumentsEnText(
          Array.isArray(data?.documentsEn ?? data?.documents)
            ? (data.documentsEn ?? data.documents).join('\n')
            : '',
        );
        setUpdatedAt(data?.updatedAt ? new Date(data.updatedAt).toLocaleString('ru-RU') : '');
      } catch (error) {
        if (!cancelled) {
          if (error?.message === 'SESSION_EXPIRED') {
            onAuthError?.(error);
          } else {
            onMessage?.(error?.message || 'Не удалось загрузить данные хранения топлива');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [token, onAuthError, onMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    onMessage?.('');
    try {
      const priceRowsRu = parsePriceLines(priceRowsRuText);
      const priceRowsKz = parsePriceLines(priceRowsKzText);
      const priceRowsEn = parsePriceLines(priceRowsEnText);

      const parseDocuments = (value, langLabel) => {
        const rows = value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
        if (rows.length === 0) {
          throw new Error(`Добавьте хотя бы один пункт в перечень документов (${langLabel})`);
        }
        return rows;
      };

      const documentsRu = parseDocuments(documentsRuText, 'RU');
      const documentsKz = parseDocuments(documentsKzText, 'KZ');
      const documentsEn = parseDocuments(documentsEnText, 'EN');

      const payload = {
        capacityDate: capacityDate.trim(),
        capacityTons: capacityTons.trim(),
        submitEmail: submitEmail.trim(),
        contactPhone: contactPhone.trim(),
        priceRowsRu,
        priceRowsKz,
        priceRowsEn,
        documentsRu,
        documentsKz,
        documentsEn,
      };

      const saved = await saveFuelStorageContent(token, payload);
      setUpdatedAt(saved?.updatedAt ? new Date(saved.updatedAt).toLocaleString('ru-RU') : '');
      onMessage?.('Данные раздела "Хранение авиационного топлива" сохранены');
    } catch (error) {
      if (error?.message === 'SESSION_EXPIRED') {
        onAuthError?.(error);
      } else {
        onMessage?.(error?.message || 'Ошибка сохранения');
      }
    } finally {
      setSaving(false);
    }
  };

  const languageFieldsByTab = {
    ru: {
      priceLabel: 'Стоимость услуг RU (каждая строка: Наименование | Единица | Цена)',
      pricePlaceholder: 'Услуги по хранению ГСМ | за 1 тн | 13291.00',
      priceValue: priceRowsRuText,
      setPriceValue: setPriceRowsRuText,
      docsLabel: 'Перечень документов RU (по одному пункту в строке)',
      docsValue: documentsRuText,
      setDocsValue: setDocumentsRuText,
    },
    kz: {
      priceLabel: 'Стоимость услуг KZ (әр жол: Қызмет | Өлшем бірлігі | Бағасы)',
      pricePlaceholder: 'Жанармай сақтау қызметтері | 1 тоннаға | 13291.00',
      priceValue: priceRowsKzText,
      setPriceValue: setPriceRowsKzText,
      docsLabel: 'Құжаттар тізімі KZ (әр жолға бір тармақ)',
      docsValue: documentsKzText,
      setDocsValue: setDocumentsKzText,
    },
    en: {
      priceLabel: 'Service prices EN (each line: Name | Unit | Price)',
      pricePlaceholder: 'Fuel storage services | per 1 ton stored | 13291.00',
      priceValue: priceRowsEnText,
      setPriceValue: setPriceRowsEnText,
      docsLabel: 'Documents list EN (one item per line)',
      docsValue: documentsEnText,
      setDocsValue: setDocumentsEnText,
    },
  };

  const activeFields = languageFieldsByTab[activeLang] ?? languageFieldsByTab.ru;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Хранение авиационного топлива</h2>
          <p className="text-sm text-gray-500">
            Редактирование данных страницы `/partners/fuel-storage`
          </p>
        </div>
        {updatedAt ? <span className="text-xs text-gray-500">Обновлено: {updatedAt}</span> : null}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="text-gray-600">Дата свободных мощностей</span>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            value={capacityDate}
            onChange={(e) => setCapacityDate(e.target.value)}
            placeholder="29.06.2026"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-600">Свободные мощности (метрические тонны)</span>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            value={capacityTons}
            onChange={(e) => setCapacityTons(e.target.value)}
            placeholder="3500"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-600">Email для заявок</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            value={submitEmail}
            onChange={(e) => setSubmitEmail(e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-600">Телефон</span>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
        </label>
        <div className="md:col-span-2 rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            {languageTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLang(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
                  activeLang === tab.id
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label className="text-sm">
              <span className="text-gray-600">{activeFields.priceLabel}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                rows={4}
                value={activeFields.priceValue}
                onChange={(e) => activeFields.setPriceValue(e.target.value)}
                placeholder={activeFields.pricePlaceholder}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">{activeFields.docsLabel}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                rows={6}
                value={activeFields.docsValue}
                onChange={(e) => activeFields.setDocsValue(e.target.value)}
                required
              />
            </label>
          </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || loading}
            className="rounded-xl bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить данные раздела'}
          </button>
        </div>
      </form>
    </div>
  );
}

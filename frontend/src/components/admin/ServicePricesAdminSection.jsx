'use client';

import { useEffect, useState } from 'react';

import { fetchServicePrices, saveServicePrices } from '@/lib/servicePricesApi';

const EMPTY_TARIFF = {
  nameRu: '',
  unitRu: '',
  priceRu: '',
  nameKz: '',
  unitKz: '',
  priceKz: '',
  nameEn: '',
  unitEn: '',
  priceEn: '',
};

const LANGS = [
  { id: 'Ru', label: 'RU' },
  { id: 'Kz', label: 'KZ' },
  { id: 'En', label: 'EN' },
];

export default function ServicePricesAdminSection({ token, onMessage, onAuthError }) {
  const [prices, setPrices] = useState(null);
  const [lang, setLang] = useState('Ru');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchServicePrices()
      .then((data) => {
        if (!cancelled) setPrices(data);
      })
      .catch((error) => {
        if (!cancelled) onMessage(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [onMessage]);

  const updateTariff = (index, field, value) => {
    setPrices((current) => {
      const tariffs = [...(current?.tariffs ?? [])];
      tariffs[index] = { ...tariffs[index], [field]: value };
      return { ...current, tariffs };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await saveServicePrices(token, prices);
      setPrices(saved);
      onMessage('Цены услуг сохранены');
    } catch (error) {
      if (!onAuthError(error)) onMessage(error.message || 'Не удалось сохранить цены');
    } finally {
      setSaving(false);
    }
  };

  if (!prices) {
    return <p className="text-sm text-gray-500">Загрузка цен...</p>;
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Цены услуг</h2>
        <p className="text-sm text-gray-500">VIP-зал, камера хранения и таблица тарифов на сайте.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="text-gray-600">VIP, 1 пассажир</span>
          <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={prices.vipOne} onChange={(e) => setPrices({ ...prices, vipOne: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="text-gray-600">VIP, 2–4 пассажира</span>
          <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={prices.vipFew} onChange={(e) => setPrices({ ...prices, vipFew: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="text-gray-600">VIP, группа 5+</span>
          <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={prices.vipGroup} onChange={(e) => setPrices({ ...prices, vipGroup: e.target.value })} />
        </label>
        <label className="text-sm md:col-span-3">
          <span className="text-gray-600">Камера хранения</span>
          <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={prices.luggage} onChange={(e) => setPrices({ ...prices, luggage: e.target.value })} />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">Тарифы</h3>
        <div className="flex gap-1">
          {LANGS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLang(item.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${lang === item.id ? 'bg-blue-900 text-white' : 'border border-gray-200 text-gray-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {(prices.tariffs ?? []).map((row, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_160px_180px_auto] gap-2">
            <input className="rounded-lg border border-gray-200 px-3 py-2 text-sm" value={row[`name${lang}`] ?? ''} onChange={(e) => updateTariff(index, `name${lang}`, e.target.value)} placeholder="Услуга" />
            <input className="rounded-lg border border-gray-200 px-3 py-2 text-sm" value={row[`unit${lang}`] ?? ''} onChange={(e) => updateTariff(index, `unit${lang}`, e.target.value)} placeholder="Единица" />
            <input className="rounded-lg border border-gray-200 px-3 py-2 text-sm" value={row[`price${lang}`] ?? ''} onChange={(e) => updateTariff(index, `price${lang}`, e.target.value)} placeholder="Цена" />
            <button type="button" className="text-sm text-red-600 px-2" onClick={() => setPrices({ ...prices, tariffs: prices.tariffs.filter((_, i) => i !== index) })}>Удалить</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-xl border border-gray-300 px-4 py-2 text-sm" onClick={() => setPrices({ ...prices, tariffs: [...(prices.tariffs ?? []), { ...EMPTY_TARIFF }] })}>Добавить строку</button>
        <button type="submit" disabled={saving} className="rounded-xl bg-blue-900 text-white text-sm font-semibold px-4 py-2 disabled:opacity-50">{saving ? 'Сохранение...' : 'Сохранить цены'}</button>
      </div>
    </form>
  );
}

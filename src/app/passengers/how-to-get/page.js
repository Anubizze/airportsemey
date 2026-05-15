'use client';

import { useLanguage } from '@/context/LanguageContext';

const TRANSPORT = {
  ru: [
    { key: 'taxi', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', items: ['Официальное такси — у выхода из зоны прилёта','Яндекс Go, inDrive — работают в городе','Стоимость: от 1 500 тенге до центра','Время в пути: ~20 минут'] },
    { key: 'bus', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', items: ['Маршрут №12 — до центра города','Остановка у главного входа в терминал','Интервал: 30 минут','Время в пути: ~40 минут'] },
    { key: 'car', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', items: ['Бесплатная парковка у терминала — 1 час','Платная парковка — от 200 тенге/час','Навигатор: «Аэропорт Семей»','Координаты: 50.3742° N, 80.2348° E'] },
  ],
  kz: [
    { key: 'taxi', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', items: ['Ресми такси — қону аймағынан шыққан жерде','Яндекс Go, inDrive — қалада жұмыс істейді','Бағасы: орталыққа дейін 1 500 теңгеден','Жол уақыты: ~20 минут'] },
    { key: 'bus', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', items: ['№12 маршрут — қала орталығына дейін','Терминалдың басты кіреберісінде аялдама','Интервал: 30 минут','Жол уақыты: ~40 минут'] },
    { key: 'car', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', items: ['Терминал жанында тегін тұрақ — 1 сағат','Ақылы тұрақ — сағатына 200 теңгеден','Навигатор: «Семей әуежайы»','Координаттар: 50.3742° N, 80.2348° E'] },
  ],
  en: [
    { key: 'taxi', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', items: ['Official taxi — at arrivals exit','Yandex Go, inDrive — operate in the city','Price: from 1,500 KZT to city centre','Travel time: ~20 minutes'] },
    { key: 'bus', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', items: ['Route No. 12 — to city centre','Stop at main terminal entrance','Frequency: every 30 minutes','Travel time: ~40 minutes'] },
    { key: 'car', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', items: ['Free parking at terminal — 1 hour','Paid parking — from 200 KZT/hour','Navigation: "Semey Airport"','Coordinates: 50.3742° N, 80.2348° E'] },
  ],
};

export default function HowToGetPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.howToGet;
  const transports = TRANSPORT[lang] ?? TRANSPORT.ru;
  const titles = [p.taxi, p.bus, p.car];

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/passengers" className="hover:text-white transition-colors">{t.nav.passengers}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{p.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Map placeholder */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
            <div className="h-72 flex items-center justify-center text-gray-400" style={{ background: 'linear-gradient(135deg, #e8edf5 0%, #d0dce8 100%)' }}>
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">г. Семей, ул. Аэропорт, 1</p>
                <a
                  href="https://yandex.kz/maps/?text=Аэропорт+Семей"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-blue-700 font-medium hover:text-blue-900 transition-colors"
                >
                  {p.openMap}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {transports.map((transport, idx) => (
              <div key={transport.key} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={transport.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{titles[idx]}</h3>
                <ul className="space-y-2">
                  {transport.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

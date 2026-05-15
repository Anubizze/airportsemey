'use client';

import { useLanguage } from '@/context/LanguageContext';

const SERVICES = [
  {
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    title: { ru: 'Кафе «Лидо»', kz: '«Лидо» кафесі', en: 'Café Lido' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: { ru: 'Горячие блюда, прохладительные напитки, кофе, большой выбор выпечки и закусок.', kz: 'Ыстық тағамдар, суық сусындар, кофе, нан-тоқаш пен закускалардың үлкен таңдауы.', en: 'Hot meals, cold drinks, coffee, wide selection of pastries and snacks.' },
  },
  {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: { ru: 'Медицинская часть', kz: 'Медициналық бөлім', en: 'Medical Unit' },
    floor: { ru: '1 этаж, правая сторона', kz: '1-қабат, оң жақ', en: '1st floor, right side' },
    desc: { ru: 'Первая медицинская помощь, предполётный контроль экипажа. Тел: 8 (7222) 360-222.', kz: 'Алғашқы медициналық көмек, экипаждың ұшу алдындағы бақылауы. Тел: 8 (7222) 360-222.', en: 'First aid, pre-flight crew check. Tel: 8 (7222) 360-222.' },
  },
  {
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707',
    title: { ru: 'Намазхана', kz: 'Намазхана', en: 'Prayer Room' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: { ru: 'Уединённая комната для молитв, оснащённая всеми необходимыми предметами.', kz: 'Барлық қажетті заттармен жабдықталған жеке намаз оқу бөлмесі.', en: 'Private prayer room equipped with all necessary items.' },
  },
  {
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: { ru: 'Справочное бюро', kz: 'Анықтама бюросы', en: 'Information Desk' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: { ru: 'Информация о расписании рейсов и услугах аэропорта. Тел: 8 (7222) 360-222.', kz: 'Рейс кестесі және әуежай қызметтері туралы ақпарат. Тел: 8 (7222) 360-222.', en: 'Flight schedule and airport services information. Tel: 8 (7222) 360-222.' },
  },
  {
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    title: { ru: 'Авиакасса', kz: 'Авиакасса', en: 'Ticket Office' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: { ru: 'Касса не работает. Билеты: flyarystan.com, scat.kz. Тел: 8 (7222) 36-02-22.', kz: 'Касса жұмыс істемейді. Билеттер: flyarystan.com, scat.kz. Тел: 8 (7222) 36-02-22.', en: 'Office closed. Tickets at flyarystan.com, scat.kz. Tel: 8 (7222) 36-02-22.' },
  },
  {
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    title: { ru: 'VIP зал', kz: 'VIP залы', en: 'VIP Lounge' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: { ru: 'Регистрация, досмотр, трансфер до ВС. Тел: 8 (7222) 36-15-00.', kz: 'Тіркелу, тексеру, ұшаққа трансфер. Тел: 8 (7222) 36-15-00.', en: 'Check-in, security, aircraft transfer. Tel: 8 (7222) 36-15-00.' },
  },
  {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: { ru: 'Комната матери и ребёнка', kz: 'Ана мен бала бөлмесі', en: 'Mother & Child Room' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: { ru: 'Детская кроватка, пеленальный столик, корзина с игрушками, туалет.', kz: 'Балалар керуеті, пелёналау үстелі, ойыншықтар себеті, дәретхана.', en: 'Cot, changing table, toy basket, toilet.' },
  },
  {
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    title: { ru: 'Камера хранения', kz: 'Заттарды сақтау', en: 'Left Luggage' },
    floor: { ru: '1 этаж, правая сторона', kz: '1-қабат, оң жақ', en: '1st floor, right side' },
    desc: { ru: 'Хранение багажа. 1 000 тенге/сутки. Макс. вес — 30 кг.', kz: 'Жүк сақтау. 1 000 теңге/тәулік. Макс. салмақ — 30 кг.', en: 'Luggage storage. 1,000 KZT/day. Max weight — 30 kg.' },
  },
  {
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: { ru: 'Помощь маломобильным', kz: 'Мобильдігі шектеулілерге көмек', en: 'Mobility Assistance' },
    floor: { ru: 'Весь терминал', kz: 'Бүкіл терминал', en: 'Entire terminal' },
    desc: { ru: 'Инвалидные коляски, амбулифт. Заявка за 5 дней. Тел: 8 (7222) 360-222.', kz: 'Инвалидті арбалар, амбулифт. 5 күн бұрын өтініш. Тел: 8 (7222) 360-222.', en: 'Wheelchairs, ambulift. Request 5 days in advance. Tel: 8 (7222) 360-222.' },
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: { ru: 'ЛОВД (Полиция)', kz: 'ЛМАБ (Полиция)', en: 'Airport Police' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: { ru: 'Общественный порядок, проверка документов. Обращайтесь при утере документов.', kz: 'Қоғамдық тәртіп, құжаттарды тексеру. Құжаттар жоғалса хабарласыңыз.', en: 'Public order, document verification. Contact if documents are lost.' },
  },
];

export default function ServicesPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.services;

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
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => (
              <div key={service.title.ru} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{service.title[lang] ?? service.title.ru}</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">{service.floor[lang] ?? service.floor.ru}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{service.desc[lang] ?? service.desc.ru}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

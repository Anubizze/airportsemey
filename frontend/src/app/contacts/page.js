'use client';

import { useLanguage } from '@/context/LanguageContext';

const CONTACTS = [
  { key: 'info', phone: '8 (7222) 36-02-22', email: 'airportsemey@mail.kz', hours: '24/7' },
  { key: 'reception', phone: '8 (7222) 36-00-33', email: 'airportsemey@mail.kz', hoursRu: 'Пн–Пт: 09:00–18:00', hoursKz: 'Дс–Жм: 09:00–18:00', hoursEn: 'Mon–Fri: 09:00–18:00' },
  { key: 'ticket', titleRu: 'Авиакасса', titleKz: 'Авиакасса', titleEn: 'Ticket Office', phone: '8 (7222) 36-12-15', hoursRu: 'По расписанию рейсов', hoursKz: 'Рейс кестесі бойынша', hoursEn: 'Per flight schedule' },
  { key: 'vip', titleRu: 'VIP зал', titleKz: 'VIP залы', titleEn: 'VIP Lounge', phone: '8 (7222) 36-15-00', hoursRu: 'По расписанию рейсов', hoursKz: 'Рейс кестесі бойынша', hoursEn: 'Per flight schedule' },
  { key: 'disabled', titleRu: 'Служба помощи маломобильным', titleKz: 'Мобильдігі шектеулілерге көмек', titleEn: 'Reduced mobility service', phone: '8 (7222) 360-222', hours: '24/7' },
  { key: 'taxi', titleRu: 'Такси для лиц с ограниченными возможностями', titleKz: 'Мүмкіндігі шектеулілерге такси', titleEn: 'Disability taxi service', phone: '8 (7222) 672-797', hoursRu: 'По запросу', hoursKz: 'Сұранысқа байланысты', hoursEn: 'On request' },
];

export default function ContactsPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.contacts;

  const getTitle = (c) => {
    if (c.key === 'info') return t.pages.passengers.info;
    if (c.key === 'reception') return t.pages.passengers.reception;
    if (c.key === 'vip') return t.pages.passengers.vip;
    if (c.key === 'disabled') return t.pages.passengers.disabled;
    return c[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] ?? c.titleRu;
  };

  const getHours = (c) => {
    if (c.hours) return c.hours;
    return c[`hours${lang.charAt(0).toUpperCase() + lang.slice(1)}`] ?? c.hoursRu;
  };

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
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

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8 max-w-3xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{p.addressDetails}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{p.address}</div>
                  <div className="text-sm font-medium text-gray-800">{p.addressValue}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">{p.email}</div>
                  <a href="mailto:airportsemey@mail.kz" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                    airportsemey@mail.kz
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-5">{p.phones}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {CONTACTS.map((contact) => (
              <div key={contact.key} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">{getTitle(contact)}</h3>
                <div className="space-y-2">
                  <a href={`tel:${contact.phone.replace(/\s|\(|\)|-/g, '')}`} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contact.phone}
                  </a>
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact.email}
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getHours(contact)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{p.writeUs}</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{p.writeUsText}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t.pages.passengers.reception}</div>
                    <a href="tel:87222360033" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                      8 (7222) 36-00-33
                    </a>
                    <div className="text-xs text-gray-500 mt-1">{p.receptionHours}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{p.email}</div>
                    <a href="mailto:airportsemey@mail.kz" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                      airportsemey@mail.kz
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{p.address}</div>
                    <div className="text-sm font-medium text-gray-800">{p.addressValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

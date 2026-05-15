'use client';

import { useLanguage } from '@/context/LanguageContext';

const VACANCIES = {
  ru: [
    { title: 'Оператор стойки регистрации', department: 'Пассажирский сервис', type: 'Полная занятость', salary: '150 000 — 200 000 тг' },
    { title: 'Инженер по авиационной безопасности', department: 'Служба безопасности', type: 'Полная занятость', salary: '250 000 — 320 000 тг' },
    { title: 'Специалист по IT', department: 'IT-отдел', type: 'Полная занятость', salary: '200 000 — 280 000 тг' },
    { title: 'Бухгалтер', department: 'Финансовый отдел', type: 'Полная занятость', salary: '180 000 — 230 000 тг' },
    { title: 'Водитель спецтехники', department: 'Техническая служба', type: 'Полная занятость', salary: '160 000 — 210 000 тг' },
  ],
  kz: [
    { title: 'Тіркеу стойкасының операторы', department: 'Жолаушылар қызметі', type: 'Толық жұмыс күні', salary: '150 000 — 200 000 тг' },
    { title: 'Авиациялық қауіпсіздік инженері', department: 'Қауіпсіздік қызметі', type: 'Толық жұмыс күні', salary: '250 000 — 320 000 тг' },
    { title: 'IT маманы', department: 'IT бөлімі', type: 'Толық жұмыс күні', salary: '200 000 — 280 000 тг' },
    { title: 'Бухгалтер', department: 'Қаржы бөлімі', type: 'Толық жұмыс күні', salary: '180 000 — 230 000 тг' },
    { title: 'Арнайы техника жүргізушісі', department: 'Техникалық қызмет', type: 'Толық жұмыс күні', salary: '160 000 — 210 000 тг' },
  ],
  en: [
    { title: 'Check-in Counter Operator', department: 'Passenger Services', type: 'Full-time', salary: '150,000 — 200,000 KZT' },
    { title: 'Aviation Security Engineer', department: 'Security Service', type: 'Full-time', salary: '250,000 — 320,000 KZT' },
    { title: 'IT Specialist', department: 'IT Department', type: 'Full-time', salary: '200,000 — 280,000 KZT' },
    { title: 'Accountant', department: 'Finance Department', type: 'Full-time', salary: '180,000 — 230,000 KZT' },
    { title: 'Special Equipment Driver', department: 'Technical Service', type: 'Full-time', salary: '160,000 — 210,000 KZT' },
  ],
};

export default function VacanciesPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.vacancies;
  const vacancies = VACANCIES[lang] ?? VACANCIES.ru;

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/about" className="hover:text-white transition-colors">{t.nav.about}</a>
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
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div key={vacancy.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vacancy.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{vacancy.department}</span>
                      <span className="text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full">{vacancy.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{vacancy.salary}</span>
                    <a
                      href="/contacts"
                      className="inline-flex items-center gap-1 text-sm font-medium text-white px-4 py-2 rounded-xl whitespace-nowrap transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#001e5c' }}
                    >
                      {p.apply}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <p className="text-sm text-gray-700">
              {p.contactUs}{' '}
              <a href="mailto:hr@airport-semey.kz" className="font-medium text-blue-700 hover:underline">hr@airport-semey.kz</a>
              {' '}{p.orCall}{' '}
              <a href="tel:+77222360033" className="font-medium text-blue-700 hover:underline">8 (7222) 36-00-33</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

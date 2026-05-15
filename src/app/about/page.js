'use client';

import { useLanguage } from '@/context/LanguageContext';

const TEAM = [
  { name: 'Ахметов Болат Сериккалиевич', role: 'Генеральный директор' },
  { name: 'Нурланова Айгерим Маратовна', role: 'Заместитель директора по операционной деятельности' },
  { name: 'Сейткали Ержан Болатович', role: 'Главный инженер' },
  { name: 'Карибаева Динара Асхатовна', role: 'Финансовый директор' },
];

const HISTORY = [
  { year: '1958', ru: 'Основание аэропорта. Открытие первых регулярных воздушных рейсов.', kz: 'Әуежайдың негізі қаланды. Алғашқы тұрақты рейстер ашылды.', en: 'Airport founded. First regular flights launched.' },
  { year: '1991', ru: 'Реорганизация после обретения Казахстаном независимости.', kz: 'Қазақстан тәуелсіздік алғаннан кейін қайта ұйымдастырылды.', en: 'Reorganized after Kazakhstan gained independence.' },
  { year: '2005', ru: 'Первая масштабная реконструкция терминала и взлётно-посадочной полосы.', kz: 'Терминал мен ұшу-қону жолағының бірінші ірі реконструкциясы.', en: 'First major reconstruction of the terminal and runway.' },
  { year: '2015', ru: 'Аэропорт получает статус международного. Открытие международных направлений.', kz: 'Әуежай халықаралық мәртебе алды. Халықаралық бағыттар ашылды.', en: 'Airport gains international status. International routes opened.' },
  { year: '2024', ru: 'Завершение реконструкции пассажирского терминала. Пропускная способность — 500 пасс./час.', kz: 'Жолаушылар терминалының реконструкциясы аяқталды. Өткізу қабілеті — 500 жол./сағ.', en: 'Terminal reconstruction completed. Capacity increased to 500 pass./hour.' },
  { year: '2026', ru: 'Открытие новых маршрутов. Развитие партнёрской сети авиакомпаний.', kz: 'Жаңа бағыттар ашылды. Авиакомпания серіктестік желісі дамуда.', en: 'New routes opened. Airline partner network expanding.' },
];

const CERTS = [
  { ru: 'Сертификат аэродрома ИКАО (ICAO Aerodrome Certificate)', kz: 'ИКАО аэродром сертификаты', en: 'ICAO Aerodrome Certificate' },
  { ru: 'Сертификат соответствия ИКАО стандартам авиационной безопасности', kz: 'ИКАО авиациялық қауіпсіздік стандарттарына сәйкестік сертификаты', en: 'ICAO Aviation Security Compliance Certificate' },
  { ru: 'Сертификат системы менеджмента качества ISO 9001:2015', kz: 'ISO 9001:2015 сапа менеджмент жүйесінің сертификаты', en: 'ISO 9001:2015 Quality Management System Certificate' },
  { ru: 'Свидетельство о государственной регистрации', kz: 'Мемлекеттік тіркеу куәлігі', en: 'State Registration Certificate' },
];

export default function AboutPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.about;

  const STATS = [
    { value: '1958', label: p.foundedYear },
    { value: '8 500', label: `м² — ${p.terminalArea}` },
    { value: '500', label: p.capacity },
    { value: '2', label: p.airlinePartners },
  ];

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

      <div className="bg-gray-50 min-h-screen">
        {/* Stats */}
        <div className="bg-white py-10 border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: '#003087' }}>{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
          {/* About */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{p.aboutUs}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{p.p1}</p>
                <p>{p.p2}</p>
                <p>{p.p3}</p>
                <p>{p.p4}</p>
              </div>
            </div>
          </section>

          {/* History */}
          <section id="history" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{p.history}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                {HISTORY.map((event) => (
                  <div key={event.year} className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: '#003087' }}>
                      {event.year}
                    </div>
                    <div className="flex-1 pt-3.5">
                      <p className="text-gray-700 text-sm">{event[lang] ?? event.ru}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Management */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{p.management}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                    style={{ backgroundColor: '#003087' }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certificates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{p.certs}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <ul className="space-y-3">
                {CERTS.map((cert) => (
                  <li key={cert.ru} className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {cert[lang] ?? cert.ru}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

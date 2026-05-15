'use client';

import { useLanguage } from '@/context/LanguageContext';

const VIP_SERVICES = {
  ru: ['Ускоренное прохождение контроля','Индивидуальная регистрация','Шведский стол и горячие напитки','Безалкогольные напитки и снеки','Высокоскоростной Wi-Fi','Спутниковое TV','Деловая зона с принтером','Душевая кабина','Трансфер до самолёта','Персональный ассистент'],
  kz: ['Жеделдетілген бақылаудан өту','Жеке тіркелу','Буфет және ыстық сусындар','Алкогольсіз сусындар мен тәттілер','Жылдамдығы жоғары Wi-Fi','Жерсерін TV','Принтері бар іскери аймақ','Душ кабинасы','Ұшаққа дейін трансфер','Жеке ассистент'],
  en: ['Expedited security clearance','Individual check-in','Buffet and hot drinks','Soft drinks and snacks','High-speed Wi-Fi','Satellite TV','Business area with printer','Shower cabin','Aircraft transfer','Personal assistant'],
};

const ABOUT_TEXT = {
  ru: ['CIP/VIP зал аэропорта Семей предлагает высший уровень комфорта и приватности для деловых путешественников и пассажиров, желающих провести время ожидания в особых условиях.','Зал расположен на втором этаже терминала и рассчитан на одновременное обслуживание до 20 гостей.'],
  kz: ['Семей әуежайының CIP/VIP залы іскери жолаушылар мен VIP деңгейінде күту уақытын өткізгісі келетін жолаушылар үшін жоғары деңгейдегі комфорт пен жеке кеңістік ұсынады.','Зал терминалдың 2-қабатында орналасқан және бір мезгілде 20 қонаққа дейін қызмет көрсетуге арналған.'],
  en: ['Semey Airport CIP/VIP Lounge offers the highest level of comfort and privacy for business travellers and passengers who wish to spend their waiting time in premium conditions.','The lounge is located on the second floor of the terminal and can accommodate up to 20 guests simultaneously.'],
};

export default function CipVipPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.cipVip;

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{p.about}</h2>
                {(ABOUT_TEXT[lang] ?? ABOUT_TEXT.ru).map((text, i) => (
                  <p key={i} className="text-gray-700 text-sm leading-relaxed mb-2">{text}</p>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-5">{p.services}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(VIP_SERVICES[lang] ?? VIP_SERVICES.ru).map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{p.price}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">1 {lang === 'en' ? 'passenger' : lang === 'kz' ? 'жолаушы' : 'пассажир'}</span>
                    <span className="font-semibold text-gray-900">5 000 тг</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">2–4 {lang === 'en' ? 'passengers' : lang === 'kz' ? 'жолаушы' : 'пассажира'}</span>
                    <span className="font-semibold text-gray-900">4 000 тг/{lang === 'en' ? 'pp' : lang === 'kz' ? 'адам' : 'чел'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{lang === 'en' ? 'Group 5+' : lang === 'kz' ? 'Топ 5+' : 'Группа 5+'}</span>
                    <span className="font-semibold text-gray-900">{lang === 'en' ? 'from 3,000 tg/pp' : lang === 'kz' ? '3 000 тг/адам' : 'от 3 000 тг/чел'}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">{p.priceNote}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{p.hours}</h3>
                <p className="text-sm text-gray-700">
                  {lang === 'en' ? '3 hours before first flight until last flight departs' : lang === 'kz' ? 'Бірінші рейстен 3 сағат бұрынынан соңғы рейске дейін' : 'За 3 часа до первого рейса и до отправления последнего'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {lang === 'en' ? 'Daily' : lang === 'kz' ? 'Күн сайын' : 'Ежедневно'}
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{p.booking}</h3>
                <p className="text-sm text-gray-600 mb-4">{p.bookingDesc}</p>
                <a
                  href="tel:+77222361500"
                  className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl w-full justify-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#001e5c' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {p.call}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

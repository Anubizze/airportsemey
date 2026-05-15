'use client';

import Image from 'next/image';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';
import { useLanguage } from '@/context/LanguageContext';

const AIRLINES_CHECKIN = [
  {
    key: 'flyarystan',
    name: 'FlyArystan',
    code: 'FS',
    url: 'https://www.flyarystan.com',
    logo: flyarystanLogo,
    bg: '#fff7f2',
    border: '#ffd4b8',
  },
  {
    key: 'scat',
    name: 'SCAT Airlines',
    code: 'DV',
    url: 'https://www.scat.kz',
    logo: scatLogo,
    bg: '#f2f6ff',
    border: '#c8d8f8',
  },
];

export default function CheckinPage() {
  const { t } = useLanguage();
  const p = t.pages.checkin;

  const TIPS = [
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: p.tip1Title, text: p.tip1Text },
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: p.tip2Title, text: p.tip2Text },
    { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: p.tip3Title, text: p.tip3Text },
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
            <a href="/schedule" className="hover:text-white transition-colors">{t.nav.schedule}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{t.nav.checkin}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tip.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>

          {/* Airlines */}
          <h2 className="text-xl font-bold text-gray-900 mb-5">{p.onlineCheckin}</h2>
          <div className="space-y-4">
            {AIRLINES_CHECKIN.map((airline) => (
              <div
                key={airline.code}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: airline.border }}
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  <div
                    className="flex items-center justify-center p-6 sm:w-52 flex-shrink-0"
                    style={{ backgroundColor: airline.bg }}
                  >
                    <Image
                      src={airline.logo}
                      alt={airline.name}
                      width={160}
                      height={80}
                      className="object-contain"
                      style={{ width: 160, height: 80 }}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4 p-5">
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-1">{airline.name}</div>
                      <div className="text-sm text-gray-500 leading-relaxed">
                        {airline.key === 'flyarystan' ? t.checkin.flyarystanDesc : t.checkin.scatDesc}
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.checkin.beforeFlight}
                      </div>
                    </div>
                    <a
                      href={airline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl transition-opacity hover:opacity-90 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: '#001e5c' }}
                    >
                      {p.go}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
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

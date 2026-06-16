'use client';

import Image from 'next/image';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';
import hiSkyLogo from '@/public/hisky.png';
import { useLanguage } from '@/context/LanguageContext';

const AIRLINES = [
  {
    key: 'flyarystan',
    name: 'FlyArystan',
    logo: flyarystanLogo,
    url: 'https://flyarystan.com/',
    bg: '#fff7f2',
    border: '#ffd4b8',
  },
  {
    key: 'scat',
    name: 'SCAT Airlines',
    logo: scatLogo,
    url: 'https://www.scat.kz/',
    bg: '#f2f6ff',
    border: '#c8d8f8',
  },
  {
    key: 'hisky',
    name: 'Hi Sky',
    logo: hiSkyLogo,
    url: 'https://hisky.kz/',
    bg: '#e8f2fa',
    border: '#a8cce8',
  },
];

export default function Partners() {
  const { t } = useLanguage();

  return (
    <section className="py-14" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.partners.title}</h2>
          <p className="text-gray-500 text-sm">{t.partners.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {AIRLINES.map((airline) => (
            <a
              key={airline.key}
              href={airline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              style={{ borderColor: airline.border }}
            >
              <div
                className="flex items-center justify-center py-8 px-6 group-hover:brightness-95 transition-all"
                style={{ backgroundColor: airline.bg }}
              >
                <Image
                  src={airline.logo}
                  alt={airline.name}
                  width={180}
                  height={88}
                  className="object-contain"
                  style={{ width: 180, height: 88 }}
                />
              </div>

              <div className="bg-white px-5 py-4 text-center border-t flex items-center justify-center gap-2" style={{ borderColor: airline.border }}>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-800 transition-colors">{airline.name}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {t.partners[`${airline.key}Desc`]}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

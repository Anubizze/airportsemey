'use client';

import Image from 'next/image';
import Link from 'next/link';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';
import hiSkyLogo from '@/public/hisky.png';
import { useLanguage } from '@/context/LanguageContext';

const AIRLINES = [
  {
    key: 'flyarystan',
    name: 'FlyArystan',
    logo: flyarystanLogo,
    url: 'https://www.flyarystan.com',
    bg: '#fff7f2',
    border: '#ffd4b8',
  },
  {
    key: 'scat',
    name: 'SCAT Airlines',
    logo: scatLogo,
    url: 'https://www.scat.kz',
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

export default function CheckinSection() {
  const { t } = useLanguage();

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.checkin.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">{t.checkin.subtitle}</p>
          </div>
          <Link
            href="/schedule/checkin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            {t.checkin.more}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AIRLINES.map((airline) => (
            <div
              key={airline.key}
              className="rounded-2xl border overflow-hidden shadow-sm flex flex-col sm:flex-row"
              style={{ borderColor: airline.border, backgroundColor: '#fff' }}
            >
              {/* Logo */}
              <div
                className="flex items-center justify-center p-6 sm:w-48 flex-shrink-0"
                style={{ backgroundColor: airline.bg }}
              >
                <Image
                  src={airline.logo}
                  alt={airline.name}
                  width={148}
                  height={72}
                  className="object-contain"
                  style={{ width: 148, height: 72 }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-5 flex-1">
                <div>
                  <div className="font-bold text-gray-900 text-base mb-1">{airline.name}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t.checkin[`${airline.key}Desc`]}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.checkin.beforeFlight}
                  </span>
                  <a
                    href={airline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                    style={{ backgroundColor: '#001e5c' }}
                  >
                    {t.checkin.register}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

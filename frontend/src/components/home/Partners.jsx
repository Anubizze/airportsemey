'use client';

import Image from 'next/image';

import { useAirlines } from '@/context/AirlinesContext';
import { airlineText } from '@/lib/airlineCatalog';
import { useLanguage } from '@/context/LanguageContext';

function PartnerLogo({ airline }) {
  const src = airline.logoUrl || airline.logo;
  if (!src) return <span className="text-sm font-bold text-gray-500">{airline.code}</span>;
  if (typeof src === 'string') {
    return <img src={src} alt={airline.name} className="object-contain" style={{ width: 180, height: 88 }} />;
  }
  return (
    <Image
      src={src}
      alt={airline.name}
      width={180}
      height={88}
      className="object-contain"
      style={{ width: 180, height: 88 }}
    />
  );
}

export default function Partners() {
  const { t } = useLanguage();
  const { airlines } = useAirlines();

  return (
    <section className="py-14" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.partners.title}</h2>
          <p className="text-gray-500 text-sm">{t.partners.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {airlines.map((airline) => {
            const description = airlineText(airline, t, 'partners') || t.partners.airlineDesc;
            const card = (
              <>
                <div
                  className="flex items-center justify-center py-8 px-6 group-hover:brightness-95 transition-all bg-white"
                >
                  <PartnerLogo airline={airline} />
                </div>
                <div className="bg-white px-5 py-4 text-center border-t border-gray-100 flex items-center justify-center gap-2">
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                      {airline.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">{description}</div>
                  </div>
                  {airline.websiteUrl ? (
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  ) : null}
                </div>
              </>
            );
            const className =
              'rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white';

            if (!airline.websiteUrl) {
              return (
                <div key={airline.code} className={className}>
                  {card}
                </div>
              );
            }

            return (
              <a
                key={airline.code}
                href={airline.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {card}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

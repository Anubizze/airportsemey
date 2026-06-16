'use client';

import PageHero from '@/components/layout/PageHero';
import SubPageLinks from '@/components/layout/SubPageLinks';
import { useLanguage } from '@/context/LanguageContext';

export default function PartnersPage() {
  const { t } = useLanguage();
  const p = t.pages.partnersPortal;

  const LINKS = [
    { label: t.nav.procurement, href: '/partners/procurement', desc: p.procurementDesc, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: t.nav.tenants, href: '/partners/tenants', desc: p.tenantsDesc, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: t.nav.tariffs, href: '/partners/tariffs', desc: p.tariffsDesc, icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { label: t.nav.fuel, href: '/partners/fuel', desc: p.fuelDesc, icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
    { label: t.nav.documents, href: '/partners/documents', desc: p.documentsDesc, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <>
      <PageHero title={p.title} subtitle={p.subtitle} crumbs={[{ label: p.title }]} />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-10">
            <p className="text-gray-700 leading-relaxed mb-4">{p.intro}</p>
            <p className="text-gray-700 leading-relaxed">{p.intro2}</p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-5">{p.sectionsTitle}</h2>
          <SubPageLinks items={LINKS} />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{p.contactTitle}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{p.contactText}</p>
              <p>
                {p.phoneLabel}{' '}
                <a href="tel:87222360033" className="text-blue-700 hover:text-blue-900 font-medium">8 (7222) 36-00-33</a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:airportsemey@mail.kz" className="text-blue-700 hover:text-blue-900 font-medium">airportsemey@mail.kz</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

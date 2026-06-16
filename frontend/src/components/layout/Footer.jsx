'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/airport_logo.png';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const twoGisUrl =
    'https://2gis.kz/semej/search/%D0%90%D1%8D%D1%80%D0%BE%D0%BF%D0%BE%D1%80%D1%82%20%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9/firm/70000001053099563?m=80.22912%2C50.350191%2F13.95';
  const twoGisStaticMapUrl =
    'https://static.maps.2gis.com/1.0?center=80.22912,50.350191&zoom=13&size=900,480&markers=80.22912,50.350191';

  const FOOTER_LINKS = [
    {
      title: t.nav.about,
      links: [
        { label: t.nav.aboutAirport, href: '/about' },
        { label: t.nav.vacancies, href: '/about/vacancies' },
        { label: t.nav.security, href: '/about/security' },
        { label: t.nav.contacts, href: '/contacts' },
      ],
    },
    {
      title: t.nav.passengers,
      links: [
        { label: t.nav.passengersOverview, href: '/passengers' },
        { label: t.nav.flightSchedule, href: '/schedule' },
        { label: t.nav.checkin, href: '/schedule/checkin' },
        { label: t.nav.services, href: '/passengers/services' },
        { label: t.nav.howToGet, href: '/passengers/how-to-get' },
        { label: t.nav.baggage, href: '/passengers/baggage' },
        { label: t.nav.cipVip, href: '/passengers/cip-vip' },
      ],
    },
    {
      title: t.nav.partners,
      links: [
        { label: t.nav.partnersOverview, href: '/partners' },
        { label: t.nav.procurement, href: '/partners/procurement' },
        { label: t.nav.tenants, href: '/partners/tenants' },
        { label: t.nav.tariffs, href: '/partners/tariffs' },
        { label: t.nav.fuel, href: '/partners/fuel' },
        { label: t.nav.documents, href: '/partners/documents' },
      ],
    },
    {
      title: t.nav.news,
      links: [
        { label: t.nav.news, href: '/news' },
        { label: t.nav.contacts, href: '/contacts' },
      ],
    },
  ];

  return (
    <footer style={{ backgroundColor: '#001a5e' }} className="text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src={logo}
                alt={t.a11y.logoAlt}
                height={44}
                className="w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'telegram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'facebook' && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social === 'instagram' && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    )}
                    {social === 'telegram' && (
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4 text-white">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-200 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <h4 className="text-xl font-semibold text-white mb-3">{t.footer.map2gis}</h4>
              <div className="rounded-xl overflow-hidden border border-white/15 bg-white/5">
                <a href={twoGisUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Image
                    src={twoGisStaticMapUrl}
                    alt={t.footer.mapAlt}
                    width={900}
                    height={480}
                    className="w-full h-72 object-cover"
                    unoptimized
                  />
                </a>
              </div>
              <p className="mt-2 text-sm text-blue-200">{t.footer.siteName}</p>
              <a
                href={twoGisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 text-sm text-blue-200 hover:text-white transition-colors"
              >
                {t.footer.openMap2gis}
              </a>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-3">{t.footer.contactsTitle}</h4>
              <div className="space-y-2 text-sm text-blue-200">
                <p>
                  {t.footer.phone}{' '}
                  <a href="tel:87222360033" className="hover:text-white transition-colors">8 (7222) 36-00-33</a>
                </p>
                <p>
                  {t.footer.ticketOffice}{' '}
                  <a href="tel:87222361215" className="hover:text-white transition-colors">8 (7222) 36-12-15</a>
                </p>
                <p>{t.footer.address} {t.footer.addressValue}</p>
                <p>
                  {t.footer.email}{' '}
                  <a href="mailto:airportsemey@mail.kz" className="hover:text-white transition-colors">airportsemey@mail.kz</a>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-blue-300">
              {t.footer.rights.replace('{year}', year)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

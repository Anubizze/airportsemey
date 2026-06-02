'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/airport_logo.png';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { lang, switchLang, t } = useLanguage();

  const NAV_ITEMS = [
    {
      label: t.nav.about,
      href: '/about',
      children: [
        { label: t.nav.aboutAirport, href: '/about' },
        { label: t.nav.vacancies, href: '/about/vacancies' },
        { label: t.nav.security, href: '/about/security' },
        { label: t.nav.contacts, href: '/contacts' },
      ],
    },
    {
      label: t.nav.passengers,
      href: '/passengers',
      children: [
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
      label: t.nav.schedule,
      href: '/schedule',
      children: [
        { label: t.nav.flightSchedule, href: '/schedule' },
        { label: t.nav.checkin, href: '/schedule/checkin' },
      ],
    },
    {
      label: t.nav.news,
      href: '/news',
    },
    {
      label: t.nav.partners,
      href: '/partners',
      children: [
        { label: t.nav.partnersOverview, href: '/partners' },
        { label: t.nav.procurement, href: '/partners/procurement' },
        { label: t.nav.tenants, href: '/partners/tenants' },
        { label: t.nav.tariffs, href: '/partners/tariffs' },
        { label: t.nav.fuel, href: '/partners/fuel' },
      ],
    },
  ];

  const LANGS = [
    { key: 'kz', label: 'KZ' },
    { key: 'ru', label: 'RU' },
    { key: 'en', label: 'EN' },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar */}
      <div style={{ backgroundColor: '#00164a' }} className="text-white text-sm">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="tel:87222360033" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              8 (7222) 36-00-33
            </a>
            <a href="mailto:airportsemey@mail.kz" className="hover:text-blue-200 transition-colors hidden sm:block">
              airportsemey@mail.kz
            </a>
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-1">
            {LANGS.map((l, i) => (
              <span key={l.key} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/20 text-xs">|</span>}
                <button
                  onClick={() => switchLang(l.key)}
                  className={`text-xs font-medium px-1 py-0.5 rounded transition-colors uppercase ${
                    lang === l.key
                      ? 'text-white font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div style={{ backgroundColor: '#001e5c' }}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={logo}
              alt={t.a11y.logoAlt}
              height={36}
              priority
              className="w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  {item.label}
                  {item.children && (
                    <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && openDropdown === item.href && (
                  <div className={`absolute top-full w-56 z-50 pt-2 ${item.href === '/partners' ? 'right-0' : 'left-0'}`}>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.a11y.menu}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10" style={{ backgroundColor: '#002470' }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10 border-b border-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div style={{ backgroundColor: '#001a5e' }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center px-10 py-2.5 text-sm text-blue-200 hover:text-white hover:bg-white/10 border-b border-white/5 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Mobile lang switcher */}
            <div className="flex items-center gap-4 px-6 py-4 border-t border-white/10">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => switchLang(l.key)}
                  className={`text-sm font-semibold uppercase transition-colors ${
                    lang === l.key ? 'text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

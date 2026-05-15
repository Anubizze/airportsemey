'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PassengersPage() {
  const { t } = useLanguage();
  const p = t.pages.passengers;

  const QUICK_LINKS = [
    { label: p.schedule, href: '/schedule', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: p.checkin, href: '/schedule/checkin', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: p.baggage, href: '/passengers/baggage', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: p.services, href: '/passengers/services', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' },
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

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {QUICK_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Reg info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">{p.regTime}</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span><strong>{p.international}:</strong> {p.intlText}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span><strong>{p.domestic}:</strong> {p.domText}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">{p.phones}</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: p.info, phone: '8 (7222) 36-02-22' },
                  { label: p.reception, phone: '8 (7222) 36-00-33' },
                  { label: p.vip, phone: '8 (7222) 36-15-00' },
                  { label: p.disabled, phone: '8 (7222) 360-222' },
                ].map((item) => (
                  <li key={item.label} className="flex justify-between items-center">
                    <span className="text-gray-500">{item.label}</span>
                    <a href={`tel:${item.phone.replace(/\s|\(|\)|-/g, '')}`} className="font-medium text-blue-700 hover:text-blue-900">{item.phone}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">{p.noTicketOffice}</h3>
                <p className="text-sm text-amber-800">
                  {p.noTicketOfficeText.split('flyarystan.com')[0]}
                  <a href="https://flyarystan.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">flyarystan.com</a>
                  {p.noTicketOfficeText.split('flyarystan.com')[1]?.split('scat.kz')[0]}
                  <a href="https://www.scat.kz" target="_blank" rel="noopener noreferrer" className="underline font-medium">scat.kz</a>
                  {p.noTicketOfficeText.split('scat.kz')[1]}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEPARTURES, ARRIVALS } from '@/data/flights';
import FlightStatusBadge from '@/components/ui/FlightStatusBadge';
import AirlineLogo from '@/components/ui/AirlineLogo';
import { useLanguage } from '@/context/LanguageContext';

function ActualTime({ actual, scheduled }) {
  if (!actual || actual === '00:00') {
    return <span className="text-sm text-gray-400">—</span>;
  }
  const isEarly = actual < scheduled;
  const isLate = actual > scheduled;
  return (
    <span className={`text-sm font-medium ${isLate ? 'text-red-600' : isEarly ? 'text-green-600' : 'text-gray-700'}`}>
      {actual}
    </span>
  );
}

export default function FlightTable() {
  const [tab, setTab] = useState('arrivals');
  const { t } = useLanguage();
  const flights = tab === 'departures' ? DEPARTURES : ARRIVALS;

  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const TABS = [
    { key: 'arrivals', label: t.flights.arrivals, icon: 'M19 14l-7 7m0 0l-7-7m7 7V3' },
    { key: 'departures', label: t.flights.departures, icon: 'M5 10l7-7m0 0l7 7m-7-7v18' },
  ];

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.flights.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">{today}</p>
          </div>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            {t.flights.fullSchedule}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 w-fit">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-all relative ${
                tab === tabItem.key
                  ? 'text-blue-800'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tabItem.icon} />
              </svg>
              {tabItem.label}
              {tab === tabItem.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.airline}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.flight}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    {tab === 'departures' ? t.flights.to : t.flights.from}
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.plan}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.fact}</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.status}</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, idx) => (
                  <tr
                    key={flight.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${
                      idx === flights.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-3">
                      <AirlineLogo code={flight.airlineCode} name={flight.airline} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-700">{flight.flightNumber}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">
                        {tab === 'departures' ? flight.destination : flight.origin}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">{flight.scheduled}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ActualTime actual={flight.actual} scheduled={flight.scheduled} />
                    </td>
                    <td className="px-4 py-4">
                      <FlightStatusBadge status={flight.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {flights.map((flight) => (
              <div key={flight.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <AirlineLogo code={flight.airlineCode} name={flight.airline} />
                    <div className="text-sm font-bold text-gray-800">{flight.flightNumber}</div>
                  </div>
                  <FlightStatusBadge status={flight.status} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">
                      {tab === 'departures' ? t.flights.to : t.flights.from}
                    </div>
                    <div className="font-medium text-gray-800">
                      {tab === 'departures' ? flight.destination : flight.origin}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{t.flights.plan}</div>
                    <div className="font-semibold text-gray-900">{flight.scheduled}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{t.flights.fact}</div>
                    <ActualTime actual={flight.actual} scheduled={flight.scheduled} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

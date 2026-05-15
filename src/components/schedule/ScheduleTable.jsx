'use client';

import { useState, useMemo } from 'react';
import { DEPARTURES, ARRIVALS } from '@/data/flights';
import FlightStatusBadge from '@/components/ui/FlightStatusBadge';
import AirlineLogo from '@/components/ui/AirlineLogo';
import { useLanguage } from '@/context/LanguageContext';

function ActualTime({ actual, scheduled }) {
  if (!actual || actual === '00:00') return <span className="text-sm text-gray-400">—</span>;
  const isLate = actual > scheduled;
  const isEarly = actual < scheduled;
  return (
    <span className={`text-sm font-medium ${isLate ? 'text-red-600' : isEarly ? 'text-green-600' : 'text-gray-700'}`}>
      {actual}
    </span>
  );
}

export default function ScheduleTable() {
  const [tab, setTab] = useState('arrivals');
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  const allFlights = tab === 'arrivals' ? ARRIVALS : DEPARTURES;

  const flights = useMemo(() => {
    if (!search.trim()) return allFlights;
    const q = search.toLowerCase();
    return allFlights.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        (tab === 'departures' ? f.destination : f.origin).toLowerCase().includes(q)
    );
  }, [allFlights, search, tab]);

  const TABS = [
    { key: 'arrivals', label: t.flights.arrivals, icon: 'M19 14l-7 7m0 0l-7-7m7 7V3' },
    { key: 'departures', label: t.flights.departures, icon: 'M5 10l7-7m0 0l7 7m-7-7v18' },
  ];

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 w-fit">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-all relative ${
                tab === tabItem.key ? 'text-blue-800' : 'text-gray-400 hover:text-gray-700'
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

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`${t.flights.flight}, ${tab === 'departures' ? t.flights.to : t.flights.from}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {flights.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">—</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.airline}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.flight}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      {tab === 'departures' ? t.flights.to : t.flights.from}
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.plan}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.fact}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">T</th>
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
                        <span className="font-mono text-sm font-semibold text-blue-900">{flight.flightNumber}</span>
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
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                          {flight.terminal}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <FlightStatusBadge status={flight.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-100">
              {flights.map((flight) => (
                <div key={flight.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <AirlineLogo code={flight.airlineCode} name={flight.airline} />
                      <div>
                        <div className="font-mono text-sm font-bold text-blue-900">{flight.flightNumber}</div>
                        <div className="text-xs text-gray-500">{flight.airline}</div>
                      </div>
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
          </>
        )}
      </div>
    </div>
  );
}

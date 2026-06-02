'use client';

import { useMemo, useState } from 'react';
import FlightStatusBadge from '@/components/ui/FlightStatusBadge';
import LiveStatusBadge from '@/components/ui/LiveStatusBadge';
import AirlineLogo from '@/components/ui/AirlineLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveFlights } from '@/hooks/useLiveFlights';
import { getLocale, translateCity } from '@/lib/locale';

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

function formatDisplayDate(value, lang) {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(getLocale(lang), { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function parseTimeToMinutes(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value ?? '').trim());
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]) * 60 + Number(match[2]);
}

function filterByPeriod(list, periodFrom, periodTo) {
  if (!periodFrom && !periodTo) return list;

  const from = periodFrom || periodTo;
  const to = periodTo || periodFrom;

  return list.filter((flight) => {
    if (!flight.date) return false;
    return flight.date >= from && flight.date <= to;
  });
}

export default function ScheduleTable({ periodFrom = '', periodTo = '' }) {
  const [tab, setTab] = useState('arrivals');
  const [search, setSearch] = useState('');
  const { flightsData, liveStatus, apiOnline } = useLiveFlights();
  const { t, lang } = useLanguage();
  const p = t.pages.schedule;

  const allFlights = useMemo(() => {
    const list = tab === 'departures' ? flightsData.departures : flightsData.arrivals;
    return filterByPeriod(list, periodFrom, periodTo).sort((a, b) => {
      const byDate = (a.date ?? '').localeCompare(b.date ?? '');
      if (byDate !== 0) return byDate;
      return parseTimeToMinutes(a.scheduled) - parseTimeToMinutes(b.scheduled);
    });
  }, [flightsData, tab, periodFrom, periodTo]);

  const periodLabel = useMemo(() => {
    if (!periodFrom && !periodTo) return p.allDates;
    if (periodFrom && periodTo && periodFrom !== periodTo) {
      return `${formatDisplayDate(periodFrom, lang)} — ${formatDisplayDate(periodTo, lang)}`;
    }
    const single = periodFrom || periodTo;
    return formatDisplayDate(single, lang);
  }, [periodFrom, periodTo, lang, p.allDates]);

  const flights = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allFlights;

    return allFlights.filter((f) => {
      const city = tab === 'departures' ? f.destination : f.origin;
      const cityLabel = translateCity(city, t.cities).toLowerCase();
      return (
        f.flightNumber.toLowerCase().includes(q)
        || f.airline.toLowerCase().includes(q)
        || String(city ?? '').toLowerCase().includes(q)
        || cityLabel.includes(q)
      );
    });
  }, [allFlights, search, tab, t.cities]);

  const TABS = [
    { key: 'arrivals', label: t.flights.arrivals, icon: 'M19 14l-7 7m0 0l-7-7m7 7V3' },
    { key: 'departures', label: t.flights.departures, icon: 'M5 10l7-7m0 0l7 7m-7-7v18' },
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{p.liveTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{p.liveHint}</p>
          <p className="text-xs text-gray-400 mt-1">{p.periodShown}: {periodLabel}</p>
        </div>
        <LiveStatusBadge liveStatus={liveStatus} apiOnline={apiOnline} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex border-b border-gray-200 w-fit">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              type="button"
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

        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor" viewBox="0 0 24 24"
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

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {flights.length === 0 ? (
          <div className="py-16 text-center px-4">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">{t.flights.noResults}</p>
            {apiOnline ? (
              <p className="text-sm text-gray-400 mt-2">{p.emptyPeriodHint}</p>
            ) : (
              <p className="text-sm text-red-600 mt-2">{p.offlineHint}</p>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.airline}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.flight}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      {tab === 'departures' ? t.flights.to : t.flights.from}
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.date}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.plan}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.fact}</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">{t.flights.terminal}</th>
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
                          {translateCity(
                            tab === 'departures' ? flight.destination : flight.origin,
                            t.cities,
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{formatDisplayDate(flight.date, lang)}</span>
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

            <div className="md:hidden divide-y divide-gray-100">
              {flights.map((flight) => (
                <div key={flight.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <AirlineLogo code={flight.airlineCode} name={flight.airline} />
                      <div>
                        <div className="font-mono text-sm font-bold text-blue-900">{flight.flightNumber}</div>
                        <div className="text-xs text-gray-500">{formatDisplayDate(flight.date, lang)}</div>
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
                        {translateCity(
                          tab === 'departures' ? flight.destination : flight.origin,
                          t.cities,
                        )}
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

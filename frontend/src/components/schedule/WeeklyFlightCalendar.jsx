'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

import { DEFAULT_SCHEDULE_ENTRIES, WEEK_DAYS, groupScheduleByDay } from '@/data/schedule';
import { fetchSchedule } from '@/lib/scheduleApi';
import { getLocale, translateCity } from '@/lib/locale';

export const WEEK_SCHEDULE = groupScheduleByDay(DEFAULT_SCHEDULE_ENTRIES);

function FlightsBlock({ title, rows, cityColLabel, timeFromLabel, timeToLabel, emptyLabel, periodLabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className="p-5 text-sm text-gray-400">{emptyLabel}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-2.5">{timeFromLabel}</th>
                <th className="px-4 py-2.5">{timeToLabel}</th>
                <th className="px-4 py-2.5">{cityColLabel}</th>
                <th className="px-4 py-2.5">№</th>
                <th className="px-4 py-2.5">{periodLabel}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => (
                <tr key={`${item.flightNumber}-${idx}`} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-gray-900">{item.timeFrom}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.timeTo}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.city}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-blue-900">{item.flightNumber}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">{item.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function WeeklyFlightCalendar({ periodFrom = '', periodTo = '' }) {
  const { t, lang } = useLanguage();
  const labels = t.calendar;
  const [entries, setEntries] = useState(DEFAULT_SCHEDULE_ENTRIES);
  const [activeDay, setActiveDay] = useState('mon');
  const week = useMemo(() => groupScheduleByDay(entries, periodFrom, periodTo), [entries, periodFrom, periodTo]);
  const dayKeys = WEEK_DAYS;
  const dayData = week[activeDay];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const board = await fetchSchedule();
        if (!cancelled) setEntries(board.entries);
      } catch {
        // Keep the latest timetable when the API is temporarily unavailable.
      }
    };
    void load();
    const timer = window.setInterval(load, 30000);
    window.addEventListener('focus', load);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', load);
    };
  }, []);

  const dateLabel = (value) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(getLocale(lang))
    : '…';
  const mapRow = (item) => ({
    flightNumber: item.flightNumber,
    city: translateCity(item.city, t.cities),
    timeFrom: item.direction === 'departure' ? item.time : item.counterpartTime || '—',
    timeTo: item.direction === 'arrival' ? item.time : item.counterpartTime || '—',
    period: item.validFrom || item.validTo ? `${dateLabel(item.validFrom)} – ${dateLabel(item.validTo)}` : '—',
  });
  const departures = dayData.departures.map(mapRow);
  const arrivals = dayData.arrivals.map(mapRow);

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{labels.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{labels.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {dayKeys.map((key) => {
          const isActive = activeDay === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDay(key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-800'
              }`}
            >
              {labels.days[key]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FlightsBlock
          title={labels.departures}
          rows={departures}
          cityColLabel={labels.city}
          timeFromLabel={labels.depTime}
          timeToLabel={labels.arrTime}
          emptyLabel={labels.empty}
          periodLabel={labels.period}
        />
        <FlightsBlock
          title={labels.arrivals}
          rows={arrivals}
          cityColLabel={labels.city}
          timeFromLabel={labels.depTime}
          timeToLabel={labels.arrTime}
          emptyLabel={labels.empty}
          periodLabel={labels.period}
        />
      </div>
    </section>
  );
}

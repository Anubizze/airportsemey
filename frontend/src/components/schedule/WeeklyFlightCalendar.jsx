'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const WEEK_SCHEDULE = {
  mon: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:05', timeToDest: '08:30' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
      { flightNumber: 'KC7154', city: 'Almaty', timeFromSemey: '20:55', timeToDest: '22:25' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:05', timeToSemey: '06:35' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
      { flightNumber: 'KC7153', city: 'Almaty', timeFromOrigin: '18:50', timeToSemey: '20:25' },
    ],
  },
  tue: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:05', timeToDest: '08:30' },
      { flightNumber: 'IH3107', city: 'Urzhar', timeFromSemey: '11:10', timeToDest: '12:20' },
      { flightNumber: 'DV754', city: 'Karagandy', timeFromSemey: '12:00', timeToDest: '13:00' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'IH3108', city: 'Urzhar', timeFromOrigin: '13:00', timeToSemey: '14:10' },
      { flightNumber: 'DV753', city: 'Karagandy', timeFromOrigin: '10:00', timeToSemey: '11:00' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
    ],
  },
  wed: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:50', timeToDest: '09:25' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
    ],
  },
  thu: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:05', timeToDest: '08:30' },
      { flightNumber: 'IH3107', city: 'Urzhar', timeFromSemey: '11:30', timeToDest: '12:50' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
      { flightNumber: 'KC7154', city: 'Almaty', timeFromSemey: '18:15', timeToDest: '20:05' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'IH3108', city: 'Urzhar', timeFromOrigin: '13:30', timeToSemey: '14:40' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
      { flightNumber: 'KC7153', city: 'Almaty', timeFromOrigin: '15:55', timeToSemey: '17:40' },
    ],
  },
  fri: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:50', timeToDest: '09:25' },
      { flightNumber: 'DV754', city: 'Karagandy', timeFromSemey: '12:00', timeToDest: '13:00' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
      { flightNumber: 'KC7154', city: 'Almaty', timeFromSemey: '17:50', timeToDest: '19:30' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'DV753', city: 'Karagandy', timeFromOrigin: '10:00', timeToSemey: '11:00' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
      { flightNumber: 'KC7153', city: 'Almaty', timeFromOrigin: '15:50', timeToSemey: '17:20' },
    ],
  },
  sat: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:05', timeToDest: '08:30' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
    ],
  },
  sun: {
    departures: [
      { flightNumber: 'KC7352', city: 'Astana', timeFromSemey: '07:50', timeToDest: '09:25' },
      { flightNumber: 'KC7152', city: 'Almaty', timeFromSemey: '13:25', timeToDest: '15:05' },
    ],
    arrivals: [
      { flightNumber: 'KC7351', city: 'Astana', timeFromOrigin: '05:10', timeToSemey: '06:35' },
      { flightNumber: 'KC7151', city: 'Almaty', timeFromOrigin: '11:20', timeToSemey: '12:55' },
    ],
  },
};

function FlightsBlock({ title, rows, cityColLabel, timeFromLabel, timeToLabel, emptyLabel }) {
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
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => (
                <tr key={`${item.flightNumber}-${idx}`} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-gray-900">{item.timeFrom}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.timeTo}</td>
                  <td className="px-4 py-2.5 text-gray-700">{item.city}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-blue-900">{item.flightNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function WeeklyFlightCalendar() {
  const { t } = useLanguage();
  const labels = t.calendar;

  const dayKeys = useMemo(() => Object.keys(WEEK_SCHEDULE), []);
  const [activeDay, setActiveDay] = useState('mon');

  const dayData = WEEK_SCHEDULE[activeDay] ?? WEEK_SCHEDULE.mon;

  const departures = dayData.departures.map((item) => ({
    flightNumber: item.flightNumber,
    city: t.cities[item.city] ?? item.city,
    timeFrom: item.timeFromSemey,
    timeTo: item.timeToDest,
  }));

  const arrivals = dayData.arrivals.map((item) => ({
    flightNumber: item.flightNumber,
    city: t.cities[item.city] ?? item.city,
    timeFrom: item.timeFromOrigin,
    timeTo: item.timeToSemey,
  }));

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
        />
        <FlightsBlock
          title={labels.arrivals}
          rows={arrivals}
          cityColLabel={labels.city}
          timeFromLabel={labels.depTime}
          timeToLabel={labels.arrTime}
          emptyLabel={labels.empty}
        />
      </div>
    </section>
  );
}

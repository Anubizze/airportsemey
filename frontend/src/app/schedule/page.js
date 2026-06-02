'use client';

import { useState } from 'react';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import WeeklyFlightCalendar from '@/components/schedule/WeeklyFlightCalendar';
import { useLanguage } from '@/context/LanguageContext';
import { getLocale } from '@/lib/locale';

export default function SchedulePage() {
  const { t, lang } = useLanguage();
  const p = t.pages.schedule;
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');

  const today = new Date().toLocaleDateString(getLocale(lang), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

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
          <p className="text-blue-200 mt-2 capitalize">{today}</p>
          <div className="mt-5 rounded-2xl bg-white/10 border border-white/20 p-4">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <label className="text-sm flex-1">
                <span className="block text-blue-100 mb-1">{p.periodFrom}</span>
                <input
                  type="date"
                  value={periodFrom}
                  onChange={(e) => setPeriodFrom(e.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/95 text-gray-900 px-3 py-2"
                />
              </label>
              <label className="text-sm flex-1">
                <span className="block text-blue-100 mb-1">{p.periodTo}</span>
                <input
                  type="date"
                  value={periodTo}
                  onChange={(e) => setPeriodTo(e.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white/95 text-gray-900 px-3 py-2"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setPeriodFrom('');
                  setPeriodTo('');
                }}
                className="rounded-xl border border-white/40 text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                {p.reset}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-8">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">{p.banner}</p>
          </div>
          <ScheduleTable periodFrom={periodFrom} periodTo={periodTo} />

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{p.regularTitle}</h2>
            <p className="text-sm text-gray-500 mb-6">{p.regularHint}</p>
            <WeeklyFlightCalendar />
          </div>
        </div>
      </div>
    </>
  );
}

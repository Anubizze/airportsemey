'use client';

import ScheduleTable from '@/components/schedule/ScheduleTable';
import { useLanguage } from '@/context/LanguageContext';

export default function SchedulePage() {
  const { t } = useLanguage();
  const p = t.pages.schedule;

  const today = new Date().toLocaleDateString('ru-RU', {
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
          <ScheduleTable />
        </div>
      </div>
    </>
  );
}

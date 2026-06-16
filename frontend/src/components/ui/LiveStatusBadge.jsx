'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LiveStatusBadge({ liveStatus, apiOnline }) {
  const { t } = useLanguage();

  const isLive = liveStatus === 'connected' && apiOnline;
  const isConnecting = liveStatus === 'connecting' || (apiOnline && liveStatus !== 'connected');

  let label = t.flights.liveOffline;
  let dotClass = 'bg-red-500';
  let textClass = 'text-red-700';
  let bgClass = 'bg-red-50 border-red-200';

  if (isLive) {
    label = t.flights.liveOnline;
    dotClass = 'bg-green-500 animate-pulse';
    textClass = 'text-green-700';
    bgClass = 'bg-green-50 border-green-200';
  } else if (isConnecting) {
    label = t.flights.liveConnecting;
    dotClass = 'bg-amber-400 animate-pulse';
    textClass = 'text-amber-700';
    bgClass = 'bg-amber-50 border-amber-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${bgClass} ${textClass}`}
      title={t.flights.liveHint}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
      {label}
    </span>
  );
}

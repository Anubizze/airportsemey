'use client';

import { STATUS_STYLES } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function FlightStatusBadge({ status }) {
  const { t } = useLanguage();
  const label = t.status[status] ?? status;
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

'use client';

import Image from 'next/image';

import { useAirlines } from '@/context/AirlinesContext';

function LogoImage({ src, alt }) {
  if (!src) return null;
  if (typeof src === 'string') {
    return <img src={src} alt={alt} className="object-contain w-full h-full" />;
  }
  return (
    <Image src={src} alt={alt} width={132} height={60} className="object-contain w-full h-full" />
  );
}

export default function AirlineLogo({ code, name }) {
  const { findAirline } = useAirlines();
  const airline = findAirline(code);
  const src = airline?.logoUrl || airline?.logo || null;
  const title = airline?.name || name || code;

  if (src) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm"
        style={{
          width: 160,
          height: 80,
          border: '1.5px solid #e8edf5',
          padding: '10px 14px',
        }}
        title={title}
      >
        <LogoImage src={src} alt={title} />
      </div>
    );
  }

  const label = String(title || code || '—')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join('\n');

  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{
        width: 160,
        height: 80,
        backgroundColor: '#e10600',
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 1.3,
        whiteSpace: 'pre-line',
        letterSpacing: '0.01em',
      }}
      title={title}
    >
      {label}
    </div>
  );
}

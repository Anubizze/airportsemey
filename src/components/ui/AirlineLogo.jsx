import Image from 'next/image';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';

const AIRLINE_LOGOS = {
  FS: flyarystanLogo,
  DV: scatLogo,
  IH: scatLogo,
  KC: flyarystanLogo,
};

const AIRLINE_INITIALS = {
  KC: { bg: '#003087', text: '#ffffff', label: 'Air\nAstana' },
  IQ: { bg: '#005baa', text: '#ffffff', label: 'QAZAQ\nAir' },
};

export default function AirlineLogo({ code, name, size = 'md' }) {
  const normalizedCode = String(code ?? '')
    .trim()
    .toUpperCase();
  const fallbackFromName = String(name ?? '')
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const effectiveCode = normalizedCode || fallbackFromName || 'UN';
  const img = AIRLINE_LOGOS[effectiveCode];

  if (img) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm"
        style={{
          width: 160,
          height: 80,
          border: '1.5px solid #e8edf5',
          padding: '10px 14px',
        }}
        title={name}
      >
        <Image
          src={img}
          alt={name}
          width={132}
          height={60}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  const initials = AIRLINE_INITIALS[effectiveCode] ?? {
    bg: '#64748b',
    text: '#fff',
    label: effectiveCode.slice(0, 2),
  };

  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{
        width: 160,
        height: 80,
        backgroundColor: initials.bg,
        color: initials.text,
        fontSize: 13,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 1.3,
        whiteSpace: 'pre-line',
        letterSpacing: '0.01em',
      }}
      title={name}
    >
      {initials.label}
    </div>
  );
}

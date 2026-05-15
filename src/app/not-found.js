import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: '#003087' }}
      >
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-3">404</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">Страница не найдена</p>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        Запрашиваемая страница не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#003087' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        На главную
      </Link>
    </div>
  );
}

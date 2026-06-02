'use client';

import Link from 'next/link';

export default function SubPageLinks({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h3>
          {item.desc && <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>}
        </Link>
      ))}
    </div>
  );
}

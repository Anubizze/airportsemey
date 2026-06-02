'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { pickLocalized } from '@/lib/locale';
import ServicePhotoCarousel from '@/components/passengers/ServicePhotoCarousel';

function formatPhoneDisplay(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `8 (${digits.slice(1, 5)}) ${digits.slice(5, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return phone;
}

export default function ServiceDetailModal({ service, onClose }) {
  const { lang, t } = useLanguage();
  const p = t.pages.services;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!service) return null;

  const title = pickLocalized(service.title, lang);
  const floor = pickLocalized(service.floor, lang);
  const details = pickLocalized(service.details, lang);
  const images = service.images ?? [];
  const hasPhotos = images.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
            </svg>
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h2 id="service-modal-title" className="text-lg font-bold text-gray-900 leading-snug">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {p.location}: <span className="font-medium text-gray-700">{floor}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={p.close}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6 space-y-6">
          {/* Gallery */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
              {p.gallery}
            </h3>
            {hasPhotos ? (
              <ServicePhotoCarousel
                images={images}
                lang={lang}
                fallbackTitle={title}
                labels={{
                  prevPhoto: p.prevPhoto,
                  nextPhoto: p.nextPhoto,
                  photo: p.photo,
                  swipeHint: p.swipeHint,
                }}
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">{p.photosComingSoon}</p>
              </div>
            )}
          </section>

          {/* Description */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {p.about}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{details}</p>
          </section>

          {/* Contacts & links */}
          {(service.phone || service.links?.length || service.href) && (
            <section className="flex flex-wrap gap-3 pt-1">
              {service.phone && (
                <a
                  href={`tel:${service.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {formatPhoneDisplay(service.phone)}
                </a>
              )}
              {service.href && (
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
                  onClick={onClose}
                >
                  {p.learnMore}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              {service.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

export default function DocumentPreviewModal({ open, title, url, onClose, labels }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !url) return null;

  const isPdf = /\.pdf($|\?)/i.test(url);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={labels.close}
      />

      <div className="relative z-10 flex flex-col w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="flex items-start gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{labels.previewTitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {labels.download}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={labels.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-gray-100">
          {isPdf ? (
            <iframe
              src={`${url}#toolbar=1&navpanes=0`}
              title={title}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 max-w-md mb-4">{labels.previewUnavailable}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                {labels.openExternal}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

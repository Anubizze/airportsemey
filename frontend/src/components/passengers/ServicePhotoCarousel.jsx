'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { pickLocalized } from '@/lib/locale';

function isUploadSrc(src) {
  const value = String(src ?? '');
  return value.includes('localhost') || value.includes('/uploads/');
}

export default function ServicePhotoCarousel({ images, lang, fallbackTitle, labels }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index) => {
    const container = scrollRef.current;
    if (!container || !images.length) return;
    const next = Math.max(0, Math.min(index, images.length - 1));
    const slide = container.children[next];
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setActiveIndex(next);
  }, [images.length]);

  useEffect(() => {
    setActiveIndex(0);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [images]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || images.length <= 1) return undefined;

    const onScroll = () => {
      const width = container.clientWidth || 1;
      const index = Math.round(container.scrollLeft / width);
      setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.id ?? image.src ?? index}
              className="relative min-w-full snap-start aspect-[4/3] flex-shrink-0"
            >
              <Image
                src={image.src}
                alt={pickLocalized(image.alt, lang) || fallbackTitle}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 672px"
                unoptimized={isUploadSrc(image.src)}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-md hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
              aria-label={labels.prevPhoto}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-md hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
              aria-label={labels.nextPhoto}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((image, index) => (
            <button
              key={`thumb-${image.id ?? image.src ?? index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex ? 'border-blue-700' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`${labels.photo} ${index + 1}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={isUploadSrc(image.src)}
              />
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center sm:hidden">{labels.swipeHint}</p>
    </div>
  );
}

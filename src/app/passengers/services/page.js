'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { pickLocalized } from '@/lib/locale';
import { AIRPORT_SERVICES } from '@/data/services';
import {
  fetchServicePhotosGrouped,
  mapApiPhotoToImage,
  mergeServicePhotos,
} from '@/lib/servicesApi';
import ServiceDetailModal from '@/components/passengers/ServiceDetailModal';

export default function ServicesPage() {
  const { lang, t } = useLanguage();
  const p = t.pages.services;
  const [selectedService, setSelectedService] = useState(null);
  const [photosByService, setPhotosByService] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchServicePhotosGrouped();
        if (!cancelled) setPhotosByService(data ?? {});
      } catch {
        if (!cancelled) setPhotosByService({});
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openService = (service) => {
    setSelectedService(mergeServicePhotos(service, photosByService[service.id] ?? []));
  };

  const getPhotoCountLabel = (count) =>
    p.photosCount.replace('{count}', String(count));

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/passengers" className="hover:text-white transition-colors">{t.nav.passengers}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{p.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AIRPORT_SERVICES.map((service) => {
              const apiPhotos = photosByService[service.id] ?? [];
              const preview = apiPhotos[0] ? mapApiPhotoToImage(apiPhotos[0]) : null;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openService(service)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 transition-all text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {preview && (
                    <div className="relative h-36 bg-gray-100">
                      <Image
                        src={preview.src}
                        alt={pickLocalized(service.title, lang)}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={String(preview.src).includes('/uploads/') || String(preview.src).includes('localhost')}
                      />
                      {apiPhotos.length > 1 && (
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                          {getPhotoCountLabel(apiPhotos.length)}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                            {pickLocalized(service.title, lang)}
                          </h3>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                            {pickLocalized(service.floor, lang)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                          {pickLocalized(service.desc, lang)}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-700 group-hover:gap-2 transition-all">
                          {p.openDetails}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

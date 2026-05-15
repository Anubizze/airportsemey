'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import hero1 from '@/public/airoporthero1.webp';
import hero2 from '@/public/airporthero2.webp';
import hero3 from '@/public/airoporthero3.webp';
import hero4 from '@/public/airporthero4.webp';
import { useLanguage } from '@/context/LanguageContext';

const SLIDES = [hero1, hero2, hero3, hero4];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '580px' }}>
      {/* Slideshow background */}
      {SLIDES.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={idx === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,20,60,0.88) 0%, rgba(0,30,80,0.72) 50%, rgba(0,20,60,0.30) 100%)',
        }}
      />


      {/* Content */}
      <div
        className="relative container mx-auto px-4 lg:px-8 flex flex-col items-start justify-center"
        style={{ minHeight: '580px', paddingTop: '40px', paddingBottom: '40px' }}
      >
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 backdrop-blur-sm border border-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {t.topbar.working}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mb-4 drop-shadow-lg">
          {t.hero.welcome}
          <span className="block" style={{ color: '#f0c040' }}>
            {t.hero.name}
          </span>
        </h1>

        <p className="text-base md:text-lg max-w-lg mb-8 leading-relaxed drop-shadow"
          style={{ color: 'rgba(220,232,255,0.9)' }}>
          {t.hero.subtitle}{' '}
          <span className="font-semibold text-white">IATA: HSM</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#c8a030' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t.hero.scheduleBtn}
          </Link>
          <Link
            href="/schedule/checkin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/20"
            style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.hero.checkinBtn}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-6">
          {[
            { value: '7', label: t.hero.flightsPerDay },
            { value: '2', label: t.hero.airlines },
            { value: '500', label: t.hero.passPerHour },
            { value: '24/7', label: t.hero.workHours },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-8 bg-white/20" />}
              <div>
                <div className="text-2xl font-bold text-white drop-shadow">{stat.value}</div>
                <div className="text-xs" style={{ color: 'rgba(180,200,255,0.85)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-4 lg:left-8 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="rounded-full transition-all"
              style={{
                width: idx === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: idx === current ? '#f0c040' : 'rgba(255,255,255,0.4)',
              }}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

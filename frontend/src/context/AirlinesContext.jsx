'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { findAirline, mergeAirlines } from '@/lib/airlineCatalog';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api';

const AirlinesContext = createContext(null);

export function AirlinesProvider({ children }) {
  const [airlines, setAirlines] = useState(() => mergeAirlines([]));

  const reloadAirlines = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/airlines`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      setAirlines(mergeAirlines(Array.isArray(data) ? data : []));
    } catch {
      setAirlines(mergeAirlines([]));
    }
  }, []);

  useEffect(() => {
    void reloadAirlines();
  }, [reloadAirlines]);

  const value = useMemo(
    () => ({
      airlines,
      reloadAirlines,
      findAirline: (code) => findAirline(airlines, code),
    }),
    [airlines, reloadAirlines],
  );

  return <AirlinesContext.Provider value={value}>{children}</AirlinesContext.Provider>;
}

export function useAirlines() {
  const context = useContext(AirlinesContext);
  if (!context) {
    throw new Error('useAirlines must be used inside AirlinesProvider');
  }
  return context;
}

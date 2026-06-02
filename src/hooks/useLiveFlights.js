'use client';

import { useEffect, useState } from 'react';
import {
  applyFlightEvent,
  checkApiHealth,
  fetchFlights,
  subscribeFlights,
} from '@/lib/flightsApi';

const POLL_MS = 30000;
const HEALTH_MS = 10000;

export function useLiveFlights() {
  const [flightsData, setFlightsData] = useState({ arrivals: [], departures: [] });
  const [liveStatus, setLiveStatus] = useState('connecting');
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const loadFlights = async () => {
      try {
        const data = await fetchFlights();
        if (!cancelled) {
          setFlightsData(data);
          setApiOnline(true);
        }
      } catch {
        if (!cancelled) setApiOnline(false);
      }
    };

    const checkHealth = async () => {
      const ok = await checkApiHealth();
      if (!cancelled) setApiOnline(ok);
    };

    void loadFlights();
    void checkHealth();

    if (typeof window !== 'undefined') {
      unsubscribe = subscribeFlights(
        (event) => {
          if (!cancelled) {
            setFlightsData((prev) => applyFlightEvent(prev, event));
          }
        },
        {
          onStatusChange: (status) => {
            if (!cancelled) setLiveStatus(status);
          },
        },
      );
    }

    const poll = window.setInterval(loadFlights, POLL_MS);
    const healthPoll = window.setInterval(checkHealth, HEALTH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearInterval(healthPoll);
      unsubscribe();
    };
  }, []);

  return { flightsData, liveStatus, apiOnline };
}

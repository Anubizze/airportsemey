import { ARRIVALS, DEPARTURES } from '@/data/flights';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

function toLocalDateString(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatTime(value) {
  if (!value) return '00:00';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '00:00';
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function normalizeCityName(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  const dictionary = {
    astana: 'Астана',
    'nur-sultan': 'Астана',
    almaty: 'Алматы',
    karagandy: 'Караганда',
    karaganda: 'Караганда',
    urzhar: 'Урджар',
  };
  return dictionary[raw] ?? value;
}

function parseTimeToMinutes(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value ?? '').trim());
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]) * 60 + Number(match[2]);
}

function hasActualTime(value) {
  return Boolean(value && value !== '00:00');
}

function pickPreferredFlight(current, incoming) {
  const currentUpdated = current._updatedAtMs ?? 0;
  const incomingUpdated = incoming._updatedAtMs ?? 0;
  if (incomingUpdated !== currentUpdated) {
    return incomingUpdated > currentUpdated ? incoming : current;
  }

  const currentHasActual = hasActualTime(current.actual);
  const incomingHasActual = hasActualTime(incoming.actual);
  if (currentHasActual !== incomingHasActual) {
    return incomingHasActual ? incoming : current;
  }

  return current;
}

function sanitizeFlightList(list) {
  const byFlightNumber = new Map();

  for (const item of list) {
    const key = String(item.flightNumber ?? '').trim().toUpperCase();
    const normalized = {
      ...item,
      destination: item.destination ? normalizeCityName(item.destination) : item.destination,
      origin: item.origin ? normalizeCityName(item.origin) : item.origin,
    };
    const existing = byFlightNumber.get(key);
    byFlightNumber.set(key, existing ? pickPreferredFlight(existing, normalized) : normalized);
  }

  return [...byFlightNumber.values()]
    .map((item) => {
      const { _updatedAtMs, ...rest } = item;
      return rest;
    })
    .sort((a, b) => parseTimeToMinutes(a.scheduled) - parseTimeToMinutes(b.scheduled));
}

function mapFlight(dto) {
  const updatedAtMs = dto.updatedAt ? new Date(dto.updatedAt).getTime() : NaN;
  const createdAtMs = dto.createdAt ? new Date(dto.createdAt).getTime() : NaN;
  const scheduledAtMs = dto.scheduledTime ? new Date(dto.scheduledTime).getTime() : NaN;
  const base = {
    id: dto.id,
    airline: dto.airlineName,
    airlineCode: dto.airlineCode,
    flightNumber: dto.flightNumber,
    scheduled: formatTime(dto.scheduledTime),
    actual: formatTime(dto.estimatedTime),
    terminal: dto.terminal ?? '1',
    status: dto.status ?? 'scheduled',
    date: toLocalDateString(dto.scheduledTime),
    _updatedAtMs: Number.isFinite(updatedAtMs)
      ? updatedAtMs
      : Number.isFinite(createdAtMs)
        ? createdAtMs
        : Number.isFinite(scheduledAtMs)
          ? scheduledAtMs
          : 0,
  };

  if (dto.direction === 'departure') {
    return {
      ...base,
      destination: dto.city,
      destinationCode: dto.cityCode,
    };
  }

  return {
    ...base,
    origin: dto.city,
    originCode: dto.cityCode,
  };
}

export async function fetchFlights() {
  const response = await fetch(`${API_BASE}/flights`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch flights (${response.status})`);
  }

  const data = await response.json();
  const arrivals = [];
  const departures = [];

  for (const item of data) {
    const flight = mapFlight(item);
    if (item.direction === 'departure') departures.push(flight);
    else arrivals.push(flight);
  }

  return {
    arrivals: sanitizeFlightList(arrivals),
    departures: sanitizeFlightList(departures),
  };
}

export function getFallbackFlights() {
  return {
    arrivals: sanitizeFlightList(ARRIVALS),
    departures: sanitizeFlightList(DEPARTURES),
  };
}

function upsertFlight(list, item) {
  const index = list.findIndex((flight) => flight.id === item.id);
  if (index === -1) return [item, ...list];
  const next = [...list];
  next[index] = item;
  return next;
}

export function applyFlightEvent(currentState, event) {
  if (!event?.type || event.type === 'ping') return currentState;

  if (event.type === 'deleted') {
    const deletedId = event?.payload?.id;
    if (!deletedId) return currentState;
    return {
      arrivals: currentState.arrivals.filter((flight) => flight.id !== deletedId),
      departures: currentState.departures.filter((flight) => flight.id !== deletedId),
    };
  }

  if (!event?.payload) return currentState;
  const mapped = mapFlight(event.payload);
  const isDeparture = event.payload.direction === 'departure';

  return {
    arrivals: isDeparture
      ? sanitizeFlightList(currentState.arrivals.filter((flight) => flight.id !== mapped.id))
      : sanitizeFlightList(upsertFlight(currentState.arrivals, mapped)),
    departures: isDeparture
      ? sanitizeFlightList(upsertFlight(currentState.departures, mapped))
      : sanitizeFlightList(currentState.departures.filter((flight) => flight.id !== mapped.id)),
  };
}

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

export function subscribeFlights(onEvent, options = {}) {
  const { onStatusChange, onError } = options;
  let source = null;
  let reconnectTimer = null;
  let retryDelay = 1000;
  let closed = false;

  const setStatus = (status) => {
    onStatusChange?.(status);
  };

  const connect = () => {
    if (closed || typeof window === 'undefined') return;

    setStatus('connecting');
    source = new EventSource(`${API_BASE}/flights/stream`);

    source.onopen = () => {
      retryDelay = 1000;
      setStatus('connected');
    };

    source.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        if (parsed?.type === 'ping') {
          setStatus('connected');
          return;
        }
        onEvent?.(parsed);
      } catch {
        // ignore malformed events
      }
    };

    source.onerror = (error) => {
      setStatus('disconnected');
      onError?.(error);
      source?.close();
      source = null;

      if (!closed) {
        reconnectTimer = window.setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, 30000);
          connect();
        }, retryDelay);
      }
    };
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    source?.close();
    source = null;
  };
}

import { DEFAULT_SCHEDULE_ENTRIES } from '@/data/schedule';

export function getScheduledFlights(now = new Date()) {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Almaty', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const data = { arrivals: [], departures: [] };
  const cityCodes = { Astana: 'NQZ', Almaty: 'ALA', Urzhar: 'UZR' };
  const airlineNames = { IQ: 'Vietjet Qazaqstan', FS: 'FlyArystan', IH: 'Hi Sky' };
  for (const entry of DEFAULT_SCHEDULE_ENTRIES) {
    if (entry.weekday !== weekday || date < entry.validFrom || date > entry.validTo) continue;
    const airlineCode = entry.flightNumber.slice(0, 2);
    const flight = {
      id: `plan-${entry.direction}-${entry.flightNumber}-${entry.time}`,
      airline: airlineNames[airlineCode] || airlineCode,
      airlineCode,
      flightNumber: entry.flightNumber,
      scheduled: entry.time,
      actual: '00:00',
      terminal: '1',
      status: 'scheduled',
      date,
    };
    if (entry.direction === 'departure') {
      data.departures.push({ ...flight, destination: entry.city, destinationCode: cityCodes[entry.city] });
    } else {
      data.arrivals.push({ ...flight, origin: entry.city, originCode: cityCodes[entry.city] });
    }
  }
  return data;
}

export const { arrivals: ARRIVALS, departures: DEPARTURES } = getScheduledFlights();

export const STATUS_LABELS = {
  scheduled: { ru: 'По расписанию' },
  checkin: { ru: 'Регистрация' },
  boarding: { ru: 'Посадка' },
  departed: { ru: 'Вылетел' },
  delayed: { ru: 'Задержан' },
  cancelled: { ru: 'Отменён' },
  landing: { ru: 'Заходит на посадку' },
  landed: { ru: 'Произвёл посадку' },
  arrived: { ru: 'Прибыл' },
};

// Winter timetable supplied by the airport, 25.10.2026–27.03.2027.
export const SCHEDULE_PERIOD = { from: '2026-10-25', to: '2027-03-27' };
export const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function pair(weekday, city, outbound, inbound, validFrom = SCHEDULE_PERIOD.from, validTo = SCHEDULE_PERIOD.to) {
  return [
    { weekday, city, direction: 'departure', flightNumber: outbound[0], time: outbound[1], counterpartTime: outbound[2], validFrom, validTo },
    { weekday, city, direction: 'arrival', flightNumber: inbound[0], time: inbound[2], counterpartTime: inbound[1], validFrom, validTo },
  ];
}

export const DEFAULT_SCHEDULE_ENTRIES = [
  ...[1, 2, 3, 4, 5, 6, 0].flatMap((weekday) => [
    ...pair(weekday, 'Astana', ['IQ374', '10:10', '11:45'], ['IQ373', '08:05', '09:40']),
    ...pair(weekday, 'Almaty', ['FS7152', '14:10', '16:00'], ['FS7151', '11:40', '13:20']),
    ...pair(weekday, 'Astana', ['FS7352', '18:00', '19:25'], ['FS7351', '16:05', '17:30']),
  ]),
  ...[2, 5].flatMap((weekday) => pair(weekday, 'Urzhar', ['IH3107', '11:10', '12:20'], ['IH3108', '13:00', '14:10'], '2026-10-25', '2026-12-30')),
  ...pair(1, 'Almaty', ['FS7154', '19:15', '21:05'], ['FS7151', '16:55', '18:35'], '2026-10-25', '2027-03-22'),
  ...pair(5, 'Almaty', ['FS7154', '20:10', '22:00'], ['FS7151', '18:00', '19:40'], '2026-11-06', '2027-11-27'),
];

export function groupScheduleByDay(entries, periodFrom = '', periodTo = '') {
  const week = Object.fromEntries(WEEK_DAYS.map((day) => [day, { departures: [], arrivals: [] }]));
  for (const entry of entries) {
    const day = WEEK_DAYS[(Number(entry.weekday) + 6) % 7];
    if (!day || !['arrival', 'departure'].includes(entry.direction)) continue;
    const from = periodFrom || periodTo;
    const to = periodTo || periodFrom;
    if ((from && entry.validTo && entry.validTo < from) || (to && entry.validFrom && entry.validFrom > to)) continue;
    if (from && to) {
      const first = new Date(`${from > (entry.validFrom || '') ? from : entry.validFrom}T00:00:00Z`);
      const last = to < (entry.validTo || '9999') ? to : entry.validTo;
      first.setUTCDate(first.getUTCDate() + (Number(entry.weekday) - first.getUTCDay() + 7) % 7);
      if (first.toISOString().slice(0, 10) > last) continue;
    }
    week[day][entry.direction === 'departure' ? 'departures' : 'arrivals'].push(entry);
  }
  for (const day of Object.values(week)) {
    day.departures.sort((a, b) => a.time.localeCompare(b.time));
    day.arrivals.sort((a, b) => a.time.localeCompare(b.time));
  }
  return week;
}

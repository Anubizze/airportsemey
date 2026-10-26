import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) return nextResolve(new URL(`../src/${specifier.slice(2)}.js`, import.meta.url).href, context);
    return nextResolve(specifier, context);
  },
});
const { DEFAULT_SCHEDULE_ENTRIES, groupScheduleByDay } = await import('../src/data/schedule.js');
const { fetchSchedule } = await import('../src/lib/scheduleApi.js');
const { fetchFlights, applyFlightEvent } = await import('../src/lib/flightsApi.js');
const { getScheduledFlights } = await import('../src/data/flights.js');

test('winter timetable preserves all 50 flight occurrences and the confirmed exceptions', () => {
  assert.equal(DEFAULT_SCHEDULE_ENTRIES.length, 50);
  const week = groupScheduleByDay(DEFAULT_SCHEDULE_ENTRIES);
  assert.equal(week.sat.departures[0].flightNumber, 'IQ374');
  assert.equal(week.sat.departures[0].time, '10:10');
  assert.equal(week.mon.arrivals.filter((entry) => entry.flightNumber === 'FS7151').length, 2);
  assert.equal(week.fri.departures.at(-1).validTo, '2027-11-27');
  assert.equal(week.tue.departures.find((entry) => entry.flightNumber === 'IH3107').time, '11:10');
  const friday = getScheduledFlights(new Date('2026-11-06T06:00:00Z'));
  assert.equal(friday.departures.length, 5);
  assert.equal(friday.arrivals.filter((entry) => entry.flightNumber === 'FS7151').length, 2);
});

test('period filters account for validity dates and the actual weekday', () => {
  assert.equal(groupScheduleByDay(DEFAULT_SCHEDULE_ENTRIES, '2026-11-06', '2026-11-06').fri.departures.length, 5);
  assert.equal(groupScheduleByDay(DEFAULT_SCHEDULE_ENTRIES, '2026-10-30', '2026-10-30').fri.departures.length, 4);
  const afterUrzhar = groupScheduleByDay(DEFAULT_SCHEDULE_ENTRIES, '2027-01-01', '2027-01-01');
  assert.equal(afterUrzhar.fri.departures.some((entry) => entry.flightNumber === 'IH3107'), false);
  assert.equal(afterUrzhar.mon.departures.length, 0);
  assert.deepEqual(groupScheduleByDay([], '', '').mon.departures, []);
});

test('public calendar reads published admin changes without a session and preserves an empty plan', async (t) => {
  const changed = { entries: [{ ...DEFAULT_SCHEDULE_ENTRIES[0], time: '12:34' }], source: 'custom' };
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.ok(url.endsWith('/schedule'));
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers, undefined);
    return Response.json(changed);
  });
  assert.equal((await fetchSchedule()).entries[0].time, '12:34');
  mock.mock.mockImplementation(async () => Response.json({ entries: [], source: 'custom' }));
  assert.deepEqual((await fetchSchedule()).entries, []);
  mock.mock.mockImplementation(async () => new Response('', { status: 503 }));
  await assert.rejects(fetchSchedule());
});

test('board and live events keep repeated flight numbers and use Semey local time', async (t) => {
  const dto = (id, scheduledTime) => ({ id, flightNumber: 'FS7151', airlineName: 'FlyArystan', airlineCode: 'FS', city: 'Almaty', direction: 'arrival', scheduledTime, status: 'scheduled' });
  const day = dto('day', '2026-11-06T08:20:00Z');
  const evening = dto('evening', '2026-11-06T14:40:00Z');
  t.mock.method(globalThis, 'fetch', async () => Response.json([day, evening]));
  const state = await fetchFlights();
  assert.deepEqual(state.arrivals.map((entry) => entry.scheduled), ['13:20', '19:40']);
  const updated = applyFlightEvent(state, { type: 'updated', payload: { ...evening, status: 'delayed' } });
  assert.equal(updated.arrivals.length, 2);
  assert.equal(updated.arrivals[1].status, 'delayed');
});

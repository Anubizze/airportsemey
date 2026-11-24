import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://abaiairport.kz/api/';
const { fetchAnnouncements, fetchAdminAnnouncements, saveAnnouncement, deleteAnnouncement, getAnnouncementText } = await import('../src/lib/announcementsApi.js');

test('localized announcements fall back to Russian independently for title and body', () => {
  const item = { titleRu: 'Заголовок', contentRu: 'Текст', titleKz: 'Тақырып', contentKz: '', contentEn: 'Body' };
  assert.deepEqual(getAnnouncementText(item, 'ru'), { title: 'Заголовок', content: 'Текст' });
  assert.deepEqual(getAnnouncementText(item, 'kz'), { title: 'Тақырып', content: 'Текст' });
  assert.deepEqual(getAnnouncementText(item, 'en'), { title: 'Заголовок', content: 'Body' });
});

test('public reads are uncached and admin calls use authentication and the correct methods', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, ...options });
    return Response.json(options.method ? { id: 'test-id' } : []);
  });
  await fetchAnnouncements();
  await fetchAdminAnnouncements('token');
  await saveAnnouncement('token', { titleRu: 'Title', contentRu: 'Body', isPublished: false });
  await saveAnnouncement('token', { isPublished: true }, 'test-id');
  await deleteAnnouncement('token', 'test-id');
  assert.equal(calls[0].url, 'https://abaiairport.kz/api/announcements');
  assert.equal(calls[0].cache, 'no-store');
  assert.equal(calls[0].headers, undefined);
  assert.equal(calls[1].url, 'https://abaiairport.kz/api/announcements/admin/all');
  for (const call of calls.slice(1)) assert.equal(call.headers.Authorization, 'Bearer token');
  assert.equal(calls[2].method, 'POST');
  assert.equal(JSON.parse(calls[2].body).isPublished, false);
  assert.equal(calls[3].method, 'PATCH');
  assert.deepEqual(JSON.parse(calls[3].body), { isPublished: true });
  assert.equal(calls[4].method, 'DELETE');
});

test('expired sessions, server validation and proxy errors have usable messages', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 401 }));
  await assert.rejects(fetchAdminAnnouncements('expired'), { message: 'SESSION_EXPIRED' });
  mock.mock.mockImplementation(async () => Response.json({ message: ['Укажите заголовок', 'Укажите текст'] }, { status: 400 }));
  await assert.rejects(saveAnnouncement('token', {}), { message: 'Укажите заголовок, Укажите текст' });
  mock.mock.mockImplementation(async () => new Response('<html>Bad gateway</html>', { status: 502 }));
  await assert.rejects(fetchAnnouncements(), { message: 'Не удалось выполнить действие с объявлениями' });
});

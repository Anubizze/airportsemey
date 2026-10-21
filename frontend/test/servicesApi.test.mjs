import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../src/${specifier.slice(2)}.js`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://abaiairport.kz/api/';
const { resolveUploadUrl, updateServicePhoto, fetchAdminServicePhotos, uploadServicePhoto } = await import('../src/lib/servicesApi.js');

test('uploaded files use the API route, including legacy and already-prefixed paths', () => {
  for (const path of ['/uploads/services/photo.jpeg', 'uploads/services/photo.jpeg', '/api/uploads/services/photo.jpeg', 'api/uploads/services/photo.jpeg']) {
    assert.equal(resolveUploadUrl(path), 'https://abaiairport.kz/api/uploads/services/photo.jpeg');
  }
  assert.equal(resolveUploadUrl('/uploads/documents/report.pdf'), 'https://abaiairport.kz/api/uploads/documents/report.pdf');
  assert.equal(resolveUploadUrl('https://cdn.example.com/photo.jpeg'), 'https://cdn.example.com/photo.jpeg');
  assert.equal(resolveUploadUrl(''), '');
  assert.equal(resolveUploadUrl(null), '');
});

test('metadata-only editing keeps empty captions and does not attach a replacement file', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://abaiairport.kz/api/service-photos/photo-id');
    assert.equal(options.method, 'PATCH');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.headers['Content-Type'], undefined);
    assert.equal(options.body.get('altRu'), '');
    assert.equal(options.body.get('sortOrder'), '0');
    assert.equal(options.body.has('file'), false);
    return Response.json({ id: 'photo-id' });
  });
  assert.deepEqual(await updateServicePhoto('test-token', 'photo-id', { altRu: '', sortOrder: 0 }), { id: 'photo-id' });
});

test('replacement uploads the selected file', async (t) => {
  const file = new File(['image-bytes'], 'photo.png', { type: 'image/png' });
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.body.get('file').name, 'photo.png');
    assert.equal(await options.body.get('file').text(), 'image-bytes');
    return Response.json({ id: 'photo-id' });
  });
  await updateServicePhoto('test-token', 'photo-id', { file });
});

test('expired sessions are reported separately from upload errors', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Unauthorized' }, { status: 401 }));
  await assert.rejects(fetchAdminServicePhotos('expired-token'), { message: 'SESSION_EXPIRED' });
});

test('validation messages are readable and non-JSON errors use a fallback', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => Response.json({ message: ['Invalid service', 'Invalid order'] }, { status: 400 }));
  await assert.rejects(updateServicePhoto('test-token', 'photo-id', {}), { message: 'Invalid service, Invalid order' });
  mock.mock.mockImplementation(async () => new Response('<html>Bad Gateway</html>', { status: 502 }));
  await assert.rejects(uploadServicePhoto('test-token', { serviceId: 'medical', file: new File(['image'], 'photo.png') }), { message: 'Ошибка загрузки' });
});

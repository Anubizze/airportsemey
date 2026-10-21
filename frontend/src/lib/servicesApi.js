import { AIRPORT_SERVICES } from '@/data/services';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export function getUploadsBaseUrl() {
  // Uploads must use the same backend route as the API behind the site proxy.
  return API_BASE;
}

export function resolveUploadUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const relativePath = path.replace(/^\/?api\/uploads\//, '/uploads/');
  return `${getUploadsBaseUrl()}${relativePath.startsWith('/') ? relativePath : `/${relativePath}`}`;
}

async function readPhotoResponse(response, fallback) {
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) throw new Error('SESSION_EXPIRED');
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message || fallback);
  }
  return data;
}

export function mapApiPhotoToImage(photo) {
  return {
    id: photo.id,
    src: resolveUploadUrl(photo.url),
    alt: {
      ru: photo.altRu ?? '',
      kz: photo.altKz ?? '',
      en: photo.altEn ?? '',
    },
  };
}

export function getServiceOptions() {
  return AIRPORT_SERVICES.map((service) => ({
    id: service.id,
    title: service.title.ru,
  }));
}

export async function fetchServicePhotosGrouped() {
  const response = await fetch(`${API_BASE}/service-photos`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Не удалось загрузить фото услуг');
  }
  return response.json();
}

export async function fetchAdminServicePhotos(token) {
  const response = await fetch(`${API_BASE}/service-photos/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return readPhotoResponse(response, 'Не удалось загрузить фото услуг');
}

export async function uploadServicePhoto(token, { serviceId, file, altRu, altKz, altEn, sortOrder }) {
  const formData = new FormData();
  formData.append('serviceId', serviceId);
  formData.append('file', file);
  if (altRu) formData.append('altRu', altRu);
  if (altKz) formData.append('altKz', altKz);
  if (altEn) formData.append('altEn', altEn);
  if (sortOrder !== undefined && sortOrder !== '') {
    formData.append('sortOrder', String(sortOrder));
  }

  const response = await fetch(`${API_BASE}/service-photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return readPhotoResponse(response, 'Ошибка загрузки');
}

export async function updateServicePhoto(token, id, { file, ...fields }) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  }
  if (file) formData.append('file', file);
  const response = await fetch(`${API_BASE}/service-photos/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return readPhotoResponse(response, 'Не удалось сохранить фото');
}

export async function deleteServicePhoto(token, id) {
  const response = await fetch(`${API_BASE}/service-photos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return readPhotoResponse(response, 'Ошибка удаления');
}

export function mergeServicePhotos(service, apiPhotos = []) {
  const dynamicImages = apiPhotos.map(mapApiPhotoToImage);
  const staticImages = service.images ?? [];
  return {
    ...service,
    images: [...dynamicImages, ...staticImages],
  };
}

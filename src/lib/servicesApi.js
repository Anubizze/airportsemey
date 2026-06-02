import { AIRPORT_SERVICES } from '@/data/services';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

export function getUploadsBaseUrl() {
  return API_BASE.replace(/\/api\/?$/, '');
}

export function resolveUploadUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getUploadsBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Не удалось загрузить фото услуг');
  }
  return data;
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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка загрузки',
    );
  }
  return data;
}

export async function deleteServicePhoto(token, id) {
  const response = await fetch(`${API_BASE}/service-photos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка удаления');
  }
  return data;
}

export function mergeServicePhotos(service, apiPhotos = []) {
  const dynamicImages = apiPhotos.map(mapApiPhotoToImage);
  const staticImages = service.images ?? [];
  return {
    ...service,
    images: [...dynamicImages, ...staticImages],
  };
}

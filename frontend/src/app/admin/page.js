'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';
import {
  deleteVacancy,
  fetchAdminVacancies,
  fetchVacancyApplications,
  saveVacancy,
} from '@/lib/vacanciesApi';
import {
  deleteServicePhoto,
  fetchAdminServicePhotos,
  resolveUploadUrl,
  uploadServicePhoto,
} from '@/lib/servicesApi';
import { AIRPORT_SERVICES } from '@/data/services';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:4000/api';

const EMPTY_VACANCY_FORM = {
  title: '',
  department: '',
  employmentType: 'Полная занятость',
  salaryText: '',
  description: '',
  contactPhone: '87222360033',
  isPublished: true,
  sortOrder: 0,
};

const EMPTY_FORM = {
  flightNumber: '',
  airlineName: '',
  airlineCode: '',
  direction: 'departure',
  city: '',
  cityCode: '',
  terminal: '1',
  sector: '',
  gate: '',
  scheduledTime: '',
  estimatedTime: '',
  status: 'scheduled',
};

const STATUS_OPTIONS = [
  'scheduled',
  'checkin',
  'boarding',
  'departed',
  'delayed',
  'cancelled',
  'landing',
  'landed',
  'arrived',
];

const STATUS_LABELS_RU = {
  scheduled: 'По расписанию',
  checkin: 'Регистрация',
  boarding: 'Посадка',
  departed: 'Вылетел',
  delayed: 'Задержан',
  cancelled: 'Отменён',
  landing: 'Заходит на посадку',
  landed: 'Произвёл посадку',
  arrived: 'Прибыл',
};
const LOG_PAGE_SIZE = 20;

const AIRLINE_PRESETS = [
  {
    code: 'FS',
    name: 'FlyArystan',
    logo: flyarystanLogo,
    bg: '#fff7f2',
    border: '#ffd4b8',
  },
  {
    code: 'DV',
    name: 'SCAT',
    logo: scatLogo,
    bg: '#f2f6ff',
    border: '#c8d8f8',
  },
];

function toLocalDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function getDelayMinutes(flight) {
  if (!flight?.scheduledTime || !flight?.estimatedTime) return 0;
  const scheduledTs = new Date(flight.scheduledTime).getTime();
  const estimatedTs = new Date(flight.estimatedTime).getTime();
  if (Number.isNaN(scheduledTs) || Number.isNaN(estimatedTs)) return 0;
  const diffMin = Math.round((estimatedTs - scheduledTs) / 60000);
  return diffMin > 0 ? diffMin : 0;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [flights, setFlights] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [logSearch, setLogSearch] = useState('');
  const [logUser, setLogUser] = useState('');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [logPage, setLogPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [vacancyApplications, setVacancyApplications] = useState([]);
  const [vacancyForm, setVacancyForm] = useState(EMPTY_VACANCY_FORM);
  const [editingVacancyId, setEditingVacancyId] = useState(null);
  const [vacancyLoading, setVacancyLoading] = useState(false);
  const [servicePhotos, setServicePhotos] = useState([]);
  const [photoServiceId, setPhotoServiceId] = useState(AIRPORT_SERVICES[0]?.id ?? 'cafe-lido');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoAlt, setPhotoAlt] = useState('');
  const [photoSortOrder, setPhotoSortOrder] = useState(0);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);

  const isLogged = Boolean(token);

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) setToken(saved);
  }, []);

  const sortedFlights = useMemo(() => {
    return [...flights].sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
  }, [flights]);

  const filteredStatusHistory = useMemo(() => {
    const search = logSearch.trim().toLowerCase();
    const user = logUser.trim().toLowerCase();
    const fromTs = logDateFrom ? new Date(`${logDateFrom}T00:00:00`).getTime() : null;
    const toTs = logDateTo ? new Date(`${logDateTo}T23:59:59`).getTime() : null;

    return statusHistory.filter((item) => {
      const itemTs = item.createdAt ? new Date(item.createdAt).getTime() : 0;
      const bySearch =
        !search ||
        String(item.flightNumber ?? '').toLowerCase().includes(search) ||
        String(item.newStatus ?? '').toLowerCase().includes(search) ||
        String(item.previousStatus ?? '').toLowerCase().includes(search);
      const byUser = !user || String(item.changedByLogin ?? '').toLowerCase().includes(user);
      const byFrom = fromTs === null || itemTs >= fromTs;
      const byTo = toTs === null || itemTs <= toTs;

      return bySearch && byUser && byFrom && byTo;
    });
  }, [statusHistory, logSearch, logUser, logDateFrom, logDateTo]);

  const totalLogPages = Math.max(1, Math.ceil(filteredStatusHistory.length / LOG_PAGE_SIZE));

  const paginatedStatusHistory = useMemo(() => {
    const start = (logPage - 1) * LOG_PAGE_SIZE;
    return filteredStatusHistory.slice(start, start + LOG_PAGE_SIZE);
  }, [filteredStatusHistory, logPage]);

  const selectedAirlinePreset = useMemo(
    () => AIRLINE_PRESETS.find((item) => item.code === form.airlineCode),
    [form.airlineCode],
  );
  const delayedFlights = useMemo(() => {
    return sortedFlights
      .map((flight) => ({
        ...flight,
        delayMinutes: getDelayMinutes(flight),
      }))
      .filter((flight) => flight.status === 'delayed' || flight.delayMinutes > 0)
      .sort((a, b) => b.delayMinutes - a.delayMinutes);
  }, [sortedFlights]);

  const delayStats = useMemo(() => {
    if (delayedFlights.length === 0) {
      return { total: 0, avg: 0, max: 0 };
    }
    const totalDelay = delayedFlights.reduce((sum, item) => sum + item.delayMinutes, 0);
    const maxDelay = delayedFlights.reduce((max, item) => Math.max(max, item.delayMinutes), 0);
    return {
      total: delayedFlights.length,
      avg: Math.round(totalDelay / delayedFlights.length),
      max: maxDelay,
    };
  }, [delayedFlights]);

  const loadFlights = async () => {
    const response = await fetch(`${API_BASE}/flights`, { cache: 'no-store' });
    const data = await response.json();
    setFlights(Array.isArray(data) ? data : []);
  };

  const loadStatusHistory = async (authToken) => {
    const response = await fetch(`${API_BASE}/flights/history/status?limit=100`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    setStatusHistory(Array.isArray(data) ? data : []);
  };

  const loadVacancies = async (authToken) => {
    try {
      const data = await fetchAdminVacancies(authToken);
      setVacancies(Array.isArray(data) ? data : []);
    } catch {
      setVacancies([]);
    }
  };

  const loadVacancyApplications = async (authToken) => {
    try {
      const data = await fetchVacancyApplications(authToken);
      setVacancyApplications(Array.isArray(data) ? data : []);
    } catch {
      setVacancyApplications([]);
    }
  };

  const loadServicePhotos = async (authToken) => {
    try {
      const data = await fetchAdminServicePhotos(authToken);
      setServicePhotos(Array.isArray(data) ? data : []);
    } catch {
      setServicePhotos([]);
    }
  };

  const getServiceTitle = (serviceId) =>
    AIRPORT_SERVICES.find((item) => item.id === serviceId)?.title?.ru ?? serviceId;

  useEffect(() => {
    if (!isLogged) return;
    void loadFlights();
    void loadStatusHistory(token);
    void loadVacancies(token);
    void loadVacancyApplications(token);
    void loadServicePhotos(token);
  }, [isLogged, token]);

  useEffect(() => {
    setLogPage(1);
  }, [logSearch, logUser, logDateFrom, logDateTo]);

  useEffect(() => {
    if (logPage > totalLogPages) {
      setLogPage(totalLogPages);
    }
  }, [logPage, totalLogPages]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.accessToken) {
        throw new Error(data?.message ?? 'Ошибка авторизации');
      }
      localStorage.setItem('admin_token', data.accessToken);
      setToken(data.accessToken);
      setLogin('');
      setPassword('');
      setMessage('Успешный вход в админку');
    } catch (error) {
      setAuthError(error.message || 'Не удалось войти');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setFlights([]);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage('Вы вышли из админки');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      ...form,
      scheduledTime: new Date(form.scheduledTime).toISOString(),
      estimatedTime: form.estimatedTime ? new Date(form.estimatedTime).toISOString() : undefined,
      sector: form.sector || undefined,
      gate: form.gate || undefined,
      terminal: form.terminal || '1',
      airlineCode: form.airlineCode.toUpperCase(),
      cityCode: form.cityCode.toUpperCase(),
    };

    try {
      const isEdit = Boolean(editingId);
      const response = await fetch(
        isEdit ? `${API_BASE}/flights/${editingId}` : `${API_BASE}/flights`,
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка',
        );
      }

      setMessage(isEdit ? 'Рейс обновлён' : 'Рейс добавлен');
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadFlights();
      await loadStatusHistory(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flight) => {
    setEditingId(flight.id);
    setForm({
      flightNumber: flight.flightNumber ?? '',
      airlineName: flight.airlineName ?? '',
      airlineCode: flight.airlineCode ?? '',
      direction: flight.direction ?? 'departure',
      city: flight.city ?? '',
      cityCode: flight.cityCode ?? '',
      terminal: flight.terminal ?? '1',
      sector: flight.sector ?? '',
      gate: flight.gate ?? '',
      scheduledTime: toLocalDateInput(flight.scheduledTime),
      estimatedTime: toLocalDateInput(flight.estimatedTime),
      status: flight.status ?? 'scheduled',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить рейс?')) return;
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/flights/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Ошибка удаления');
      setMessage('Рейс удалён');
      await loadFlights();
      await loadStatusHistory(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка удаления');
    }
  };

  const handleMarkDelayed = async (flight) => {
    const raw = window.prompt(`На сколько минут задерживается рейс ${flight.flightNumber}?`, '30');
    if (raw === null) return;

    const delayMinutes = Number.parseInt(raw, 10);
    if (!Number.isFinite(delayMinutes) || delayMinutes <= 0) {
      setMessage('Введите корректное количество минут (больше 0)');
      return;
    }

    const scheduled = new Date(flight.scheduledTime);
    if (Number.isNaN(scheduled.getTime())) {
      setMessage('Не удалось определить плановое время рейса');
      return;
    }

    const delayedTime = new Date(scheduled.getTime() + delayMinutes * 60 * 1000);

    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/flights/${flight.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'delayed',
          estimatedTime: delayedTime.toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Ошибка',
        );
      }
      setMessage(`Рейс ${flight.flightNumber} помечен как задержанный (+${delayMinutes} мин)`);
      await loadFlights();
      await loadStatusHistory(token);
    } catch (error) {
      setMessage(error.message || 'Не удалось установить задержку');
    }
  };

  const exportHistoryCsv = () => {
    if (filteredStatusHistory.length === 0) {
      setMessage('Нет данных для экспорта');
      return;
    }

    const headers = [
      'Дата/время',
      'Рейс',
      'Пользователь',
      'Было',
      'Стало',
      'Примечание',
    ];
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = filteredStatusHistory.map((item) => [
      item.createdAt ? new Date(item.createdAt).toLocaleString('ru-RU') : '',
      item.flightNumber ?? '',
      item.changedByLogin ?? 'Система',
      item.previousStatus ? STATUS_LABELS_RU[item.previousStatus] ?? item.previousStatus : '',
      STATUS_LABELS_RU[item.newStatus] ?? item.newStatus,
      item.note ?? '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateSuffix = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `flight-status-history-${dateSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportDelayCsv = () => {
    if (delayedFlights.length === 0) {
      setMessage('Нет задержек для экспорта');
      return;
    }
    const headers = ['Рейс', 'Тип', 'Город', 'План', 'Факт', 'Задержка (мин)', 'Статус'];
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = delayedFlights.map((flight) => [
      flight.flightNumber,
      flight.direction === 'departure' ? 'Вылет' : 'Прилёт',
      flight.city,
      flight.scheduledTime ? new Date(flight.scheduledTime).toLocaleString('ru-RU') : '',
      flight.estimatedTime ? new Date(flight.estimatedTime).toLocaleString('ru-RU') : '',
      flight.delayMinutes,
      STATUS_LABELS_RU[flight.status] ?? flight.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateSuffix = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `delay-report-${dateSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSelectAirline = (preset) => {
    setForm((prev) => ({
      ...prev,
      airlineName: preset.name,
      airlineCode: preset.code,
    }));
  };

  const handleVacancySubmit = async (event) => {
    event.preventDefault();
    setVacancyLoading(true);
    setMessage('');
    try {
      await saveVacancy(token, vacancyForm, editingVacancyId);
      setMessage(editingVacancyId ? 'Вакансия обновлена' : 'Вакансия добавлена');
      setVacancyForm(EMPTY_VACANCY_FORM);
      setEditingVacancyId(null);
      await loadVacancies(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка сохранения вакансии');
    } finally {
      setVacancyLoading(false);
    }
  };

  const handleEditVacancy = (vacancy) => {
    setEditingVacancyId(vacancy.id);
    setVacancyForm({
      title: vacancy.title ?? '',
      department: vacancy.department ?? '',
      employmentType: vacancy.employmentType ?? 'Полная занятость',
      salaryText: vacancy.salaryText ?? '',
      description: vacancy.description ?? '',
      contactPhone: vacancy.contactPhone ?? '87222360033',
      isPublished: vacancy.isPublished ?? true,
      sortOrder: vacancy.sortOrder ?? 0,
    });
  };

  const handleDeleteVacancy = async (id) => {
    if (!confirm('Удалить вакансию?')) return;
    setMessage('');
    try {
      await deleteVacancy(token, id);
      setMessage('Вакансия удалена');
      await loadVacancies(token);
      await loadVacancyApplications(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка удаления вакансии');
    }
  };

  const handlePhotoUpload = async (event) => {
    event.preventDefault();
    if (!photoFiles.length) {
      setMessage('Выберите одно или несколько изображений');
      return;
    }
    setPhotoUploadLoading(true);
    setMessage('');
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        await uploadServicePhoto(token, {
          serviceId: photoServiceId,
          file: photoFiles[i],
          altRu: photoAlt,
          altKz: photoAlt,
          altEn: photoAlt,
          sortOrder: photoSortOrder + i,
        });
      }
      setMessage(`Загружено фото: ${photoFiles.length}`);
      setPhotoFiles([]);
      setPhotoAlt('');
      setPhotoSortOrder(0);
      await loadServicePhotos(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка загрузки фото');
    } finally {
      setPhotoUploadLoading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!confirm('Удалить фото?')) return;
    setMessage('');
    try {
      await deleteServicePhoto(token, id);
      setMessage('Фото удалено');
      await loadServicePhotos(token);
    } catch (error) {
      setMessage(error.message || 'Ошибка удаления фото');
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Админка рейсов</h1>
          <p className="text-sm text-gray-500 mb-6">Войдите по логину и паролю администратора</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Логин</label>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-900 text-white text-sm font-semibold py-2.5 hover:opacity-90"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Админка рейсов</h1>
            <p className="text-sm text-gray-500">Управление онлайн-табло аэропорта</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Выйти
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Редактировать рейс' : 'Добавить рейс'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="text-sm">
              <span className="text-gray-600">Номер рейса</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.flightNumber}
                onChange={(e) => setForm((s) => ({ ...s, flightNumber: e.target.value }))}
                required
              />
            </label>
            <div className="text-sm md:col-span-2 lg:col-span-2">
              <span className="text-gray-600">Выбор авиакомпании</span>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AIRLINE_PRESETS.map((preset) => {
                  const selected = form.airlineCode === preset.code;
                  return (
                    <button
                      key={preset.code}
                      type="button"
                      onClick={() => handleSelectAirline(preset)}
                      className={`rounded-xl border p-2.5 flex items-center gap-3 text-left transition ${
                        selected
                          ? 'ring-2 ring-blue-400 border-blue-300'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                      style={{ backgroundColor: preset.bg, borderColor: selected ? '#93c5fd' : preset.border }}
                    >
                      <div className="w-16 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1">
                        <Image src={preset.logo} alt={preset.name} width={52} height={28} className="object-contain" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 leading-tight">{preset.name}</div>
                        <div className="text-xs text-gray-500">{preset.code}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="text-sm">
              <span className="text-gray-600">Тип рейса</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.direction}
                onChange={(e) => setForm((s) => ({ ...s, direction: e.target.value }))}
              >
                <option value="departure">Вылет</option>
                <option value="arrival">Прилёт</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Авиакомпания (можно править)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.airlineName}
                onChange={(e) => setForm((s) => ({ ...s, airlineName: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Код авиакомпании</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 uppercase"
                value={form.airlineCode}
                onChange={(e) => setForm((s) => ({ ...s, airlineCode: e.target.value.toUpperCase() }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Город</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.city}
                onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Код города</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 uppercase"
                value={form.cityCode}
                onChange={(e) => setForm((s) => ({ ...s, cityCode: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Плановое время</span>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.scheduledTime}
                onChange={(e) => setForm((s) => ({ ...s, scheduledTime: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Фактическое/расчётное время</span>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.estimatedTime}
                onChange={(e) => setForm((s) => ({ ...s, estimatedTime: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Терминал</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.terminal}
                onChange={(e) => setForm((s) => ({ ...s, terminal: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Сектор</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.sector}
                onChange={(e) => setForm((s) => ({ ...s, sector: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Выход (Gate)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.gate}
                onChange={(e) => setForm((s) => ({ ...s, gate: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Статус</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS_RU[status] ?? status}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-2 lg:col-span-4 flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : editingId ? 'Сохранить изменения' : 'Добавить рейс'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Отмена
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  void loadFlights();
                  void loadStatusHistory(token);
                }}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Обновить список
              </button>
            </div>
          </form>
          {selectedAirlinePreset && (
            <p className="mt-3 text-xs text-gray-500">
              Выбрана авиакомпания: <span className="font-medium text-gray-700">{selectedAirlinePreset.name}</span>
            </p>
          )}
          {message && <p className="mt-4 text-sm text-blue-700">{message}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Текущие рейсы ({sortedFlights.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-2 pr-3">Рейс</th>
                  <th className="py-2 pr-3">Авиакомпания</th>
                  <th className="py-2 pr-3">Тип</th>
                  <th className="py-2 pr-3">Город</th>
                  <th className="py-2 pr-3">План</th>
                  <th className="py-2 pr-3">Факт</th>
                  <th className="py-2 pr-3">Статус</th>
                  <th className="py-2 pr-3">Gate</th>
                  <th className="py-2 pr-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedFlights.map((flight) => (
                  <tr key={flight.id} className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-medium">{flight.flightNumber}</td>
                    <td className="py-2 pr-3">{flight.airlineName}</td>
                    <td className="py-2 pr-3">{flight.direction === 'departure' ? 'Вылет' : 'Прилёт'}</td>
                    <td className="py-2 pr-3">{flight.city}</td>
                    <td className="py-2 pr-3">{new Date(flight.scheduledTime).toLocaleString('ru-RU')}</td>
                    <td className="py-2 pr-3">
                      {flight.estimatedTime ? new Date(flight.estimatedTime).toLocaleString('ru-RU') : '—'}
                    </td>
                    <td className="py-2 pr-3">{STATUS_LABELS_RU[flight.status] ?? flight.status}</td>
                    <td className="py-2 pr-3">{flight.gate ?? '—'}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(flight)}
                          className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Редакт.
                        </button>
                        <button
                          onClick={() => void handleMarkDelayed(flight)}
                          className="rounded-lg border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-50"
                        >
                          Задержка + отчёт
                        </button>
                        <button
                          onClick={() => void handleDelete(flight.id)}
                          className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Отчёт по задержкам ({delayStats.total})
            </h2>
            <button
              type="button"
              onClick={exportDelayCsv}
              className="rounded-xl border border-blue-300 text-blue-800 px-4 py-2 text-sm font-medium hover:bg-blue-50"
            >
              Экспорт CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Задержанных рейсов</p>
              <p className="text-xl font-bold text-gray-900">{delayStats.total}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Средняя задержка</p>
              <p className="text-xl font-bold text-gray-900">{delayStats.avg} мин</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Максимальная задержка</p>
              <p className="text-xl font-bold text-gray-900">{delayStats.max} мин</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-2 pr-3">Рейс</th>
                  <th className="py-2 pr-3">Тип</th>
                  <th className="py-2 pr-3">Город</th>
                  <th className="py-2 pr-3">План</th>
                  <th className="py-2 pr-3">Факт</th>
                  <th className="py-2 pr-3">Задержка</th>
                  <th className="py-2 pr-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {delayedFlights.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-5 text-center text-gray-400">
                      Сейчас нет задержанных рейсов
                    </td>
                  </tr>
                ) : (
                  delayedFlights.map((flight) => (
                    <tr key={`delay-${flight.id}`} className="border-b border-gray-50">
                      <td className="py-2 pr-3 font-medium">{flight.flightNumber}</td>
                      <td className="py-2 pr-3">{flight.direction === 'departure' ? 'Вылет' : 'Прилёт'}</td>
                      <td className="py-2 pr-3">{flight.city}</td>
                      <td className="py-2 pr-3">
                        {flight.scheduledTime
                          ? new Date(flight.scheduledTime).toLocaleString('ru-RU')
                          : '—'}
                      </td>
                      <td className="py-2 pr-3">
                        {flight.estimatedTime
                          ? new Date(flight.estimatedTime).toLocaleString('ru-RU')
                          : '—'}
                      </td>
                      <td className="py-2 pr-3 font-semibold text-red-700">
                        {flight.delayMinutes > 0 ? `${flight.delayMinutes} мин` : '—'}
                      </td>
                      <td className="py-2 pr-3">{STATUS_LABELS_RU[flight.status] ?? flight.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Лог изменений статусов ({filteredStatusHistory.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <label className="text-sm lg:col-span-2">
              <span className="text-gray-600">Поиск (рейс/статус)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Например FS 7352"
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Пользователь</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={logUser}
                onChange={(e) => setLogUser(e.target.value)}
                placeholder="admin"
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">С даты</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={logDateFrom}
                onChange={(e) => setLogDateFrom(e.target.value)}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">По дату</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={logDateTo}
                onChange={(e) => setLogDateTo(e.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={exportHistoryCsv}
              className="rounded-xl border border-blue-300 text-blue-800 px-4 py-2 text-sm font-medium hover:bg-blue-50"
            >
              Экспорт CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setLogSearch('');
                setLogUser('');
                setLogDateFrom('');
                setLogDateTo('');
                setLogPage(1);
              }}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Сбросить фильтры
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-2 pr-3">Время</th>
                  <th className="py-2 pr-3">Рейс</th>
                  <th className="py-2 pr-3">Кто изменил</th>
                  <th className="py-2 pr-3">Было</th>
                  <th className="py-2 pr-3">Стало</th>
                  <th className="py-2 pr-3">Примечание</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStatusHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-5 text-center text-gray-400">
                      Нет изменений статусов
                    </td>
                  </tr>
                ) : (
                  paginatedStatusHistory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-2 pr-3">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="py-2 pr-3 font-medium">{item.flightNumber ?? '—'}</td>
                      <td className="py-2 pr-3">{item.changedByLogin ?? 'Система'}</td>
                      <td className="py-2 pr-3">
                        {item.previousStatus
                          ? STATUS_LABELS_RU[item.previousStatus] ?? item.previousStatus
                          : '—'}
                      </td>
                      <td className="py-2 pr-3 font-medium text-blue-800">
                        {STATUS_LABELS_RU[item.newStatus] ?? item.newStatus}
                      </td>
                      <td className="py-2 pr-3 text-gray-500">{item.note ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Страница {logPage} из {totalLogPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                disabled={logPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-100"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                disabled={logPage >= totalLogPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-100"
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingVacancyId ? 'Редактировать вакансию' : 'Добавить вакансию'}
          </h2>
          <form onSubmit={handleVacancySubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="text-sm md:col-span-2">
              <span className="text-gray-600">Название</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.title}
                onChange={(e) => setVacancyForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Порядок</span>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.sortOrder}
                onChange={(e) => setVacancyForm((s) => ({ ...s, sortOrder: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Отдел</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.department}
                onChange={(e) => setVacancyForm((s) => ({ ...s, department: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Тип занятости</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.employmentType}
                onChange={(e) => setVacancyForm((s) => ({ ...s, employmentType: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Зарплата</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.salaryText}
                onChange={(e) => setVacancyForm((s) => ({ ...s, salaryText: e.target.value }))}
                placeholder="150 000 — 200 000 тг"
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Телефон для связи</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={vacancyForm.contactPhone}
                onChange={(e) => setVacancyForm((s) => ({ ...s, contactPhone: e.target.value }))}
                placeholder="87222360033"
              />
            </label>
            <label className="text-sm md:col-span-3">
              <span className="text-gray-600">Описание</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                rows={3}
                value={vacancyForm.description}
                onChange={(e) => setVacancyForm((s) => ({ ...s, description: e.target.value }))}
              />
            </label>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={vacancyForm.isPublished}
                onChange={(e) => setVacancyForm((s) => ({ ...s, isPublished: e.target.checked }))}
              />
              <span className="text-gray-600">Опубликована на сайте</span>
            </label>
            <div className="md:col-span-3 flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={vacancyLoading}
                className="rounded-xl bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
              >
                {vacancyLoading ? 'Сохранение...' : editingVacancyId ? 'Сохранить вакансию' : 'Добавить вакансию'}
              </button>
              {editingVacancyId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVacancyId(null);
                    setVacancyForm(EMPTY_VACANCY_FORM);
                  }}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Отмена
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  void loadVacancies(token);
                  void loadVacancyApplications(token);
                }}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Обновить
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Вакансии ({vacancies.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-2 pr-3">Название</th>
                  <th className="py-2 pr-3">Отдел</th>
                  <th className="py-2 pr-3">Зарплата</th>
                  <th className="py-2 pr-3">Телефон</th>
                  <th className="py-2 pr-3">Статус</th>
                  <th className="py-2 pr-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-5 text-center text-gray-400">
                      Вакансий пока нет
                    </td>
                  </tr>
                ) : (
                  vacancies.map((vacancy) => (
                    <tr key={vacancy.id} className="border-b border-gray-50">
                      <td className="py-2 pr-3 font-medium">{vacancy.title}</td>
                      <td className="py-2 pr-3">{vacancy.department}</td>
                      <td className="py-2 pr-3">{vacancy.salaryText}</td>
                      <td className="py-2 pr-3">{vacancy.contactPhone}</td>
                      <td className="py-2 pr-3">{vacancy.isPublished ? 'Опубликована' : 'Скрыта'}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditVacancy(vacancy)}
                            className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Редакт.
                          </button>
                          <button
                            onClick={() => void handleDeleteVacancy(vacancy.id)}
                            className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Фото услуг аэропорта ({servicePhotos.length})
          </h2>
          <form onSubmit={handlePhotoUpload} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <label className="text-sm md:col-span-2">
              <span className="text-gray-600">Услуга</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={photoServiceId}
                onChange={(e) => setPhotoServiceId(e.target.value)}
              >
                {AIRPORT_SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title.ru}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-gray-600">Порядок</span>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={photoSortOrder}
                onChange={(e) => setPhotoSortOrder(Number(e.target.value) || 0)}
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-gray-600">Подпись к фото (необязательно)</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={photoAlt}
                onChange={(e) => setPhotoAlt(e.target.value)}
                placeholder="Кафе «Лидо»"
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-gray-600">Файлы (можно выбрать несколько, JPEG/PNG/WebP, до 5 МБ каждый)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))}
              />
              {photoFiles.length > 0 && (
                <span className="mt-1 block text-xs text-gray-500">
                  Выбрано файлов: {photoFiles.length}
                </span>
              )}
            </label>
            <div className="md:col-span-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={photoUploadLoading || photoFiles.length === 0}
                className="rounded-xl bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
              >
                {photoUploadLoading
                  ? 'Загрузка...'
                  : photoFiles.length > 1
                    ? `Загрузить ${photoFiles.length} фото`
                    : 'Загрузить фото'}
              </button>
              <button
                type="button"
                onClick={() => void loadServicePhotos(token)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Обновить
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicePhotos.length === 0 ? (
              <p className="text-sm text-gray-400 col-span-full py-4 text-center">
                Фото пока не загружены
              </p>
            ) : (
              servicePhotos.map((photo) => (
                <div key={photo.id} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                  <div className="relative aspect-[4/3] bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveUploadUrl(photo.url)}
                      alt={photo.altRu || getServiceTitle(photo.serviceId)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-900">{getServiceTitle(photo.serviceId)}</div>
                    {photo.altRu ? <div className="text-xs text-gray-500 mt-1">{photo.altRu}</div> : null}
                    <button
                      type="button"
                      onClick={() => void handleDeletePhoto(photo.id)}
                      className="mt-3 rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Отклики на вакансии ({vacancyApplications.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="py-2 pr-3">Дата</th>
                  <th className="py-2 pr-3">Вакансия</th>
                  <th className="py-2 pr-3">ФИО</th>
                  <th className="py-2 pr-3">Телефон</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Сообщение</th>
                </tr>
              </thead>
              <tbody>
                {vacancyApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-5 text-center text-gray-400">
                      Откликов пока нет
                    </td>
                  </tr>
                ) : (
                  vacancyApplications.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-2 pr-3">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="py-2 pr-3 font-medium">{item.vacancyTitle}</td>
                      <td className="py-2 pr-3">{item.fullName}</td>
                      <td className="py-2 pr-3">{item.phone}</td>
                      <td className="py-2 pr-3">{item.email ?? '—'}</td>
                      <td className="py-2 pr-3 text-gray-500">{item.message ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

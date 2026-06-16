'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateEmploymentType } from '@/lib/locale';
import {
  fetchVacancies,
  formatContactPhone,
  phoneHref,
  submitVacancyApplication,
} from '@/lib/vacanciesApi';

const DEFAULT_PHONE = '87222360033';

function ApplyModal({ vacancy, onClose }) {
  const { t } = useLanguage();
  const p = t.pages.vacancies;
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const contactPhone = vacancy?.contactPhone || DEFAULT_PHONE;
  const contactLabel = formatContactPhone(contactPhone);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitVacancyApplication(vacancy.id, form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || p.errorSubmit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {success ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{p.applySuccessTitle}</h3>
            <p className="mt-2 text-sm text-gray-600">{p.applySuccessText}</p>
            <p className="mt-4 text-sm text-gray-700">
              {p.contactPhoneLabel}{' '}
              <a href={phoneHref(contactPhone)} className="font-semibold text-blue-700 hover:underline">
                {contactLabel}
              </a>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              {p.close}
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900">{p.applyModalTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{vacancy.title}</p>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm">
                <span className="text-gray-600">{p.fullName}</span>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">{p.phone}</span>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="+7 (7222) 00-00-00"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">{p.emailOptional}</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">{p.messageOptional}</span>
                <textarea
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                />
              </label>
              <p className="text-xs text-gray-500">
                {p.contactPhoneLabel}{' '}
                <a href={phoneHref(contactPhone)} className="font-medium text-blue-700 hover:underline">
                  {contactLabel}
                </a>
              </p>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? p.sending : p.sendApply}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {p.cancel}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function VacanciesPage() {
  const { t } = useLanguage();
  const p = t.pages.vacancies;
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchVacancies();
        if (!cancelled) setVacancies(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || p.errorLoad);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/about" className="hover:text-white transition-colors">{t.nav.about}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{p.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {loading && <p className="text-sm text-gray-500">{p.loading}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="space-y-4">
            {!loading && vacancies.length === 0 && !error && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm">
                {p.empty}
              </div>
            )}

            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vacancy.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {vacancy.department}
                      </span>
                      <span className="text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                        {translateEmploymentType(vacancy.employmentType, p.employmentTypes)}
                      </span>
                    </div>
                    {vacancy.description && (
                      <p className="mt-3 text-sm text-gray-600">{vacancy.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {vacancy.salaryText}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedVacancy(vacancy)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-white px-4 py-2 rounded-xl whitespace-nowrap transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#001e5c' }}
                    >
                      {p.apply}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <p className="text-sm text-gray-700">
              {p.contactUs}{' '}
              <a href="mailto:airportsemey@mail.kz" className="font-medium text-blue-700 hover:underline">
                airportsemey@mail.kz
              </a>
              {' '}{p.orCall}{' '}
              <a href={phoneHref(DEFAULT_PHONE)} className="font-medium text-blue-700 hover:underline">
                {formatContactPhone(DEFAULT_PHONE)}
              </a>.
            </p>
          </div>
        </div>
      </div>

      {selectedVacancy && (
        <ApplyModal vacancy={selectedVacancy} onClose={() => setSelectedVacancy(null)} />
      )}
    </>
  );
}

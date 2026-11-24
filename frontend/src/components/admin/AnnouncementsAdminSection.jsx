'use client';

import { useEffect, useRef, useState } from 'react';
import { deleteAnnouncement, fetchAdminAnnouncements, saveAnnouncement } from '@/lib/announcementsApi';

const EMPTY_FORM = {
  titleRu: '', contentRu: '', titleKz: '', contentKz: '', titleEn: '', contentEn: '', isPublished: true,
};
const inputClass = 'mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm';

export default function AnnouncementsAdminSection({ token, onAuthError }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(0);
  const authErrorRef = useRef(onAuthError);
  const formRef = useRef(null);
  useEffect(() => { authErrorRef.current = onAuthError; }, [onAuthError]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchAdminAnnouncements(token).then((data) => {
      if (!cancelled) setItems(data);
    }).catch((err) => {
      if (!cancelled && !authErrorRef.current(err)) setError(err.message);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, reload]);

  const reset = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); };
  const reportError = (err) => { if (!onAuthError(err)) setError(err.message); };
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setError(''); setMessage('');
    if (!form.titleRu.trim() || !form.contentRu.trim()) {
      setError('Заполните заголовок и текст объявления на русском языке.');
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAnnouncement(token, form, editingId);
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current]);
      reset();
      setMessage(saved.isPublished ? 'Объявление сохранено и опубликовано на сайте.' : 'Черновик сохранён. Он не виден на сайте.');
    } catch (err) { reportError(err); }
    finally { setSaving(false); }
  };

  const toggle = async (item) => {
    setBusyId(item.id); setError(''); setMessage('');
    try {
      const saved = await saveAnnouncement(token, { isPublished: !item.isPublished }, item.id);
      setItems((current) => current.map((record) => record.id === item.id ? saved : record));
      if (editingId === item.id) updateField('isPublished', saved.isPublished);
      setMessage(saved.isPublished ? 'Объявление опубликовано на сайте.' : 'Объявление скрыто с сайта.');
    } catch (err) { reportError(err); }
    finally { setBusyId(null); }
  };

  const remove = async (item) => {
    if (!window.confirm(`Удалить объявление «${item.titleRu}»?`)) return;
    setBusyId(item.id); setError(''); setMessage('');
    try {
      await deleteAnnouncement(token, item.id);
      setItems((current) => current.filter((record) => record.id !== item.id));
      if (editingId === item.id) reset();
      setMessage('Объявление удалено.');
    } catch (err) { reportError(err); }
    finally { setBusyId(null); }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Объявления</h2>
        <p className="text-sm text-gray-500">Публикации для раздела «Партнёрам → Объявления».</p>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      <form ref={formRef} onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <fieldset disabled={saving || Boolean(busyId) || loading} className="space-y-4">
          <legend className="mb-3 font-semibold text-gray-900">{editingId ? 'Редактирование объявления' : 'Новое объявление'}</legend>
          <label className="block text-sm text-gray-700">
            Заголовок (RU)
            <input required maxLength={255} value={form.titleRu} onChange={(event) => updateField('titleRu', event.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm text-gray-700">
            Текст объявления (RU)
            <textarea required maxLength={20000} rows={7} value={form.contentRu} onChange={(event) => updateField('contentRu', event.target.value)} className={inputClass} />
          </label>
          <details className="rounded-xl border border-gray-100 p-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">Переводы (KZ / EN)</summary>
            <p className="mt-2 text-xs text-gray-500">Необязательно. Если перевод не заполнен, посетители увидят русский текст.</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {[['Kz', 'KZ'], ['En', 'EN']].map(([suffix, label]) => (
                <div key={suffix} className="space-y-3">
                  <label className="block text-sm text-gray-700">
                    Заголовок ({label})
                    <input maxLength={255} value={form[`title${suffix}`]} onChange={(event) => updateField(`title${suffix}`, event.target.value)} className={inputClass} />
                  </label>
                  <label className="block text-sm text-gray-700">
                    Текст объявления ({label})
                    <textarea maxLength={20000} rows={5} value={form[`content${suffix}`]} onChange={(event) => updateField(`content${suffix}`, event.target.value)} className={inputClass} />
                  </label>
                </div>
              ))}
            </div>
          </details>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isPublished} onChange={(event) => updateField('isPublished', event.target.checked)} />
            Опубликовать на сайте
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Сохранение...' : 'Сохранить объявление'}</button>
            {editingId && <button type="button" onClick={reset} className="rounded-xl border border-gray-300 px-4 py-2 text-sm">Отменить редактирование</button>}
          </div>
        </fieldset>
      </form>
      {loading ? <p className="text-sm text-gray-500">Загрузка объявлений...</p> : error && !items.length ? (
        <button type="button" onClick={() => setReload((value) => value + 1)} className="text-sm font-medium text-blue-900 underline">Повторить загрузку</button>
      ) : !items.length ? <p className="text-sm text-gray-500">Объявлений пока нет. Добавьте первое с помощью формы выше.</p> : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.isPublished ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{item.isPublished ? 'Опубликовано' : 'Черновик'}</span>
                <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('ru-RU', { timeZone: 'Asia/Almaty' })}</span>
              </div>
              <h3 className="break-words font-semibold text-gray-900">{item.titleRu}</h3>
              <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-gray-600">{item.contentRu}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" disabled={saving || Boolean(busyId)} onClick={() => {
                  setEditingId(item.id);
                  setForm(Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, item[key] ?? EMPTY_FORM[key]])));
                  setError(''); setMessage(''); formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }} className="text-sm font-medium text-blue-800 disabled:opacity-50">Редактировать</button>
                <button type="button" disabled={saving || Boolean(busyId)} onClick={() => toggle(item)} className="text-sm font-medium text-blue-800 disabled:opacity-50">{item.isPublished ? 'Скрыть с сайта' : 'Опубликовать'}</button>
                <button type="button" disabled={saving || Boolean(busyId)} onClick={() => remove(item)} className="text-sm font-medium text-red-600 disabled:opacity-50">Удалить</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

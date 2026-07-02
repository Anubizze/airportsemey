'use client';

import { useState } from 'react';
import Image from 'next/image';
import eotinishIcon from '@/public/eotinish.png';
import { useLanguage } from '@/context/LanguageContext';
import { submitFeedback } from '@/lib/feedbackApi';

const COMPLAINT_EMAIL = 'airportsemey@mail.ru';

export default function EotinishButton() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const labels = {
    ru: {
      title: 'Отправить жалобу',
      subject: 'Жалоба пассажира',
      modalTitle: 'Жалоба пассажира',
      modalText: 'Опишите проблему, и сообщение уйдёт на почту аэропорта.',
      name: 'Ваше имя',
      email: 'Email для ответа',
      message: 'Текст жалобы',
      send: 'Отправить',
      sending: 'Отправка...',
      close: 'Закрыть',
      success: 'Жалоба отправлена. Спасибо за обращение.',
      error: 'Не удалось отправить жалобу. Попробуйте позже.',
      hint: 'Жалоба',
    },
    kz: {
      title: 'Шағым жіберу',
      subject: 'Жолаушы шағымы',
      modalTitle: 'Жолаушы шағымы',
      modalText: 'Мәселені сипаттаңыз, хабарлама әуежай поштасына жіберіледі.',
      name: 'Атыңыз',
      email: 'Жауап үшін Email',
      message: 'Шағым мәтіні',
      send: 'Жіберу',
      sending: 'Жіберілуде...',
      close: 'Жабу',
      success: 'Шағым жіберілді. Өтінішіңізге рахмет.',
      error: 'Шағымды жіберу сәтсіз аяқталды. Кейінірек қайталап көріңіз.',
      hint: 'Шағым',
    },
    en: {
      title: 'Send complaint',
      subject: 'Passenger complaint',
      modalTitle: 'Passenger complaint',
      modalText: 'Describe the issue and we will send it to the airport email.',
      name: 'Your name',
      email: 'Reply email',
      message: 'Complaint message',
      send: 'Send',
      sending: 'Sending...',
      close: 'Close',
      success: 'Complaint sent. Thank you for your feedback.',
      error: 'Failed to send complaint. Please try again later.',
      hint: 'Complaint',
    },
  };

  const copy = labels[lang] ?? labels.ru;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitFeedback({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: copy.subject,
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err?.message || copy.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSuccess(false);
          setError('');
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-white shadow-lg border border-gray-200 px-3 py-2 hover:shadow-xl transition-shadow"
        title={copy.title}
        aria-label={copy.title}
      >
        <Image src={eotinishIcon} alt="e-Otinish" width={28} height={28} className="w-7 h-7 object-contain" />
        <span className="text-xs font-semibold text-gray-700 hidden sm:inline">{copy.hint}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900">{copy.modalTitle}</h3>
            <p className="mt-2 text-sm text-gray-600">{copy.modalText}</p>
            <p className="mt-1 text-xs text-gray-500">{COMPLAINT_EMAIL}</p>

            {success ? (
              <div className="mt-4">
                <p className="text-sm text-green-700">{copy.success}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  {copy.close}
                </button>
              </div>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-600">{copy.name}</span>
                  <input
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-600">{copy.email}</span>
                  <input
                    required
                    type="email"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-600">{copy.message}</span>
                  <textarea
                    required
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    value={form.message}
                    onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? copy.sending : copy.send}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {copy.close}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

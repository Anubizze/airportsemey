'use client';

import { useState } from 'react';

export default function ServicePhotoPreview({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/3] bg-gray-200">
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-gray-600">
          <span className="font-medium">Фото недоступно</span>
          <span>Нажмите «Редактировать», чтобы заменить изображение.</span>
          <button type="button" onClick={() => setFailed(false)} className="rounded-lg border border-gray-400 px-3 py-1.5 hover:bg-white">Повторить загрузку</button>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

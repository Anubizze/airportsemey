# Аэропорт Семей

```
airport/
├── frontend/   # Next.js — сайт (деплой на Vercel)
└── backend/    # NestJS — API (локально)
```

## Деплой фронтенда на Vercel (через GitHub)

1. Репозиторий: https://github.com/Anubizze/airportsemey
2. [vercel.com/new](https://vercel.com/new) → Import Git Repository → выбери **airportsemey**
3. **Root Directory:** `frontend` (обязательно)
4. Framework: **Next.js** (определится автоматически)
5. **Environment Variables:**
   - `NEXT_PUBLIC_API_BASE_URL` = `https://твой-api.kz/api` (когда backend будет на сервере)
6. Deploy

После каждого `git push` в `main` Vercel пересоберёт сайт автоматически.

## Локальная разработка — фронтенд

```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:3000

Скопируй `frontend/.env.local.example` → `frontend/.env.local` и укажи URL API.

## Бэкенд (локально)

```bash
cd backend
pnpm install
pnpm dev
```

API: http://localhost:4000/api

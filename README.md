# Аэропорт Семей

Фронтенд сайта `https://abaiairport.kz`. В репозитории хранится только фронтенд; API подключается отдельно.

```
airport/
└── frontend/   # Next.js — сайт
```

## Деплой фронтенда на Dokploy через Nixpacks

1. Репозиторий: `https://github.com/Anubizze/airportsemey`, ветка `main`.
2. В настройках Git укажи **Build Path:** `/frontend`.
3. В **Build Type** выбери **Nixpacks** и сохрани настройки.
4. **Publish Directory** оставь пустым: сайт запускается сервером Next.js.
5. Поля переопределения команд Install / Build / Start оставь пустыми. Удали старые переменные `NIXPACKS_INSTALL_CMD`, `NIXPACKS_BUILD_CMD`, `NIXPACKS_START_CMD`, если они заданы: они перекрывают конфигурацию из репозитория.
6. В **Environment** укажи `NEXT_PUBLIC_API_BASE_URL=https://abaiairport.kz/api` (или фактический публичный адрес API). Значение встраивается в клиентский код при сборке; после изменения нужен новый Deploy.
7. В **Domains** укажи порт приложения **3000**, затем нажми **Deploy**.

Конфигурация находится в `frontend/nixpacks.toml`: Node.js 20 из `package.json`, установка через pnpm по `pnpm-lock.yaml` вместе с зависимостями для сборки, `pnpm run build` и `pnpm run start`. Сервер слушает `0.0.0.0`; порт по умолчанию — 3000, его можно изменить переменной `PORT` вместе с портом в Domains. Dockerfile при выбранном Nixpacks не используется.

Если в логе снова появляется `npm ci`, проверь выбранный Build Type, Build Path и переопределения команд. Nixpacks также собирает Docker-образ и требует доступа сервера к реестрам образов и пакетов.

Документация: [Dokploy — Build Type](https://docs.dokploy.com/docs/core/applications/build-type), [Nixpacks — Node](https://nixpacks.com/docs/providers/node).

## Деплой фронтенда на Vercel (через GitHub)

1. Репозиторий: https://github.com/Anubizze/airportsemey
2. [vercel.com/new](https://vercel.com/new) → Import Git Repository → выбери **airportsemey**
3. **Root Directory:** `frontend` (**обязательно** — без этого сборка падает: «Couldn't find app directory»)
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

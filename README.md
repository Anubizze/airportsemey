# Аэропорт Семей

Фронтенд сайта `https://abaiairport.kz`. В репозитории хранится только фронтенд; API подключается отдельно.

```
airport/
└── frontend/   # Next.js — сайт
```

## Деплой на Dokploy готовым образом из GitHub Actions

Этот вариант собирает приложение на GitHub и не требует установки Node.js, pnpm или пакетов Nix внутри сборочных контейнеров на сервере Dokploy. Самому серверу по-прежнему нужен доступ к `ghcr.io` для загрузки образа.

1. После изменений в `frontend/` в ветке `main` автоматически запускается [Publish frontend image](https://github.com/Anubizze/airportsemey/actions/workflows/publish-image.yml). Его также можно запустить вручную через **Run workflow** в ветке `main`.
2. Workflow собирает Linux amd64 образ, проверяет HTTP-ответ главной страницы и загрузку CSS из контейнера, затем публикует `ghcr.io/anubizze/airportsemey:latest` и тег с полным SHA коммита. Сборка использует встроенный `GITHUB_TOKEN`; отдельный секрет для публикации не нужен.
3. Дождись зелёного статуса workflow. Новый пакет GHCR по умолчанию приватный, даже если репозиторий публичный. Для доступа Dokploy открой **Settings → Registries**, добавь Registry URL `ghcr.io`, Username `Anubizze` и в Password — GitHub **Personal access token (classic)** с правом `read:packages`. Токен вводи только в Dokploy, не добавляй его в файлы репозитория или чат.
4. В приложении Dokploy в **General → Provider** вместо Git/GitHub выбери **Docker** (Docker Image). Укажи **Docker Image:** `ghcr.io/anubizze/airportsemey:latest` и выбери созданный реестр. Если интерфейс предлагает Username / Password / Registry URL прямо в настройках Docker provider, укажи те же данные там.
5. В **Advanced → Build Server** оставь **Build Server = None** и **Build Registry = None**. В **Domains** порт приложения — **3000**, путь — `/`. Убери старые переопределения команды запуска, если они были заданы: образ уже запускает `node server.js`.
6. Сохрани настройки и нажми **Deploy**. Dokploy скачает готовый образ и запустит его; Nixpacks и Build Path для Docker provider не используются.

Если образ можно публиковать открыто, вместо токена можно один раз открыть [пакет airportsemey](https://github.com/users/Anubizze/packages/container/package/airportsemey) → **Package settings → Change visibility → Public**. После этого Docker provider сможет скачивать образ без логина и пароля. Публичный образ будет доступен любому; приватный репозиторий для этого делать публичным не требуется.

При следующих обновлениях дождись завершения workflow, затем нажми **Deploy** в Dokploy. Автоматический вызов деплоя Dokploy в workflow не настроен. Для отката можно указать образ с SHA нужного коммита вместо `latest`.

По умолчанию API — `https://abaiairport.kz/api`. Для другого URL создай переменную репозитория **Settings → Secrets and variables → Actions → Variables → New repository variable**: `NEXT_PUBLIC_API_BASE_URL`, затем запусти workflow заново. Это публичная переменная, она встраивается в клиентский JavaScript при сборке; изменение Environment только в Dokploy не пересобирает готовый образ.

Документация: [Dokploy — Going Production](https://docs.dokploy.com/docs/core/applications/going-production), [GitHub — Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## Альтернатива: Dokploy через Nixpacks

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

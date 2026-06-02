# Аэропорт Семей — сайт

Монорепозиторий: фронтенд + бэкенд.

```
airport/
├── frontend/   # Next.js (сайт)
├── backend/    # NestJS (API, БД, синхронизация рейсов)
└── package.json
```

## Запуск локально

```bash
# из корня — оба сервера сразу
npm install
npm run dev
```

- Сайт: http://localhost:3000  
- API: http://localhost:4000  

### Отдельно

```bash
# бэкенд
cd backend
cp .env.example .env   # заполнить переменные
pnpm install
pnpm start:dev

# фронтенд
cd frontend
npm install
npm run dev
```

# Expense

Next.js frontend for the Expense tracker. Talks to the Laravel API in the sibling `expense` repo via Sanctum Bearer tokens.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the Laravel host (Herd: `http://expense.test`).

## Apps

| Route | Notes |
| --- | --- |
| `/` | Custom landing page (not shadcn) |
| `/login` | shadcn login form → `POST /api/v1/login` |
| `/dashboard` | Protected; uses TanStack Query + `GET /api/v1/me` / `dashboard` |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint

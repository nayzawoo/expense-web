# Expense Web

[![CI](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml/badge.svg)](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml)

Next.js frontend for a household expense tracker. Authenticates against the Laravel API (`expense`) with Sanctum personal access tokens and renders dashboard + admin management UI.

## Stack

- **Next.js 16** (App Router, `proxy.ts` route guards)
- **React 19** + **TanStack Query**
- **shadcn/ui** (Base UI) for app chrome
- **Tailwind CSS 4** + **Recharts**
- **Lucide** icons (category icons by name)

## Prerequisites

- Node.js 22+
- Sibling Laravel API running (Herd: `http://expense.test`) with `FRONTEND_URL` pointing at this app (default `http://localhost:3000`)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Laravel origin, no trailing slash (e.g. `http://expense.test` or your production API) |

On Vercel, set `NEXT_PUBLIC_API_URL` to a publicly reachable HTTPS API. On Laravel, set `FRONTEND_URL` (and CORS) to your Vercel origin.

## What it covers

| Area | Routes |
| --- | --- |
| Landing | `/` |
| Auth | `/login` → `POST /api/v1/login` |
| Dashboard | `/dashboard` |
| Accounts | `/accounts`, `/accounts/new`, `/accounts/[id]/edit` |
| Categories | `/categories`, `/categories/new`, `/categories/[id]/edit` |
| Users (admin) | `/users`, `/users/new`, `/users/[id]/edit` |

API client code lives under `lib/api/*`. Protected routes require the `expense_token` cookie (mirrored from `localStorage` after login).

## Scripts

```bash
npm run dev      # local development
npm run lint     # ESLint
npm run build    # production build
npm run start    # serve production build
```

CI runs lint, TypeScript check, and build on every push and pull request to `main`.

## Related

- Backend: [`expense`](https://github.com/nayzawoo/expense) — Laravel API + Inertia admin

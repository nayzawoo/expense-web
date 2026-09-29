# Expense Web

[![CI](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml/badge.svg)](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml)

Next.js frontend for a household expense tracker — landing page, auth, dashboard, and admin management for accounts, categories, and users.

## Stack

- **Next.js 16** (App Router)
- **React 19** + **TanStack Query**
- **shadcn/ui** + **Tailwind CSS 4**
- **Recharts** + **Lucide** icons

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires Node.js 22+.

### Environment

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API origin (no trailing slash) |

## Routes

| Area | Paths |
| --- | --- |
| Landing | `/` |
| Auth | `/login` |
| Dashboard | `/dashboard` |
| Accounts | `/accounts`, `/accounts/new`, `/accounts/[id]/edit` |
| Categories | `/categories`, `/categories/new`, `/categories/[id]/edit` |
| Users | `/users`, `/users/new`, `/users/[id]/edit` |

## Scripts

```bash
npm run dev        # development server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # serve production build
```

CI runs lint, typecheck, and build on every push and pull request to `main`.

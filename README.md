# Expense Web

[![CI](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml/badge.svg)](https://github.com/nayzawoo/expense-web/actions/workflows/ci.yml)

Next.js frontend for a household expense tracker — landing, auth, dashboard, spending/income logs, transfers, analytics, settings, and admin management.

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
| `NEXT_PUBLIC_API_URL` | Backend API origin, no trailing slash (e.g. `https://api.example.com`) |

Auth uses Bearer tokens. After login, the token is stored in `localStorage` (`expense_token`). A separate `expense_authenticated=1` cookie is set only as a route-guard hint for `proxy.ts` — it never contains the Bearer token.

## App routes

| Area | Paths |
| --- | --- |
| Landing | `/` |
| Auth | `/login` |
| Dashboard | `/dashboard` |
| Expenses | `/expenses`, `/expenses/new`, `/expenses/[id]/edit` |
| Incomes | `/incomes`, `/incomes/new` |
| Transfers | `/transfers`, `/transfers/new` |
| Analytics | `/analytics` |
| Accounts | `/accounts`, `/accounts/new`, `/accounts/[id]/edit` |
| Categories | `/categories`, `/categories/new`, `/categories/[id]/edit` |
| Users | `/users`, `/users/new`, `/users/[id]/edit` |
| Settings | `/settings/profile`, `/settings/security`, `/settings/appearance` |

## API (`/api/v1`)

Base URL: `{NEXT_PUBLIC_API_URL}/api/v1`

### Auth & profile

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/login` | `{ email, password, device_name? }` → `{ token, token_type, user }` |
| `GET` | `/me` | Current user (Bearer) |
| `POST` | `/logout` | Revoke current token |
| `PUT` | `/profile` | Update name & email |
| `PUT` | `/password` | Update password (`current_password`, `password`, `password_confirmation`) |

### Household data

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/dashboard` | Dashboard summary |
| `GET` | `/analytics` | Monthly analytics |
| `GET` | `/accounts` | List accounts + balances |
| `GET`/`POST` | `/expenses`, `/expenses/create` | Log & create form options |
| `GET`/`PUT`/`DELETE` | `/expenses/{id}` | Show / update / delete |
| `GET`/`POST` | `/incomes`, `/incomes/create` | Log & create form options |
| `DELETE` | `/incomes/{id}` | Delete income |
| `GET`/`POST` | `/transfers`, `/transfers/create` | Transfer log & form options |
| `DELETE` | `/transfers/{id}` | Delete transfer |

### Admin (admin users only)

| Method | Path | Notes |
| --- | --- | --- |
| CRUD | `/users`, `/users/{id}` | User management |
| CRUD + reorder | `/categories`, `/categories/{id}`, `/categories/{id}/reorder/{up\|down}` | Categories |
| `POST`/`GET`/`PUT` | `/accounts`, `/accounts/{id}` | Account create / show / update |
| `PATCH` | `/accounts/{id}/toggle-active` | Activate / deactivate |

Client wrappers live under `lib/api/*`.

## Scripts

```bash
npm run dev        # development server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # serve production build
```

CI runs lint, typecheck, and build on every push and pull request to `main`.

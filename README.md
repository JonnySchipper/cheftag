# Cheftag Solutions

Food-label and expiration management for restaurant kitchens. The UI is optimized for tablets and phones: a four-item shell (Home, Labels, Print, More), a global **PRINT** floating action, and a **New label** floating action.

## Stack

- Next.js 16 (App Router), React 19, Tailwind 4, shadcn/ui v4 (`@base-ui/react`)
- Zustand with `localStorage` persistence (mock data in `src/lib/mock-data.ts`)
- Lucide icons

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/dashboard`).

## Navigation

| Shell | Routes |
|--------|--------|
| **Home** | `/dashboard` |
| **Labels** | `/labels` (keyboard `n` or `?action=new` opens new label) |
| **Print** | `/printing` + global PRINT FAB (quick sheet) |
| **More** | Sheet: Reports, Products, Employees, Groups, Devices, Preservation Modes, Settings |

Desktop (`xl+`): sidebar mirrors the same four sections.

## Scripts

```bash
npm run lint
npm run build
```

## Print server (optional)

See `docs/RASPBERRY_PI_SETUP.md` and `print-server/` for the Raspberry Pi bridge. The app simulates printing in the browser until a real endpoint is wired in `src/lib/print-utils.ts`.

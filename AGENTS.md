# Cheftag Solutions

Modern food-label & expiration management system for restaurants.

## Cursor Cloud specific instructions

### Project overview

Single Next.js 16 (App Router) application with routes: Dashboard, Labels, Printing, Reports, Products, Employees, Groups, Devices, Preservation Modes, Settings. Uses React 19, Tailwind CSS, and shadcn/ui v4 (base-ui backed, not Radix). All data is mock (Zustand + localStorage persistence).

### Shell / navigation

- **Mobile & tablet (`< xl`)**: Bottom nav with four items — Home (`/dashboard`), Labels (`/labels`), Print (`/printing`), More (bottom sheet linking to Reports + all admin routes). Header: logo, prominent global search, theme toggle, user menu.
- **Desktop (`xl+`)**: Left sidebar with the same four sections; `More` opens the same sheet as mobile.
- **Global PRINT FAB** (`BigPrintFab`): Always visible; opens `PrintQuickSheet` (queue + “Print all now”). New labels are auto-added to the print queue and `highlightPrintAfterCreate` pulses the FAB until dismissed.
- **New label FAB** (`NewLabelFab`): Opens new-label sheet from any screen.
- **Legacy import**: `mobile-nav.tsx` re-exports `KitchenBottomNav` for compatibility.

### Running the app

```
npm run dev
```
Dev server starts at http://localhost:3000, auto-redirects to /dashboard.

### Lint and build

```
npm run lint
npm run build
```

### Key caveats

- **shadcn/ui v4 API**: Components use `@base-ui/react` instead of Radix. Use `render={<Component />}` instead of `asChild` on Trigger components (SheetTrigger, DropdownMenuTrigger, DialogTrigger, etc.).
- **Select onValueChange**: The base-ui Select's `onValueChange` can pass `null`. Always guard with `(v) => v && ...` or `(v) => setValue(v ?? "default")`.
- **React Compiler warnings**: `react-hooks/incompatible-library` and `react-hooks/purity` are set to `warn` in eslint config since we use React Hook Form's `watch()` and `Date.now()` in event handlers.
- **Mock data**: Generated randomly in `/src/lib/mock-data.ts` on import. Data persists in localStorage via Zustand persist middleware.
- **i18n**: All UI strings use `t("key")` from `/src/lib/i18n.ts`. English dictionary only for now; add pt-BR dictionary to extend.
- **No real auth**: User switching is via the avatar dropdown in the header (mock employees).
- **Printing**: Simulated via console.log. Search for `// TODO: real Raspberry Pi endpoint` to find integration points.

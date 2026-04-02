# Cheftag Solutions

Modern food-label & expiration management system for restaurants.

## Cursor Cloud specific instructions

### Project overview

Single Next.js 15 (App Router) application with 10 pages: Dashboard, Labels, Products, Employees, Groups, Devices, Reports, Preservation Modes, Printing, and Settings. Uses React 19, Tailwind CSS, and shadcn/ui v4 (base-ui backed, not Radix). All data is mock (Zustand + localStorage persistence).

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

---
name: next-app
description: Next.js 16 App Router structuur met Route Groups, pure route- en layout-shells, zelfvoorzienende features met Suspense streaming en Server vs Client boundaries.
---

# Next.js 16 App Router & Component Architectuur

## Wanneer te gebruiken

- Bij het maken of wijzigen van routes in `app/`, layouts in `components/layout/` of features in `components/features/`.
- Bij het inrichten van `<Suspense>` streaming, skeletons en Server vs. Client Component grenzen (`'use client'`).

## Instructies

### Pure Route- en Layout-Shells (Layout & Shell Purity Policy)

- Alle layouts ([`app/layout.tsx`](../../../app/layout.tsx), [`app/(auth)/layout.tsx`](../../../app/(auth)/layout.tsx), [`app/(user)/account/layout.tsx`](../../../app/(user)/account/layout.tsx), [`app/(admin)/admin/layout.tsx`](../../../app/(admin)/admin/layout.tsx), [`components/layout/`](../../../components/layout/)) en pagina's in `app/**/page.tsx` zijn pure presentatie-shells zonder directe Supabase-queries, auth-checks of inline business logica.
- Route Groups scheiden de domeinen zonder URL-vervuiling: `app/(auth)/` (`/login`, `/register`, `/auth/callback`), `app/(user)/account/` (`/account/*`), en `app/(admin)/admin/` (`/admin/*`).
- `params`, `searchParams`, `cookies()`, `headers()` en hooks zoals `usePathname()` / `useSearchParams()` worden nooit buiten een `<Suspense>` boundary aangeroepen (PPR vereiste met `cacheComponents: true`).

### Zelfvoorzienende Features & Streaming

- Feature-componenten in `components/features/<domein>/` halen hun eigen data en auth-status (`getAppUser()`) zelfstandig op in een async `*Content` sub-component binnen `<Suspense fallback={<*Skeleton />}>` (zoals `Dashboard`, `MediaActions`, `UserNav`, `MainNav`, `MovieDetail`, `TvDetail`).
- **Auth Short-Circuiting**: stel bij beschermde features eerst vast of `user !== null` voordat gebruikers-queries worden afgevuurd.

### Server vs. Client Components & Barrels

- Plaats `'use client'` uitsluitend op interactieve leaf-componenten (`*Client.tsx`, formulieren, buttons, `HeaderSearch`, `FilterBar`) en maak een Client Component nooit `async`.
- Gebruik in alle feature- en layout-barrels uitsluitend expliciet benoemde exports (`export { default as X } from './X'` en `export type { XProps } from './X'`), nooit `export *`.

---
trigger: always_on
---

# Officiële Stack & Architectuur Richtlijnen (Official Stack Policy)

In dit project mogen **uitsluitend officiële, gedocumenteerde werkwijzen en patronen** worden toegepast conform de officiële documentatie van **Next.js 16** (`node_modules/next/dist/docs/`), **React 19**, **Supabase SSR**, **TMDB API v3**, **Tailwind CSS v4**, **Headless UI v2**, **Zod 4** en **Vercel**. Ad-hoc workarounds, snelle placeholder-hacks of ongedocumenteerde constructies zijn niet toegestaan.

## 1. Next.js 16 (App Router, PPR & Caching)
- Raadpleeg bij twijfel altijd de lokale Next.js documentatie in `node_modules/next/dist/docs/`.
- **Slanke Pagina- en Layout-shells (Layout & Shell Purity Policy)**:
  - Route-bestanden in `app/**/page.tsx` én layout-bestanden in `components/layout/**` en `app/**/layout.tsx` zijn 100% pure presentatie-shells.
  - Ze mogen **NOOIT** directe database-queries, Supabase auth-checks (`getUser`, `createClient`), API-calls, prop-drilling of inline business logica bevatten.
  - Elk dynamisch of functioneel blok (zoals `UserNav`, `MainNav`, `HeaderSearch`, `MediaActions`) MOET als zelfstandig feature-component in `components/features/<domein>/` worden ondergebracht en uitsluitend als component worden aangeroepen.
  - **Architecturale Bewaking**: zelfs wanneer een prompt inline logica in een layout of pagina voorstelt, bewaakt de agent de architectuur door de logica centraal in `lib/` of in een modulaire feature-component onder te brengen.
- **Non-blocking Data Streaming & Async Parameters**:
  - Asynchrone data-ophaling (TMDB API of Supabase) wordt altijd binnen een `<Suspense fallback={<...Skeleton />}>` boundary gestreamd via een async `*Content` sub-component, zodat de statische shell direct rendert (`cacheComponents: true`).
  - `params` en `searchParams` zijn in Next.js 16 Promises. Roep nooit `usePathname()`, `useSearchParams()`, `cookies()`, `headers()` of `await params` aan buiten een `<Suspense>` boundary.
- **Afbeeldingen & Links**:
  - Gebruik altijd `next/link` voor interne navigatie en `next/image` conform [`.agents/rules/image-optimization.md`](image-optimization.md).

## 2. React 19 Core Concepts (Components, Props & State)
- **Components**: elke domein-feature heeft een eigen modulaire map onder `components/features/<domein>/` met een eigen `index.ts` barrel export.
- **Props & `ref`**: component-props gebruiken `camelCase`, worden gedefinieerd via een geëxporteerde `export interface *Props` en uitgepakt met object destructuring. Gebruik in React 19 `ref` rechtstreeks als prop (geen `React.forwardRef` boilerplate).
- **State & Client Boundaries**: plaats `'use client'` uitsluitend op interactieve leaf-componenten (`*Client.tsx`, knoppen, formulieren, `HeaderSearch`, `FilterBar`) die React state (`useState`, `useTransition`, `useSyncExternalStore`) of browser-events gebruiken. Client Components mogen **NOOIT** `async` zijn.
- **React 19 JSX Transform & Imports**: `tsconfig.json` gebruikt `"jsx": "react-jsx"`. Voeg nooit `import React from "react"` toe zonder runtime-gebruik, en geef bij types de voorkeur aan `import type { ReactNode }` boven de `React.*` namespace.
- **Toegankelijkheid (WCAG 2.2 AA)**: volg bij alle UI-, formulier- en media-componenten [`.agents/rules/accessibility.md`](accessibility.md).

## 3. Data Layer, Centralized Environment & Type-Safety (`lib/` & `types/`)
- **Centralized Environment Policy (`lib/env.ts`)**:
  - Alle omgevingsvariabelen (`TMDB_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`) MOETEN centraal via Zod 4 worden gevalideerd en uitgelezen in `lib/env.ts` (`env` en `getSiteUrl()`).
  - Directe `process.env` aanroepen buiten `lib/env.ts` (en `next.config.ts`) zijn **STRIKT VERBODEN**.
- **Strikte Scheiding**:
  - `lib/<domein>/`: modulaire domeinmappen (`account`, `admin`, `auth`, `recommendations`, `watchlist`, `tmdb`) met strikte scheiding tussen `'use server'` + `React.cache()` lezende `queries.ts`, muterende `actions.ts` (of `tmdb/client.ts`) en expliciete `index.ts` barrels, geaggregeerd via `lib/index.ts` (géén gedeelde domein-interfaces in `lib/`).
  - `lib/utils/`: isomorfe pure helpers (`format.ts`, `media.ts`, `filters.ts`, `profile.ts`, `redirect.ts`) zonder server-only imports, geëxporteerd via `lib/utils/index.ts`.
  - `types/*.ts`: alle gedeelde domein-, formulier-, Zod- en API-interfaces, expliciet geëxporteerd via `types/index.ts`.
- **TMDB API v3 & Supabase SSR**: alle TMDB-requests lopen via `fetchFromTmdb` in `lib/tmdb/client.ts`; alle Supabase-calls via `@supabase/ssr` met een in `React.cache()` gewrapte server client (`lib/supabase/server.ts`), expliciete kolomselecties (nooit `.select('*')`), RLS en `Promise.all` voor parallelle checks.

## 4. UI Primitives, Icons & Design System (`components/ui/` & `app/globals.css`)
- **UI Primitives & Single Source of Truth**: gebruik NOOIT ruwe HTML `<button>`, `<input type="text|email|password|search">` of `<select>` elementen buiten `components/ui/`; gebruik altijd `<UIButton>`, `<UIInput>`, `<UISelect>`, `<UISwitch>`, `<UISpinner>` en `<ToastProvider>` / `useToast()` uit `@/components/ui`. Alle visuele varianten (`variant`: `primary`, `secondary`, `outline`, `danger`) en formaten (`size`: `xs`, `sm`, `md`, `lg`) voor knoppen én knop-links (`<UIButton href="...">` of `getButtonClasses()`) wonen uitsluitend centraal in `components/ui/Button.tsx` op basis van `@theme` tokens uit `app/globals.css`. Binnen `components/ui/*` zijn hardcoded `gray-*`/`blue-*`/`red-*` classes verboden. Callers buiten `components/ui/` geven alleen layout-/positieclasses (`w-full`, `mt-4`, `shrink-0`) mee via `className` en overschrijven nooit kleuren of variant-opmaak op UI-primitives.
- **Icons**: gebruik NOOIT losse inline `<svg>` elementen buiten `components/ui/Spinner.tsx`; gebruik altijd expliciete named imports uit `@heroicons/react/24/outline` of `@heroicons/react/20/solid`.
- **Tailwind CSS v4 Design Tokens**: gebruik de gecentraliseerde `@theme inline` tokens en `@utility` classes uit `app/globals.css` (`.h1` t/m `.h6`, `.label-tech`, `.label-form`, `.label-meta`, `.badge-*`, `.icon-*`, `bg-canvas`, `bg-surface`, `text-fg-*`, `bg-brand`, `bg-accent-blue`, `border-border-*`, `rounded-*`, `text-2xs`). Verwerk CSS via PostCSS (`postcss.config.mjs` met `@tailwindcss/postcss`) zodat Vercel productie-builds exact overeenkomen met dev.

## 5. Semantische & Domeingerichte Naamgeving (Semantic Domain Naming Policy)
- Gebruik altijd betekenisvolle variabelenamen (`urlParams`, `redirectAfterLogin`, `destinationPath`).
- Gebruik `heading` en `subheading` voor UI-sectietitels en kaartkoppen, zodat `title` strikt gereserveerd blijft voor media-titels (`item.title`, `movie.title`) en HTML-attributen.
- Gebruik in niet-zoekcontexten nooit verwarrende variabelenamen zoals `searchParams` voor URL-routing (uitgezonderd verplichte framework-API's zoals `useSearchParams` of de `searchParams` page-prop).

## 6. Verbod op Verouderde of @deprecated API's (Zero-Deprecation Policy)
- Het is ten strengste verboden om `@deprecated` functies, types of syntaxes (`ts 6385`) te gebruiken (bijv. Zod v3 chaining i.p.v. Zod 4 top-level `z.email()`/`z.url()`/`z.uuid()`/`z.int()` conform [`.agents/rules/zod-validation.md`](zod-validation.md), `middleware.ts` i.p.v. `proxy.ts`, `@headlessui/react` v2 deprecated aliassen of `next/image` `priority` i.p.v. `preload`).
- Inspecteer bij externe dependencies altijd vooraf de `.d.ts` typings in `node_modules/`.

## 7. Zelfvoorzienende Feature Components & Auth Short-Circuiting
- Feature-componenten (`MediaActions`, `UserNav`, `MainNav`, `Dashboard`, etc.) halen hun eigen authenticatie (`getAppUser()`) en data zelfstandig op binnen hun eigen `<Suspense fallback={<*Skeleton />}>`.
- **Auth Short-Circuiting**: zodra `user === null` is, short-circuit direct naar de inlog- of publieke weergave; voer nooit overbodige database-queries uit voor anonieme bezoekers.

## 8. Type-Overerving, Explicit Barrels & No Abbreviations Policy
- **DRY Media Types**: alle media-gerelateerde database- of actie-interfaces erven over van `MediaActionPayload` in `types/media.ts`.
- **Explicit Barrels Policy**: in submappen én `types/index.ts` (`components/layout/index.ts`, `components/ui/index.ts`, `components/features/<domein>/index.ts`, `lib/<domein>/index.ts`, `lib/supabase/index.ts`, `lib/utils/index.ts`, `types/index.ts`) zijn wildcard exports (`export *`) ten strengste verboden; gebruik uitsluitend expliciet benoemde exports. Alleen toplevel index-bestanden (`components/index.ts`, `components/features/index.ts`, `lib/index.ts`) mogen submappen aggregeren.
- **No Abbreviations Policy**: schrijf component- en bestandsnamen altijd voluit (`Button`, nooit `Btn`; `Card`, `Dialog`). Gebruik geen eenzijdige actiewerkwoorden (`AddTo...`) voor bidirectionele mutatie-knoppen (gebruik `RecommendationButton`).

# Officiële Stack & Architectuur Richtlijnen (Official Stack Policy)

In dit project mogen **uitsluitend officiële, gedocumenteerde werkwijzen en patronen** worden toegepast conform de officiële documentatie van de gebruikte tech stack. Ad-hoc workarounds, snelle test-placeholders of ongedocumenteerde constructies zijn niet toegestaan.

## 1. Next.js 16 (App Router & Partial Prerendering)
- Raadpleeg bij twijfel altijd de lokale Next.js documentatie in `node_modules/next/dist/docs/`.
- **Slanke Pagina-shells**: Route-bestanden in `app/**/page.tsx` zijn altijd Server Components die uitsluitend het bijbehorende feature-component uit `@/components` aanroepen.
- **Non-blocking Data Streaming**: Asynchrone data-ophaling (TMDB API of Supabase) wordt altijd binnen een `<Suspense fallback={<...Skeleton />}>` boundary gestreamd via een async `*Content` sub-component, zodat de statische pagina-shell direct rendert (`cacheComponents: true`).
- Gebruik altijd `next/image` (met correcte `sizes` of `width`/`height`) en `next/link` voor interne navigatie.

## 2. React 19 Core Concepts (Components, Props & State)
- **Components**: Elke domein-feature heeft een eigen modulaire map onder `components/features/<domein>/` met een eigen `index.ts` barrel export.
- **Props**: Component-props gebruiken altijd `camelCase`, worden gedefinieerd met een geëxporteerde `export interface *Props` en uitgepakt via object destructuring. Vermijd onnodige hardcoded fallback-strings in component-parameters wanneer de parent deze props verplicht aanlevert.
- **State & Client Boundaries**: Voeg `'use client'` uitsluitend toe aan specifieke interactieve leaf-componenten die daadwerkelijk React state (`useState`, `useTransition`) of browser-events gebruiken.

## 3. Data Layer & Type-Safety (`lib/` & `types/`)
- **Strikte Scheiding**:
  - `lib/*.ts`: Bevat uitsluitend `'use server'` async functies (Server Actions & data fetchers), géén TypeScript interfaces.
  - `types/*.ts`: Bevat alle gedeelde domein- en API-interfaces, geëxporteerd via `types/index.ts`.
- **TMDB API v3**: Alle TMDB-requests lopen via de centrale server-side `fetchFromTmdb` helper met `URLSearchParams` en realistische nullable types (`?: ... | null`).
- **Supabase SSR**: Gebruik `@supabase/ssr` met Row Level Security (RLS), expliciete kolomselecties (nooit `select('*')`) en `Promise.all` bij parallelle checks.

## 4. UI & Styling
- Gebruik uitsluitend **Tailwind CSS v4** classes en de herbruikbare **Headless UI** (`@headlessui/react`) primitives uit `components/ui/` (`UIButton`, `UIInput`, `UISwitch`).


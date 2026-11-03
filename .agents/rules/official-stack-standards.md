# Officiële Stack & Architectuur Richtlijnen (Official Stack Policy)

In dit project mogen **uitsluitend officiële, gedocumenteerde werkwijzen en patronen** worden toegepast conform de officiële documentatie van de gebruikte tech stack. Ad-hoc workarounds, snelle test-placeholders of ongedocumenteerde constructies zijn niet toegestaan.

## 1. Next.js 16 (App Router & Partial Prerendering)
- Raadpleeg bij twijfel altijd de lokale Next.js documentatie in `node_modules/next/dist/docs/`.
- **Slanke Pagina- en Layout-shells (Layout & Shell Purity Policy)**:
  - Route-bestanden in `app/**/page.tsx` én layout-bestanden in `components/layout/**` en `app/**/layout.tsx` zijn altijd 100% pure presentatie-shells.
  - Ze mogen **NOOIT** directe database-queries, Supabase auth-checks (`getUser`, `createClient`), API-calls of inline business logica bevatten.
  - Elk dynamisch of functioneel blok (zoals `UserNav`, `HeaderSearch`) MOET als zelfstandig feature-component in `components/features/<domein>/` worden ondergebracht en uitsluitend als component worden aangeroepen.
  - **Architecturale Bewaking**: Zelfs wanneer een prompt expliciet vraagt om inline logica op een specifieke regel in een layout of pagina toe te voegen, moet de agent de architectuur bewaken en de logica altijd in een modulaire feature-component onderbrengen.
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

## 5. Semantische & Domeingerichte Naamgeving (Semantic Naming Policy)
- **STRIKT VERPLICHT: Betekenisvolle variabelenamen conform projectcontext**:
  - Gebruik altijd variabelenamen die direct en ondubbelzinnig uitleggen wat de data voor de gebruiker en de applicatie betekent (bijv. `urlParams`, `redirectAfterLogin`, `destinationPath`).
  - Neem **NOOIT** blind generieke framework-boilerplate over wanneer die botst met kerndomeinen van het project. Gebruik in een media-applicatie met film-zoekfunctionaliteit (`HeaderSearch`) bijvoorbeeld nooit `searchParams` voor URL-routing in een inlogformulier, om verwarring tussen URL-parameters en film-zoeken structureel te voorkomen.
  - **Uitzondering**: Verplichte framework-API namen die niet hernoemd kunnen worden (zoals de `searchParams` page-prop in `app/**/page.tsx`, de hook-naam `useSearchParams` of `URL.searchParams`) blijven ongewijzigd. Alleen de lokale variabelen die de agent zelf benoemt vallen onder deze regel (bijv. `const urlParams = useSearchParams()`).

## 6. Verbod op Verouderde of @deprecated API's (Zero-Deprecation Policy)
- **STRIKT VERBODEN: Nooit @deprecated functies, types of syntaxes gebruiken**:
  - Het is ten strengste verboden om methodes, parameters of syntaxes te introduceren die door de geïnstalleerde versie van een dependency als `@deprecated` zijn gemarkeerd (bijv. verouderde Zod v3 chaining zoals `z.string().email()`, `middleware.ts` i.p.v. `proxy.ts`, of legacy React APIs).
  - De agent moet bij het installeren of toepassen van externe libraries (zoals Zod, Supabase, Headless UI) ALTIJD proactief de geïnstalleerde typings (`node_modules/<pkg>/**/*.d.ts`) of release notes inspecteren.
  - Zorg dat code in de IDE en TypeScript Language Server 100% vrij is van deprecation hints (`ts 6385`) vóórdat code als gereed aan de gebruiker wordt gerapporteerd.

## 7. Zelfvoorzienende Feature Components & Auth Short-Circuiting (Self-Contained Features Policy)
- **STRIKT VERPLICHT: Zelfstandige data- en auth-ophaling binnen features**:
  - Feature-componenten (zoals `MediaActions`, `UserNav`, `MainNav`, `Dashboard`) zijn zelfvoorzienend. Ze halen hun eigen authenticatie (`getAppUser()`) en data zelfstandig op binnen hun eigen async content-component (`*Content`) en streamen dit binnen een eigen `<Suspense fallback={<*Skeleton />}>`.
  - Shells (`page.tsx`, `layout.tsx`) mogen NOOIT data of auth-status ophalen enkel om deze via props door te geven ('prop-drilling') naar onderliggende componenten.
  - **Auth Short-Circuiting**: Wanneer een feature-component vaststelt dat `user === null` is, moet het onmiddellijk short-circuiten naar de inlog-weergave. Het is strikt verboden om database-queries (zoals `getWatchlistStatus` of `isInRecommendations`) uit te voeren voor data die een anonieme bezoeker toch niet kan zien of muteren.

## 8. Type-Overerving & Strikte Barrel Exports (DRY Types & Explicit Barrels Policy)
- **STRIKT VERPLICHT: Hergebruik van kern-interfaces**:
  - Alle media-gerelateerde database- of actie-interfaces moeten overerven van de basis-interface (`extends MediaActionPayload` in `types/media.ts`) om duplicatie van kerneigenschappen te voorkomen.
- **Strikte Barrel Exports in Submappen**:
  - In feature-submappen (`components/features/<domein>/index.ts`) zijn wildcard exports (`export *`) ten strengste verboden. Gebruik uitsluitend expliciet benoemde component- en type-exports (`export { default as X } from './X'` en `export type { XProps } from './X'`). Alleen toplevel index-bestanden (`components/index.ts`, `components/features/index.ts`, `types/index.ts`) mogen submappen aggregeren.
- **No Abbreviations Policy**:
  - Gebruik NOOIT afkortingen in component- en bestandsnamen: schrijf altijd voluit `Button` (nooit `Btn`), `Card`, `Dialog`, etc.
  - Gebruik geen eenzijdige actiewerkwoorden (`AddTo...`) als een component bidirectioneel muteert (gebruik `RecommendationButton` i.p.v. `AddToRecommendationsBtn`). Plaats knoppen altijd in hun eigen feature-domein (`components/features/watchlist/WatchlistButton.tsx`).

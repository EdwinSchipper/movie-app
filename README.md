# Movie App (Movie for Friends)

> **Status:** 🚧 In ontwikkeling (Work in Progress)
>
> **Huidige werkzaamheden:**
> - 📐 **Flowchart & Architectuur:** Flowcharts en navigatiestructuren uitwerken en visualiseren (Figma & Draw.io).
> - 🧩 **Pages & Components Audit:** Pages, componenthiërarchie en koppelingen controleren.
> - 📦 **Props, Promises & TypeScript:** Props, asynchrone Promise-afhandeling (`params`, `searchParams`) en de algehele TypeScript-opbouw controleren en bijwerken op kwaliteit.

Een moderne webapplicatie voor het ontdekken, bekijken en delen van films en series met vrienden, gebouwd met [Next.js](https://nextjs.org) (App Router), React 19, [Supabase](https://supabase.com) en Tailwind CSS.

---

## 📌 Projectoverzicht & Context

Dit project is momenteel in actieve ontwikkeling. Het doel is het bouwen van een interactief, high-performance platform waar gebruikers trending titels kunnen verkennen, door film- en seriecatalogi kunnen zoeken, gedetailleerde metadata kunnen bekijken en een persoonlijke Watchlist en aanbevelingen (Recommendations) kunnen beheren en delen.

Hieronder vind je een overzicht van de belangrijkste ontwikkelgebieden en hun huidige status:

### 🗺️ Ontwikkelstatus & Roadmap

| Onderdeel | Status | Omschrijving |
| :--- | :---: | :--- |
| **API Integration (TMDB)** | ✅ `Done` | TMDB API v3 geïntegreerd via één centrale server-side fetch-helper (`fetchFromTmdb`) voor trending films/series, detailpagina's, multi-search (`/search/multi`) en directe IMDb-ID herkenning (`/find/{id}`). |
| **Data Streaming & Performance** | ✅ `Done` | Server-side data fetching met Partial Prerendering (PPR), React Suspense streaming met skeleton fallbacks en geparalleliseerde database-checks (`Promise.all`). |
| **Role-Based Access Control (RBAC)** | ✅ `Done` | Strikte scheiding tussen normale gebruikers en administrators via Supabase RLS en Server Actions (`lib/auth.ts`, `lib/admin.ts`). Watchlist-isolatie per `user_id` en admin-only aanbevelingen. |
| **Authenticatie & Sessiebeheer** | ✅ `Done` | Supabase SSR auth met PKCE code exchange (`/auth/callback`), Next.js 16 `proxy.ts` sessie-verversing, `React.cache()` request deduplicatie, open-redirect mitigatie en router concurrency guard. |
| **Account & Profielbeheer (`/account`)** | ✅ `Done` | Persoonlijke gebruikerssectie met accountgegevens (`/account/profile`), gesegmenteerde Watchlist (*Watched* / *Not watched*) en persoonlijke weergave-instellingen (*Tiles aantal* en *Row/grid* weergave). |
| **Admin Beheeromgeving (`/admin`)** | ✅ `Done` | Beveiligd admin-dashboard met gebruikersoverzicht, rol- en rechtenbeheer (`/admin/users`), en moderatie van publieke aanbevelingen (`/admin/recommendations`). |
| **Component & Type Architectuur** | 🔄 `In Progress` | Flowcharts uitwerken, pages, componenten, props en promises (`params`/`searchParams`) en TypeScript-opbouw controleren en bijwerken op kwaliteit. |
| **Deployment & CI/CD** | ✅ `Done` | Geautomatiseerde continuous deployment via Vercel en CI kwaliteitscontroles via GitHub Actions. |
| **Design & Overzichtspagina's** | 📋 `To Do` | Definitief visual theme, dedicated overzichtspagina's voor Watchlist/Recommendations en responsive finetuning. |

### ⚡ Architectuur: Back-end, Data Stream & Front-end

De applicatie is opgezet met een strikte scheiding van verantwoordelijkheden en focus op maximale performance, data-integriteit en type-safety tussen back- en front-end:

- **Centrale & Getypeerde Omgevingsconfiguratie (`lib/env.ts`)**: Directe `process.env.*` aanroepen en onveilige non-null assertions (`!`) zijn structureel vervangen door één centrale, type-safe `env` module. Omgevingsvariabelen worden via Zod 4 schema's strikt gevalideerd (gescheiden in server- en publieke runtime variabelen) met fail-fast foutmeldingen. Daarnaast verzorgt `getSiteUrl()` intelligente origin-resolutie met automatische ondersteuning voor localhost, reverse-proxy headers en Vercel preview/productie deployments (`VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`).
- **TMDB Server-Side Data Layer (`lib/tmdb.ts`)**: Alle externe API-aanroepen verlopen uitsluitend server-side met Next.js data-caching (`revalidate`), veilige `URLSearchParams`-encoding en strikte nullable TypeScript-interfaces (`types/tmdb.ts`), zodat ontbrekende of niet-vertaalde TMDB-metadata nooit tot runtime crashes leidt.
- **Supabase Database & Security (`lib/watchlist.ts`, `lib/recommendations.ts`)**: Persistente data-opslag en mutaties (`upsert` / `delete`) lopen via server-side Supabase SSR-clients met Row Level Security (RLS) op PostgreSQL-niveau. Alle queries vragen uitsluitend expliciete kolommen op (geen `select('*')`) voor minimale bandbreedte en 1-op-1 overeenstemming met onze TypeScript-interfaces (`types/watchlist.ts`, `types/recommendations.ts`).
- **Non-blocking Data Streaming & Parallel Fetching**: Detail- en overzichtspagina's streamen asynchrone data binnen `<Suspense>` boundaries met directe skeleton fallbacks. Meerdere onafhankelijke database-checks (zoals Watchlist- en Recommendation-status) worden parallel uitgevoerd via `Promise.all` om request-waterfalls te voorkomen.
- **Supabase SSR Authenticatie & PKCE Callback (`app/(auth)/auth/callback/route.ts`)**: E-mailverificaties en OAuth-aanmeldingen verlopen conform de moderne PKCE-standaard (Proof Key for Code Exchange). De route-handler wisselt eenmalige verificatiecodes server-side in voor veilige `HttpOnly` sessie-cookies via `exchangeCodeForSession()`.
- **Sessiebeheer via Next.js 16 Proxy (`proxy.ts`)**: Sessies worden transparant ververst op elk binnenkomend request via de officiële Next.js 16 `proxy.ts` conventie (de opvolger van `middleware.ts`) met behulp van `@supabase/ssr` cookies-handlers (`getAll`/`setAll`).
- **Gededupliceerde Server-Side Auth (`lib/auth.ts`)**: Gebruikerssessie en rolbepaling (`AppUser`, `UserRole`) worden opgevraagd via `React.cache()` helpers (`getCurrentUser()`, `getAppUser()`). Hierdoor delen onafhankelijke componenten binnen één SSR-renderpass (`MainNav`, `UserNav`, `Dashboard`) dezelfde gegevens zonder herhaalde Supabase-aanroepen.
- **Centrale Isomorfe Helpers & Open-Redirect Beveiliging (`lib/utils/`)**: Alle pure, universele helpers voor datum-, rating-, speelduur- en mediatype-opmaak (`format.ts`), TMDB-afbeeldings- en detail-URL's + payload-validatie (`media.ts`), profielnormalisatie (`profile.ts`), mediafiltering (`filters.ts`) en open-redirect bescherming (`redirect.ts` via `getSafeRedirectPath`) zijn gebundeld onder `@/lib/utils`.

### 👤 Gebruikers- & Admin-architectuur (RBAC)

De applicatie hanteert een strikte scheiding tussen normale gebruikers en administrators via Supabase Row Level Security (RLS) en Server Actions:

- **Publieke Aanbevelingen (Recommendations)**:
  - **Volledig openbaar**: Iedereen (ook anonieme/niet-ingelogde bezoekers) kan de aanbevelingenlijst inzien via `/recommendations`.
  - **Admin-only beheer**: Uitsluitend administrators zien de knop "Aanbevelen" op media-detailpagina's en kunnen aanbevelingen toevoegen of verwijderen.
- **Mijn Account (`/account`)**:
  - **Gegevens (`/account/profile`)**: Overzicht van accountgegevens, rolbadge (`user` / `admin`) en registratiedatum.
  - **Watchlist (`/account/watchlist`)**: Persoonlijke watchlist met statussegmentatie (*Alle*, *Nog te bekijken*, *Reeds bekeken*).
  - **Instellingen (`/account/settings`)**: Persoonlijke weergave-instellingen (aantal tiles per pagina, grid- vs. row-weergave).
- **Beheer & Admin (`/admin`)**:
  - Afgeschermde server-side routes met `isAdmin()` verificatie (404/redirect voor niet-admins).
  - **Gebruikersoverzicht (`/admin/users`)**: Overzichtslijst van alle geregistreerde accounts.
  - **Rechtenbeheer (`/admin/users/[id]`)**: Detailweergave om gebruikersrollen (`user` / `admin`) toe te kennen en direct te synchroniseren met de database en Supabase Auth metadata.

---

## 🚀 Aan de slag (Getting Started)

### Vereisten (Prerequisites)

Zorg ervoor dat je [Node.js](https://nodejs.org/) (v20+) hebt geïnstalleerd, samen met [pnpm](https://pnpm.io/) (`pnpm` aanbevolen).

### Installatie & Lokale Development Server

1. **Dependencies installeren:**

   ```bash
   pnpm install
   ```

2. **Environment variables configureren:**

   Maak een lokaal configuratiebestand aan in de root van het project (`.env.local` of `.env.development.local`):

   ```env
   # TMDB API (Server-only)
   TMDB_API_KEY=jouw_tmdb_api_sleutel

   # Supabase SSR (Publiek)
   NEXT_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw_supabase_anon_key

   # Optioneel: Site URL (standaard http://localhost:3000 lokaal; automatisch VERCEL_URL op Vercel)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   #### Overzicht Omgevingsvariabelen

   | Variabele | Scope | Type | Verplicht | Toelichting |
   | :--- | :---: | :---: | :---: | :--- |
   | `TMDB_API_KEY` | Server | `string` | Ja | API-sleutel voor The Movie Database v3. Nooit publiek zichtbaar. |
   | `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | `url` | Ja | URL naar het Supabase project. Gevalideerd via Zod in `lib/env.ts`. |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | `string` | Ja | Publieke Supabase anon sleutel (beveiligd met Row Level Security). |
   | `NEXT_PUBLIC_SITE_URL` | Client & Server | `url` | Nee | Basis-URL voor redirects en e-mailcallbacks. Fallback via `getSiteUrl()`. |
   | `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` | Server | `string` | Automatisch | Door Vercel automatisch geïnjecteerd; gebruikt voor preview- en productie-URLs. |

3. **Lokale development server starten:**

   ```bash
   pnpm dev
   ```

4. **De applicatie openen:**

   Navigeer naar [http://localhost:3000](http://localhost:3000) in je browser.

---

## 🔄 CI/CD & Deployment

Het project maakt gebruik van een volledig geautomatiseerde DevOps pipeline:

### 1. Continuous Deployment (Vercel)
- **`master` branch:** Activeert automatisch een **Production Deployment** met de productie API- en Supabase-sleutels (`movie-app-pi-flame-56.vercel.app`).
- **`development` branch:** Activeert automatisch een **Preview Deployment** met de test/development API- en Supabase-sleutels.
- **Branch-specifieke Environment Variables:** Ingericht in het Vercel dashboard onder *Settings → Environment Variables*, gescheiden per *Production* en *Preview*.

### 2. Continuous Integration (GitHub Actions)
Bij elke push en pull request naar `master` of `development` draait automatisch de CI pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):
- **Linting:** `pnpm run lint` (ESLint 9)
- **Type Checking:** `pnpm exec tsc --noEmit` (TypeScript 5)
- **Master Production Quality Gate (`master` branch & PR's naar `master`):**
  - **Zero Warnings:** `pnpm run lint --max-warnings=0`
  - **Database Query Policy:** Blokkeert verboden `select('*')` queries
  - **No Debug Logs:** Blokkeert achtergebleven `console.log()` statements
  - **Clean Production Code:** Blokkeert achtergebleven `//` en `{/* */}` code-comments
- **Build Validation:** `pnpm run build` (Next.js 16 Turbopack build test via GitHub Actions Secrets)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, Partial Prerendering)
- **Library:** [React 19](https://react.dev)
- **Database & Backend-as-a-Service:** [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, `@supabase/supabase-js` & `@supabase/ssr`)
- **Externe Data API:** [TMDB API v3](https://developer.themoviedb.org/docs) (The Movie Database)
- **UI Primitives:** [Headless UI](https://headlessui.com/) (`@headlessui/react`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) & [Vercel](https://vercel.com)
- **Package Manager:** [pnpm v10](https://pnpm.io/)

---

## 📚 Bronnen & Documentatie (Resources)

- [Next.js Documentatie](https://nextjs.org/docs) - Features en App Router API documentatie.
- [Supabase Documentatie](https://supabase.com/docs) - PostgreSQL database, Row Level Security (RLS) en Next.js SSR integratie.
- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) - Movie & TV metadata API.
- [Vercel Deployment Documentatie](https://vercel.com/docs) - Deployments, environment variables en branch workflows.
- [Tailwind CSS Documentatie](https://tailwindcss.com/docs) - Utility-first styling framework.

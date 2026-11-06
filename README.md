# Movie App (Movie for Friends)

> **Status:** 🚧 In ontwikkeling (Work in Progress)
>
> **Huidige focus:**
> - 📐 **Flowcharts & Architectuur:** Navigatiestructuren en gebruikersflows uitwerken (Figma & Draw.io).
> - 🎨 **UI/UX & Responsive Design:** De huidige interface is puur een functionele placeholder. Het definitieve visuele thema en een volledig responsive design voor mobiel, tablet en desktop staan op de planning.

Een webapplicatie voor het ontdekken, bijhouden en delen van films en series met vrienden, gebouwd met [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev), [Supabase](https://supabase.com) en [Tailwind CSS v4](https://tailwindcss.com).

---

## 🗺️ Ontwikkelstatus & Roadmap

| Onderdeel | Status | Omschrijving |
| :--- | :---: | :--- |
| **API Integration (TMDB)** | ✅ `Done` | Server-side TMDB API v3 integratie voor trending titels, detailpagina's, multi-search en IMDb-ID herkenning. |
| **Data Streaming & Performance** | ✅ `Done` | Partial Prerendering (PPR), `<Suspense>` streaming met skeletons en parallelle data-fetching (`Promise.all`). |
| **Authenticatie & Sessiebeheer** | ✅ `Done` | Supabase SSR met PKCE callback (`/auth/callback`), Next.js 16 `proxy.ts` sessie-verversing en `React.cache()` deduplicatie. |
| **Role-Based Access Control (RBAC)** | ✅ `Done` | Scheiding tussen bezoekers, gebruikers en admins via Supabase RLS en Server Actions. |
| **Accountomgeving (`/account`)** | ✅ `Done` | Profieloverzicht, gesegmenteerde Watchlist (*Bekeken* / *Nog te bekijken*) en weergave-voorkeuren. |
| **Admin Beheeromgeving (`/admin`)** | ✅ `Done` | Gebruikersbeheer, roltoekenning (`user` / `admin`) en moderatie van publieke aanbevelingen. |
| **Component & Type Architectuur** | ✅ `Done` | Zelfvoorzienende feature-componenten, UI-primitives (`Toast`, `Input`, `Button`), isomorfe utils en expliciete TypeScript-barrels. |
| **Deployment & CI/CD** | ✅ `Done` | Automatische Vercel deployments en GitHub Actions Master Production Quality Gate. |
| **Flowcharts & Navigatie** | 🔄 `In Progress` | Uitwerken en visualiseren van applicatie-flows en pagina-hiërarchie in Figma en Draw.io. |
| **UI/UX & Responsive Design** | 📋 `To Do` | Huidige UI is puur een placeholder; uitwerking van definitief design, mobiele navigatie en responsive lay-outs. |

---

## 🏗️ Architectuur in het Kort

De codebase volgt een strikte scheiding tussen presentatie, domeinfeatures, server-acties en datamodellen:

- **App Router & Layouts (`app/`)**: Pure presentatie-shells zonder inline business-logica of database-aanroepen. Dynamische data stroomt via asynchrone `*Content` componenten binnen `<Suspense>`.
- **Zelfvoorzienende Features (`components/features/`)**: Domeingebonden modules (`auth`, `dashboard`, `media`, `recommendations`, `search`, `watchlist`, `account`, `admin`) die zelfstandig hun data en auth-status ophalen.
- **UI Primitives & Design Tokens (`components/ui/`, `app/globals.css`)**: Herbruikbare basiscomponenten (`UIButton`, `UIInput`, `UISelect`, `UISwitch`, `UISpinner`, `ToastProvider`) gebouwd op Headless UI en Tailwind v4 tokens.
- **Data & Server Actions (`lib/`)**:
  - `lib/env.ts` — Type-safe omgevingsvariabelen gevalideerd met Zod 4.
  - `lib/tmdb.ts` — Gecachete server-side TMDB v3 fetches met veilige foutafhandeling.
  - `lib/auth.ts`, `lib/watchlist.ts`, `lib/recommendations.ts`, `lib/admin.ts` — Server-side Supabase acties met expliciete kolomselecties (geen `select('*')`).
  - `lib/utils/` — Centrale isomorfe helpers voor formatting, media-URL's, filters, profielnormalisatie en open-redirect beveiliging.
- **Strikte Types (`types/`)**: Domein- en API-interfaces met expliciet benoemde barrel-exports in `types/index.ts`.

---

## 👤 Gebruikersrollen & Routes

| Rol | Toegang & Functionaliteit |
| :--- | :--- |
| **Bezoeker (Anoniem)** | Kan trending films/series bekijken, zoeken, detailpagina's openen en publieke aanbevelingen (`/recommendations`) inzien. |
| **Gebruiker (`user`)** | Alles van bezoeker + persoonlijke Watchlist beheren en accountinstellingen aanpassen via `/account` (`profile`, `watchlist`, `settings`). |
| **Beheerder (`admin`)** | Alles van gebruiker + titels toevoegen/verwijderen uit publieke aanbevelingen en gebruikersrollen beheren via `/admin` (`users`, `recommendations`). |

---

## 🚀 Aan de Slag

### 1. Vereisten & Installatie
Zorg dat **Node.js v20+** en **pnpm** zijn geïnstalleerd:

```bash
pnpm install
```

### 2. Omgevingsvariabelen (`.env.local`)
Maak een `.env.local` bestand aan in de projectroot:

```env
TMDB_API_KEY=jouw_tmdb_api_sleutel
NEXT_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variabele | Scope | Verplicht | Toelichting |
| :--- | :---: | :---: | :--- |
| `TMDB_API_KEY` | Server | Ja | TMDB API v3 sleutel (blijft strikt server-side). |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Ja | Supabase project-URL (Zod-gevalideerd). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Ja | Publieke Supabase anon-sleutel (beveiligd via RLS). |
| `NEXT_PUBLIC_SITE_URL` | Client & Server | Nee | Basis-URL voor redirects; valt automatisch terug op `VERCEL_URL` of `localhost:3000`. |

### 3. Development Server Starten

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in de browser.

---

## 🔄 CI/CD & Quality Gate

- **Vercel Continuous Deployment:**
  - `master` → **Production Deployment** (`movie-app-pi-flame-56.vercel.app`)
  - `development` → **Preview Deployment**
- **GitHub Actions CI (`.github/workflows/ci.yml`):**
  - Type-check (`npx tsc --noEmit`) & Linting (`pnpm lint --max-warnings=0`)
  - **Master Production Quality Gate:** Blokkeert `select('*')` queries, `console.log()` statements en achtergebleven `//` of `{/* */}` comments
  - Productie build-validatie (`pnpm build`)

---

## 🛠️ Tech Stack

| Categorie | Technologie |
| :--- | :--- |
| **Framework & UI** | [Next.js 16](https://nextjs.org) (App Router, Turbopack, PPR), [React 19](https://react.dev), [TypeScript 5](https://www.typescriptlang.org) |
| **Styling & Componenten** | [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/postcss`), [Headless UI](https://headlessui.com), [Heroicons](https://heroicons.com) |
| **Backend & Auth** | [Supabase](https://supabase.com) (PostgreSQL, RLS, `@supabase/ssr`), [Zod 4](https://zod.dev) |
| **Externe Data** | [TMDB API v3](https://developer.themoviedb.org/docs) |
| **Tooling & DevOps** | [pnpm v10](https://pnpm.io), ESLint 9, GitHub Actions, Vercel |

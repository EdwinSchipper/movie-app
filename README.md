# Movie App (Movie for Friends)

> **Status:** 🚧 In ontwikkeling (Work in Progress)

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
| **Database & Persistente Opslag (Supabase)** | 🔄 `In Progress` | Integratie van Supabase (PostgreSQL + RLS) voor **Watchlist** en **Recommendations**, met strikte server-actions (`lib/`), expliciete kolomselecties (geen `select('*')`) en non-blocking UI-interacties (`useTransition`). |
| **Component & Type Architectuur** | 🔄 `In Progress` | Strikte scheiding tussen `types/` (nullable-safe TMDB & database interfaces), `lib/` (`'use server'` data-laag) en modulaire `components/` (`ui/`, `layout/`, `features/`). |
| **Deployment & CI/CD** | ✅ `Done` | Geautomatiseerde continuous deployment via Vercel en CI kwaliteitscontroles via GitHub Actions. |
| **Design & Overzichtspagina's** | 📋 `To Do` | Definitief visual theme, dedicated overzichtspagina's voor Watchlist/Recommendations en responsive finetuning. |

### ⚡ Architectuur: Back-end, Data Stream & Front-end

De applicatie is opgezet met een strikte scheiding van verantwoordelijkheden en focus op maximale performance, data-integriteit en type-safety tussen back- en front-end:

- **TMDB Server-Side Data Layer (`lib/tmdb.ts`)**: Alle externe API-aanroepen verlopen uitsluitend server-side met Next.js data-caching (`revalidate`), veilige `URLSearchParams`-encoding en strikte nullable TypeScript-interfaces (`types/tmdb.ts`), zodat ontbrekende of niet-vertaalde TMDB-metadata nooit tot runtime crashes leidt.
- **Supabase Database & Security (`lib/watchlist.ts`, `lib/recommendations.ts`)**: Persistente data-opslag en mutaties (`upsert` / `delete`) lopen via server-side Supabase SSR-clients met Row Level Security (RLS) op PostgreSQL-niveau. Alle queries vragen uitsluitend expliciete kolommen op (geen `select('*')`) voor minimale bandbreedte en 1-op-1 overeenstemming met onze TypeScript-interfaces (`types/watchlist.ts`, `types/recommendations.ts`).
- **Non-blocking Data Streaming & Parallel Fetching**: Detail- en overzichtspagina's streamen asynchrone data binnen `<Suspense>` boundaries met directe skeleton fallbacks. Meerdere onafhankelijke database-checks (zoals Watchlist- en Recommendation-status) worden parallel uitgevoerd via `Promise.all` om request-waterfalls te voorkomen.

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

   Maak een lokaal omgevingsbestand aan in de root van het project (`.env.development.local`):

   ```env
   TMDB_API_KEY=jouw_tmdb_api_sleutel
   NEXT_PUBLIC_SUPABASE_URL=jouw_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw_supabase_anon_key
   ```

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

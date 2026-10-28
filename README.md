# Movie App (Movie for Friends)

> **Status:** 🚧 In ontwikkeling (Work in Progress)

Een moderne webapplicatie voor het ontdekken, bekijken en delen van films en series met vrienden, gebouwd met [Next.js](https://nextjs.org) (App Router), React 19 en Tailwind CSS.

---

## 📌 Projectoverzicht & Context

Dit project is momenteel in actieve ontwikkeling. Het doel is het bouwen van een interactief, high-performance platform waar gebruikers trending titels kunnen verkennen, door film- en seriecatalogi kunnen zoeken, gedetailleerde metadata kunnen bekijken en aanbevelingen kunnen delen.

Hieronder vind je een overzicht van de belangrijkste ontwikkelgebieden en hun huidige status:

### 🗺️ Ontwikkelstatus & Roadmap

| Onderdeel | Status | Omschrijving |
| :--- | :---: | :--- |
| **API Integration** | ✅ `Done` | TMDB API v3 geïntegreerd voor trending movies, trending TV series en dynamische detailpagina's. |
| **Data Streaming** | ✅ `Done` | Server-side data fetching met Partial Prerendering (PPR) en React Suspense streaming met skeleton fallbacks. |
| **Deployment & CI/CD**| ✅ `Done` | Geautomatiseerde continuous deployment via Vercel en CI kwaliteitscontroles via GitHub Actions. |
| **Component Architecture** | 🔄 `In Progress` | Modulaire componenten verdeeld over UI primitives (Button, Input, Switch), layout (Header) en features (Search, Trending). |
| **Design** | 📋 `To Do` | Definitief visual theme, detail views optimalisatie en responsive finetuning. |
| **State Management** | 📋 `To Do` | Client & server state architectuur voor zoekqueries, watchlists en gebruikersinteracties. |

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
- **`master` branch:** Activeert automatisch een **Production Deployment** met de productie API-sleutels (`movie-app-pi-flame-56.vercel.app`).
- **`development` branch:** Activeert automatisch een **Preview Deployment** met de test/development API-sleutels.
- **Branch-specifieke Environment Variables:** Ingericht in het Vercel dashboard onder *Settings → Environment Variables*, gescheiden per *Production* en *Preview*.

### 2. Continuous Integration (GitHub Actions)
Bij elke push en pull request naar `master` of `development` draait automatisch de CI pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):
- **Linting:** `pnpm run lint` (ESLint 9)
- **Type Checking:** `pnpm exec tsc --noEmit` (TypeScript 5)
- **Build Validation:** `pnpm run build` (Next.js 16 Turbopack build test via GitHub Actions Secrets)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, Partial Prerendering)
- **Library:** [React 19](https://react.dev)
- **UI Primitives:** [Headless UI](https://headlessui.com/) (`@headlessui/react`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) & [Vercel](https://vercel.com)
- **Package Manager:** [pnpm v10](https://pnpm.io/)

---

## 📚 Bronnen & Documentatie (Resources)

- [Next.js Documentatie](https://nextjs.org/docs) - Features en App Router API documentatie.
- [Vercel Deployment Documentatie](https://vercel.com/docs) - Deployments, environment variables en branch workflows.
- [Tailwind CSS Documentatie](https://tailwindcss.com/docs) - Utility-first styling framework.
- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) - Movie & TV metadata API.

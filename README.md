# Movie App (Movie for Friends)

> **Status:** 🚧 Work in Progress

A modern web application for discovering, browsing, and sharing movies with friends, built with [Next.js](https://nextjs.org) (App Router), React 19, and Tailwind CSS.

---

## 📌 Project Overview & Context

This project is currently in early active development. The goal is to build an interactive, high-performance movie discovery platform where users can explore trending titles, search movie catalogs, view detailed metadata, and share recommendations.

Below is an overview of the key development areas and their current status:

### 🗺️ Development Status & Roadmap

| Area | Status | Description |
| :--- | :---: | :--- |
| **API Integration** | ✅ `Done` | TMDB API v3 geïntegreerd voor trending movies, trending TV series en dynamische detailpagina's. |
| **Data Streaming** | ✅ `Done` | Server-side data fetching met Partial Prerendering (PPR) en React Suspense streaming met skeleton fallbacks. |
| **Deployment & CI/CD**| ✅ `Done` | Geautomatiseerde continuous deployment via Vercel en CI kwaliteitscontroles via GitHub Actions. |
| **UI Components** | 🔄 `In Progress` | Modulaire componenten met Tailwind CSS v4 en Headless UI (Switch, Button, Header, Carousels/Grids). |
| **Design** | 📋 `To Do` | Definitief visual theme, detail views optimalisatie en responsive finetuning. |
| **State Management** | 📋 `To Do` | Client & server state architectuur voor zoekqueries, watchlists en gebruikersinteracties. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+) installed, along with [pnpm](https://pnpm.io/) (`pnpm` recommended).

### Installation & Development Server

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment variables:**

   Maak een lokaal omgevingsbestand aan in de root van het project (`.env.development.local`):

   ```env
   TMDB_API_KEY=jouw_tmdb_api_sleutel
   ```

3. **Start the local development server:**

   ```bash
   pnpm dev
   ```

4. **Open the application:**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

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

## 📚 Resources & Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Vercel Deployment Documentation](https://vercel.com/docs) - Deployment, environment variables, and branch workflows.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework.
- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) - Movie & TV metadata API.

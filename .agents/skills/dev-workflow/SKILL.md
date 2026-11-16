---
name: dev-workflow
description: Lokale setup, centrale omgevingsvariabelen (lib/env.ts), pnpm scripts, GitHub Actions CI en Vercel Preview vs Production deployments.
---

# Dev Workflow – Movie App (Next.js 16 & Vercel)

## Wanneer te gebruiken

- Bij het lokaal opzetten, draaien of valideren van de applicatie.
- Bij het controleren van vereiste omgevingsvariabelen en pre-flight checks vóór een commit of pull request naar `master`.

## Instructies

### Lokale setup & Centralized Environment (`lib/env.ts` & `.env.example`)

- Installeer afhankelijkheden met `pnpm install`.
- Kopieer [`.env.example`](../../../.env.example) naar `.env.local` en vul `TMDB_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` en optioneel `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in.
- **Centralized Environment Policy**: alle omgevingsvariabelen worden uitsluitend centraal uitgelezen en via Zod 4 gevalideerd in [`lib/env.ts`](../../../lib/env.ts) (`env` en `getSiteUrl()`). Houd [`.env.example`](../../../.env.example) altijd 1-op-1 synchroon met [`lib/env.ts`](../../../lib/env.ts). Gebruik nooit rechtstreeks `process.env` in `app/`, `components/`, `types/` of overige bestanden in `lib/`.
- `getSiteUrl()` herkent automatisch `NEXT_PUBLIC_SITE_URL`, reverse-proxy headers (`x-forwarded-host`), `VERCEL_PROJECT_PRODUCTION_URL` en `VERCEL_URL`, met fallback naar `http://localhost:3000`.

### Commando's

- Ontwikkeling (Turbopack): `pnpm dev` (`http://localhost:3000`).
- TypeScript controle: `pnpm type-check` (`tsc --noEmit`) en `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`.
- Linter: `pnpm lint` of strict `pnpm lint --max-warnings=0`.
- Productie-build: `pnpm build` gevolgd door `pnpm start`.
- Release-branch voorbereiden: `pnpm release:master` (maakt `release/master` vanaf `origin/master` met inhoud van `development` zonder `.agents/` en `AGENTS.md`).

### Vercel Deployments & CI Quality Gate

- **Vercel Branches**:
  - `development` → werkbranch met `.agents/` en `AGENTS.md`; activeert automatische **Preview Deployment** met preview Environment Variables in Vercel.
  - `release/master` → schone release-branch gegenereerd door `pnpm release:master` (via [`scripts/release-master.mjs`](../../../scripts/release-master.mjs)) voor Pull Request naar `master`.
  - `master` → automatische **Production Deployment** (`https://movie-app-pi-flame-56.vercel.app`) zonder `.agents/` en `AGENTS.md`.
- **GitHub Actions ([`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml))**:
  - Draait op elke push en pull request naar `development` en `master`: `pnpm run lint`, `pnpm exec tsc --noEmit` en `pnpm run build`.
  - Voert richting `master` de extra **Master Production Quality Gate** uit (`--max-warnings=0`, Zero-Wildcard `select('*')`, Zero-Console `console.log(` en Zero-Comment `//` / `{/* */}`).
- Voer nooit zelfstandig `git commit` of `git push` uit zonder expliciete opdracht van de gebruiker; commitberichten zijn altijd in het Nederlands.
- Schakel na het pushen van `release/master` (`git push -u --force-with-lease origin release/master`) altijd terug naar `development` en geef direct de Pull Request link mee: `https://github.com/EdwinSchipper/movie-app/compare/master...release/master?expand=1`.

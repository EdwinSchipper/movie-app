<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Movie App – Agent Guide

**Centraal startpunt** voor contributors en AI-agents. Bindende regels staan uitsluitend éénmaal vastgelegd in [`.agents/rules/`](.agents/rules/) (single source of truth, zonder duplicatie), aangevuld met [`.agents/agents/`](.agents/agents/) en [`.agents/skills/*/SKILL.md`](.agents/skills/).

## Projectoverzicht & Tech Stack

| Gebied | Details |
| --- | --- |
| **Applicatie** | Movie App (Movie for Friends) — gehost op **Vercel** (`https://movie-app-pi-flame-56.vercel.app`) |
| **Repository** | https://github.com/EdwinSchipper/movie-app (`development` is werkbranch → Vercel Preview; `.agents/` & `AGENTS.md` staan niet op `master`) |
| **Framework** | TypeScript 5 (`strict`), Next.js 16.4 (App Router, PPR & React Compiler in [next.config.ts](next.config.ts)), React 19 |
| **UI & Styling** | Tailwind CSS v4 ([postcss.config.mjs](postcss.config.mjs), [app/globals.css](app/globals.css)), Headless UI v2 (`@headlessui/react`), Heroicons (`@heroicons/react`) |
| **Database & Auth** | Supabase (`@supabase/ssr`, PostgreSQL met RLS, PKCE auth, Next.js 16 [proxy.ts](proxy.ts)) |
| **Externe Data & Validatie** | TMDB API v3 ([lib/tmdb/](lib/tmdb/index.ts)), Zod 4 ([lib/env.ts](lib/env.ts), [types/auth.ts](types/auth.ts), [types/media.ts](types/media.ts), [types/watchlist.ts](types/watchlist.ts)) |
| **Linter & Build** | ESLint 9 ([eslint.config.mjs](eslint.config.mjs)), GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)), `pnpm` |

## Commando's & Architectuur (Quick Reference)

| Commando | Doel |
| --- | --- |
| `pnpm dev` | Lokale ontwikkelsessie starten (Turbopack) |
| `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` | Ongebruikte imports, locals & parameters controleren |
| `pnpm type-check` | TypeScript types controleren (`tsc --noEmit`) |
| `pnpm lint --max-warnings=0` | Strenge ESLint validatie uitvoeren (0 warnings toegestaan) |
| `pnpm build` | Productie Next.js applicatie compileren voor Vercel |
| `pnpm release:master` | Release-branch `release/master` genereren vanaf `origin/master` zonder `.agents/` en `AGENTS.md` |

- `app/`: Pure route-shells (`layout.tsx`, Route Groups `(auth)/`, `(user)/account/`, `(admin)/admin/`, `movies/[id]/`, `tv/[id]/`, `trending/`, `recommendations/`, `watchlist/`) die zelfvoorzienende feature-componenten renderen.
- `components/`: Herbruikbare UI primitives in `ui/` (`UIButton`, `UIInput`, `UISelect`, `UISwitch`, `UISpinner`, `ToastProvider`), globale layout-shells in `layout/` (`Header`, `Footer`) en zelfvoorzienende domein-features met `<Suspense>` skeletons in `features/` (`account`, `admin`, `auth`, `dashboard`, `filtering`, `media`, `navigation`, `recommendations`, `search`, `trending-movies`, `trending-tv`, `watchlist`).
- `lib/`: Centrale Zod 4 omgevingsconfiguratie en Vercel origin-resolutie in [lib/env.ts](lib/env.ts) (gesynchroniseerd met [.env.example](.env.example)), modulaire domeinmappen (`account/`, `admin/`, `auth/`, `recommendations/`, `watchlist/`) met strikte `queries.ts` (`React.cache()`), `actions.ts` (`'use server'`) en expliciete `index.ts` barrels, `@supabase/ssr` clients & proxy in `supabase/`, server-side TMDB API v3 module in `tmdb/` (`client.ts`, `queries.ts`, `index.ts`), pure isomorfe helpers in `utils/` en toplevel aggregatie in [lib/index.ts](lib/index.ts).
- `supabase/`: PostgreSQL schema-, RLS-, trigger- en RPC-bronwaarheid in [supabase/schema.sql](supabase/schema.sql).
- `types/`: Alle gedeelde domein-, API-, filter-, en Zod-schema definities (`media.ts`, `tmdb.ts`, `watchlist.ts`, `recommendations.ts`, `filters.ts`, `auth.ts`) met expliciete named exports in [types/index.ts](types/index.ts).

---

## Agent Rules ([`.agents/rules/`](.agents/rules/))

| Regel | Pad | Kernverantwoordelijkheid |
| --- | --- | --- |
| Accessibility | [`.agents/rules/accessibility.md`](.agents/rules/accessibility.md) | WCAG 2.2 AA landmarks, `<time>`/`sr-only` semantiek, focus/Escape via Headless UI, scrims & `prefers-reduced-motion` |
| Analytics Standards | [`.agents/rules/analytics-standards.md`](.agents/rules/analytics-standards.md) | Eventuele GTM, GA4, Consent Mode v2 (`IArguments`), AVG/GDPR en Zero-PII |
| Change Approval | [`.agents/rules/change-approval.md`](.agents/rules/change-approval.md) | Nooit zelfstandig committen of pushen; wijzigingen eerst voorleggen |
| Database & Data Queries | [`.agents/rules/database-queries.md`](.agents/rules/database-queries.md) | Verbod op `select('*')`, `.maybeSingle()`, `Promise.all`, Auth Short-Circuiting & centrale TMDB `fetchFromTmdb` |
| Git Commits | [`.agents/rules/git-commits.md`](.agents/rules/git-commits.md) | Conventional Commits met verplichte `- Waarom`/`- Wat`/`- Impact` body (altijd Nederlands) & Vercel workflow |
| Image Optimization | [`.agents/rules/image-optimization.md`](.agents/rules/image-optimization.md) | Versie-gedreven `next/image` props (`preload`, `sizes`), Vercel Image Optimization caching & `image.tmdb.org` `remotePatterns` |
| Import Integrity | [`.agents/rules/import-integrity.md`](.agents/rules/import-integrity.md) | Codebase-wide grep op oude paden/barrels, `tsc --noEmit`, `pnpm lint` & docs na refactors |
| Official Stack | [`.agents/rules/official-stack-standards.md`](.agents/rules/official-stack-standards.md) | Pure shells, self-contained features, React 19, `lib/env.ts`, expliciete barrels, Zero-Deprecation (`ts 6385`) & design tokens |
| Quality Gate | [`.agents/rules/quality-gate.md`](.agents/rules/quality-gate.md) | Zero-Comment (`//`), Zero-Console, Zero-Wildcard, Zero-Any, Env- & Image-checks, `tsc --noEmit`, `lint --max-warnings=0` & `pnpm build` |
| Security Headers | [`.agents/rules/security-headers.md`](.agents/rules/security-headers.md) | Vercel HTTP security headers in `next.config.ts`, CSP voor Supabase/TMDB, open-redirect preventie & `rel="noopener noreferrer"` |
| Supabase Standards | [`.agents/rules/supabase-standards.md`](.agents/rules/supabase-standards.md) | `@supabase/ssr` clients, Next.js 16 `proxy.ts`, `auth.getUser()`, `React.cache()`, RLS, RBAC & PKCE callback |
| Zod Validation | [`.agents/rules/zod-validation.md`](.agents/rules/zod-validation.md) | Zod 4 top-level syntax (`z.email()`, `z.url()`, `z.uuid()`, `z.int()`), centrale schema's in `types/` & `.safeParse()` in Server Actions |

## Gespecialiseerde Subagents ([`.agents/agents/`](.agents/agents/))

| Subagent | Pad | Specialisme |
| --- | --- | --- |
| Supabase & Data Architect | [`.agents/agents/supabase-architect.md`](.agents/agents/supabase-architect.md) | `@supabase/ssr`, `proxy.ts`, PKCE auth, RLS & RBAC, expliciete kolomqueries & TMDB API v3 (`lib/tmdb/`) |
| Environment & Architecture Guardian | [`.agents/agents/env-architecture-architect.md`](.agents/agents/env-architecture-architect.md) | `lib/env.ts` & Vercel origin/headers (`next.config.ts`), Next.js 16 / React 19 architectuur, pure shells, barrels & zero-deprecation |
| Image Optimization Architect | [`.agents/agents/image-optimization-architect.md`](.agents/agents/image-optimization-architect.md) | Versie-specifieke `next/image`, Vercel Image Optimization & Edge CDN caching, TMDB `remotePatterns` & LCP-`preload` |
| Analytics & Privacy Architect | [`.agents/agents/analytics-architect.md`](.agents/agents/analytics-architect.md) | GTM, GA4, Consent Mode v2, `@next/third-parties/google`, AVG/GDPR privacy & Zero-PII payloads |

## Documentatie & Skills ([`.agents/skills/`](.agents/skills/))

| Skill | Pad | Onderwerp |
| --- | --- | --- |
| Dev workflow | [`.agents/skills/dev-workflow/SKILL.md`](.agents/skills/dev-workflow/SKILL.md) | Lokale setup, `lib/env.ts`, `pnpm` scripts, GitHub Actions CI en Vercel Preview/Production |
| Supabase & TMDB | [`.agents/skills/supabase-tmdb/SKILL.md`](.agents/skills/supabase-tmdb/SKILL.md) | `@supabase/ssr`, `proxy.ts`, RLS/PKCE, TMDB `fetchFromTmdb` & isomorfe helpers in `lib/utils/` |
| Framework | [`.agents/skills/framework/SKILL.md`](.agents/skills/framework/SKILL.md) | Next.js 16.4 (`next.config.ts`), Tailwind CSS v4 (`postcss.config.mjs`, `globals.css`) & Headless UI primitives |
| Next.js app | [`.agents/skills/next-app/SKILL.md`](.agents/skills/next-app/SKILL.md) | App Router Route Groups, pure route-shells, zelfvoorzienende `<Suspense>` features & client boundaries |
| TypeScript style | [`.agents/skills/typescript-style/SKILL.md`](.agents/skills/typescript-style/SKILL.md) | `tsconfig` (`strict`), Zero-Any, Zero-Deprecation (`ts 6385`), Zod 4 & expliciete type-barrels |
| Testing | [`.agents/skills/testing/SKILL.md`](.agents/skills/testing/SKILL.md) | Master Production Quality Gate, pre-flight validatie & geheimbeheer (Vercel & GitHub Secrets) |
| Code review | [`.agents/skills/code-review/SKILL.md`](.agents/skills/code-review/SKILL.md) | PR-, security-headers-, Supabase/TMDB- en architectuur-checklist |

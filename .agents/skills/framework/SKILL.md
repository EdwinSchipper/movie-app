---
name: framework
description: Next.js 16.4 (Turbopack, PPR, React Compiler), React 19, Tailwind CSS v4 (@tailwindcss/postcss), Headless UI v2 en Vercel next/image configuratie.
---

# Framework & Tooling – Next.js 16, Tailwind CSS v4 & Vercel

## Wanneer te gebruiken

- Bij aanpassingen aan [`next.config.ts`](../../../next.config.ts), [`postcss.config.mjs`](../../../postcss.config.mjs), [`app/globals.css`](../../../app/globals.css) of [`package.json`](../../../package.json).
- Bij het uitbreiden van UI primitives in [`components/ui/`](../../../components/ui/) of afbeeldingsinstellingen voor Vercel Image Optimization.

## Instructies

### Stack & Scripts

- [`package.json`](../../../package.json) scripts (gebruik altijd `pnpm`):
  - `pnpm dev`: `next dev` (Turbopack)
  - `pnpm build`: `next build`
  - `pnpm start`: `next start`
  - `pnpm lint`: `eslint` (`pnpm lint --max-warnings=0` in Quality Gate)
  - `pnpm type-check`: `tsc --noEmit`
  - `pnpm release:master`: `node scripts/release-master.mjs`
- Kern-dependencies: Next.js `16.4.2`, React `19.3.0`, `babel-plugin-react-compiler`, Tailwind CSS v4 met `@tailwindcss/postcss`, `@headlessui/react` v2, `@heroicons/react`, `react-toastify` v11 (`ToastProvider`), `@supabase/ssr`, `@supabase/supabase-js`, Zod v4.

### Next.js Configuratie (`next.config.ts`) & PostCSS (`postcss.config.mjs`)

- [`next.config.ts`](../../../next.config.ts) activeert `cacheComponents: true`, `partialPrefetching: true`, `reactCompiler: true` en `logging.fetches.fullUrl: true`, en beperkt `images` (`formats: ['image/webp']`, `qualities: [75]`, `minimumCacheTTL: 2678400`, `remotePatterns` voor `https://image.tmdb.org/t/p/**`) voor optimale Vercel Image Optimization.
- Alle image-keuzes (`formats`, `qualities`, `minimumCacheTTL`, `sizes`, `preload`) en beveiligingsheaders (`headers()`) volgen [`.agents/rules/image-optimization.md`](../../rules/image-optimization.md) en [`.agents/rules/security-headers.md`](../../rules/security-headers.md).
- [`postcss.config.mjs`](../../../postcss.config.mjs) gebruikt uitsluitend `@tailwindcss/postcss` zodat productie-CSS op Vercel exact alle `@theme inline` en `@utility` tokens meeneemt.

### Tailwind CSS v4, Layout & UI Primitives

- [`app/globals.css`](../../../app/globals.css) definieert alle centrale `@theme inline` kleuren/radii/typografie (`--brand`, `--accent-blue`, `--accent-blue-hover`, `--text-2xs`, `--radius-control`), `--toastify-*` design-token overrides voor `react-toastify` en `@utility` classes (`.h1`–`.h6`, `.label-*`, `.badge-*`, `.icon-*`).
- Gebruik altijd de UI primitives uit [`components/ui/`](../../../components/ui/) (`UIButton`, `UIInput`, `UISelect`, `UISwitch`, `UISpinner`, `ToastProvider` op basis van `react-toastify/unstyled` + `ReactToastify.css`) gebouwd op `@headlessui/react` v2, en iconen uit `@heroicons/react` — nooit ruwe `<button>`, `<input type="text|email|password|search">`, `<select>` of losse inline `<svg>` buiten [`Spinner.tsx`](../../../components/ui/Spinner.tsx).
- `UIButton` (`<UIButton href="...">` of `getButtonClasses()`) in [`Button.tsx`](../../../components/ui/Button.tsx) is de verplichte **Single Source of Truth** voor zowel knoppen als knop-links; plaats geen losse knop-classes op `<Link>`, nest geen `<Link><UIButton>`, en gebruik in `components/ui/` uitsluitend `@theme` design tokens uit `app/globals.css`.

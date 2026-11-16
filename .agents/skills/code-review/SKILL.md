---
name: code-review
description: Pull Request checklist, architectuurbewaking, Supabase/TMDB integriteit en Vercel readiness richtlijnen voor code reviews.
---

# Code Review & Architectuur Checklist

## Wanneer te gebruiken

- Vóór het voorstellen van een commit/PR of bij het beoordelen van codewijzigingen op architectuur, veiligheid en performance.

## Instructies

### Review Checklist

- **Shell Purity & Self-Contained Features**: Zijn `app/**/layout.tsx`, `app/**/page.tsx` en `components/layout/**` 100% pure shells zonder inline business logica, prop-drilling of directe DB-/API-calls? Halen feature-componenten zelfstandig auth en data op binnen `<Suspense fallback={<*Skeleton />}>` met Auth Short-Circuiting bij `user === null`?
- **Supabase SSR, Schema Bronwaarheid, RLS & Zero-Wildcard**: Gebruikt elke server auth-check `supabase.auth.getUser()` (nooit `getSession()`) via `React.cache()`, ververst `proxy.ts` de sessie, gebruikt elke query expliciete kolommen (nooit `.select('*')`), lopen onafhankelijke fetches parallel via `Promise.all`, worden redirects gevalideerd met `getSafeRedirectPath()`, valideert elke Server Action invoer met Zod 4 `.safeParse()` ([`zod-validation.md`](../../rules/zod-validation.md)) en is [`supabase/schema.sql`](../../../supabase/schema.sql) synchroon?
- **TMDB Error-Semantiek & Centralized Environment**: Komen alle TMDB calls uit `lib/tmdb/client.ts` (`fetchFromTmdb` met `TMDB_REQUEST_TIMEOUT_MS` en onderscheid tussen HTTP `404` → `null`/`notFound()` vs `throw error` voor API-fouten) via `React.cache()` queries in `lib/tmdb/queries.ts`, staan alle omgevingsvariabelen centraal in `lib/env.ts` (Zod 4 + Vercel origin resolutie) gesynchroniseerd met [`.env.example`](../../../.env.example), en zijn alle TMDB-interfaces correct nullable?
- **UI Primitives, Icons & A11Y**: Worden uitsluitend `components/ui/` primitives (`UIButton`, `UIInput`, `UISelect`, `UISwitch`, `UISpinner`, `ToastProvider`), `@heroicons/react` iconen en design tokens uit `app/globals.css` gebruikt zonder `export *` in submappen/`types/index.ts`, zonder `as any`, zonder `@deprecated` API's (`ts 6385`), en conform [`accessibility.md`](../../rules/accessibility.md)?
- **Vercel Image Optimization & Security Headers**: Volgen `next/image` props (`sizes`, `preload` i.p.v. `priority`, `getTmdbImageUrl`) en `next.config.ts` (`remotePatterns` beperkt tot `image.tmdb.org/t/p/**` en HTTP security headers) [`image-optimization.md`](../../rules/image-optimization.md) en [`security-headers.md`](../../rules/security-headers.md)?
- **Quality Gate**: Slagen Zero-Comment, Zero-Console, Zero-Wildcard, `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm type-check`, `pnpm lint --max-warnings=0` en (indien van toepassing) `pnpm build` zonder waarschuwingen?

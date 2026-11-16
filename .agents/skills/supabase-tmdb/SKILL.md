---
name: supabase-tmdb
description: Supabase SSR (@supabase/ssr, proxy.ts, PKCE auth, RLS, RBAC), TMDB API v3 (fetchFromTmdb, server-caching) en centrale isomorfe helpers in lib/utils/.
---

# Supabase SSR & TMDB Data-Laag – Next.js 16

## Wanneer te gebruiken

- Bij het wijzigen of uitbreiden van database-queries en Server Actions in [`lib/`](../../../lib/) (`account/`, `admin/`, `auth/`, `recommendations/`, `watchlist/`, `supabase/`).
- Bij het aanpassen of toevoegen van TMDB API v3 endpoints in [`lib/tmdb/`](../../../lib/tmdb/index.ts) of isomorfe helpers in [`lib/utils/`](../../../lib/utils/index.ts).

## Instructies

### Supabase SSR, Auth & Database (`lib/supabase/` & `lib/<domein>/`)

- **Clients**: gebruik [`lib/supabase/client.ts`](../../../lib/supabase/client.ts) voor Client Components en [`lib/supabase/server.ts`](../../../lib/supabase/server.ts) (gewrapt in `React.cache()` met `await connection()`, async `cookies()` en `{ getAll, setAll }`) voor Server Components, Server Actions en Route Handlers, beide op basis van `env.supabase` uit [`lib/env.ts`](../../../lib/env.ts).
- **Proxy Sessieverversing**: [`proxy.ts`](../../../proxy.ts) delegeert naar `updateSession()` in [`lib/supabase/proxy.ts`](../../../lib/supabase/proxy.ts) zodat sessie-cookies ververst worden vóór SSR rendering.
- **Modulaire Scheiding & Memoization**: elke domeinmap (`auth/`, `account/`, `admin/`, `watchlist/`, `recommendations/`) splitst lezende `queries.ts` (`'use server'` + `React.cache()`), muterende `actions.ts` (`'use server'`) en een expliciete `index.ts` barrel; valideer gebruikers op de server uitsluitend met `supabase.auth.getUser()` (nooit `getSession()`) via `getCurrentUser()`, `getAppUser()` en `isAdmin()` in [`lib/auth/queries.ts`](../../../lib/auth/queries.ts).
- **PKCE & Redirects**: [`app/(auth)/auth/callback/route.ts`](../../../app/(auth)/auth/callback/route.ts) wisselt `?code=` in via `exchangeCodeForSession()` en gebruikt altijd `getSafeRedirectPath()` uit `@/lib/utils`.
- **Zero-Wildcard, Schema Bronwaarheid & Parallel Queries**: vraag altijd expliciete kolommen op (nooit `.select('*')`), gebruik `.maybeSingle()` bij unieke records, korte-sluit bij `user === null` (Auth Short-Circuiting), voer onafhankelijke calls parallel uit via `Promise.all`, en houd [`supabase/schema.sql`](../../../supabase/schema.sql) 1-op-1 gesynchroniseerd met alle tabellen, RLS-policies en RPC's (`set_user_role`).

### TMDB API v3 (`lib/tmdb/`) & Isomorfe Helpers (`lib/utils/`)

- Alle TMDB-requests verlopen server-side via `fetchFromTmdb()` in [`lib/tmdb/client.ts`](../../../lib/tmdb/client.ts) met veilige `URLSearchParams`, `AbortSignal.timeout(TMDB_REQUEST_TIMEOUT_MS)` (`10_000ms`), `env.tmdb.apiKey` en Next.js caching (`next: { revalidate }`), aangeroepen via gecachete queries in [`lib/tmdb/queries.ts`](../../../lib/tmdb/queries.ts).
- **Error-Semantiek (`404` vs. Runtime/API-fout)**: detail- en find-fetches gebruiken `allowNotFound: true` en retourneren uitsluitend `null` bij HTTP `404` (voor `notFound()`); echte API-/netwerkfouten (`500`, `429`, timeouts) worden altijd doorgegooid.
- Houd alle pure, client- én server-geschikte helpers (formatting met gecachte `Intl.DateTimeFormat`, `getTmdbImageUrl`, `getMediaDetailHref`, `normalizeMediaActionPayload`, mediafilters, profielnormalisatie en open-redirect bescherming) gebundeld in [`lib/utils/`](../../../lib/utils/) met expliciete exports in [`lib/utils/index.ts`](../../../lib/utils/index.ts).

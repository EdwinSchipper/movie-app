---
trigger: always_on
---

# Database & Data-Laag Richtlijnen (Supabase & TMDB Policy)

In dit project hanteren we strikte kwaliteits-, veiligheids- en performance-eisen voor alle database queries (Supabase / PostgreSQL) en externe API-aanroepen (TMDB API v3).

## 1. Verbod op Wildcards (`select('*')`)
- **GEBRUIK NOOIT `select('*')`**:
  - Het gebruik van wildcards (`*`) in Supabase queries is strikt verboden.
  - Vraag altijd **exact en expliciet** alleen de benodigde kolommen op (bijv. `.select('id, user_id, tmdb_id, media_type, title, poster_path, status, created_at')`).

## 2. Redenen & Waarborgen
1. **Performance & Bandbreedte**: voorkomt onnodige datatransmissie over het netwerk tussen Supabase en Next.js Server Actions.
2. **Type-Safety & Sluitende Contracten**: garandeert dat geretourneerde data exact 1-op-1 aansluit op de gedefinieerde TypeScript interfaces in `types/`.
3. **Data-lekkage Preventie**: voorkomt dat eventuele toekomstige interne of gevoelige kolommen onbedoeld meegestuurd worden naar client componenten.

## 3. Doelgerichte & Parallelle Queries
- Gebruik `.maybeSingle()` bij het ophalen van één optioneel record op basis van unieke sleutels.
- Voer onderling onafhankelijke database- en API-queries altijd parallel uit via `Promise.all([...])` om request-waterfalls te voorkomen.
- **Auth Short-Circuiting**: voer geen gebruiker-specifieke database-queries (`getWatchlistStatus`, `getUserProfile`) uit wanneer `user === null`.

## 4. Centrale TMDB API v3 Data-Laag (`lib/tmdb/`)
- Alle TMDB API v3 requests lopen uitsluitend server-side via één centrale helper (`fetchFromTmdb` in `lib/tmdb/client.ts`) met veilige `URLSearchParams`-encoding, een request-timeout (`AbortSignal.timeout(TMDB_REQUEST_TIMEOUT_MS)` van `10_000ms`) en `env.tmdb.apiKey` uit `@/lib/env`; publieke TMDB queries wonen in `lib/tmdb/queries.ts` (gewrapt in `React.cache()`).
- **Error-Semantiek (`404` vs. Runtime/API-fout)**: gebruik `allowNotFound: true` op detail- en find-queries zodat alleen HTTP `404` gecontroleerd `null` oplevert (voor `notFound()`); vang API-fouten (`500`, `429`, timeouts) nooit stilzwijgend af als een `404` maar gooi de `Error` door naar Next.js Error Boundaries.
- Pas Next.js cache-revalidatie toe (`next: { revalidate }`) en definieer realistische nullable eigenschappen (`?: ... | null`) in `types/tmdb.ts` zodat ontbrekende TMDB-velden nooit tot runtime crashes leiden.

## 5. Database Schema Bronwaarheid (`supabase/schema.sql`)
- Houd [`supabase/schema.sql`](../../supabase/schema.sql) altijd 1-op-1 gesynchroniseerd met alle PostgreSQL tabellen (`profiles`, `watchlist`, `recommendations`), constraints, indexen, RLS-policies, triggers (`on_auth_user_created`) en RPC-functies (`set_user_role`).

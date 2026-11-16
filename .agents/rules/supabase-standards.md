---
trigger: always_on
---

# Supabase Architecture & Security Richtlijnen (Supabase Policy)

In dit project hanteren we de officiële standaarden van **Supabase met Next.js 16 App Router** conform de officiële documentatie (`@supabase/ssr`) en Next.js 16 conventies (`proxy.ts`).

---

## 1. Client Configuratie & SSR Architectuur (`@supabase/ssr`)

- **Centralized Environment (`lib/env.ts`)**:
  - Lees `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `lib/supabase/` uitsluitend uit via `env.supabase` (`@/lib/env`), nooit rechtstreeks uit `process.env`.

- **Browser Client (`lib/supabase/client.ts`)**:
  - Wordt uitsluitend aangeroepen in interactieve Client Components (`'use client'`) via `createBrowserClient`.

- **Server Client (`lib/supabase/server.ts`)**:
  - Wordt uitsluitend aangeroepen in Server Components, Server Actions (`'use server'`) en Route Handlers, en is zelf gewrapt in `React.cache()`.
  - Maakt gebruik van `createServerClient` in combinatie met Next.js 16 `await connection()` (om `Date.now()` prerendering blocking te voorkomen) en async `cookies()`.
  - Hanteert de moderne `cookies: { getAll, setAll }` interface en vangt `setAll` fouten op met een stille `try/catch` voor read-only Server Components.

- **Next.js 16 Proxy (`proxy.ts` + `lib/supabase/proxy.ts` - voorheen `middleware.ts`)**:
  - **Next.js 16 breaking change**: `middleware.ts` is verouderd (`deprecated`) en officieel vervangen door `proxy.ts`.
  - Verantwoordelijk voor het verversen van de Auth-sessie vóór Server Component rendering door `supabase.auth.getUser()` aan te roepen en bijgewerkte cookies weg te schrijven op de `NextResponse`.
  - Gebruikt een strikte `matcher` config om static assets (`_next/static`, `_next/image`, favicon en afbeeldingen) uit te sluiten.

---

## 2. Beveiliging, Authenticatie & RBAC (Security Standards)

- **`auth.getUser()` vs `auth.getSession()`**:
  - **STRIKT VERPLICHT**: gebruik op de server **ALTIJD `supabase.auth.getUser()`** om de identiteit te valideren.
  - **STRIKT VERBODEN**: gebruik op de server nooit `supabase.auth.getSession()`. Cookie-data kan gemanipuleerd zijn; `getUser()` valideert het JWT cryptografisch tegen Supabase Auth.

- **Request-Level Memoization via `React.cache()`**:
  - Roep auth-status op via `getCurrentUser()`, `getAppUser()` en `isAdmin()` uit `lib/auth/queries.ts` (gewrapt in `React.cache()`), zodat componenten binnen één SSR-request dezelfde Promise delen zonder dubbele Supabase-roundtrips.

- **Anon Key vs Service Role Key**:
  - Reguliere applicatie- en servercode gebruikt uitsluitend de publieke `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - De `SUPABASE_SERVICE_ROLE_KEY` mag NOOIT in client-code voorkomen of naar de browser lekken.

- **Row Level Security (RLS), RBAC & Schema Bronwaarheid (`supabase/schema.sql`)**:
  - Elke tabel (`profiles`, `watchlist`, `recommendations`) MOET RLS ingeschakeld hebben (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) en gedocumenteerd zijn in [`supabase/schema.sql`](../../supabase/schema.sql).
  - Gebruikersdata is geïsoleerd via `auth.uid() = user_id` (en `auth.uid() = id` op `profiles`).
  - Publieke aanbevelingen (`recommendations`) hebben read-toegang voor `anon`/`authenticated` en write-toegang uitsluitend voor admins (`isAdmin()`).

---

## 3. Query Performance & Data Integrity

- **Geen Wildcards (`select('*')`)**: vraag altijd expliciet alleen de benodigde kolommen op.
- **Doelgerichte & Parallelle Queries**: gebruik `.maybeSingle()` voor unieke lookups en `Promise.all([...])` voor onafhankelijke parallelle queries.
- **Auth Short-Circuiting**: sla watchlist- of profielqueries direct over als `user === null`.
- **Indexering in PostgreSQL**: indexeer kolommen in `WHERE`/`JOIN`/`ORDER BY` (`user_id`, `tmdb_id`, `media_type`, `created_at`).

---

## 4. Scope-beheer & Server Actions (`'use server'`)

- Valideer inkomende payloads runtime met Zod 4 via `.safeParse(...)` op basis van centrale schema's in `@/types` (zoals `loginSchema`, `registerSchema`, `userSettingsSchema`, `updateUserRoleSchema`, `addWatchlistInputSchema`, `watchlistStatusSchema`) of `validateMediaActionPayload` / `validateMediaTarget` (`@/lib/utils`), conform [`.agents/rules/zod-validation.md`](zod-validation.md).
- Pas `revalidatePath(...)` direct toe na mutaties (`insert`, `update`, `delete`, `upsert`).
- Retourneer altijd een getypeerd `ActionResult` (`{ success: true }` of `{ success: false, error: string }`).

---

## 5. Route-organisatie via Next.js Route Groups (`app/(auth)`, `app/(user)`, `app/(admin)`)

- **`app/(auth)/`**: `login/page.tsx`, `register/page.tsx`, `auth/callback/route.ts` (`/login`, `/register`, `/auth/callback`).
- **`app/(user)/account/`**: `page.tsx`, `profile/page.tsx`, `watchlist/page.tsx`, `settings/page.tsx`.
- **`app/(admin)/admin/`**: `page.tsx`, `users/page.tsx`, `users/[id]/page.tsx`, `recommendations/page.tsx` (server-side beveiligd met `isAdmin()` -> `notFound()`).

---

## 6. E-mail Verificatie & PKCE Auth Flow (`app/(auth)/auth/callback/route.ts`)

- **Registratie (`signUp`)**: gebruikt `options.emailRedirectTo` met `getSiteUrl()` uit `@/lib/env`: `${origin}/auth/callback?next=/account`.
- **Callback Route Handler (`app/(auth)/auth/callback/route.ts`)**: wisselt `?code=` server-side in via `supabase.auth.exchangeCodeForSession(code)` en valideert de redirect altijd met `getSafeRedirectPath(next)` tegen open redirects.
- **Supabase Redirect Allow-list (Vercel + Lokaal)**: registreer in het Supabase Dashboard onder *Authentication → URL Configuration → Redirect URLs* zowel `http://localhost:3000/auth/callback` als alle Vercel productie- en preview-URL's (`https://movie-app-pi-flame-56.vercel.app/auth/callback` en `https://*-edwinschippers-projects.vercel.app/**` of projectspecifieke wildcard).

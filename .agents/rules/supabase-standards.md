# Supabase Architecture & Security Richtlijnen (Supabase Policy)

In dit project hanteren we de officiële standaarden van **Supabase met Next.js 16 App Router** conform de officiële documentatie (`@supabase/ssr` tutorial `with-nextjs`) en Next.js 16 conventies (`proxy.ts`).

---

## 1. Client Configuratie & SSR Architectuur (`@supabase/ssr`)

- **Browser Client (`lib/supabase/client.ts`)**:
  - Wordt uitsluitend aangeroepen in interactieve Client Components (`'use client'`).
  - Maakt gebruik van `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.

- **Server Client (`lib/supabase/server.ts`)**:
  - Wordt uitsluitend aangeroepen in Server Components, Server Actions (`'use server'`) en Route Handlers.
  - Maakt gebruik van `createServerClient` in combinatie met Next.js async `cookies()`.
  - Hanteert de moderne `cookies: { getAll, setAll }` interface.
  - Vangt `setAll` fouten op met een lege `try/catch` zodat aanroepen vanuit read-only Server Components geruisloos doorgelaten worden en sessie-mutaties verlopen via Server Actions of de Next.js 16 Proxy.

- **Next.js 16 Proxy (`proxy.ts` - voorheen `middleware.ts`)**:
  - **Let op Next.js 16 breaking change**: De `middleware` file convention is verouderd (deprecated) en officieel hernoemd naar `proxy`.
  - **Bestand**: `proxy.ts` direct in de root van het project (naast `app/`), met `export function proxy(request: NextRequest)`.
  - **Doel voor Supabase**: Verantwoordelijk voor het verversen van de Auth-sessie vóórdat Server Components renderen door `supabase.auth.getUser()` aan te roepen en de nieuwe cookies weg te schrijven op de `NextResponse`.
  - **Matcher**: Gebruikt altijd een strikte `matcher` config om static assets (`_next/static`, `_next/image`, favicon en afbeeldingsbestanden) uit te sluiten voor optimale performance.

---

## 2. Beveiliging & Authenticatie (Security Standards)

- **`auth.getUser()` vs `auth.getSession()`**:
  - **STRIKT VERPLICHT**: Gebruik op de server (Server Actions, Server Components, Route Handlers, Proxy) **ALTIJD `supabase.auth.getUser()`** om de identiteit van de gebruiker te valideren.
  - **STRIKT VERBODEN**: Gebruik op de server nooit `supabase.auth.getSession()`. Cookie-sessies kunnen gemanipuleerd worden door de client; `getUser()` valideert het JWT-token direct cryptografisch tegen de Supabase Auth server.

- **Anon Key vs Service Role Key**:
  - Reguliere applicatie- en servercode gebruikt uitsluitend de publieke `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - De `SUPABASE_SERVICE_ROLE_KEY` mag NOOIT naar de client lekken en wordt uitsluitend ingezet in afgeschermde backend-taken of administratieve migraties.

- **Row Level Security (RLS)**:
  - Elke tabel in Supabase MOET RLS ingeschakeld hebben (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
  - Toegangsrechten voor gebruikers worden gekoppeld via `auth.uid() = user_id`.
  - Publieke data (zoals openbare aanbevelingen) heeft een expliciete `SELECT` policy voor `anon` en `authenticated`.

---

## 3. Query Performance & Data Integrity

- **Geen Wildcards (`select('*')`)**:
  - Vraag altijd exact en uitsluitend de benodigde kolommen op (`.select('id, user_id, tmdb_id, title, ...')`).
- **Doelgerichte Queries**:
  - Gebruik `.maybeSingle()` bij het opvragen van één uniek record op basis van identifiers.
  - Vermijd redundante roundtrips door status en aanwezigheid in één query te combineren (bijv. `getWatchlistStatus`).
- **Parallel Data Fetching**:
  - Voer onafhankelijke database-calls in Server Components altijd parallel uit via `Promise.all([ ... ])` om request-waterfalls te voorkomen.
- **Indexering in PostgreSQL**:
  - Zorg dat kolommen die gebruikt worden in `WHERE`, `JOIN` of `ORDER BY` clausules (zoals `user_id`, `tmdb_id`, `media_type`, `created_at`) voorzien zijn van een database index of unique constraint.

---

## 4. Scope-beheer & Lifecycle

- **Server Action Scopes (`'use server'`)**:
  - Valideer binnenkomende parameters runtime vóórdat de query wordt uitgevoerd.
  - Pas `revalidatePath(...)` direct toe na een succesvolle mutatie (`insert`, `update`, `delete`, `upsert`).
  - Retourneer altijd een getypeerd `ActionResult` (`{ success: true }` of `{ success: false, error: string }`).
- **Geen openstaande resources**:
  - De `@supabase/ssr` client is stateless per request en vereist geen handmatige connection-teardown of connection pools in Serverless/Edge functies.

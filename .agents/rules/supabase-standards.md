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

---

## 5. Route-organisatie via Next.js Route Groups (`app/(auth)` & `app/(user)`)

Plaats authenticatie- en gebruikerspagina's nooit los in de `app/` root, maar structureer ze met Route Groups (ronde haakjes):

- **`app/(auth)/` (Toegang)**:
  - Bevat authenticatieroutes: `login/page.tsx`, `register/page.tsx` en `auth/callback/route.ts`.
  - URL's blijven schoon en herkenbaar (`/login`, `/register`, `/auth/callback`).
  - Kan voorzien worden van een dedicated `(auth)/layout.tsx` (bijv. een minimalistische, gecentreerde inlogkaart zonder overbodige navigatiemenu's).
- **`app/(user)/` (Gebruikersbeheer)**:
  - Bevat beveiligde account- en profielpagina's: `profile/page.tsx`, `settings/page.tsx`.
  - URL's blijven strak (`/profile`, `/settings`), terwijl alle user-specifieke code modulair bijeen blijft.

---

## 6. E-mail Verificatie & PKCE Auth Flow (`app/(auth)/auth/callback/route.ts`)

Bij e-mailbevestigingen (registratie, wachtwoordherstel of magic links) hanteren we de officiële **PKCE (Proof Key for Code Exchange)** architectuur:

- **Registratie (`signUp`)**:
  - Roep `supabase.auth.signUp()` aan met een expliciete `options.emailRedirectTo`:
    - `${origin}/auth/callback?next=/profile`
- **Callback Route Handler (`app/(auth)/auth/callback/route.ts`)**:
  - Vangt de `?code=` query-parameter op uit de verificatie-e-mail.
  - Wisselt de code server-side in voor een cryptografisch geldige sessie via:
    `await supabase.auth.exchangeCodeForSession(code)`.
  - Schrijft de sessie-cookies direct weg via de `@supabase/ssr` server client en redirect de gebruiker naar het opgegeven `next` pad (standaard `/profile`).
- **Redirect URL Allow-list (Supabase Dashboard)**:
  - Zowel de lokale development URL (`http://localhost:3000/auth/callback`) als de productie-URL (`https://<productie-domein>/auth/callback`) MOETEN in het Supabase Dashboard geregistreerd staan onder *Authentication → URL Configuration → Redirect URLs*.
- **E-mail Aflevering (SMTP)**:
  - In development: gebruik de ingebouwde Supabase mailer (rate-limited tot 3-4 mails per uur).
  - In productie: configureer een custom SMTP provider (bijv. Resend of Postmark) in het Supabase Dashboard voor gegarandeerde inbox-aflevering vanaf eigen domeinnaam.

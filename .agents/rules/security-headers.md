---
trigger: always_on
---

# HTTP Security Headers, Open-Redirect & Vercel Richtlijnen

Vercel Edge Network verzorgt TLS/HTTPS en optioneel HSTS op standaard Vercel-domeinen, maar applicatieve HTTP-beveiligingsheaders (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, etc.) moeten expliciet in [`next.config.ts`](../../next.config.ts) (`async headers()`) worden beheerd en bewaakt door de `env-architecture-architect`.

## 1. Verplichte Basisheaders (`/:path*` in `next.config.ts`)
- **`Strict-Transport-Security`**: `max-age=63072000; includeSubDomains; preload` (2 jaar HTTPS-verplichting; browsers negeren deze header over HTTP op `localhost` conform RFC 6797).
- **`X-Content-Type-Options`**: `nosniff` (voorkomt MIME-type sniffing).
- **`Referrer-Policy`**: `strict-origin-when-cross-origin`
- **`Permissions-Policy`**: `camera=(), microphone=(), geolocation=()`
- **`X-Frame-Options` / `Content-Security-Policy` `frame-ancestors`**: minimaal `frame-ancestors 'none'` (of `'self'`) om clickjacking van derden uit te sluiten.

## 2. CSP Bronnen & Externe Verbindingen (Movie App Stack)
Controleer bij het toevoegen of wijzigen van externe scripts, afbeeldingen, auth-endpoints of API-calls direct [`next.config.ts`](../../next.config.ts) (`headers()` CSP en `images.remotePatterns`):
- **Supabase Auth & Database (`connect-src`)**: `https://*.supabase.co` (en `wss://*.supabase.co` indien realtime actief).
- **TMDB Images (`img-src`)**: `https://image.tmdb.org` (strikt beperkt tot `pathname: '/t/p/**'` in `images.remotePatterns`).
- **Vercel Preview Toolbar / Analytics** *(indien ingeschakeld)*: sta benodigde Vercel preview-scripts uitsluitend gecontroleerd toe.
- **Testen met `Report-Only`**: test een volledige `script-src` / `default-src` CSP bij voorkeur eerst met `Content-Security-Policy-Report-Only` op een Vercel Preview deployment (`development`), zodat Next.js 16 inline hydration/PPR scripts niet stilzwijgend blokkeren.

## 3. Open-Redirect & Link-Veiligheid
- **Open-Redirect Mitigatie**: valideer elke `next` / `redirectAfterLogin` URL in login-, register- en PKCE callback-flows (`/auth/callback`) **ALTIJD** via `getSafeRedirectPath()` (`@/lib/utils`). Externe of protocol-relatieve URL's (zoals `'/' + '/'`) zijn ten strengste verboden.
- **Externe Links**: gebruik op externe `<a target="_blank">` en `<Link target="_blank">` links altijd `rel="noopener noreferrer"`.

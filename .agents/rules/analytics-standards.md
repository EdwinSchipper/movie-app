---
trigger: always_on
---

# Analytics, Tag Management & Privacy Richtlijnen (GTM / GA4 & Zero-PII)

Indien Google Tag Manager, Google Analytics 4 of privacy-toestemming in dit project wordt toegepast, gelden strikte architecturale en AVG/GDPR-standaarden conform de officiële Next.js 16 (`node_modules/next/dist/docs/01-app/02-guides/third-party-libraries.md`) en Google Consent Mode v2 documentatie.

## 1. Architectuur & Scheiding
- **Modulaire Isolatie**: Plaats alle tracking- en consent-logica (`GTMPageTracker`, `CookieConsent`, `analytics-utils`) in `components/features/analytics/` met expliciete named exports in `components/features/analytics/index.ts`.
- **Pure Layout Shell**: Houd `app/layout.tsx` vrij van inline `<script>` logica en directe `process.env` reads; roep uitsluitend feature-componenten aan.
- **Centralized Environment**: Lees tracking-ID's (`NEXT_PUBLIC_GTM_ID`) uitsluitend via `env` uit `@/lib/env`.

## 2. Google Consent Mode v2 & `IArguments` Protocol
- Initialiseren met de vier vereiste v2 consent-parameters (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`, `wait_for_update: 500`) voordat `gtm.js` laadt.
- Gebruik altijd een strikt getypeerde helper die een authentiek `IArguments` object (`arguments`) naar `window.dataLayer` pusht (nooit rest-parameter arrays of `(window as any)` casts).

## 3. App Router Tracking & React 19
- Gebruik `@next/third-parties/google` (`GoogleTagManager` en `sendGTMEvent`).
- Isoleer `usePathname` en `useSearchParams` altijd binnen `<Suspense fallback={null}>`.
- Gebruik geen legacy `setTimeout(..., 100)` workarounds; React 19 hoist `<title>` synchroon vóór `useEffect`.

## 4. AVG/GDPR & Zero-PII Policy
- **STRIKT VERBODEN**: Stuur NOOIT Personally Identifiable Information (PII) zoals `user.id`, e-mailadressen, IP-adressen of persoonlijke watchlist-inhoud mee in events of URL-parameters richting analytics-providers.
- Synchroniseer benodigde externe domeinen (`googletagmanager.com`, `google-analytics.com`) altijd met de Content Security Policy in `next.config.ts` ([`.agents/rules/security-headers.md`](security-headers.md)).

---
trigger: always_on
---

# Image Optimization & Vercel Richtlijnen (Image Optimization Policy)

Afbeeldingen worden uitsluitend geleverd via `next/image` (op Vercel via Vercel Image Optimization en het Vercel Edge Network) volgens de officiële documentatie van **de geïnstalleerde Next.js versie** (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`). Lees bij elke versie-upgrade eerst de `Version History` tabel in die documentatie en werk deze rule bij.

## 1. Versie-gedreven Standaarden
- Controleer vóór elke wijziging de geïnstalleerde `next` versie en de bijbehorende lokale docs; neem nooit voorbeelden uit oudere Next.js versies over.
- **Zero-Deprecation**: Gebruik nooit `@deprecated` image props of config. Voor Next.js 16+:
  - `priority` is deprecated → gebruik `preload` (of `loading="eager"` / `fetchPriority="high"`).
  - `onLoadingComplete` is deprecated → gebruik `onLoad`.
  - `images.domains` is deprecated → gebruik `remotePatterns`.
  - `next/legacy/image` is verboden.

## 2. `next.config.ts` Standaardconfiguratie (Vercel-geoptimaliseerd)
| Optie | Standaard / Richtlijn | Reden |
| --- | --- | --- |
| `formats` | `["image/webp"]` (aanbevolen) | Houdt Vercel cache-varianten en transformatiequotum beheerst |
| `qualities` | `[75]` (indien geconfigureerd) | Verplicht bij expliciete `quality`-prop sinds Next.js 16 |
| `minimumCacheTTL` | `2678400` (31 dagen, aanbevolen) | Lange Vercel Edge cacheduur voor statische TMDB-posters |
| `deviceSizes` / `imageSizes` | Afgestemd op poster- & hero-breedtes | Beperkt onnodige varianten op Vercel |
| `remotePatterns` | Strikte allowlist `https://image.tmdb.org` met `pathname: '/t/p/**'` | Voorkomt misbruik van de Vercel Image Optimizer door externe URL's |

## 3. Component-regels (`next/image`)
- **Centrale URL-opbouw**: gebruik altijd `getTmdbImageUrl(path, size)` uit `@/lib/utils` (`lib/utils/media.ts`) i.p.v. losse `https://image.tmdb.org/...` strings.
- **`sizes` is verplicht** bij `fill`-afbeeldingen en bevat uitsluitend geldige CSS media queries (bijv. `"(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"`). Tailwind-notatie (`"sm:50vw md:200px"`) is ongeldig en verboden.
- Breakpoints in `sizes` sluiten aan op Tailwind v4 (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px) en de werkelijke gerenderde kolombreedte.
- Alleen het enkele LCP-beeld boven de vouw krijgt `preload` / `fetchPriority="high"`; maximaal één LCP-preload per route.
- `quality` mag uitsluitend een waarde uit `images.qualities` zijn (indien geconfigureerd).
- `unoptimized` voor SVG, GIF en lokale micro-afbeeldingen < 10 KB (`.svg` wordt automatisch overgeslagen).
- Altijd expliciete `width`/`height` of `fill` in een parent met vaste ratio (`aspect-2/3`, `aspect-video`) voor CLS-vrije rendering; skeletons spiegelen dezelfde aspect-ratio.

## 4. Verificatie
```bash
git grep -n -P "\bpriority\b" -- "app/" "components/"
git grep -n -P "sizes=\x22[^\x22]*\b(sm|md|lg|xl):" -- "app/" "components/"
git grep -n -E "quality=\{" -- "app/" "components/"
```
*(Bovenstaande controles horen in principe 0 deprecation/syntaxfouten op te leveren; `quality` waarden moeten binnen `images.qualities` vallen.)*

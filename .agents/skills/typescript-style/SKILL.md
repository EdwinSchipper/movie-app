---
name: typescript-style
description: Strikte TypeScript 5 conventies, Zero-Any en Zero-Deprecation beleid, Zod 4 schema's en expliciete type-barrels in types/.
---

# TypeScript, Zod 4 & Type Architectuur

## Wanneer te gebruiken

- Bij het toevoegen of aanpassen van interfaces en schema's in [`types/`](../../../types/), component-props of ESLint/TSConfig instellingen.

## Instructies

### Strikte Type-Safety, Zero-Any & Zero-Deprecation

- [`tsconfig.json`](../../../tsconfig.json) staat op `"strict": true` met `"jsx": "react-jsx"` en pad-alias `@/*`.
- **Zero-Any Policy**: gebruik geen `any` of `as any` casts in `app/`, `components/`, `lib/` of `types/`. Vang TMDB- en Supabase-variaties altijd type-veilig op via nullable interfaces in [`types/tmdb.ts`](../../../types/tmdb.ts) en schema's in [`types/auth.ts`](../../../types/auth.ts).
- **Zero-Deprecation Policy (`ts 6385`)**: controleer vóór gebruik altijd `.d.ts` definities in `node_modules/`. Volg voor Zod 4 altijd [`.agents/rules/zod-validation.md`](../../rules/zod-validation.md): gebruik top-level validators (`z.email()`, `z.url()`, `z.uuid()`, `z.int()`), `.extend()` en `.safeParse()` — nooit deprecated Zod v3 chaining (zoals `z.string().email()`, `.merge()`, `.passthrough()`, `.finite()`).
- **React 19 `react-jsx` & `ref` Prop**: voeg geen onnodig `import React from 'react'` toe; gebruik `import type { ReactNode, Ref }` waar nodig en geef `ref` rechtstreeks door als prop in custom UI primitives (`UIInput`) zonder `forwardRef`.

### DRY Media Types & Expliciete Barrels

- Alle `'use server'` bestanden in [`lib/`](../../../lib/) bevatten uitsluitend async functies; gedeelde types en Zod-schema's staan in [`types/`](../../../types/).
- Media-actie en database-interfaces erven verplicht over van `MediaActionPayload` in [`types/media.ts`](../../../types/media.ts).
- [`types/index.ts`](../../../types/index.ts) gebruikt uitsluitend expliciet benoemde `export { ... }` en `export type { ... }` re-exports (nooit `export *`).

### Component Props & Naamgeving

- Exporteer voor elk component een `export interface *Props` met `camelCase` properties.
- Gebruik `heading` en `subheading` voor UI-sectiekoppen zodat `title` strikt gereserveerd blijft voor media-titels (`item.title`, `movie.title`) en HTML-attributen.
- Pas de No Abbreviations Policy toe (`Button`, nooit `Btn`; `RecommendationButton`, nooit `AddToRecommendationsBtn`).

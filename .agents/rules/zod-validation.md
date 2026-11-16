---
trigger: always_on
---

# Zod 4 Validatie & Schema Richtlijnen (Zod Validation Policy)

In dit project hanteren we **Zod v4** (`zod@^4.6.x`) voor alle runtime-validatie van omgevingsvariabelen, formulieren, Server Action payloads en externe invoer. Controleer bij nieuwe Zod-constructies altijd de geïnstalleerde typings in [`node_modules/zod/v4/classic/schemas.d.ts`](../../node_modules/zod/v4/classic/schemas.d.ts) en [`errors.d.ts`](../../node_modules/zod/v4/classic/errors.d.ts).

## 1. Versie-gedreven Zod 4 Syntax (Zero-Deprecation `ts 6385`)
Gebruik uitsluitend moderne Zod 4 top-level functies en methodes. Zod v3 method-chaining die als `@deprecated` is gemarkeerd is ten strengste verboden:

- **Top-level String Formats (verplicht boven string-methods)**:
  - `z.email(...)` i.p.v. deprecated `z.string().email()`
  - `z.url(...)` / `z.httpUrl(...)` i.p.v. deprecated `z.string().url()`
  - `z.uuid(...)` i.p.v. deprecated `z.string().uuid()`
  - `z.iso.datetime()`, `z.iso.date()`, `z.iso.time()` i.p.v. deprecated `z.string().datetime()` / `.date()` / `.time()`
  - `z.jwt()`, `z.base64()`, `z.ipv4()`, `z.ipv6()`, `z.cuid2()`, `z.ulid()`, `z.nanoid()` i.p.v. string-chain varianten
- **Numbers & Integers**:
  - Gebruik `z.int(...)` voor gehele getallen (`tmdb_id`, `tile_count_preference`) i.p.v. legacy `z.number().int()` of deprecated `.safe()`.
  - Gebruik nooit deprecated `.finite()` (`z.number()` weigert `Infinity`/`NaN` al standaard in Zod 4) of `.step()` (gebruik `.multipleOf()`).
- **Objects & Enums**:
  - Gebruik `z.object()`, `z.strictObject()` en `z.looseObject()` (nooit deprecated `.passthrough()`).
  - Breid objectschema's uit met `schemaA.extend(schemaB.shape)` i.p.v. deprecated `schemaA.merge(schemaB)` of `mediaActionPayloadSchema.extend({ ... })`.
  - Gebruik `z.enum(['movie', 'tv'])` voor vaste string-unions (nooit deprecated `z.nativeEnum()`).
- **Foutmeldingen & Error Handling**:
  - Geef foutmeldingen door als directe string (`z.email('Vul een geldig e-mailadres in.')`, `z.string().min(1, '...')`) of via `{ error: '...' }`; gebruik nooit legacy `invalid_type_error` of `required_error`.
  - Lees validatiefouten uit via `parseResult.error.issues[0]?.message` of formatteer met `z.treeifyError(err)` / `z.prettifyError(err)` / `z.flattenError(err)` (nooit deprecated `error.format()` of `error.flatten()`).

## 2. Architectuur & Plaatsing (`types/` & `lib/env.ts`)
- **Centrale Schema-Locatie**:
  - Alle gedeelde domein-, formulier- en actie-schema's wonen in `types/*.ts` ([`types/auth.ts`](../../types/auth.ts), [`types/media.ts`](../../types/media.ts), [`types/watchlist.ts`](../../types/watchlist.ts)) en worden expliciet benoemd geëxporteerd via [`types/index.ts`](../../types/index.ts).
  - Omgevingsvariabelen-schema's (`publicEnvSchema`, `serverEnvSchema`) wonen uitsluitend in [`lib/env.ts`](../../lib/env.ts).
  - Definieer nooit losse inline Zod-schema's midden in UI-componenten of Server Actions.
- **Type-Inference (`z.infer`)**:
  - Leid gedeelde types af via `z.infer<typeof ...Schema>` (of `z.output` / `z.input`), nooit via deprecated `schema._output` of `schema._input`.

## 3. Verplichte Boundary-Validatie met `.safeParse()` in Server Actions
- Valideer alle onvertrouwde input (formulierdata, RPC-/actieparameters, payloads) op de server-grens met `.safeParse(...)` (eventueel via herbruikbare validatie-helpers zoals `validateMediaActionPayload()` en `validateMediaTarget()` in [`lib/utils/media.ts`](../../lib/utils/media.ts)).
- Gebruik in Server Actions (`'use server'`) **nooit** ongecontroleerde `.parse(...)` (wat een uncaught `ZodError` gooit naar de UI), maar zet `!parseResult.success` altijd om in een getypeerd `ActionResult`:
  ```ts
  {
    success: false,
    error: parseResult.error.issues[0]?.message || 'Controleer de ingevoerde gegevens.',
  }
  ```

## 4. Verificatie (Quality Gate)
```bash
git grep --untracked -n -P "z\.string\([^)]*\)\.(email|url|uuid|datetime|date|time|ip|cidr|cuid|ulid|nanoid|base64|jwt)\b|\.(passthrough|merge|finite|safe)\(" -- "app/" "components/" "lib/" "types/"
```
*(0 resultaten toegestaan).*

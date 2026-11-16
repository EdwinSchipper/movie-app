---
trigger: always_on
---

# Master Production Quality Gate & Pre-Flight Checks

Vóór ELKE commit en vóór ELKE push naar een remote branch (`development` of `master`) MOET de agent de Master Production Quality Gate proactief en zonder uitzondering lokaal valideren. Deze regels sluiten direct aan op [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

## 1. Zero-Comment Policy (Geen `//` of `{/* */}`)
Productiecode moet zelfdocumenterend en schoon zijn. Achtergebleven inline commentaar, TODO's of uitgecommente code in applicatiebestanden zijn niet toegestaan.

- **Verificatiecommando** (inclusief untracked bestanden):
  ```bash
  git grep --untracked -n -P "(^|[^:])//|\{/\*" -- "app/" "components/" "lib/" "types/"
  ```
  *(0 resultaten toegestaan; enkel officiële JSDoc/TSDoc documentatieblokken `/** ... */` en URL-protocollen `https://` zijn toegestaan)*.
- **Let op string literals**: gebruik in code nooit twee opeenvolgende slashes (`//`) in strings of regexes (tenzij voorafgegaan door `:`), omdat de CI-regex dit markeert als commentaar. Gebruik veilige alternatieven zoals `'/' + '/'`.

## 2. Zero-Console Policy
Geen achtergebleven `console.log` statements in client- of servercode:
```bash
git grep --untracked -n "console\.log(" -- "app/" "components/" "lib/" "types/"
```
*(0 resultaten toegestaan. Gebruik uitsluitend gecontroleerde `console.error` of `console.warn` bij expliciete foutafhandeling).*

## 3. Zero-Wildcard Database Queries Policy
Geen `select('*')` wildcards in Supabase / PostgreSQL queries:
```bash
git grep --untracked -n -E "\.select\(\s*['\"]\*['\"]\s*\)" -- "app/" "components/" "lib/" "types/"
```
*(0 resultaten toegestaan. Vraag altijd exact de benodigde kolommen op).*

## 4. Zero-Any, Zod 4 & Centralized Environment Gates
- **Geen `any` of `as any` casts**:
  ```bash
  git grep --untracked -n -P "\bas any\b|:\s*any\b" -- "app/" "components/" "lib/" "types/"
  ```
- **Geen deprecated Zod v3 syntaxes** ([`.agents/rules/zod-validation.md`](zod-validation.md)):
  ```bash
  git grep --untracked -n -P "z\.string\([^)]*\)\.(email|url|uuid|datetime|date|time|ip|cidr|cuid|ulid|nanoid|base64|jwt)\b|\.(passthrough|merge|finite|safe)\(" -- "app/" "components/" "lib/" "types/"
  ```
- **Geen directe `process.env` buiten `lib/env.ts`**:
  ```bash
  git grep --untracked -n "process\.env" -- "app/" "components/" "lib/" "types/" ":!lib/env.ts"
  ```
*(0 resultaten toegestaan).*

## 5. Image Optimization & Design Token Gates
Conform [`.agents/rules/image-optimization.md`](image-optimization.md), [`.agents/rules/official-stack-standards.md`](official-stack-standards.md) en [`.agents/rules/accessibility.md`](accessibility.md):
```bash
git grep --untracked -n -P "\bpriority\b" -- "app/" "components/"
git grep --untracked -n -P "sizes=\x22[^\x22]*\b(sm|md|lg|xl):" -- "app/" "components/"
git grep --untracked -n -E "(bg|text|border|ring)-(gray|blue|red)-" -- "components/ui/"
git grep --untracked -n -E "<Link[^>]*>\s*<UIButton|<UIButton[^>]*>\s*<Link" -- "app/" "components/"
```
*(Bovenstaande controles moeten 0 resultaten opleveren: `preload` i.p.v. deprecated `priority`, geldige CSS media-queries in `sizes`, geen hardcoded `gray-*`/`blue-*`/`red-*` in `components/ui/`, en geen geneste `<Link>` + `<UIButton>` combinaties — gebruik `<UIButton href="...">`.)*

## 6. Linter, Unused-Code, Type-Safety & Build Gates
- **Ongebruikte imports, variabelen & parameters (`react-jsx`)**:
  ```bash
  pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters
  ```
- **TypeScript compilatie**:
  ```bash
  pnpm type-check
  ```
  *(Moet eindigen met 0 fouten, `tsc --noEmit`)*.
- **ESLint Strict Gate**:
  ```bash
  pnpm lint --max-warnings=0
  ```
  *(Moet slagen met 0 errors en 0 warnings).*
- **Next.js Productiebuild** (bij build-, config- of grote architectuurwijzigingen):
  ```bash
  pnpm build
  ```
  *(Moet succesvol compileren op Vercel/Turbopack zonder errors).*

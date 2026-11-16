---
name: testing
description: Master Production Quality Gate, pre-flight validatie, GitHub Actions CI-workflows en geheimbeheer voor Vercel en Supabase.
---

# Testing, Pre-Flight Validatie & Geheimbeheer

## Wanneer te gebruiken

- Vóór elke voorgestelde commit, bij het controleren van de GitHub Actions CI-pipeline of voorafgaand aan een merge naar `master` (Vercel Production).

## Instructies

### Master Production Quality Gate

Voer vóór elke commit lokaal de volledige pre-flight controle uit conform [`.agents/rules/quality-gate.md`](../../rules/quality-gate.md) en [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml):

1. **Zero-Comment check**:
   `git grep --untracked -n -P "(^|[^:])//|\{/\*" -- "app/" "components/" "lib/" "types/"` (0 resultaten).
2. **Zero-Console check**:
   `git grep --untracked -n "console\.log(" -- "app/" "components/" "lib/" "types/"` (0 resultaten).
3. **Zero-Wildcard Database Queries check**:
   `git grep --untracked -n -E "\.select\(\s*['\"]\*['\"]\s*\)" -- "app/" "components/" "lib/" "types/"` (0 resultaten).
4. **Zero-Any, Zod 4 Deprecation & Centralized Env check**:
   `git grep --untracked -n -P "\bas any\b|:\s*any\b" -- "app/" "components/" "lib/" "types/"`, `git grep --untracked -n -P "z\.string\([^)]*\)\.(email|url|uuid|datetime|date|time|ip|cidr|cuid|ulid|nanoid|base64|jwt)\b|\.(passthrough|merge|finite|safe)\(" -- "app/" "components/" "lib/" "types/"` en `git grep --untracked -n "process\.env" -- "app/" "components/" "lib/" "types/" ":!lib/env.ts"` (0 resultaten).
5. **Type-Safety, Unused-Code & ESLint**:
   `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm type-check` en `pnpm lint --max-warnings=0` moeten met 0 fouten en 0 waarschuwingen slagen.
6. **Productie-build**:
   `pnpm build` moet succesvol compileren bij build-, config- of structurele wijzigingen.

### Geheimbeheer (Credentials Policy)

- Commit nooit echte `TMDB_API_KEY`, Supabase keys of `.env*.local` bestanden; echte geheimen horen uitsluitend in `.env.local` (lokaal), GitHub Actions Secrets (`CI`) en Vercel Environment Variables (gescheiden tussen Preview en Production). Gebruik [`.env.example`](../../../.env.example) uitsluitend voor placeholders.

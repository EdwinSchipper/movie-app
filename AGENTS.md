<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git Commit Message Guidelines

Commit messages moeten te allen tijde haarscherp, specifiek en informatief zijn. Generieke of vage omschrijvingen zijn niet toegestaan.

### 1. Format
```text
<type>(<specifieke-scope>): <gebiedende wijs omschrijving van de kernwijziging>

[Verplichte body bij wijzigingen met meer dan 1 regel of bij logica-aanpassingen]
- Waarom: <concrete aanleiding, bug of doel>
- Wat: <specifieke functies, interfaces, components of bestanden die zijn gewijzigd>
- Impact: <technische of visuele consequentie, bijv. type-safety, Suspense streaming, SEO>
```

### 2. Typen & Specifieke Scopes
- `feat`: Nieuwe functionaliteit of route (bijv. `(movie-detail)`, `(trending-tv)`)
- `fix`: Bugfix of runtime correctie (bijv. `(tmdb-api)`, `(types)`)
- `refactor`: Structuur- of architectuurwijziging zonder feature-wijziging (bijv. `(features-folder)`, `(choice-alias)`)
- `style`: Visuele afwerking of CSS (bijv. `(back-link)`, `(switch-ui)`)
- `docs`: Documentatie of agent instructies (bijv. `(agents-md)`, `(readme)`)
- `chore`: Tooling, configs, dependencies (bijv. `(next-config)`, `(eslint)`)

### 3. Strikte Kwaliteitseisen
1. **Geen vage omschrijvingen**: Gebruik nooit generieke termen zoals "update code", "fix bug", "changes", "tweaks" of "refactor components".
2. **Specifieke Scopes**: Gebruik de meest nauwe scope (`(tv-detail)` i.p.v. `(app)` of `(components)`).
3. **Benoem het 'Wat' én het 'Waarom'**: Een commit message moet over 6 maanden nog exact duidelijk maken welke ontwerpkeuze is gemaakt.

### 4. Voorbeelden (Goed vs. Fout)
| Fout (te generiek) ❌ | Goed (specifiek en contextrijk) ✅ |
| :--- | :--- |
| `feat(detail): add page` | `feat(tv-detail): add dynamic /tv/[id] page with Suspense streaming` |
| `refactor(ui): update switch` | `refactor(switch-ui): adopt TimeWindow choice alias to remove boolean translation` |
| `refactor(components): reorder folders` | `refactor(components): split generic UI and domain features into dedicated subfolders` |
| `style(tv): update hover` | `style(tv-detail): update back navigation link hover color to blue-600` |

## Wijzigingen & Goedkeuringsbeleid (Change Approval Policy)

- **STRIKT VERBODEN: Nooit zelfstandig commits maken**:
  - Voer NOOIT uit eigen beweging een `git commit` of `git push` uit.
  - Vraag na het valideren/testen altijd eerst aan de gebruiker of er gecommit mag worden, of stel een commitbericht voor.
  - Voer `git commit` UITSLUITEND en ALLEEN uit wanneer de gebruiker hier expliciet en letterlijk opdracht toe heeft gegeven (bijv. "commit", "maak een commit", "ja commit").

- **Aanpassingen niet automatisch accepteren / doorvoeren**:
  - Voer geen ingrijpende wijzigingen, bestandsoverschrijvingen of configuratie-aanpassingen stilzwijgend of automatisch door zonder dat de gebruiker hiervoor expliciet akkoord heeft gegeven of erom heeft gevraagd.
  - Leg voorgestelde wijzigingen altijd eerst duidelijk uit (welke bestanden, wat er verandert en waarom), zodat de gebruiker deze kan beoordelen.
  - Geef de gebruiker te allen tijde de regie over het accepteren of weigeren van codeaanpassingen en git commits.
  - Vraag bij twijfel of meerdere oplossingsrichtingen eerst om verduidelijking of toestemming voordat je bestanden wijzigt.

## Import-integriteit & Refactoring Beleid (Import Integrity & Cleanup Policy)

Na elke herstructurering, verplaatsing van bestanden (`git mv`), hernoeming of refactoring MOET de agent altijd proactief en zonder dat de gebruiker hierom hoeft te vragen de volgende controles uitvoeren:
1. **Codebase-breed zoeken op oude paden en exports**:
   - Controleer via grep of verouderde relatieve paden (bijv. `./Header`, `components/ui/Header`) of oude identifiers ergens zijn achtergebleven.
   - Loop alle betrokken `index.ts` (barrel) bestanden na: verwijder verouderde exports en zorg dat nieuwe paden correct zijn opgenomen.
2. **Afhankelijkheids- & typecontrole**:
   - Voer altijd `npx tsc --noEmit` uit om te verifiëren dat alle TypeScript imports en types sluitend zijn.
   - Voer altijd `pnpm lint` uit om te garanderen dat de linter geen ongebruikte variabelen of verouderde imports signaleert.
3. **Documentatie & referenties**:
   - Controleer of documentatiebestanden (zoals `README.md`) of tests nog verwijzen naar verouderde structuren en werk deze direct bij.
4. **Proactieve rapportage**:
   - Meld de uitkomst van deze import- en syntaxcontroles altijd expliciet in de samenvatting aan de gebruiker.



## Database & Query Richtlijnen (Database & Query Policy)

- **STRIKT VERBODEN: Nooit `select('*')` gebruiken**:
  - Het gebruik van wildcards (`*`) in database queries (Supabase / PostgreSQL) is ten strengste verboden.
  - Vraag ALTIJD exact en expliciet alleen de benodigde kolommen op (bijv. `.select('id, user_id, title, ...')`).
- **Waarom**:
  1. Performance & Bandbreedte: minimaliseert datatransmissie tussen database en server.
  2. Type-Safety: garandeert dat geretourneerde data 1-op-1 aansluit op TypeScript interfaces.
  3. Beveiliging: voorkomt dat toekomstige interne of gevoelige kolommen onbedoeld meelekken naar de client.


## Officiële Stack & Architectuur Richtlijnen (Official Stack Policy)

- **STRIKT VERPLICHT: Uitsluitend officiële werkwijzen conform stack-documentatie**:
  - Pas in dit project alleen patronen en implementaties toe die volledig in lijn zijn met de officiële documentatie van **Next.js 16** (`node_modules/next/dist/docs/`), **React 19** (React Foundations: `Components`, `Props`, `State`), **Supabase SSR**, **TMDB API v3**, **Tailwind CSS v4** en **Headless UI**.
  - Geen ad-hoc workarounds, inline placeholder-hacks of ongedocumenteerde constructies.
- **Architectuurstandaarden**:
  1. **App Router & Suspense Streaming**: `app/**/page.tsx` bestanden zijn slanke Server Component shells die feature-componenten uit `@/components` renderen; dynamische data wordt via een async `*Content` sub-component binnen `<Suspense>` gestreamd met een `*Skeleton` fallback.
  2. **React Core Concepts & Naamgeving**: Componenten en `*Props` interfaces gebruiken `PascalCase`, prop-namen gebruiken `camelCase` met object destructuring, en `'use client'` wordt enkel op interactieve leaf-componenten geplaatst.
  3. **Scheiding `types/` en `lib/`**: `'use server'` bestanden in `lib/` bevatten uitsluitend async functies; alle gedeelde interfaces staan in `types/` en worden via `types/index.ts` geëxporteerd.

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

- **Aanpassingen niet automatisch accepteren / doorvoeren**:
  - Voer geen ingrijpende wijzigingen, bestandsoverschrijvingen of configuratie-aanpassingen stilzwijgend of automatisch door zonder dat de gebruiker hiervoor expliciet akkoord heeft gegeven of erom heeft gevraagd.
  - Leg voorgestelde wijzigingen altijd eerst duidelijk uit (welke bestanden, wat er verandert en waarom), zodat de gebruiker deze kan beoordelen.
  - Geef de gebruiker te allen tijde de regie over het accepteren of weigeren van codeaanpassingen en git commits.
  - Vraag bij twijfel of meerdere oplossingsrichtingen eerst om verduidelijking of toestemming voordat je bestanden wijzigt.

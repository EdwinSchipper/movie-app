---
trigger: always_on
---

# Git Commit Message Guidelines (Nederlands)

Commit messages moeten te allen tijde haarscherp, specifiek en informatief zijn. Generieke of vage omschrijvingen zijn niet toegestaan.
Als **harde regel** geldt dat de voertaal van alle commit messages (onderwerp en body) **ALTIJD het Nederlands** is.

### 1. Formaat
```text
<type>(<specifieke-scope>): <gebiedende wijs omschrijving van de kernwijziging in het Nederlands>

[Verplichte body bij wijzigingen met meer dan 1 bestand of bij logica-aanpassingen]
- Waarom: <concrete aanleiding, bug of doel>
- Wat: <specifieke functies, interfaces, componenten of bestanden die zijn gewijzigd>
- Impact: <technische of visuele consequentie, bijv. type-safety, Suspense streaming, Vercel build>
```

### 2. Typen & Specifieke Scopes
- `feat`: Nieuwe functionaliteit of route (bijv. `(movie-detail)`, `(trending-tv)`, `(toast)`)
- `fix`: Bugfix of runtime/styling correctie (bijv. `(tmdb-api)`, `(types)`, `(postcss)`)
- `perf`: Performance-, caching- of streaming-optimalisatie (bijv. `(suspense-streaming)`, `(image-delivery)`)
- `refactor`: Structuur- of architectuurwijziging zonder feature-wijziging (bijv. `(ui-input)`, `(utils-helpers)`)
- `style`: Visuele afwerking of CSS conform design system (bijv. `(back-link)`, `(branding-tokens)`)
- `docs`: Documentatie of agent instructies (bijv. `(agents-md)`, `(readme)`)
- `chore`: Tooling, configs, dependencies (bijv. `(next-config)`, `(eslint)`, `(deps)`)

### 3. Strikte Kwaliteitseisen
1. **Geen vage omschrijvingen**: Gebruik nooit generieke termen zoals "update code", "fix bug", "changes", "tweaks" of "refactor components".
2. **Specifieke Scopes**: Gebruik de meest nauwe scope (`(tv-detail)` i.p.v. `(app)` of `(components)`).
3. **Benoem het 'Wat' én het 'Waarom'**: Een commit message moet over 6 maanden nog exact duidelijk maken welke ontwerpkeuze is gemaakt.
4. **Voertaal ALTIJD Nederlands**: Zowel de onderwerpregel als de body zijn in het Nederlands geschreven.

### 4. Voorbeelden (Goed vs. Fout)
| Fout (te generiek / Engels) ❌ | Goed (specifiek, contextrijk & Nederlands) ✅ |
| :--- | :--- |
| `feat(detail): add page` | `feat(tv-detail): voeg dynamische /tv/[id] pagina met Suspense streaming toe` |
| `fix(ui): fix input` | `refactor(ui-input): forward ref expliciet door naar HeadlessInput primitive` |
| `refactor(components): reorder` | `refactor(components): splits generieke UI-primitives en domeinfeatures op in submappen` |
| `docs: update docs` | `docs(readme): herstructureer documentatie en benoem placeholder UI en responsive roadmap` |

### 5. Vercel & Release Workflow (`development` → `release/master` → `master`)
- **`development` branch**: werkbranch met `.agents/` en `AGENTS.md`; genereert na push automatisch een Vercel **Preview Deployment**.
- **Release Branch (`pnpm release:master`)**: bouwt via [`scripts/release-master.mjs`](../../scripts/release-master.mjs) de schone branch `release/master` vanaf `origin/master` met de inhoud van `development`, **exclusief `.agents/` en `AGENTS.md`**.
- **`master` branch**: genereert na merge/push automatisch de **Production Deployment** (`movie-app-pi-flame-56.vercel.app`) nadat de GitHub Actions **Master Production Quality Gate** groen is.
- Schakel na het pushen van `release/master` (`git push -u --force-with-lease origin release/master`) altijd terug naar `development` en geef direct de Pull Request link mee:
  `https://github.com/EdwinSchipper/movie-app/compare/master...release/master?expand=1`
- Maak na validatie altijd eerst een helder overzicht en stel een Nederlands commitbericht voor; voer pas `git commit` of `git push` uit na expliciet akkoord van de gebruiker.

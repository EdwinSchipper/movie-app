---
trigger: always_on
---

# Accessibility (WCAG 2.2 AA) & Reduced Motion Richtlijnen

Toegankelijkheid is standaard onderdeel van elke UI- en media-component binnen de geïnstalleerde stack (**Next.js 16.4**, **React 19**, **Headless UI v2**, **Tailwind CSS v4**). Let op: `eslint-config-next/core-web-vitals` activeert slechts een basisset `jsx-a11y/*`-regels; onderstaande standaarden vullen dat aan.

## 1. Landmarks, Semantiek & Structuur
- **Benoemde Landmarks**: Gebruik semantische regio's (`<header>`, `<main>`, `<footer>`, `<nav aria-label="...">`) en geef zelfstandige secties (zoals de Hero en overzichtssecties) bij voorkeur `<section aria-labelledby="...">` gekoppeld aan de bijbehorende heading (`id`).
- **Heading-hiërarchie**: Gebruik precies één `<h1>` per pagina en een doorlopende hiërarchie (`h1` → `h2` → `h3`) zonder niveaus over te slaan.
- **Tijd & Datum (`<time>`)**: Tijdstippen, release-datums en registratiedatums gebruiken waar mogelijk een semantisch `<time dateTime="...">` element (geen losse `<span>` met `aria-label`).
- **Decoratieve Tekens & Context**: Decoratieve symbolen en scheidingstekens (`•`, `★`, status-stippen) krijgen `aria-hidden="true"`. Geef schermlezercontext waar nodig via `<span className="sr-only">` (bijv. `Beoordeling: `, `Media-type: `).
- **Afbeeldingen**: Decoratieve `<Image>` / SVG-ornamenten krijgen `alt=""` (en `aria-hidden="true"` op de container); filmposters en backdrops gebruiken de volledige titel of een beschrijvende tekst als `alt`.

## 2. Touch Targets, Keyboard & Headless UI v2
- **Touch Targets (WCAG 2.2 AA+)**: Alle knoppen en interactieve links zijn minimaal `24×24px` (voor primaire mobiele acties streven naar `44×44px`).
- **Geen Geneste Interactieve Elementen**: Plaats nooit een `<button>` binnen een `<a>`/`<Link>` of andersom; style een `<Link>` rechtstreeks als knop of gebruik navigatie-triggers buiten het anker.
- **Focus, Toetsenbord & Feedback**: Interactieve controls (`UIButton`, `UIInput`, `UISelect`, `UISwitch`) gebruiken `@headlessui/react` v2 (zonder `@deprecated` aliassen). Overlays en dropdowns (zoals `HeaderSearch`) sluiten met `Escape` en click-outside en hervatten focus logisch. Alle interactieve elementen behouden zichtbare focus-ringen (`:focus-visible` / `data-focus:ring-2`). Toast-meldingen (`ToastProvider`) gebruiken `role="status"` / `aria-live="polite"`.

## 3. Contrast, Media Scrims & Streaming (Next.js 16)
- **Scrims Over Media**: Tekst boven film-backdrops (zoals `DashboardHero`) en posters krijgt contrasterende gradient scrims op basis van design tokens uit `app/globals.css`.
- **CLS-vrije Skeletons**: `<Suspense fallback={<*Skeleton />}>` componenten spiegelen de werkelijke layout-afmetingen en `aspect-2/3` verhoudingen zodat streaming geen visuele of focus-sprongen veroorzaakt.

## 4. `prefers-reduced-motion` (React 19 + Tailwind CSS v4)
- **CSS Reduced Motion**: Decoratieve CSS-animaties en skeleton pulse-effecten dragen `motion-reduce:transition-none` of `motion-reduce:animate-none`.
- **Hydration-Veilige Media (`useSyncExternalStore`)**: Eventuele achtergrondvideo's of automatische carrousels lezen `(prefers-reduced-motion: reduce)` uit via `useSyncExternalStore` met `getServerSnapshot = () => true`, zodat beweging nooit ongewenst vóór hydratie start.

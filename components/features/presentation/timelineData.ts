import type { TimelineFlowSpec } from '@/types'

export const TIMELINE_FLOW_SPECS: TimelineFlowSpec[] = [
  {
    id: 'home',
    routePath: '/',
    routeHref: '/',
    label: 'Startpagina',
    badge: 'Publiek + Header Auth',
    scopeTone: 'emerald',
    summary:
      'Pure shells renderen direct. Header-blokken en Dashboard-secties hangen parallel onder de pagina en delen één gecachte auth-aanvraag.',
    keyTakeaway:
      'MainNav, UserNav en DashboardCards vragen alle drie getAppUser() op; React.cache() voert Supabase Auth per request maar 1× uit.',
    stages: [
      {
        id: 'home-t0',
        order: 'T0',
        title: 'Sessiepoort',
        subtitle: 'Proxy ververst auth-cookies vóór elke server render.',
        gateTrigger: 'Binnenkomend request voor /',
        layout: 'single',
        blocks: [
          {
            id: 'home-proxy',
            name: 'proxy(request)',
            filePath: 'proxy.ts',
            role: 'Proxy',
            status: 'waiting',
            statusLabel: 'Wacht af',
            microNote: 'await updateSession()',
            summary:
              'Elke request passeert eerst de Next.js 16 proxy (assets uitgezonderd) zodat access tokens vers zijn voordat Server Components starten.',
            promises: [
              {
                call: 'await updateSession(request)',
                status: 'waiting',
                statusText: 'Controleert en ververst auth-cookies voor SSR',
              },
            ],
            proceedsWhen:
              'Zodra updateSession() antwoordt, mag Next.js naar RootLayout en Page.',
          },
        ],
      },
      {
        id: 'home-t1',
        order: 'T1',
        title: 'Shell & Header-splitsing',
        subtitle: 'RootLayout opent drie Header-blokken tegelijk naast elkaar.',
        gateTrigger: 'Cookies ververst → shells openen',
        layout: 'single',
        blocks: [
          {
            id: 'home-root-layout',
            name: 'RootLayout + Page (/)',
            filePath: 'app/layout.tsx & app/page.tsx',
            role: 'Layout Shell',
            status: 'direct',
            statusLabel: 'Direct',
            microNote: 'Pure shell · 0 queries',
            summary:
              'Zet ToastProvider, Header, main en Footer direct neer zonder zelf te wachten op data.',
            proceedsWhen:
              'Opent alle onderliggende blokken in Header en Dashboard tegelijk.',
            childrenLayout: 'parallel',
            childrenLabel: 'Splitsing onder RootLayout (Header)',
            children: [
              {
                id: 'home-header-search',
                name: 'HeaderSearch',
                filePath: 'components/features/search/HeaderSearch.tsx',
                role: 'Client Component',
                status: 'interactive',
                statusLabel: 'Client',
                microNote: 'Geen auth nodig',
                summary:
                  'Wacht niet op Supabase; zodra de gebruiker typt start SearchResults met 300ms debounce.',
                proceedsWhen:
                  'Bij typen start SearchResults met 300ms debounce naar TMDB.',
              },
              {
                id: 'home-main-nav',
                name: 'MainNav',
                filePath: 'components/features/navigation/MainNav.tsx',
                role: 'Suspense Boundary',
                status: 'cached',
                statusLabel: 'Gecacht 1×',
                microNote: 'await getAppUser()',
                fallback: '<MainNavSkeleton />',
                promises: [
                  {
                    call: 'await getAppUser()',
                    status: 'cached',
                    statusText: 'Deelt 1 Supabase-sessiecheck via React.cache()',
                  },
                ],
                proceedsWhen:
                  'Toont Trending & Aanbevelingen, plus Watchlist zodra user bestaat.',
              },
              {
                id: 'home-user-nav',
                name: 'UserNav',
                filePath: 'components/features/auth/UserNav.tsx',
                role: 'Suspense Boundary',
                status: 'cached',
                statusLabel: 'Gecacht 1×',
                microNote: 'Deelt zelfde Promise',
                fallback: '<UserNavSkeleton />',
                promises: [
                  {
                    call: 'await getAppUser()',
                    status: 'cached',
                    statusText: 'Zelfde Promise als MainNav (nul extra roundtrips)',
                  },
                ],
                proceedsWhen:
                  'Rendert Inloggen-knop, Account-knop of ook de Beheer-badge.',
              },
            ],
          },
        ],
        variantsByRole: {
          guest: {
            blocks: [
              {
                id: 'home-root-layout-guest',
                name: 'RootLayout + Page (/)',
                filePath: 'app/layout.tsx & app/page.tsx',
                role: 'Layout Shell',
                status: 'direct',
                statusLabel: 'Direct',
                microNote: 'Pure shell · 0 queries',
                proceedsWhen:
                  'Opent HeaderSearch en beide Header-Suspense blokken tegelijk.',
                childrenLayout: 'parallel',
                childrenLabel: 'Splitsing onder RootLayout (Bezoeker)',
                children: [
                  {
                    id: 'home-header-search-guest',
                    name: 'HeaderSearch',
                    filePath: 'components/features/search/HeaderSearch.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Client',
                    microNote: 'Geen auth nodig',
                    proceedsWhen: 'Klaar voor zoekopdrachten zodra gehydrateerd.',
                  },
                  {
                    id: 'home-main-nav-guest',
                    name: 'MainNavContent',
                    filePath: 'components/features/navigation/MainNav.tsx',
                    role: 'Suspense Boundary',
                    status: 'short-circuit',
                    statusLabel: 'Kortgesloten',
                    microNote: 'user === null · 2 links',
                    fallback: '<MainNavSkeleton />',
                    promises: [
                      {
                        call: 'getAppUser() -> null',
                        status: 'short-circuit',
                        statusText: 'Geen profile-query uitgevoerd',
                      },
                    ],
                    proceedsWhen: 'Toont alleen Trending & Aanbevelingen.',
                  },
                  {
                    id: 'home-user-nav-guest',
                    name: 'UserNavContent',
                    filePath: 'components/features/auth/UserNav.tsx',
                    role: 'Suspense Boundary',
                    status: 'short-circuit',
                    statusLabel: 'Inloggen CTA',
                    microNote: 'Link naar /login',
                    fallback: '<UserNavSkeleton />',
                    promises: [
                      {
                        call: 'getAppUser() -> null',
                        status: 'cached',
                        statusText: 'Gebruikt gecachte null-uitkomst',
                      },
                    ],
                    proceedsWhen: 'Rendert UIButton "Inloggen" (/login).',
                  },
                ],
              },
            ],
          },
          admin: {
            blocks: [
              {
                id: 'home-root-layout-admin',
                name: 'RootLayout + Page (/)',
                filePath: 'app/layout.tsx & app/page.tsx',
                role: 'Layout Shell',
                status: 'direct',
                statusLabel: 'Direct',
                microNote: 'Pure shell · 0 queries',
                proceedsWhen:
                  'Opent HeaderSearch en beide Header-Suspense blokken tegelijk.',
                childrenLayout: 'parallel',
                childrenLabel: 'Splitsing onder RootLayout (Admin)',
                children: [
                  {
                    id: 'home-header-search-admin',
                    name: 'HeaderSearch',
                    filePath: 'components/features/search/HeaderSearch.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Client',
                    microNote: 'Geen auth nodig',
                    proceedsWhen: 'Klaar voor zoekopdrachten zodra gehydrateerd.',
                  },
                  {
                    id: 'home-main-nav-admin',
                    name: 'MainNavContent',
                    filePath: 'components/features/navigation/MainNav.tsx',
                    role: 'Suspense Boundary',
                    status: 'cached',
                    statusLabel: 'Gecacht 1×',
                    microNote: 'role: admin · 3 links',
                    fallback: '<MainNavSkeleton />',
                    promises: [
                      {
                        call: 'getAppUser() -> role: admin',
                        status: 'cached',
                        statusText: '1 gedeelde sessie- & profile-lookup',
                      },
                    ],
                    proceedsWhen: 'Toont Trending, Aanbevelingen én Watchlist.',
                  },
                  {
                    id: 'home-user-nav-admin',
                    name: 'UserNavContent',
                    filePath: 'components/features/auth/UserNav.tsx',
                    role: 'Suspense Boundary',
                    status: 'cached',
                    statusLabel: 'Admin badge',
                    microNote: 'Account + Beheer',
                    fallback: '<UserNavSkeleton />',
                    promises: [
                      {
                        call: 'getAppUser() -> role: admin',
                        status: 'cached',
                        statusText: 'Zelfde Promise uit React.cache()',
                      },
                    ],
                    proceedsWhen: 'Toont Account, badge-violet "Beheer" (/admin) en Uitloggen.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        id: 'home-t2',
        order: 'T2',
        title: 'Dashboard-streams',
        subtitle: 'TMDB Hero en Auth Cards draaien los van elkaar onder Dashboard.',
        gateTrigger: 'Parallel naast Header boundaries',
        layout: 'single',
        connectFromBlockIds: ['home-root-layout', 'home-root-layout-guest', 'home-root-layout-admin'],
        blocks: [
          {
            id: 'home-dashboard',
            name: 'Dashboard',
            filePath: 'components/features/dashboard/Dashboard.tsx',
            role: 'Page Shell',
            status: 'direct',
            statusLabel: 'Heading direct',
            microNote: '2 eigen Suspense-grenzen',
            summary:
              'Titel, subtitel en DashboardText verschijnen meteen zonder data-afhankelijkheid.',
            proceedsWhen:
              'Opent twee onafhankelijke Suspense-blokken voor Hero en Cards.',
            childrenLayout: 'parallel',
            childrenLabel: 'Splitsing onder Dashboard',
            children: [
              {
                id: 'home-hero-block',
                name: 'DashboardHeroContent',
                filePath: 'components/features/dashboard/Dashboard.tsx',
                role: 'Server Content',
                status: 'parallel',
                statusLabel: 'TMDB live',
                microNote: "getTrendingMovies('day')",
                fallback: '<DashboardHeroSkeleton />',
                promises: [
                  {
                    call: "await getTrendingMovies('day')",
                    status: 'parallel',
                    statusText: 'TMDB API v3 (revalidate: 3600s)',
                  },
                ],
                proceedsWhen:
                  'Zodra TMDB antwoordt, streamt DashboardHero met LCP preload-afbeelding.',
              },
              {
                id: 'home-cards-block',
                name: 'DashboardCardsContent',
                filePath: 'components/features/dashboard/DashboardCard.tsx',
                role: 'Server Content',
                status: 'cached',
                statusLabel: 'Gecacht',
                microNote: 'Hergebruikt getAppUser()',
                fallback: '<DashboardCardsSkeleton />',
                promises: [
                  {
                    call: 'await getAppUser()',
                    status: 'cached',
                    statusText: 'Direct uit React.cache() van de Header',
                  },
                ],
                proceedsWhen:
                  'Rendert 3 kaarten; Watchlist-link is /watchlist (ingelogd) of /login?next=/watchlist.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'movie-detail',
    routePath: '/movies/[id]',
    label: 'Filmdetail',
    badge: 'Geneste Suspense + Short-Circuit',
    scopeTone: 'brand',
    summary:
      'Sequentiële keten binnen MovieDetail gevolgd door een geneste Suspense-laag voor persoonlijke knoppen.',
    keyTakeaway:
      'De filmpagina wacht niet op Supabase watchlist-checks; en anonieme bezoekers slaan persoonlijke DB-queries over.',
    stages: [
      {
        id: 'movie-t0',
        order: 'T0',
        title: 'Sessiepoort',
        subtitle: 'Proxy houdt cookies vers voor latere persoonlijke acties.',
        gateTrigger: 'Request /movies/[id]',
        layout: 'single',
        blocks: [
          {
            id: 'movie-proxy',
            name: 'proxy(request)',
            filePath: 'proxy.ts',
            role: 'Proxy',
            status: 'waiting',
            statusLabel: 'Wacht af',
            microNote: 'await updateSession()',
            promises: [
              {
                call: 'await updateSession(request)',
                status: 'waiting',
                statusText: 'Houdt JWT geldig voor MediaActions verderop',
              },
            ],
            proceedsWhen: 'Zodra cookies ververst zijn, start MoviePage.',
          },
        ],
      },
      {
        id: 'movie-t1',
        order: 'T1',
        title: 'PPR Boundary & TMDB-keten',
        subtitle: 'MoviePage opent Suspense; MovieDetail wacht op params -> TMDB.',
        gateTrigger: 'Cookies klaar → Suspense opent',
        layout: 'single',
        blocks: [
          {
            id: 'movie-detail-content',
            name: 'MovieDetail -> MovieDetailContent',
            filePath: 'components/features/media/MovieDetail.tsx',
            role: 'Suspense Boundary',
            status: 'waiting',
            statusLabel: 'Sequentieel',
            microNote: 'await params → getMovieDetails',
            fallback: '<MovieDetailSkeleton />',
            summary:
              'params: Promise<{ id: string }> blijft ongeopend tot binnen Suspense. Zonder film-id kan TMDB nog niet worden bevraagd.',
            promises: [
              {
                call: '1. const { id } = await params',
                status: 'waiting',
                statusText: 'Wacht eerst op Next.js route-parameter',
              },
              {
                call: '2. await getMovieDetails(id)',
                status: 'waiting',
                statusText: 'Start na stap 1 (allowNotFound: true, 3600s cache)',
              },
            ],
            proceedsWhen:
              'Bij null (404) → app/not-found.tsx. Bij API-fout → app/error.tsx. Bij film → details + MediaActions starten.',
            childrenLayout: 'parallel',
            childrenLabel: 'Splitsing zodra movie-data binnen is',
            children: [
              {
                id: 'movie-metadata-view',
                name: 'Poster, Titel & Metadata',
                filePath: 'components/features/media/MovieDetail.tsx',
                role: 'Server Content',
                status: 'direct',
                statusLabel: 'Direct',
                microNote: 'Streamt meteen uit',
                proceedsWhen: 'Zichtbaar in de browser terwijl MediaActions nog mag laden.',
              },
              {
                id: 'movie-media-actions-boundary',
                name: 'MediaActions (Geneste Suspense)',
                filePath: 'components/features/media/MediaActions.tsx',
                role: 'Suspense Boundary',
                status: 'waiting',
                statusLabel: 'Genest',
                microNote: 'Wacht op rol & DB',
                fallback: '<MediaActionsSkeleton />',
                proceedsWhen: 'Wacht op getAppUser() in stap T2.',
              },
            ],
          },
        ],
      },
      {
        id: 'movie-t2',
        order: 'T2',
        title: 'Geneste Acties & Auth Short-Circuit',
        subtitle: 'Wissel van rol om te zien welke Supabase-queries wel of niet starten.',
        gateTrigger: 'Pas actief nadat movie.id bekend is',
        layout: 'single',
        connectFromBlockIds: ['movie-media-actions-boundary'],
        blocks: [
          {
            id: 'movie-media-actions-user',
            name: 'MediaActionsContent',
            filePath: 'components/features/media/MediaActions.tsx',
            role: 'Server Content',
            status: 'parallel',
            statusLabel: '1 query + guard',
            microNote: 'Watchlist + resolve(false)',
            promises: [
              {
                call: 'const user = await getAppUser()',
                status: 'cached',
                statusText: 'Uit React.cache() (role: "user")',
              },
              {
                call: 'Promise.all([getWatchlistStatus(...), Promise.resolve(false)])',
                status: 'parallel',
                statusText: 'Watchlist opgehaald; admin-check kortgesloten',
              },
            ],
            proceedsWhen:
              'Zodra watchlist-status binnen is, hydrateert WatchlistButton.',
            childrenLayout: 'stack',
            childrenLabel: 'Kind-component onder MediaActionsContent',
            children: [
              {
                id: 'movie-watchlist-btn-user',
                name: 'WatchlistButton',
                filePath: 'components/features/watchlist/WatchlistButton.tsx',
                role: 'Client Component',
                status: 'interactive',
                statusLabel: 'Client',
                microNote: 'toggleWatchlistAction()',
                promises: [
                  {
                    call: 'startTransition(() => toggleWatchlistAction)',
                    status: 'interactive',
                    statusText: 'Bij klik: Zod .safeParse() -> RLS -> revalidatePath() + Toast',
                  },
                ],
                proceedsWhen: 'Toont Toast-feedback en ververst /watchlist cache.',
              },
            ],
          },
        ],
        variantsByRole: {
          guest: {
            blocks: [
              {
                id: 'movie-media-actions-guest',
                name: 'MediaActionsContent',
                filePath: 'components/features/media/MediaActions.tsx',
                role: 'Server Content',
                status: 'short-circuit',
                statusLabel: 'Kortgesloten',
                microNote: '!user → 0 DB-queries',
                promises: [
                  {
                    call: 'const user = await getAppUser()',
                    status: 'cached',
                    statusText: 'Geeft null terug uit React.cache()',
                  },
                  {
                    call: 'getWatchlistStatus() & isInRecommendations()',
                    status: 'short-circuit',
                    statusText: 'OVERGESLAGEN door Auth Short-Circuiting',
                  },
                ],
                proceedsWhen:
                  'Stopt direct zonder DB-calls en toont inlogknop.',
                childrenLayout: 'stack',
                childrenLabel: 'Resultaat bij !user',
                children: [
                  {
                    id: 'movie-login-cta',
                    name: 'UIButton (Inloggen om te bewaren)',
                    filePath: 'components/features/media/MediaActions.tsx',
                    role: 'Client Component',
                    status: 'direct',
                    statusLabel: 'Login CTA',
                    microNote: '/login?next=/movies/[id]',
                    proceedsWhen: 'Veilige redirect terug naar de film na inloggen.',
                  },
                ],
              },
            ],
          },
          admin: {
            blocks: [
              {
                id: 'movie-media-actions-admin',
                name: 'MediaActionsContent',
                filePath: 'components/features/media/MediaActions.tsx',
                role: 'Server Content',
                status: 'parallel',
                statusLabel: '2 queries parallel',
                microNote: 'Promise.all (Watchlist + Aanrader)',
                promises: [
                  {
                    call: 'const user = await getAppUser()',
                    status: 'cached',
                    statusText: 'Uit React.cache() (role: "admin")',
                  },
                  {
                    call: 'getWatchlistStatus(...) & isInRecommendations(...)',
                    status: 'parallel',
                    statusText: 'Beide Supabase-queries tegelijk via Promise.all()',
                  },
                ],
                proceedsWhen:
                  'Zodra beide Promises binnen zijn, renderen beide knoppen.',
                childrenLayout: 'parallel',
                childrenLabel: 'Beide knoppen parallel actief',
                children: [
                  {
                    id: 'movie-watchlist-btn-admin',
                    name: 'WatchlistButton',
                    filePath: 'components/features/watchlist/WatchlistButton.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Client',
                    microNote: 'toggleWatchlistAction()',
                    proceedsWhen: 'Mutaties via RLS + revalidatePath() + Toast.',
                  },
                  {
                    id: 'movie-rec-btn-admin',
                    name: 'RecommendationButton',
                    filePath: 'components/features/recommendations/RecommendationButton.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Admin Client',
                    microNote: 'toggleRecommendationAction()',
                    proceedsWhen: 'Admin-mutatie via isAdmin() + revalidatePath().',
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'trending',
    routePath: '/trending',
    routeHref: '/trending',
    label: 'Trending',
    badge: 'Parallel TMDB + Race-Guards',
    scopeTone: 'emerald',
    summary:
      'TrendingPage opent twee zelfstandige Suspense-grenzen voor Films en Series naast elkaar; na hydratatie vangen TrendingMoviesClient en TrendingTvClient snelle dag/week-kliks veilig af.',
    keyTakeaway:
      'Films en Series blokkeren elkaar niet bij SSR, en requestIdRef negeert trage oude antwoorden zodra iemand snel tussen Vandaag en Deze Week schakelt.',
    stages: [
      {
        id: 'trending-t0',
        order: 'T0',
        title: 'Sessiepoort & TrendingPage Shell',
        subtitle: 'Proxy ververst sessie; TrendingPage opent twee parallelle TMDB-takken.',
        gateTrigger: 'Na proxy.ts sessie-check',
        layout: 'single',
        blocks: [
          {
            id: 'trending-page-shell',
            name: 'TrendingPage (/trending)',
            filePath: 'app/trending/page.tsx',
            role: 'Page Shell',
            status: 'direct',
            statusLabel: 'Shell direct',
            microNote: '2 losse TMDB-takken',
            promises: [
              {
                call: 'await updateSession(request) in proxy.ts',
                status: 'waiting',
                statusText: 'Cookies ververst voor de globale Header',
              },
            ],
            proceedsWhen:
              'Opent TrendingMovies en TrendingTv naast elkaar onder één pagina.',
            childrenLayout: 'parallel',
            childrenLabel: 'Splitsing onder TrendingPage',
            children: [
              {
                id: 'trending-movies-server',
                name: 'TrendingMoviesContent',
                filePath: 'components/features/trending-movies/TrendingMovies.tsx',
                role: 'Suspense Boundary',
                status: 'parallel',
                statusLabel: 'TMDB Films',
                microNote: "getTrendingMovies('day')",
                fallback: '<TrendingMoviesSkeleton />',
                promises: [
                  {
                    call: "await getTrendingMovies('day')",
                    status: 'parallel',
                    statusText: 'TMDB /trending/movie/day (3600s cache)',
                  },
                ],
                proceedsWhen:
                  'Geeft initialMovies door aan TrendingMoviesClient zodra TMDB antwoordt.',
                childrenLayout: 'stack',
                children: [
                  {
                    id: 'trending-movies-client',
                    name: 'TrendingMoviesClient',
                    filePath: 'components/features/trending-movies/TrendingMoviesClient.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Race-guard',
                    microNote: 'UISwitch + requestIdRef',
                    promises: [
                      {
                        call: 'startTransition(() => getTrendingMovies(nextRange))',
                        status: 'interactive',
                        statusText: 'Alleen nieuwste requestId werkt state bij; anders rollback + toast',
                      },
                    ],
                    proceedsWhen:
                      'Update films alleen als requestId === requestIdRef.current.',
                  },
                ],
              },
              {
                id: 'trending-tv-server',
                name: 'TrendingTvContent',
                filePath: 'components/features/trending-tv/TrendingTv.tsx',
                role: 'Suspense Boundary',
                status: 'parallel',
                statusLabel: 'TMDB Series',
                microNote: "getTrendingTv('day')",
                fallback: '<TrendingTvSkeleton />',
                promises: [
                  {
                    call: "await getTrendingTv('day')",
                    status: 'parallel',
                    statusText: 'TMDB /trending/tv/day (3600s cache)',
                  },
                ],
                proceedsWhen:
                  'Geeft initialShows door aan TrendingTvClient zodra TMDB antwoordt.',
                childrenLayout: 'stack',
                children: [
                  {
                    id: 'trending-tv-client',
                    name: 'TrendingTvClient',
                    filePath: 'components/features/trending-tv/TrendingTvClient.tsx',
                    role: 'Client Component',
                    status: 'interactive',
                    statusLabel: 'Race-guard',
                    microNote: 'UISwitch + requestIdRef',
                    promises: [
                      {
                        call: 'startTransition(() => getTrendingTv(nextRange))',
                        status: 'interactive',
                        statusText: 'Alleen nieuwste requestId werkt state bij; anders rollback + toast',
                      },
                    ],
                    proceedsWhen:
                      'Update series alleen als requestId === requestIdRef.current.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'search',
    routePath: 'Globale Header',
    label: 'Zoeken',
    badge: 'Debounce + Server Action',
    scopeTone: 'brand',
    summary:
      'HeaderSearch draait los van de paginaroute in de globale Header: input wordt eerst geschoond en gedebounced (300ms), waarna searchMulti() kiest tussen IMDb-lookup (/find) en multi-search.',
    keyTakeaway:
      'Geen auth-afhankelijkheid, 300ms debounce tegen API-spam, isCancelled-cleanup tegen verouderde resultaten en directe navigatie via Link.',
    stages: [
      {
        id: 'search-t0',
        order: 'T0',
        title: 'Header Input & Sanitatie',
        subtitle: 'HeaderSearch vangt toetsaanslagen af en opent de dropdown pas bij geldige invoer.',
        gateTrigger: 'Typen in HeaderSearch',
        layout: 'single',
        blocks: [
          {
            id: 'search-header-input',
            name: 'HeaderSearch',
            filePath: 'components/features/search/HeaderSearch.tsx',
            role: 'Client Component',
            status: 'interactive',
            statusLabel: 'Geen auth nodig',
            microNote: "replace(/[<>]/g, '') + isOpen",
            summary:
              'Verwijdert ongewenste < en > tekens direct uit de invoer, luistert naar Escape en click-outside om te sluiten, en monteert SearchResults pas bij query.trim().length > 0.',
            proceedsWhen:
              'Zodra er niet-lege tekst staat, rendert SearchResults met query.',
          },
        ],
      },
      {
        id: 'search-t1',
        order: 'T1',
        title: '300ms Debounce & Cancellation Guard',
        subtitle: 'SearchResults wacht 300ms tot de gebruiker stopt met typen voordat een netwerkcall start.',
        gateTrigger: 'query.trim().length > 0',
        layout: 'single',
        blocks: [
          {
            id: 'search-results-debounce',
            name: 'SearchResults (useEffect)',
            filePath: 'components/features/search/SearchResults.tsx',
            role: 'Client Component',
            status: 'waiting',
            statusLabel: '300ms Debounce',
            microNote: 'setTimeout(300) + isCancelled',
            fallback: 'Zoeken naar "..." laadstatus in dropdown',
            promises: [
              {
                call: 'setTimeout(..., 300) -> searchMulti(trimmed)',
                status: 'waiting',
                statusText: 'Wacht 300ms; cleanup annuleert oude timer en zet isCancelled = true',
              },
            ],
            proceedsWhen:
              'Als er 300ms geen nieuwe toets is ingedrukt, roept hij Server Action searchMulti() aan.',
          },
        ],
      },
      {
        id: 'search-t2',
        order: 'T2',
        title: 'Server Action Routering (IMDb vs Tekst)',
        subtitle: 'searchMulti() bepaalt op de server welk TMDB v3 endpoint wordt bevraagd.',
        gateTrigger: 'Na 300ms -> searchMulti(trimmed)',
        layout: 'single',
        blocks: [
          {
            id: 'search-multi-action',
            name: 'searchMulti(query)',
            filePath: 'lib/tmdb/queries.ts',
            role: 'Server Content',
            status: 'parallel',
            statusLabel: 'Kiest endpoint',
            microNote: '/^tt\\d{7,10}$/i vs /search/multi',
            summary:
              'Server Action schermt env.tmdb.apiKey af voor de browser en kiest op basis van regex tussen een exacte IMDb-lookup of algemene zoekquery.',
            promises: [
              {
                call: 'fetchFromTmdb(..., { revalidate: 3600 | 60 })',
                status: 'cached',
                statusText: 'IMDb-id cached 1 uur; vrije zoektermen cached 60 seconden',
              },
            ],
            proceedsWhen:
              'Geeft gefilterde SearchItem[] terug (uitsluitend movie en tv).',
            childrenLayout: 'parallel',
            childrenLabel: 'Mogelijke TMDB-routes binnen searchMulti()',
            children: [
              {
                id: 'search-tmdb-find',
                name: 'IMDb ID Lookup (/find/{id})',
                filePath: 'lib/tmdb/queries.ts',
                role: 'Server Content',
                status: 'cached',
                statusLabel: '3600s cache',
                microNote: 'Als query matcht tt + cijfers',
                promises: [
                  {
                    call: "fetchFromTmdb('/find/tt...', { external_source: 'imdb_id' })",
                    status: 'cached',
                    statusText: 'allowNotFound: true · combineert movie_results & tv_results',
                  },
                ],
                proceedsWhen: 'Retourneert exacte film- of seriematch (of []).',
              },
              {
                id: 'search-tmdb-multi',
                name: 'Multi Search (/search/multi)',
                filePath: 'lib/tmdb/queries.ts',
                role: 'Server Content',
                status: 'parallel',
                statusLabel: '60s cache',
                microNote: 'Reguliere titelzoekopdracht',
                promises: [
                  {
                    call: "fetchFromTmdb('/search/multi', { include_adult: 'false' })",
                    status: 'parallel',
                    statusText: 'Filtert resultaten strikt op media_type movie | tv',
                  },
                ],
                proceedsWhen: 'Retourneert gefilterde lijst met films en series.',
              },
            ],
          },
        ],
      },
      {
        id: 'search-t3',
        order: 'T3',
        title: 'Resultatenlijst & Detailnavigatie',
        subtitle: 'SearchResultItem rendert uitsluitend als het verzoek niet tussentijds is geannuleerd.',
        gateTrigger: '!isCancelled → SearchItem[]',
        connectFromBlockIds: ['search-tmdb-find', 'search-tmdb-multi'],
        layout: 'single',
        blocks: [
          {
            id: 'search-result-item',
            name: 'SearchResultItem -> Detailroute',
            filePath: 'components/features/search/SearchResults.tsx',
            role: 'Client Component',
            status: 'interactive',
            statusLabel: '!isCancelled',
            microNote: 'Link → /movies/[id] | /tv/[id]',
            summary:
              'Toont poster (w200), badge (Film/Serie), jaartal en rating. Klikken wist en sluit HeaderSearch en start navigatie naar de detailroute.',
            promises: [
              {
                call: 'if (!isCancelled) setResults(data)',
                status: 'interactive',
                statusText: 'Negeert trage oude zoekresultaten na opnieuw typen of wissen',
              },
            ],
            proceedsWhen:
              'Klik op resultaat roept onSelect() aan en navigeert via next/link naar /movies/[id] of /tv/[id].',
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    routePath: '/admin',
    routeHref: '/admin',
    label: 'Beheer & RBAC',
    badge: 'Promise.all + notFound()',
    scopeTone: 'violet',
    summary:
      'Autorisatie, gebruikerslijst en aanbevelingen starten tegelijk in één parallelle stap, bewaakt door server-side notFound().',
    keyTakeaway:
      'isAdmin() draait via React.cache() maximaal 1 keer en blokkeert niet-admins nog vóórdat HTML of emails naar de browser gaan.',
    stages: [
      {
        id: 'admin-t0',
        order: 'T0',
        title: 'Sessie & Admin-shells',
        subtitle: 'AdminLayout rendert AdminNav en AdminPage naast elkaar.',
        gateTrigger: 'Request /admin na proxy.ts',
        layout: 'single',
        blocks: [
          {
            id: 'admin-layout-shell',
            name: 'AdminLayout',
            filePath: 'app/(admin)/admin/layout.tsx',
            role: 'Layout Shell',
            status: 'direct',
            statusLabel: 'Pure shell',
            microNote: 'Geen auth in layout',
            promises: [
              {
                call: 'await updateSession(request) in proxy.ts',
                status: 'waiting',
                statusText: 'Cookies ververst vóór SSR',
              },
            ],
            proceedsWhen:
              'Opent tegelijk AdminNav (Client) en AdminDashboardContent.',
            childrenLayout: 'parallel',
            childrenLabel: 'Splitsing onder AdminLayout',
            children: [
              {
                id: 'admin-nav-block',
                name: 'AdminNav',
                filePath: 'components/features/admin/AdminNav.tsx',
                role: 'Suspense Boundary',
                status: 'interactive',
                statusLabel: 'Client tabs',
                microNote: 'usePathname() in Suspense',
                fallback: '<AdminNavSkeleton />',
                proceedsWhen: 'Markeert actieve beheer-tab na hydratatie.',
              },
              {
                id: 'admin-page-boundary',
                name: 'AdminPage',
                filePath: 'app/(admin)/admin/page.tsx',
                role: 'Suspense Boundary',
                status: 'parallel',
                statusLabel: 'Wacht op RBAC',
                microNote: 'Start Promise.all()',
                fallback: '<AdminDashboardSkeleton />',
                proceedsWhen: 'Beslist in T1 over toegang of 404.',
              },
            ],
          },
        ],
      },
      {
        id: 'admin-t1',
        order: 'T1',
        title: 'Parallel Promise.all & RBAC Gate',
        subtitle: 'Wissel van rol om het verschil tussen toegang en 404 te zien.',
        gateTrigger: 'Binnen <AdminDashboardSkeleton /> boundary',
        layout: 'single',
        connectFromBlockIds: ['admin-page-boundary'],
        blocks: [
          {
            id: 'admin-content-admin',
            name: 'AdminDashboardContent',
            filePath: 'app/(admin)/admin/page.tsx',
            role: 'Server Content',
            status: 'parallel',
            statusLabel: '3 parallel (Admin)',
            microNote: 'isAdmin + users + recs',
            promises: [
              {
                call: 'isAdmin()',
                status: 'cached',
                statusText: 'true (1× gecachte auth + profile check)',
              },
              {
                call: 'getAdminUsers()',
                status: 'parallel',
                statusText: 'Hergebruikt isAdmin() -> haalt users uit Supabase',
              },
              {
                call: 'getRecommendations()',
                status: 'parallel',
                statusText: 'Haalt aanbevelingen tegelijk op',
              },
            ],
            proceedsWhen:
              'isAuthorized === true → geeft data door aan AdminDashboard.',
            childrenLayout: 'stack',
            childrenLabel: 'Toegestaan voor Admin',
            children: [
              {
                id: 'admin-dashboard-cards',
                name: 'AdminDashboard + AdminCard (2×)',
                filePath: 'components/features/admin/AdminDashboard.tsx',
                role: 'Server Content',
                status: 'direct',
                statusLabel: 'Toegestaan',
                microNote: 'KPI + beheerlinks',
                proceedsWhen: 'Rendert gebruiker- en aanbevelingsstatistieken.',
              },
            ],
          },
        ],
        variantsByRole: {
          guest: {
            blocks: [
              {
                id: 'admin-content-guest',
                name: 'AdminDashboardContent',
                filePath: 'app/(admin)/admin/page.tsx',
                role: 'Server Content',
                status: 'short-circuit',
                statusLabel: 'Geblokkeerd',
                microNote: '!isAuthorized → notFound()',
                promises: [
                  {
                    call: 'isAdmin()',
                    status: 'cached',
                    statusText: 'getAppUser() === null -> false',
                  },
                  {
                    call: 'getAdminUsers()',
                    status: 'short-circuit',
                    statusText: 'Kortgesloten bij !isAuthorized -> []',
                  },
                ],
                proceedsWhen: 'Roept notFound() aan vóór enige admin-UI.',
                childrenLayout: 'stack',
                childrenLabel: 'Gate bij !isAuthorized (Bezoeker)',
                children: [
                  {
                    id: 'admin-404-guest',
                    name: 'NotFoundBoundary',
                    filePath: 'app/not-found.tsx',
                    role: 'Error / 404 Boundary',
                    status: 'short-circuit',
                    statusLabel: '404',
                    microNote: 'Verbergt /admin volledig',
                    proceedsWhen: 'Geen spoor van beheeromgeving in browser.',
                  },
                ],
              },
            ],
          },
          user: {
            blocks: [
              {
                id: 'admin-content-user',
                name: 'AdminDashboardContent',
                filePath: 'app/(admin)/admin/page.tsx',
                role: 'Server Content',
                status: 'short-circuit',
                statusLabel: 'Geblokkeerd',
                microNote: 'role: user → notFound()',
                promises: [
                  {
                    call: 'isAdmin()',
                    status: 'cached',
                    statusText: 'profile.role === "user" -> false',
                  },
                  {
                    call: 'getAdminUsers()',
                    status: 'short-circuit',
                    statusText: 'Kortgesloten -> [] (0 emails opgehaald)',
                  },
                ],
                proceedsWhen: 'Roept notFound() aan; blokkeert toegang.',
                childrenLayout: 'stack',
                childrenLabel: 'Gate bij !isAuthorized (Gebruiker)',
                children: [
                  {
                    id: 'admin-404-user',
                    name: 'NotFoundBoundary',
                    filePath: 'app/not-found.tsx',
                    role: 'Error / 404 Boundary',
                    status: 'short-circuit',
                    statusLabel: '404',
                    microNote: '0 admin-data gelekt',
                    proceedsWhen: 'Standaard gebruiker krijgt nette 404 pagina.',
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
]

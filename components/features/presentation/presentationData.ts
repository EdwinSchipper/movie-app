import type {
  FeatureModuleSpec,
  IntegrationSpec,
  PromisePatternSpec,
  RouteSpec,
  ScopeBoundarySpec,
  UiPrimitiveSpec,
} from '@/types'

export const ROUTE_SPECS: RouteSpec[] = [
  {
    path: '/',
    navigableHref: '/',
    filePath: 'app/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Startpagina met hero-spotlight van de #1 trending film en snelle navigatiekaarten.',
    componentName: 'Dashboard',
    propsSpec: 'DashboardProps { heading: string; subheading?: string }',
    dataDependencies: [
      "getTrendingMovies('day') via lib/tmdb",
      'getAppUser() via lib/auth',
    ],
    connectedFeatures: ['Dashboard', 'DashboardHero', 'DashboardCard', 'UIButton'],
    connectedIntegrations: ['TMDB API v3 (Live JSON Data)', 'TMDB Image CDN (image.tmdb.org)', 'Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Auth-status bepaalt alleen de Watchlist-knoplink (/watchlist vs /login?next=/watchlist); geen gevoelige data voor bezoekers.',
  },
  {
    path: '/trending',
    navigableHref: '/trending',
    filePath: 'app/trending/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Overzicht van populaire films en series met live dag- en weekwisseling.',
    componentName: 'TrendingMovies + TrendingTv',
    propsSpec:
      'TrendingMoviesProps { heading: string } & TrendingTvProps { heading: string }',
    dataDependencies: [
      "getTrendingMovies('day' | 'week')",
      "getTrendingTv('day' | 'week')",
    ],
    connectedFeatures: ['TrendingMovies', 'TrendingTv', 'UISwitch', 'ToastProvider'],
    connectedIntegrations: ['TMDB API v3 (Live JSON Data)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Alle TMDB-requests lopen server-side met env.tmdb.apiKey en 10s timeout; API key lekt nooit naar de browser.',
  },
  {
    path: '/movies/[id]',
    filePath: 'app/movies/[id]/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Dynamische filmdetailpagina met poster, metadata, genres, runtime en contextuele acties.',
    componentName: 'MovieDetail',
    propsSpec: 'MoviePageProps { params: Promise<{ id: string }> }',
    dataDependencies: [
      'getMovieDetails(id) met allowNotFound: true',
      'MediaActions (getAppUser, getWatchlistStatus, isInRecommendations)',
    ],
    connectedFeatures: ['MovieDetail', 'MediaActions', 'WatchlistButton', 'RecommendationButton'],
    connectedIntegrations: ['TMDB API v3 (Live JSON Data)', 'TMDB Image CDN (image.tmdb.org)', 'Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Bij ontbrekende film (HTTP 404 -> null) wordt notFound() aangeroepen; API-storingen bubbelen door naar app/error.tsx.',
  },
  {
    path: '/tv/[id]',
    filePath: 'app/tv/[id]/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Dynamische seriedetailpagina met seizoenen, afleveringen en contextuele acties.',
    componentName: 'TvDetail',
    propsSpec: 'TvPageProps { params: Promise<{ id: string }> }',
    dataDependencies: [
      'getTvDetails(id) met allowNotFound: true',
      'MediaActions (WatchlistButton + admin RecommendationButton)',
    ],
    connectedFeatures: ['TvDetail', 'MediaActions', 'WatchlistButton', 'RecommendationButton'],
    connectedIntegrations: ['TMDB API v3 (Live JSON Data)', 'TMDB Image CDN (image.tmdb.org)', 'Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Identieke 404- vs error-scheiding en Auth Short-Circuiting voor anonieme bezoekers in MediaActions.',
  },
  {
    path: '/watchlist',
    navigableHref: '/watchlist',
    filePath: 'app/watchlist/page.tsx',
    routeGroup: 'Basis',
    scope: 'Ingelogd',
    renderMode: 'PPR + Suspense',
    summary:
      'Persoonlijke kijklijst met client-side filters voor mediatype, periode en sortering.',
    componentName: 'WatchlistGrid',
    propsSpec:
      'WatchlistGridProps { heading: string; subheading?: string; searchParams?: MediaSearchParams }',
    dataDependencies: [
      'getWatchlist() (RLS: auth.uid() = user_id)',
      'parseMediaFilters + filterAndSortMedia',
    ],
    connectedFeatures: ['WatchlistGrid', 'WatchlistCard', 'FilterBar', 'UISelect'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Geïsoleerd via Supabase Row Level Security en auth.getUser(); niet-ingelogde gebruikers zien lege/login-guard.',
  },
  {
    path: '/recommendations',
    navigableHref: '/recommendations',
    filePath: 'app/recommendations/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Gedeelde lijst van aanraders voor vrienden met dezelfde filter- en sorteerbalk.',
    componentName: 'RecommendationGrid',
    propsSpec:
      'RecommendationGridProps { heading: string; subheading?: string; searchParams?: MediaSearchParams }',
    dataDependencies: [
      'getRecommendations()',
      'parseMediaFilters + filterAndSortMedia',
    ],
    connectedFeatures: ['RecommendationGrid', 'RecommendationCard', 'FilterBar', 'UISelect'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Publiek leesbaar via RLS (anon + authenticated); mutaties zijn strikt voorbehouden aan administrators.',
  },
  {
    path: '/presentatie',
    navigableHref: '/presentatie',
    filePath: 'app/presentatie/page.tsx',
    routeGroup: 'Basis',
    scope: 'Publiek',
    renderMode: 'Statisch',
    summary:
      'Interactieve architectuurkaart van alle routes, UI primitives, scopes, Promises en koppelingen.',
    componentName: 'PresentationOverview',
    propsSpec: 'PresentationClient met React state, Headless UI TabGroup en Disclosure',
    dataDependencies: ['Statische typesafe architectuurdefinities uit presentationData.ts'],
    connectedFeatures: ['PresentationOverview', 'PresentationClient', 'RouteMapOverview', 'UIButton', 'UIInput'],
    connectedIntegrations: ['Vercel Platform & Image Optimization'],
    securityNotes:
      'Pure presentatielaag zonder directe DB- of API-calls; directe klikbare links naar publieke en beveiligde routes.',
  },
  {
    path: '/login',
    navigableHref: '/login',
    filePath: 'app/(auth)/login/page.tsx',
    routeGroup: '(auth)',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Inlogscherm met Zod 4 validatie, veilige redirect-afhandeling en TMDB achtergrondposter.',
    componentName: 'LoginForm',
    propsSpec: 'LoginFormProps { className?: string } (gebruikt useSearchParams in Suspense)',
    dataDependencies: ['login(formData) Server Action in lib/auth/actions.ts'],
    connectedFeatures: ['LoginForm', 'UIInput', 'UIButton', 'UISpinner'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Bestemmings-URL na login wordt geschoond met getSafeRedirectPath() tegen open-redirect aanvallen.',
  },
  {
    path: '/register',
    navigableHref: '/register',
    filePath: 'app/(auth)/register/page.tsx',
    routeGroup: '(auth)',
    scope: 'Publiek',
    renderMode: 'PPR + Suspense',
    summary:
      'Registratieformulier met e-mailverificatie en automatische profielaanmaak via PostgreSQL trigger.',
    componentName: 'RegisterForm',
    propsSpec: 'RegisterFormProps { className?: string }',
    dataDependencies: ['signup(formData) met getSiteUrl() redirect naar /auth/callback'],
    connectedFeatures: ['RegisterForm', 'UIInput', 'UIButton'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Wachtwoordbevestiging en complexiteit gevalideerd via registerSchema (Zod 4); PKCE e-mailbevestiging.',
  },
  {
    path: '/auth/callback',
    filePath: 'app/(auth)/auth/callback/route.ts',
    routeGroup: '(auth)',
    scope: 'Systeem',
    renderMode: 'Route Handler',
    summary:
      'PKCE OAuth/verificatie callback die een eenmalige ?code= inwisselt voor een server-sessie.',
    componentName: 'GET(request: NextRequest)',
    propsSpec: 'NextRequest met ?code= en ?next= query parameters',
    dataDependencies: ['supabase.auth.exchangeCodeForSession(code)', 'getSiteUrl()'],
    connectedFeatures: ['Route Handler GET', 'getSiteUrl', 'getSafeRedirectPath'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Valideert ?next= via getSafeRedirectPath() en leidt bij fouten gecontroleerd terug naar /login?error=auth-code-error.',
  },
  {
    path: '/account',
    navigableHref: '/account',
    filePath: 'app/(user)/account/page.tsx',
    routeGroup: '(user)',
    scope: 'Ingelogd',
    renderMode: 'PPR + Suspense',
    summary:
      'Persoonlijk accountoverzicht binnen gedeelde AccountLayout en subnavigatie.',
    componentName: 'AccountDashboard',
    propsSpec: 'AccountDashboardProps { profile: UserProfile; watchlistItemCount: number }',
    dataDependencies: ['Promise.all([getUserProfile(), getWatchlist()])'],
    connectedFeatures: ['AccountLayout', 'AccountNav', 'AccountDashboard', 'AccountCard'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Redirect naar /login?next=/account wanneer profile === null.',
  },
  {
    path: '/account/profile',
    navigableHref: '/account/profile',
    filePath: 'app/(user)/account/profile/page.tsx',
    routeGroup: '(user)',
    scope: 'Ingelogd',
    renderMode: 'PPR + Suspense',
    summary: 'Overzicht van profielgegevens, e-mailadres, rolbadge en registratiedatum.',
    componentName: 'AccountProfile',
    propsSpec: 'AccountProfileProps { profile: UserProfile }',
    dataDependencies: ['getUserProfile()'],
    connectedFeatures: ['AccountLayout', 'AccountProfile', 'AccountDataList', 'AccountRoleBadge'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes: 'Leest uitsluitend eigen profielrij via RLS (auth.uid() = id).',
  },
  {
    path: '/account/settings',
    navigableHref: '/account/settings',
    filePath: 'app/(user)/account/settings/page.tsx',
    routeGroup: '(user)',
    scope: 'Ingelogd',
    renderMode: 'PPR + Suspense',
    summary: 'Voorkeuren voor weergavemodus (grid of row) en aantal getoonde tegels.',
    componentName: 'AccountSettings',
    propsSpec: 'AccountSettingsProps { initialSettings: UserSettings }',
    dataDependencies: ['getUserProfile()', 'updateUserSettings() Action'],
    connectedFeatures: ['AccountLayout', 'AccountSettings', 'UIButton', 'UISpinner'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Valideert invoer via userSettingsSchema.partial().safeParse() en voorkomt rol-wijziging via RLS with check.',
  },
  {
    path: '/account/watchlist',
    navigableHref: '/account/watchlist',
    filePath: 'app/(user)/account/watchlist/page.tsx',
    routeGroup: '(user)',
    scope: 'Ingelogd',
    renderMode: 'PPR + Suspense',
    summary: 'Compact beheer van eigen watchlist-items inclusief statuswisseling en verwijderen.',
    componentName: 'AccountWatchlist',
    propsSpec:
      'AccountWatchlistProps { initialItems: WatchlistItem[]; defaultDisplayMode?: TileDisplayMode; defaultTileLimit?: number }',
    dataDependencies: ['Promise.all([getUserProfile(), getWatchlist()])'],
    connectedFeatures: ['AccountLayout', 'AccountWatchlist', 'AccountWatchlistCard', 'UIButton'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes: 'Mutaties via updateWatchlistStatus en removeFromWatchlist revalideren direct.',
  },
  {
    path: '/admin',
    navigableHref: '/admin',
    filePath: 'app/(admin)/admin/page.tsx',
    routeGroup: '(admin)',
    scope: 'Admin',
    renderMode: 'PPR + Suspense',
    summary: 'Beheerdashboard met tellingen voor gebruikers, admins en publieke aanbevelingen.',
    componentName: 'AdminDashboard',
    propsSpec:
      'AdminDashboardProps { users: AdminUserSummary[]; recommendations: RecommendationItem[] }',
    dataDependencies: ['Promise.all([isAdmin(), getAdminUsers(), getRecommendations()])'],
    connectedFeatures: ['AdminLayout', 'AdminNav', 'AdminDashboard', 'AdminCard'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'Server-side beveiligd: bij !isAuthorized volgt direct notFound() zodat niet-admins zelfs het bestaan niet afleiden.',
  },
  {
    path: '/admin/users',
    navigableHref: '/admin/users',
    filePath: 'app/(admin)/admin/users/page.tsx',
    routeGroup: '(admin)',
    scope: 'Admin',
    renderMode: 'PPR + Suspense',
    summary: 'Tabel met geregistreerde gebruikers en doorklik naar individueel rolbeheer.',
    componentName: 'UserList',
    propsSpec: 'UserListProps { users: AdminUserSummary[] }',
    dataDependencies: ['Promise.all([isAdmin(), getAdminUsers()])'],
    connectedFeatures: ['AdminLayout', 'UserList', 'UIInput', 'AccountRoleBadge'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes: 'RLS "Admins lezen alle profielen" controleert public.is_admin() ook in PostgreSQL.',
  },
  {
    path: '/admin/users/[id]',
    filePath: 'app/(admin)/admin/users/[id]/page.tsx',
    routeGroup: '(admin)',
    scope: 'Admin',
    renderMode: 'PPR + Suspense',
    summary: 'Detailpagina per gebruiker met profielkaart en rolformulier (user of admin).',
    componentName: 'UserDetailCard + UserRoleForm',
    propsSpec: 'AdminUserDetailPageProps { params: Promise<{ id: string }> }',
    dataDependencies: ['Promise.all([isAdmin(), getAdminUserById(id)])', 'updateUserRole() Action'],
    connectedFeatures: ['AdminLayout', 'UserDetailCard', 'UserRoleForm', 'UISelect', 'UIButton'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'Vercel Platform & Image Optimization'],
    securityNotes:
      'updateUserRole gebruikt updateUserRoleSchema (Zod UUID + enum) en RPC set_user_role met security definer.',
  },
  {
    path: '/admin/recommendations',
    navigableHref: '/admin/recommendations',
    filePath: 'app/(admin)/admin/recommendations/page.tsx',
    routeGroup: '(admin)',
    scope: 'Admin',
    renderMode: 'PPR + Suspense',
    summary: 'Beheeroverzicht van alle publieke aanbevelingen inclusief verwijderactie.',
    componentName: 'AdminRecommendations',
    propsSpec: 'AdminRecommendationsProps { initialItems: RecommendationItem[] }',
    dataDependencies: [
      'Promise.all([isAdmin(), getRecommendations()])',
      'removeFromRecommendations() Action',
    ],
    connectedFeatures: ['AdminLayout', 'AdminRecommendations', 'UIInput', 'UIButton'],
    connectedIntegrations: ['Supabase (PostgreSQL + SSR Auth)', 'TMDB Image CDN (image.tmdb.org)', 'Vercel Platform & Image Optimization'],
    securityNotes: 'Alleen admins kunnen verwijderen; check gebeurt zowel in Action als in RLS policy.',
  },
  {
    path: 'app/error.tsx',
    filePath: 'app/error.tsx',
    routeGroup: 'Systeem',
    scope: 'Systeem',
    renderMode: 'Error Boundary',
    summary:
      'Algemene React Error Boundary binnen RootLayout met movie-ASCII weergave en herstelknop.',
    componentName: 'ErrorPage',
    propsSpec: 'ErrorPageProps { error: unknown; retry: () => void }',
    dataDependencies: ['Next.js 16 retry() voor her renderen na tijdelijke API- of netwerkfout'],
    connectedFeatures: ['ErrorPage', 'UIButton', 'ToastProvider'],
    connectedIntegrations: ['Vercel Platform & Image Optimization'],
    securityNotes:
      'Toont in productie nooit gevoelige stacktraces; geeft alleen optionele error.digest referentiecode weer.',
  },
  {
    path: 'app/not-found.tsx',
    filePath: 'app/not-found.tsx',
    routeGroup: 'Systeem',
    scope: 'Systeem',
    renderMode: 'Statisch',
    summary:
      'Algemene 404-pagina voor onbekende URLs en aangeroepen notFound() boundaries.',
    componentName: 'NotFoundPage',
    propsSpec: 'Statische Server Component met eigen Metadata export',
    dataDependencies: ['Geen runtime data-afhankelijkheden; statisch voorgebouwd in /_not-found'],
    connectedFeatures: ['NotFoundPage', 'Header', 'Footer'],
    connectedIntegrations: ['Vercel Platform & Image Optimization'],
    securityNotes: 'Next.js voegt automatisch <meta name="robots" content="noindex" /> toe.',
  },
]

export const UI_PRIMITIVE_SPECS: UiPrimitiveSpec[] = [
  {
    name: 'UIButton',
    filePath: 'components/ui/Button.tsx',
    propsInterface: 'UIButtonProps extends ButtonProps',
    keyProps: ['variant?: primary | secondary | outline | danger', 'size?: xs | sm | md | lg', 'className?', 'children?'],
    foundation: '@headlessui/react Button',
    summary: 'Centrale toegankelijke knop met uniforme varianten, focus-ringen en disabled states.',
    usedIn: ['WatchlistButton', 'RecommendationButton', 'DashboardHero', 'ErrorPage', 'UserNav'],
  },
  {
    name: 'UIInput',
    filePath: 'components/ui/Input.tsx',
    propsInterface: 'UIInputProps extends Omit<InputProps, size>',
    keyProps: ['size?: sm | md', 'type?', 'ref?: Ref<HTMLInputElement>', 'className?'],
    foundation: '@headlessui/react Input',
    summary: 'Tekst-, e-mail-, wachtwoord- en zoekinvoer met focus-ringen en React 19 ref-prop.',
    usedIn: ['HeaderSearch', 'LoginForm', 'RegisterForm', 'PresentationClient'],
  },
  {
    name: 'UISelect',
    filePath: 'components/ui/Select.tsx',
    propsInterface: 'UISelectProps<T extends string>',
    keyProps: ['value: T', 'options: UISelectOption<T>[]', 'onChange: (value: T) => void', 'label?', 'size?: sm | md', 'disabled?', 'className?'],
    foundation: '@headlessui/react Field, Label, Listbox, ListboxButton, ListboxOptions, ListboxOption',
    summary: 'Toegankelijke custom dropdown voor filter- en rolselectie zonder native <select>.',
    usedIn: ['FilterBar', 'UserRoleForm'],
  },
  {
    name: 'UISwitch',
    filePath: 'components/ui/Switch.tsx',
    propsInterface: 'UISwitchProps<T extends string>',
    keyProps: ['value: T', 'onChange: (value: T) => void', 'options?: [T, T]', 'labels?: [string, string]', 'disabled?', 'className?'],
    foundation: '@headlessui/react Switch',
    summary: 'Segmented toggle voor twee opties zoals Trending Vandaag vs Deze Week.',
    usedIn: ['TrendingMoviesClient', 'TrendingTvClient'],
  },
  {
    name: 'UISpinner',
    filePath: 'components/ui/Spinner.tsx',
    propsInterface: 'UISpinnerProps',
    keyProps: ['size?: xs | sm | md | lg', 'className?'],
    foundation: 'Enig toegestaan inline <svg> icoon in components/ui/',
    summary: 'Animatie-indicator voor laadstatussen zoals live zoekresultaten.',
    usedIn: ['SearchResults', 'LoginForm', 'RegisterForm'],
  },
  {
    name: 'ToastProvider & useToast',
    filePath: 'components/ui/Toast.tsx',
    propsInterface: 'ToastProviderProps { children: ReactNode } & ToastApi',
    keyProps: ['toast.success(msg)', 'toast.error(msg)', 'toast.info(msg)', 'ReactToastify.css + --toastify-* tokens'],
    foundation: 'react-toastify/unstyled (v11) + Headless UI sluitknop',
    summary: 'Donkere toast-meldingen rechtsonder met regenboog progress bar, swipe-dismiss en reduced-motion.',
    usedIn: ['RootLayout', 'WatchlistButton', 'RecommendationButton', 'TrendingMoviesClient', 'TrendingTvClient'],
  },
]

export const FEATURE_MODULE_SPECS: FeatureModuleSpec[] = [
  {
    domain: 'dashboard',
    folderPath: 'components/features/dashboard/',
    boundary: 'Server + Suspense',
    propsInterfaces: ['DashboardProps', 'DashboardHeroProps', 'DashboardCardProps'],
    summary: 'Rendert hero-film (#1 trending vandaag met LCP preload) en drie navigatiekaarten.',
    dataFlow: 'Twee aparte <Suspense> streams: DashboardHeroContent en DashboardCardsContent.',
  },
  {
    domain: 'trending-movies',
    folderPath: 'components/features/trending-movies/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['TrendingMoviesProps', 'TrendingMoviesClientProps', 'TrendingMovieCardProps'],
    summary: 'Server haalt initiele dag-lijst films op; client wisselt tussen dag/week via Server Action.',
    dataFlow: 'requestIdRef voorkomt race conditions; netwerkfouten tonen toast.error via useToast.',
  },
  {
    domain: 'trending-tv',
    folderPath: 'components/features/trending-tv/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['TrendingTvProps', 'TrendingTvClientProps', 'TrendingTvCardProps'],
    summary: 'Server haalt initiele dag-lijst series op; client schakelt met UISwitch tussen dag/week.',
    dataFlow: 'Synchroniseert met getTrendingTv(range) en vangt fouten af met state-herstel + toast.error.',
  },
  {
    domain: 'search',
    folderPath: 'components/features/search/',
    boundary: 'Client',
    propsInterfaces: ['HeaderSearchProps', 'SearchResultsProps'],
    summary: 'Header zoekoverlay met 300ms debounce, IMDb-id herkenning (tt...), Escape/click-outside en focusbehoud.',
    dataFlow: 'Roept searchMulti(trimmed) aan en annuleert verouderde responses met isCancelled flag.',
  },
  {
    domain: 'media',
    folderPath: 'components/features/media/',
    boundary: 'Server + Suspense',
    propsInterfaces: ['MovieDetailProps', 'TvDetailProps', 'MediaActionsProps'],
    summary: 'Volledige detailweergave en contextuele actiebalk voor films en series.',
    dataFlow: 'MediaActions voert Auth Short-Circuiting uit en haalt daarna status + aanbeveling parallel op.',
  },
  {
    domain: 'watchlist',
    folderPath: 'components/features/watchlist/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['WatchlistGridProps', 'WatchlistCardProps', 'WatchlistButtonProps'],
    summary: 'Persoonlijk kijklijst-raster en interactieve knop (toevoegen, gezien/te zien, verwijderen).',
    dataFlow: 'WatchlistGrid combineert getWatchlist() + searchParams; WatchlistButton gebruikt useTransition + toast.',
  },
  {
    domain: 'recommendations',
    folderPath: 'components/features/recommendations/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['RecommendationGridProps', 'RecommendationCardProps', 'RecommendationButtonProps'],
    summary: 'Publiek overzicht van aanbevolen titels plus admin toggle-knop op detailpaginas.',
    dataFlow: 'Grid haalt publieke aanbevelingen + filters parallel op; RecommendationButton muteert admin-only.',
  },
  {
    domain: 'filtering',
    folderPath: 'components/features/filtering/',
    boundary: 'Client',
    propsInterfaces: ['FilterBarProps'],
    summary: 'Gedeelde URL-gestuurde filterbalk (mediatype, periode, sortering) via UISelect.',
    dataFlow: 'Synchroniseert met URL query parameters voor deelbare filterstaten zonder extra DB-roundtrip.',
  },
  {
    domain: 'account',
    folderPath: 'components/features/account/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: [
      'AccountDashboardProps',
      'AccountProfileProps',
      'AccountSettingsProps',
      'AccountWatchlistProps',
      'AccountRoleBadgeProps',
    ],
    summary: 'Gebruikersdashboard, profielkaart, weergave-instellingen, accountnavigatie en compact kijklijstbeheer.',
    dataFlow: 'updateUserSettings valideert via userSettingsSchema en revalideert de /account layout.',
  },
  {
    domain: 'admin',
    folderPath: 'components/features/admin/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: [
      'AdminDashboardProps',
      'AdminCardProps',
      'UserListProps',
      'UserDetailCardProps',
      'UserRoleFormProps',
      'AdminRecommendationsProps',
    ],
    summary: 'Beheerdersstatistieken, zoekbare gebruikerslijst, rolwijziging en moderatie van aanbevelingen.',
    dataFlow: 'Alle data-opvragingen staan onder server-side isAdmin() guard met fallback naar notFound().',
  },
  {
    domain: 'auth',
    folderPath: 'components/features/auth/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['LoginFormProps', 'RegisterFormProps'],
    summary: 'Login- en registratieformulieren plus UserNav sessieweergave en uitlogactie in de Header.',
    dataFlow: 'UserNav haalt getAppUser() binnen eigen <Suspense> op zodat de Header-shell direct statisch streamt.',
  },
  {
    domain: 'navigation',
    folderPath: 'components/features/navigation/',
    boundary: 'Client',
    propsInterfaces: ['MainNav (geen externe props; leest usePathname)'],
    summary: 'Primaire applicatienavigatie tussen Home, Trending, Watchlist en Aanbevelingen.',
    dataFlow: 'Markeert actieve route via usePathname() en Next.js prefetching met Link.',
  },
  {
    domain: 'presentation',
    folderPath: 'components/features/presentation/',
    boundary: 'Hybride (Server + Client)',
    propsInterfaces: ['PresentationOverview + PresentationClient + RouteMapOverview'],
    summary: 'Interactieve route-kaart en technische specificatietabs op /presentatie voor presentaties.',
    dataFlow: 'Koppelt routes, features, promises en externe diensten interactief via TabGroup en Disclosure.',
  },
]

export const SCOPE_BOUNDARY_SPECS: ScopeBoundarySpec[] = [
  {
    title: 'Next.js 16 Route Groups & Pure Shells',
    layer: 'App Router Structuur',
    enforcement: 'app/**/page.tsx & components/layout/*',
    summary:
      'Route Groups (auth), (user) en (admin) groeperen domeinlayouts zonder de publieke URL te vervuilen. Pagina- en layoutshells blijven vrij van directe queries.',
    files: ['app/layout.tsx', 'app/(auth)/layout.tsx', 'app/(user)/account/layout.tsx', 'app/(admin)/admin/layout.tsx'],
    guarantees: [
      'Uitsluitend aanroepen van zelfvoorzienende feature-componenten',
      'RootLayout bevat geen inline scripts of directe env-reads',
      'Gedeelde navigatie via MainNav, AccountNav en AdminNav',
    ],
  },
  {
    title: 'Server vs Client Boundaries & Suspense',
    layer: 'React 19 / PPR',
    enforcement: 'async *Content + Client leaf componenten',
    summary:
      'Asynchrone data blijft strikt in Server Components binnen <Suspense fallback={<*Skeleton />}>. Alleen interactieve controls dragen use client.',
    files: ['components/features/dashboard/Dashboard.tsx', 'components/features/media/MediaActions.tsx', 'components/features/auth/UserNav.tsx'],
    guarantees: [
      'Geen async Client Components in de hele codebase',
      'params, searchParams en cookies() worden nooit buiten Suspense aangeroepen',
      'CLS-vrije skeletons spiegelen exacte aspect-ratio van de content',
    ],
  },
  {
    title: 'Proxy Sessie-Refresh & JWT Validatie',
    layer: 'Authenticatie',
    enforcement: 'proxy.ts + lib/auth/queries.ts',
    summary:
      'Next.js 16 proxy.ts ververst cookies vóór SSR via updateSession(). Server-side identiteit wordt altijd cryptografisch gecontroleerd met supabase.auth.getUser().',
    files: ['proxy.ts', 'lib/supabase/proxy.ts', 'lib/supabase/server.ts', 'lib/auth/queries.ts'],
    guarantees: [
      'Vervangt deprecated middleware.ts conform Next.js 16',
      'Nooit onveilig vertrouwen op cookie-only auth.getSession()',
      'Statische assets en afbeeldingen worden door matcher uitgesloten',
    ],
  },
  {
    title: 'PostgreSQL Row Level Security (RLS) & RBAC',
    layer: 'Database Autorisatie',
    enforcement: 'supabase/schema.sql + isAdmin()',
    summary:
      'Alle tabellen (profiles, watchlist, recommendations) draaien onder RLS. Admins krijgen extra beveiliging via is_admin() en notFound() op /admin/*.',
    files: ['supabase/schema.sql', 'lib/admin/actions.ts', 'app/(admin)/admin/page.tsx'],
    guarantees: [
      'Watchlist-rijen strikt geisoleerd op auth.uid() = user_id',
      'Rolpromotie uitsluitend via security definer RPC set_user_role()',
      'Expliciete kolomselecties overal; verbod op wildcard-kolomselecties',
    ],
  },
  {
    title: 'Centrale Env, Zod 4 & Security Headers',
    layer: 'Configuratie & Security',
    enforcement: 'lib/env.ts + types/*.ts + next.config.ts',
    summary:
      'Alle omgevingsvariabelen worden eenmalig gevalideerd via Zod 4 in lib/env.ts. Server Actions parsen inputs veilig met .safeParse() en HTTP headers harden elke response.',
    files: ['lib/env.ts', 'next.config.ts', 'types/auth.ts', 'types/media.ts', 'types/watchlist.ts'],
    guarantees: [
      'Geen directe omgevingsvariabele-reads buiten lib/env.ts en next.config.ts',
      'HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy & frame-ancestors none',
      'Open-redirect bescherming via getSafeRedirectPath() in login, register en callback',
    ],
  },
]

export const PROMISE_PATTERN_SPECS: PromisePatternSpec[] = [
  {
    title: 'Parallelle Server Queries via Promise.all',
    mechanism: 'Promise.all([...])',
    summary:
      'Onafhankelijke database- en route-afhankelijkheden starten gelijktijdig om request-waterfalls tussen Next.js, Supabase en TMDB te voorkomen.',
    exampleFiles: [
      'app/(admin)/admin/page.tsx',
      'app/(user)/account/page.tsx',
      'components/features/watchlist/WatchlistGrid.tsx',
      'components/features/recommendations/RecommendationGrid.tsx',
    ],
    behavior:
      'In AdminDashboardContent starten isAdmin(), getAdminUsers() en getRecommendations() tegelijkertijd in één roundtrip-fase.',
  },
  {
    title: 'Request-Level Memoization met React.cache()',
    mechanism: 'cache(async () => ...)',
    summary:
      'Identieke aanroepen binnen dezelfde SSR-render delen exact dezelfde Promise zonder dubbele Supabase- of TMDB-calls.',
    exampleFiles: [
      'lib/supabase/server.ts',
      'lib/auth/queries.ts',
      'lib/tmdb/queries.ts',
      'lib/watchlist/queries.ts',
    ],
    behavior:
      'createClient(), getCurrentUser(), getAppUser() en isAdmin() kunnen vanuit meerdere losse features worden aangeroepen zonder extra latency.',
  },
  {
    title: 'Auth Short-Circuiting met Promise.resolve()',
    mechanism: 'Early return + Promise.resolve(false)',
    summary:
      'Niet-ingelogde of niet-beheerder gebruikers slaan overbodige watchlist- en aanbevelingsqueries direct over.',
    exampleFiles: ['components/features/media/MediaActions.tsx', 'lib/watchlist/queries.ts', 'lib/account/queries.ts'],
    behavior:
      'MediaActions stopt direct bij !user; bij reguliere users wordt alleen getWatchlistStatus uitgevoerd en wordt admin-check vervangen door Promise.resolve(false).',
  },
  {
    title: 'Next.js 16 Async Route Props (params & searchParams)',
    mechanism: 'Promise<{ id: string }> & MediaSearchParams',
    summary:
      'Dynamische URL-parameters en zoekfilters worden als Promise doorgegeven aan het Suspense-kind en daar pas ge-await.',
    exampleFiles: [
      'app/movies/[id]/page.tsx',
      'app/tv/[id]/page.tsx',
      'app/(admin)/admin/users/[id]/page.tsx',
      'app/watchlist/page.tsx',
    ],
    behavior:
      'De buitenste route-shell blijft direct prerenderbaar onder Cache Components & PPR.',
  },
  {
    title: 'Race-Condition Bescherming & Debounced Client Fetches',
    mechanism: 'requestIdRef & isCancelled cleanup',
    summary:
      'Snelle interacties zoals wisselen tussen Vandaag/Deze Week of typen in de zoekbalk negeren vertraagde oude antwoorden.',
    exampleFiles: [
      'components/features/trending-movies/TrendingMoviesClient.tsx',
      'components/features/trending-tv/TrendingTvClient.tsx',
      'components/features/search/SearchResults.tsx',
    ],
    behavior:
      'Alleen de meest recente aanvraag mag state updaten; oudere fouten of resultaten worden genegeerd en bij echte fouten verschijnt toast.error().',
  },
  {
    title: 'ActionResult vs gecontroleerde Error & 404 Boundaries',
    mechanism: 'ActionResult<T> | allowNotFound | throw Error',
    summary:
      'Verwachte validatie- en mutatiefouten keren als getypeerd object terug; echte server-/API-storingen activeren app/error.tsx.',
    exampleFiles: [
      'lib/auth/actions.ts',
      'lib/watchlist/actions.ts',
      'lib/tmdb/client.ts',
      'app/error.tsx',
      'app/not-found.tsx',
    ],
    behavior:
      'fetchFromTmdb gooit alleen bij !res.ok (tenzij 404 + allowNotFound: true -> null -> notFound()); Server Actions retourneren { success: false, error } voor UI-feedback en toasts.',
  },
]

export const INTEGRATION_SPECS: IntegrationSpec[] = [
  {
    name: 'Supabase (PostgreSQL + SSR Auth)',
    category: 'Database & Auth',
    summary:
      'Verzorgt gebruikersregistratie (PKCE e-mailverificatie), sessiecookies via @supabase/ssr en relationele opslag met Row Level Security.',
    files: ['lib/supabase/server.ts', 'lib/supabase/client.ts', 'lib/supabase/proxy.ts', 'supabase/schema.sql'],
    contracts: [
      'Tabellen: public.profiles, public.watchlist, public.recommendations',
      'Trigger on_auth_user_created synchroniseert auth.users automatisch naar profiles',
      'RPC public.set_user_role() synchroniseert rolwijziging naar profiles en app_metadata',
    ],
  },
  {
    name: 'TMDB API v3 (Live JSON Data)',
    category: 'Externe API',
    summary:
      'Centrale server-side data-laag voor trending films/series, detailpaginas, globale HeaderSearch en IMDb-id lookups in nl-NL.',
    files: ['lib/tmdb/client.ts', 'lib/tmdb/queries.ts', 'types/tmdb.ts'],
    contracts: [
      'Enkele ingang fetchFromTmdb met URLSearchParams en AbortSignal.timeout(10_000)',
      'Next.js fetch cache revalidate (3600s details/trending, 60s zoekresultaten)',
      'Watchlist en Aanbevelingen bewaren een snapshot in Supabase en roepen deze API niet per bezoek aan',
    ],
  },
  {
    name: 'TMDB Image CDN (image.tmdb.org)',
    category: 'Media CDN',
    summary:
      'Levert poster- en backdrop-afbeeldingen voor zowel live TMDB-schermen als opgeslagen snapshots in Watchlist en Aanbevelingen.',
    files: ['lib/utils/media.ts', 'next.config.ts'],
    contracts: [
      'Centrale URL-opbouw via getTmdbImageUrl(path, size)',
      'Strikte remotePatterns allowlist https://image.tmdb.org/t/p/** in next.config.ts',
      'Geoptimaliseerd en gecachet als WebP via Vercel Image Optimization (31 dagen)',
    ],
  },
  {
    name: 'Vercel Platform & Image Optimization',
    category: 'Hosting & CDN',
    summary:
      'Host Preview (development) en Production (master) deployments inclusief Edge caching voor geoptimaliseerde TMDB-posters.',
    files: ['next.config.ts', 'lib/env.ts', 'postcss.config.mjs'],
    contracts: [
      'next/image: WebP formaat, quality [75], minimumCacheTTL 31 dagen (2678400s)',
      'cacheComponents: true, partialPrefetching: true en reactCompiler: true',
      'Origin-resolutie via NEXT_PUBLIC_SITE_URL, VERCEL_PROJECT_PRODUCTION_URL en VERCEL_URL',
    ],
  },
  {
    name: 'GitHub Actions & Clean Release Pipeline',
    category: 'CI & Release',
    summary:
      'Automatische kwaliteitspoort bij elke push en Pull Request, gecombineerd met een schone release-branch zonder interne agentbestanden.',
    files: ['.github/workflows/ci.yml', 'scripts/release-master.mjs', 'package.json'],
    contracts: [
      'CI draait ESLint (--max-warnings=0), tsc --noEmit en greps op wildcards, console.log en comments',
      'pnpm release:master bouwt release/master vanaf origin/master zonder .agents/ en AGENTS.md',
      'Merge van PR release/master -> master triggert productie-deployment op Vercel',
    ],
  },
]

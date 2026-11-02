import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url('NEXT_PUBLIC_SITE_URL moet een geldige URL zijn.').optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url('NEXT_PUBLIC_SUPABASE_URL moet een geldige URL zijn.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is verplicht.'),
})

const serverEnvSchema = z.object({
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is verplicht.'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VERCEL_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
})

let cachedPublicEnv: z.infer<typeof publicEnvSchema> | null = null
let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null

function getPublicEnv() {
  if (cachedPublicEnv) {
    return cachedPublicEnv
  }

  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined
  const sanitizedSiteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, '') : undefined

  const parseResult = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: sanitizedSiteUrl,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join(', ')
    throw new Error(`Ongeldige publieke omgevingsvariabelen: ${errorDetails}`)
  }

  cachedPublicEnv = parseResult.data
  return cachedPublicEnv
}

function getServerEnv() {
  if (cachedServerEnv) {
    return cachedServerEnv
  }

  const parseResult = serverEnvSchema.safeParse({
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  })

  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join(', ')
    throw new Error(`Ongeldige server omgevingsvariabelen: ${errorDetails}`)
  }

  cachedServerEnv = parseResult.data
  return cachedServerEnv
}

export const env = {
  get siteUrl() {
    return getPublicEnv().NEXT_PUBLIC_SITE_URL
  },
  get supabase() {
    const config = getPublicEnv()
    return {
      url: config.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  },
  get tmdb() {
    const config = getServerEnv()
    return {
      apiKey: config.TMDB_API_KEY,
    }
  },
  get isProduction() {
    return (process.env.NODE_ENV || 'development') === 'production'
  },
  get isDevelopment() {
    return (process.env.NODE_ENV || 'development') === 'development'
  },
}

export function getSiteUrl(
  forwardedHost?: string | null,
  forwardedProto?: string | null
): string {
  const configuredSiteUrl = env.siteUrl
  if (configuredSiteUrl) {
    return configuredSiteUrl
  }

  if (forwardedHost) {
    const proto = forwardedProto || 'https'
    return `${proto}://${forwardedHost}`
  }

  const vercelProjectUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProjectUrl) {
    return `https://${vercelProjectUrl}`
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return 'http://localhost:3000'
}


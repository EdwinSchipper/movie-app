'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { UIButton } from '@/components/ui'
import { login } from '@/lib/auth'
import { getSafeRedirectPath } from '@/lib/redirect'

export interface LoginFormProps {
  className?: string
  posterPath?: string
  posterTitle?: string
  posterQuote?: string
  posterRating?: string
}

function LoginFormSkeleton({ className = '' }: LoginFormProps) {
  return (
    <div
      className={`w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/60 animate-pulse grid grid-cols-1 md:grid-cols-2 ${className}`.trim()}
    >
      <div className="hidden md:block bg-gray-200/50 dark:bg-gray-800/60 min-h-[540px]" />
      <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
        <div>
          <div className="h-8 w-44 rounded bg-gray-200/50 dark:bg-gray-700/40 mb-2" />
          <div className="h-4 w-72 rounded bg-gray-200/30 dark:bg-gray-700/30" />
        </div>
        <div className="space-y-4">
          <div className="h-10 rounded-lg bg-gray-200/40 dark:bg-gray-700/40" />
          <div className="h-10 rounded-lg bg-gray-200/40 dark:bg-gray-700/40" />
          <div className="h-10 rounded-lg bg-gray-200/40 dark:bg-gray-700/40" />
        </div>
      </div>
    </div>
  )
}

function LoginFormContent({
  className = '',
  posterPath = '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  posterTitle = 'Interstellar (2014)',
  posterQuote = 'Mankind was born on Earth. It was never meant to die here.',
  posterRating = '8.7',
}: LoginFormProps) {
  const router = useRouter()
  const urlParams = useSearchParams()
  const destinationPath = getSafeRedirectPath(urlParams.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Vul zowel je e-mailadres als wachtwoord in.')
      return
    }

    setError(null)
    setIsPending(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await login(formData)
      if (!result.success) {
        setError(result.error || 'Er is een fout opgetreden bij het inloggen.')
        setIsPending(false)
        return
      }

      router.push(destinationPath)
      router.refresh()
    } catch {
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
      setIsPending(false)
    }
  }

  return (
    <div
      className={`w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900/60 backdrop-blur-xs grid grid-cols-1 md:grid-cols-2 ${className}`.trim()}
    >
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gray-950 p-8 text-white min-h-[540px]">
        <Image
          src={`https://image.tmdb.org/t/p/w780${posterPath}`}
          alt={posterTitle}
          fill
          priority
          sizes="(max-width: 768px) 0vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/45 to-gray-950/20" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-xs">
            🎬 Movie App
          </span>
        </div>

        <div className="relative z-10 space-y-3">
          <blockquote className="text-base font-medium leading-snug text-gray-100">
            &ldquo;{posterQuote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-between text-xs text-gray-300 border-t border-white/10 pt-3">
            <span className="font-semibold text-white">{posterTitle}</span>
            <span className="flex items-center gap-1 text-yellow-400 font-medium">
              ★ {posterRating}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Jouw persoonlijke film- en seriecollectie, altijd binnen handbereik.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welkom terug
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 text-balance">
            Log in op je account om je watchlist en aanbevelingen te beheren.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw.naam@voorbeeld.nl"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Wachtwoord
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <UIButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full justify-center py-2.5 text-sm font-medium"
          >
            {isPending ? 'Bezig met inloggen...' : 'Inloggen'}
          </UIButton>
        </form>

        <div className="mt-6 text-center md:text-left text-sm text-gray-500 dark:text-gray-400">
          Nog geen account?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Account registreren
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={<LoginFormSkeleton className={props.className} />}>
      <LoginFormContent {...props} />
    </Suspense>
  )
}

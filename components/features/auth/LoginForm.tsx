'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { UIButton, UIInput } from '@/components/ui'
import { login } from '@/lib/auth'
import { getSafeRedirectPath, getTmdbImageUrl } from '@/lib/utils'

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
      className={`w-full max-w-4xl overflow-hidden rounded-hero border border-border-subtle bg-surface shadow-xl animate-pulse grid grid-cols-1 md:grid-cols-2 ${className}`.trim()}
    >
      <div className="hidden md:block bg-surface-hover min-h-[540px]" />
      <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
        <div>
          <div className="h-8 w-44 rounded-control bg-surface-hover mb-2" />
          <div className="h-4 w-72 rounded-control bg-surface-hover" />
        </div>
        <div className="space-y-4">
          <div className="h-10 rounded-control bg-surface-hover" />
          <div className="h-10 rounded-control bg-surface-hover" />
          <div className="h-10 rounded-control bg-surface-hover" />
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

      window.location.assign(destinationPath)
    } catch {
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
      setIsPending(false)
    }
  }

  return (
    <div
      className={`w-full max-w-4xl overflow-hidden rounded-hero border border-border-subtle bg-surface shadow-2xl grid grid-cols-1 md:grid-cols-2 ${className}`.trim()}
    >
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-canvas p-8 text-fg-primary min-h-[540px]">
        <Image
          src={getTmdbImageUrl(posterPath, 'w780')}
          alt={posterTitle}
          fill
          priority
          sizes="(max-width: 768px) 0vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/45 to-canvas/20" />

        <div className="relative z-10">
          <span className="badge-brand backdrop-blur-md shadow-xs">
            🎬 Movie App
          </span>
        </div>

        <div className="relative z-10 space-y-3">
          <blockquote className="text-base font-medium leading-snug text-fg-primary">
            &ldquo;{posterQuote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-between text-xs text-fg-secondary border-t border-border-default pt-3">
            <span className="font-semibold text-fg-primary">{posterTitle}</span>
            <span className="flex items-center gap-1 text-brand font-semibold">
              <span aria-hidden="true">★</span> {posterRating}
            </span>
          </div>
          <p className="text-xs text-fg-muted">
            Jouw persoonlijke film- en seriecollectie, altijd binnen handbereik.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-6 text-center md:text-left">
          <h1 className="h2">
            Welkom terug
          </h1>
          <p className="mt-1.5 text-sm text-fg-secondary text-balance">
            Log in op je account om je watchlist en aanbevelingen te beheren.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="label-form block mb-1.5"
            >
              E-mailadres
            </label>
            <UIInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw.naam@voorbeeld.nl"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="label-form block"
              >
                Wachtwoord
              </label>
            </div>
            <UIInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-control border border-accent-coral/40 bg-accent-coral/15 p-3 text-sm text-accent-coral"
            >
              {error}
            </div>
          )}

          <UIButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Bezig met inloggen...' : 'Inloggen'}
          </UIButton>
        </form>

        <div className="mt-6 text-center md:text-left text-sm text-fg-secondary">
          Nog geen account?{' '}
          <Link
            href="/register"
            className="font-semibold text-accent-blue-hover hover:text-accent-blue transition-colors"
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

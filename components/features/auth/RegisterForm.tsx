'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { UIButton, UIInput } from '@/components/ui'
import { registerSchema } from '@/types'
import { signup } from '@/lib/auth'
import { getSafeRedirectPath } from '@/lib/utils'

export interface RegisterFormProps {
  className?: string
}

function RegisterFormSkeleton({ className = '' }: RegisterFormProps) {
  return (
    <div className={`w-full max-w-md mx-auto rounded-card border border-border-subtle bg-surface p-6 sm:p-8 animate-pulse ${className}`.trim()}>
      <div className="h-8 w-44 bg-surface-hover rounded-control mx-auto mb-2" />
      <div className="h-4 w-64 bg-surface-hover rounded-control mx-auto mb-6" />
      <div className="space-y-4">
        <div className="h-10 bg-surface-hover rounded-control" />
        <div className="h-10 bg-surface-hover rounded-control" />
        <div className="h-10 bg-surface-hover rounded-control" />
      </div>
    </div>
  )
}

function RegisterFormContent({ className = '' }: RegisterFormProps) {
  const router = useRouter()
  const urlParams = useSearchParams()
  const destinationPath = getSafeRedirectPath(urlParams.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  const loginHref =
    destinationPath !== '/' ? `/login?next=${destinationPath}` : '/login'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const parseResult = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    })

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]
      setError(firstIssue?.message || 'Controleer de ingevoerde gegevens.')
      return
    }

    setError(null)
    setIsPending(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('confirmPassword', confirmPassword)

      const result = await signup(formData)
      if (!result.success) {
        setError(result.error || 'Er is een fout opgetreden bij het registreren.')
        setIsPending(false)
        return
      }

      if (result.data?.needsEmailConfirmation === false) {
        router.push(destinationPath)
        return
      }

      setIsSuccess(true)
    } catch {
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.')
    } finally {
      setIsPending(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`w-full max-w-md mx-auto rounded-card border border-border-subtle bg-surface p-6 sm:p-8 text-center ${className}`.trim()}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-brand/10 text-brand">
          <EnvelopeIcon className="icon-md" />
        </div>

        <h1 className="h2 mb-2">
          Bevestig je e-mailadres
        </h1>

        <p className="text-sm text-fg-muted">
          We hebben een verificatielink gestuurd naar{' '}
          <strong className="text-fg-primary">{email}</strong>.
          Klik op de link in de e-mail om je registratie te voltooien.
        </p>

        <div className="mt-6">
          <Link href={loginHref} className="block w-full">
            <UIButton variant="outline" size="md" className="w-full justify-center">
              Naar inloggen
            </UIButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto rounded-card border border-border-subtle bg-surface p-6 sm:p-8 ${className}`.trim()}>
      <div className="mb-6 text-center">
        <h1 className="h2 mb-1.5">
          Account aanmaken
        </h1>
        <p className="text-sm text-fg-muted">
          Registreer gratis om je eigen watchlist en aanbevelingen bij te houden.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="register-email"
            className="label-form block mb-1.5"
          >
            E-mailadres
          </label>
          <UIInput
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw.naam@voorbeeld.nl"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="label-form block mb-1.5"
          >
            Wachtwoord
          </label>
          <UIInput
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimaal 8 tekens"
            className="w-full"
          />

          <div className="mt-2 space-y-1 text-xs">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-accent-emerald' : 'text-fg-muted'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-pill ${hasMinLength ? 'bg-accent-emerald' : 'bg-fg-muted/40'}`} />
              Minimaal 8 tekens
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-accent-emerald' : 'text-fg-muted'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-pill ${hasUppercase ? 'bg-accent-emerald' : 'bg-fg-muted/40'}`} />
              Minimaal 1 hoofdletter (A-Z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-accent-emerald' : 'text-fg-muted'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-pill ${hasNumber ? 'bg-accent-emerald' : 'bg-fg-muted/40'}`} />
              Minimaal 1 cijfer (0-9)
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="label-form block mb-1.5"
          >
            Bevestig wachtwoord
          </label>
          <UIInput
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Herhaal je wachtwoord"
            className="w-full"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-control text-sm border bg-accent-coral/10 border-accent-coral/30 text-accent-coral"
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
          {isPending ? 'Bezig met registreren...' : 'Account registreren'}
        </UIButton>
      </form>

      <div className="mt-6 text-center text-sm text-fg-muted">
        Al een account?{' '}
        <Link
          href={loginHref}
          className="font-medium text-fg-primary hover:text-brand transition-colors"
        >
          Direct inloggen
        </Link>
      </div>
    </div>
  )
}

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <Suspense fallback={<RegisterFormSkeleton {...props} />}>
      <RegisterFormContent {...props} />
    </Suspense>
  )
}

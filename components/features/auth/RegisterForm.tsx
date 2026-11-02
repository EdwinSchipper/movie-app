'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UIButton } from '@/components/ui'
import { registerSchema } from '@/types'
import { signup } from '@/lib/auth'

export interface RegisterFormProps {
  className?: string
}

export default function RegisterForm({ className = '' }: RegisterFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

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
        router.push('/')
        router.refresh()
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
      <div className={`rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 backdrop-blur-xs text-center ${className}`.trim()}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Bevestig je e-mailadres
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We hebben een verificatielink gestuurd naar{' '}
          <strong className="text-gray-900 dark:text-gray-200">{email}</strong>.
          Klik op de link in de e-mail om je registratie te voltooien.
        </p>

        <div className="mt-6">
          <Link href="/login" className="block w-full">
            <UIButton variant="outline" size="md" className="w-full justify-center">
              Naar inloggen
            </UIButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs dark:border-gray-800 dark:bg-gray-900/60 backdrop-blur-xs ${className}`.trim()}>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Account aanmaken
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Registreer gratis om je eigen watchlist en aanbevelingen bij te houden.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            E-mailadres
          </label>
          <input
            id="register-email"
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
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Wachtwoord
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimaal 8 tekens"
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />

          <div className="mt-2 space-y-1 text-xs">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`} />
              Minimaal 8 tekens
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasUppercase ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`} />
              Minimaal 1 hoofdletter (A-Z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`} />
              Minimaal 1 cijfer (0-9)
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Bevestig wachtwoord
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Herhaal je wachtwoord"
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
          {isPending ? 'Bezig met registreren...' : 'Account registreren'}
        </UIButton>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Al een account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Direct inloggen
        </Link>
      </div>
    </div>
  )
}

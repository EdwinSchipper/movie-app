import type { Metadata } from 'next'
import { LoginForm } from '@/components/features'

export const metadata: Metadata = {
  title: 'Inloggen | Movie App',
  description: 'Log in op je Movie App account om je persoonlijke watchlist en aanbevelingen te beheren.',
}

export default function LoginPage() {
  return <LoginForm />
}


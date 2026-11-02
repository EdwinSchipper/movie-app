import type { Metadata } from 'next'
import { RegisterForm } from '@/components/features'

export const metadata: Metadata = {
  title: 'Registreren | Movie App',
  description: 'Maak een gratis account aan om je eigen watchlist en filmaanbevelingen bij te houden.',
}

export default function RegisterPage() {
  return <RegisterForm />
}


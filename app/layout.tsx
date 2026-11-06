import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components'
import { ToastProvider } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Movie App',
  description: 'Movie for Friends NextJS App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL" className="h-full">
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <Header />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}

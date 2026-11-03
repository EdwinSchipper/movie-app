import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from '@/components'

export const metadata: Metadata = {
  title: "Movie App",
  description: "Movie for Friends NextJS App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL" className="h-full">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

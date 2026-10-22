import type { Metadata } from "next";
import "./globals.css";
import { Header } from '@/components'

export const metadata: Metadata = {
  title: "Movie for Friends",
  description: "Movie for Friends NextJS App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
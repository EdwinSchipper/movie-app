import Link from 'next/link'
import { HeaderSearch } from '@/components/features'

export default function Header() {
  return (
    <header className="backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
          >
            Movie for Friends
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/trending" className="hover:text-blue-600 transition-colors">
              Trending
            </Link>
          </nav>
        </div>

        <HeaderSearch />
      </div>
    </header>
  )
}

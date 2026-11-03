import Link from 'next/link'
import { HeaderSearch, MainNav, UserNav } from '@/components/features'

export default function Header() {
  return (
    <header className="backdrop-blur sticky top-0 z-50 py-3">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 sm:gap-20 w-full justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-300 hover:text-blue-600 transition-colors shrink-0"
          >
            Movie App
          </Link>

          <div className="flex-1 min-w-0">
            <HeaderSearch />
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <MainNav />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}

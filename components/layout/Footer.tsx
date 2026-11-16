import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2 mb-4 md:mb-0">
          <Link
            href="/presentatie"
            className="text-sm/6 text-fg-secondary hover:text-brand transition-colors"
          >
            Architectuur &amp; Presentatie
          </Link>
        </div>
        <p className="text-center text-sm/6 text-fg-muted md:order-1">
          &copy; 2026 Movie App, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

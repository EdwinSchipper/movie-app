import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:order-2 mb-4 md:mb-0">
          <Link
            href="/presentatie"
            className="text-sm/6 text-fg-secondary hover:text-accent-blue-hover transition-colors"
          >
            Architectuur
          </Link>
          <Link
            href="/tijdlijn"
            className="text-sm/6 text-fg-secondary hover:text-accent-blue-hover transition-colors"
          >
            Dataflow
          </Link>
        </div>
        <p className="text-center text-sm/6 text-fg-muted md:order-1">
          &copy; 2026 Movie App, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

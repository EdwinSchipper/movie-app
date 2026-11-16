'use client'

import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'

export type DashboardShowcaseVariant = 'surface' | 'plain'

export interface DashboardShowcaseItem {
  id: string
  tabTitle: string
  tabDescription: string
  imageUrl: string | null
  imageAlt: string
  badgeLabel?: string
  href?: string
  linkLabel?: string
}

export interface DashboardShowcaseProps {
  items: DashboardShowcaseItem[]
  variant?: DashboardShowcaseVariant
  ariaLabel?: string
  className?: string
}

const showcaseVariants: Record<
  DashboardShowcaseVariant,
  { container: string; frame: string }
> = {
  surface: {
    container:
      'rounded-hero border border-border-subtle bg-surface p-5 md:p-8 shadow-2xl',
    frame: 'border border-border-default bg-canvas',
  },
  plain: {
    container: '',
    frame: '',
  },
}

export default function DashboardShowcase({
  items,
  variant = 'surface',
  ariaLabel = 'Uitgelichte onderdelen',
  className = '',
}: DashboardShowcaseProps) {
  if (items.length === 0) {
    return null
  }

  const variantClasses = showcaseVariants[variant]

  return (
    <section
      aria-label={ariaLabel}
      className={`${variantClasses.container} ${className}`.trim()}
    >
      <TabGroup className="space-y-6">
        <TabPanels>
          {items.map((item) => (
            <TabPanel key={item.id} className="focus:outline-none">
              <div
                className={`relative aspect-16/9 w-full overflow-hidden rounded-card ${variantClasses.frame}`.trim()}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1088px"
                    className="object-cover object-center transition-transform duration-300 motion-reduce:transition-none"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-fg-muted">
                    Geen afbeelding beschikbaar
                  </div>
                )}

                {(item.badgeLabel || (item.href && item.linkLabel)) && (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent"
                    />
                    <div className="relative z-10 flex h-full items-end justify-between gap-4 p-4 md:p-6">
                      {item.badgeLabel ? (
                        <span className="badge-surface">{item.badgeLabel}</span>
                      ) : (
                        <span />
                      )}

                      {item.href && item.linkLabel && (
                        <UIButton href={item.href} variant="primary" size="sm">
                          <span>{item.linkLabel}</span>
                          <ArrowRightIcon className="icon-xs" aria-hidden="true" />
                        </UIButton>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabPanel>
          ))}
        </TabPanels>

        <TabList
          aria-label={ariaLabel}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {items.map((item) => (
            <Tab
              key={item.id}
              className="group flex flex-col items-start md:items-center text-left md:text-center pt-1 pb-2 px-2 rounded-control cursor-pointer transition-colors focus:outline-none data-focus:ring-2 data-focus:ring-accent-blue/60"
            >
              <div className="relative mb-4 h-0.5 w-full rounded-pill bg-border-subtle overflow-hidden">
                <div className="h-full w-0 bg-accent-blue-hover transition-all duration-300 group-data-selected:w-full motion-reduce:transition-none" />
              </div>

              <span className="text-sm md:text-base font-semibold text-fg-muted transition-colors group-hover:text-fg-secondary group-data-selected:text-fg-primary">
                {item.tabTitle}
              </span>

              <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-fg-muted transition-colors group-data-selected:text-fg-secondary">
                {item.tabDescription}
              </p>
            </Tab>
          ))}
        </TabList>
      </TabGroup>
    </section>
  )
}

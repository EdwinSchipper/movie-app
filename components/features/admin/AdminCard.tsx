import type { ReactNode } from 'react'
import { UIButton } from '@/components/ui'

export interface AdminCardProps {
  heading: string
  description: string
  href: string
  buttonText: string
  badge?: string
  icon?: ReactNode
}

export default function AdminCard({
  heading,
  description,
  href,
  buttonText,
  badge,
  icon,
}: AdminCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-6 transition-all hover:border-border-default hover:bg-surface-hover">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {icon ? (
              <div className="icon-tile text-accent-violet">
                {icon}
              </div>
            ) : null}
            <h2 className="h3">{heading}</h2>
          </div>
          {badge ? (
            <span className="badge-violet">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-fg-muted leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        <UIButton href={href} variant="primary" size="sm" className="w-full">
          {buttonText}
        </UIButton>
      </div>
    </article>
  )
}

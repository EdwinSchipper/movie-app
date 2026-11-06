import Link from 'next/link'
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
    <article className="flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-xs transition-all hover:border-gray-700 hover:bg-gray-900/90">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {icon ? (
              <div className="p-2 rounded-lg bg-purple-600/10 text-purple-400">
                {icon}
              </div>
            ) : null}
            <h2 className="text-lg font-bold text-gray-100">{heading}</h2>
          </div>
          {badge ? (
            <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        <Link href={href}>
          <UIButton variant="primary" size="sm" className="w-full">
            {buttonText}
          </UIButton>
        </Link>
      </div>
    </article>
  )
}

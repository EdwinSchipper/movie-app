import { UIButton } from '@/components/ui'

export interface DashboardCardProps {
  heading: string
  description: string
  href: string
  buttonText: string
}

export default function DashboardCard({
  heading,
  description,
  href,
  buttonText,
}: DashboardCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-6 transition-all hover:border-border-default hover:bg-surface-hover">
      <div>
        <h2 className="h3 mb-2">{heading}</h2>
        <p className="text-sm text-fg-secondary leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        <UIButton href={href} variant="primary" size="md" className="w-full">
          {buttonText}
        </UIButton>
      </div>
    </div>
  )
}


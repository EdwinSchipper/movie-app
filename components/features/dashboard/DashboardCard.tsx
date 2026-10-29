import Link from 'next/link'
import { UIButton } from '@/components/ui'

export interface DashboardCardProps {
  title: string
  description: string
  href: string
  buttonText: string
}

export default function DashboardCard({
  title,
  description,
  href,
  buttonText,
}: DashboardCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div>
        <Link href={href}>
          <UIButton variant="primary" size="md" className="w-full">
            {buttonText}
          </UIButton>
        </Link>
      </div>
    </div>
  )
}


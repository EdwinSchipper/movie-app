import type { UserRole } from '@/types'

export interface AccountRoleBadgeProps {
  role: UserRole
}

export default function AccountRoleBadge({ role }: AccountRoleBadgeProps) {
  const isAdminRole = role === 'admin'

  return (
    <span
      className={`badge ${
        isAdminRole
          ? 'badge-violet'
          : 'border-accent-blue/40 bg-accent-blue/15 text-accent-blue-hover'
      }`}
    >
      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 rounded-full ${
          isAdminRole
            ? 'bg-accent-violet animate-pulse motion-reduce:animate-none'
            : 'bg-accent-blue-hover'
        }`}
      />
      {isAdminRole ? 'Administrator' : 'Standaard Gebruiker'}
    </span>
  )
}


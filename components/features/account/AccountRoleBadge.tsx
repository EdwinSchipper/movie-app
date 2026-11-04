import type { UserRole } from '@/types'

export interface AccountRoleBadgeProps {
  role: UserRole
}

export default function AccountRoleBadge({ role }: AccountRoleBadgeProps) {
  const isAdminRole = role === 'admin'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
        isAdminRole
          ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
          : 'bg-blue-950/80 text-blue-300 border-blue-800/60'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isAdminRole ? 'bg-purple-400 animate-pulse' : 'bg-blue-400'
        }`}
      />
      {isAdminRole ? 'Administrator' : 'Standaard Gebruiker'}
    </span>
  )
}


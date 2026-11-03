import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}

import { Button as HeadlessButton, type ButtonProps } from '@headlessui/react'
import type { ReactNode } from 'react'

export interface UIButtonProps extends ButtonProps {
  children?: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const buttonVariants = {
  primary:
    'bg-blue-600 text-white data-hover:bg-blue-500 data-active:bg-blue-700',
  secondary:
    'bg-gray-800 text-gray-200 border border-gray-700 data-hover:bg-gray-700 data-active:bg-gray-600',
  outline:
    'border border-gray-700/80 bg-gray-900/60 text-gray-300 data-hover:bg-gray-800 data-hover:text-white data-hover:border-gray-600',
  danger:
    'bg-red-950/50 text-red-300 border border-red-900/60 data-hover:bg-red-900/60 data-hover:text-red-200 data-active:bg-red-900/80',
}

const buttonSizes = {
  xs: 'px-2 py-0.5 text-2xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function UIButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: UIButtonProps) {
  return (
    <HeadlessButton
      {...props}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer data-disabled:opacity-50 data-disabled:cursor-not-allowed focus:outline-none data-focus:ring-2 data-focus:ring-blue-500/50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim()}
    >
      {children}
    </HeadlessButton>
  )
}

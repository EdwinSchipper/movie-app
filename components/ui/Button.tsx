import { Button as HeadlessButton, type ButtonProps } from '@headlessui/react'
import type { ReactNode } from 'react'

export interface UIButtonProps extends ButtonProps {
  children?: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white data-hover:bg-blue-500 data-active:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-800 data-hover:bg-gray-200 data-active:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:data-hover:bg-gray-700 dark:data-active:bg-gray-600',
  outline: 'border border-gray-300 text-gray-700 data-hover:bg-gray-50 data-active:bg-gray-100 dark:border-gray-800 dark:bg-gray-950/60 dark:text-gray-300 dark:data-hover:bg-gray-900 dark:data-hover:text-white dark:data-hover:border-gray-700',
  danger: 'bg-red-600 text-white data-hover:bg-red-500 data-active:bg-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border dark:border-red-900/50 dark:data-hover:bg-red-950/80',
}

const buttonSizes = {
  xs: 'px-2 py-0.5 text-2xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function UIButton({
  children = 'Knopje',
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: UIButtonProps) {
  return (
    <HeadlessButton
      {...props}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer data-disabled:opacity-50 data-disabled:cursor-not-allowed focus:outline-none data-focus:ring-2 data-focus:ring-blue-500 data-focus:ring-offset-2 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim()}
    >
      {children}
    </HeadlessButton>
  )
}

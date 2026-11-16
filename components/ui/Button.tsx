import Link from 'next/link'
import { Button as HeadlessButton, type ButtonProps } from '@headlessui/react'
import type { ReactNode } from 'react'

export type UIButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
export type UIButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface UIButtonProps extends ButtonProps {
  children?: ReactNode
  className?: string
  variant?: UIButtonVariant
  size?: UIButtonSize
  href?: string
  target?: string
  rel?: string
}

const buttonVariants: Record<UIButtonVariant, string> = {
  primary:
    'bg-accent-blue text-white hover:bg-accent-blue-hover data-hover:bg-accent-blue-hover active:bg-accent-blue/90 data-active:bg-accent-blue/90 shadow-xs',
  secondary:
    'bg-surface text-fg-primary border border-border-default hover:bg-surface-hover data-hover:bg-surface-hover',
  outline:
    'border border-border-default bg-canvas/70 text-fg-secondary hover:bg-surface-hover hover:text-fg-primary data-hover:bg-surface-hover data-hover:text-fg-primary',
  danger:
    'bg-accent-coral/15 text-accent-coral border border-accent-coral/40 hover:bg-accent-coral/25 data-hover:bg-accent-coral/25',
}

const buttonSizes: Record<UIButtonSize, string> = {
  xs: 'px-2.5 py-1 text-2xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function getButtonClasses({
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  variant?: UIButtonVariant
  size?: UIButtonSize
  className?: string
} = {}) {
  return `inline-flex items-center justify-center gap-2 font-semibold rounded-control transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 data-focus:ring-2 data-focus:ring-accent-blue/60 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim()
}

export default function UIButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  ...props
}: UIButtonProps) {
  const classes = getButtonClasses({ variant, size, className })

  if (href) {
    const resolvedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

    return (
      <Link
        href={href}
        target={target}
        rel={resolvedRel}
        aria-label={props['aria-label']}
        title={props.title}
        className={classes}
      >
        {children}
      </Link>
    )
  }

  return (
    <HeadlessButton {...props} className={classes}>
      {children}
    </HeadlessButton>
  )
}

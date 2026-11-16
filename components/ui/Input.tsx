import { Input as HeadlessInput, type InputProps } from '@headlessui/react'
import type { Ref } from 'react'

export interface UIInputProps extends Omit<InputProps, 'size'> {
  className?: string
  size?: 'sm' | 'md'
  ref?: Ref<HTMLInputElement>
}

const inputSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
}

export default function UIInput({
  className = '',
  type = 'text',
  size = 'md',
  ref,
  ...props
}: UIInputProps) {
  return (
    <HeadlessInput
      ref={ref}
      type={type}
      className={`w-full rounded-control border border-border-default bg-canvas/80 ${inputSizes[size]} text-fg-primary placeholder:text-fg-muted shadow-xs transition-colors focus:outline-none data-hover:border-fg-muted/50 data-focus:border-brand data-focus:ring-2 data-focus:ring-brand/40 data-disabled:cursor-not-allowed data-disabled:opacity-50 ${className}`.trim()}
      {...props}
    />
  )
}

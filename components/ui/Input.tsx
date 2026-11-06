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
  ...props
}: UIInputProps) {
  return (
    <HeadlessInput
      type={type}
      className={`w-full rounded-lg border border-gray-700/80 bg-gray-900/60 ${inputSizes[size]} text-gray-200 placeholder:text-gray-500 shadow-xs transition-colors focus:outline-none data-hover:border-gray-600 data-focus:border-blue-500 data-focus:ring-2 data-focus:ring-blue-500/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 ${className}`.trim()}
      {...props}
    />
  )
}

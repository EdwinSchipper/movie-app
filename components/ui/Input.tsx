import { Input as HeadlessInput, type InputProps } from '@headlessui/react'

export interface UIInputProps extends InputProps {
  className?: string
}

export default function UIInput({
  className = '',
  type = 'text',
  ...props
}: UIInputProps) {
  return (
    <HeadlessInput
      type={type}
      className={`border rounded px-3 py-1.5 text-sm transition-all focus:outline-none ${className}`.trim()}
      {...props}
    />
  )
}
'use client'

import { Switch as HeadlessSwitch } from '@headlessui/react'

export interface UISwitchProps<T extends string = string> {
  value: T
  options?: [T, T]
  labels?: [string, string]
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

export default function UISwitch<T extends string = string>({
  value,
  options = ['day', 'week'] as [T, T],
  labels = ['Day', 'Week'],
  onChange,
  disabled = false,
  className = '',
}: UISwitchProps<T>) {
  const isSecond = value === options[1]

  const handleChange = (nextVal: T) => {
    if (!disabled && nextVal !== value) {
      onChange(nextVal)
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-2 text-sm font-medium select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`.trim()}
    >
      <span
        onClick={() => handleChange(options[0])}
        className={`transition-colors ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${!isSecond ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
      >
        {labels[0]}
      </span>
      <HeadlessSwitch
        checked={isSecond}
        disabled={disabled}
        onChange={(checked) => handleChange(checked ? options[1] : options[0])}
        className="group inline-flex h-6 w-11 items-center rounded-full border border-gray-700/80 bg-gray-800 transition-colors cursor-pointer focus:outline-none data-checked:border-blue-500 data-checked:bg-blue-600 data-focus:ring-2 data-focus:ring-blue-500/50 data-disabled:cursor-not-allowed"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition-transform group-data-checked:translate-x-5.5" />
      </HeadlessSwitch>
      <span
        onClick={() => handleChange(options[1])}
        className={`transition-colors ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${isSecond ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
      >
        {labels[1]}
      </span>
    </div>
  )
}

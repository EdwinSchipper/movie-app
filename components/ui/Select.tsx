'use client'

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import type { FilterOption } from '@/types'

export interface UISelectProps<T extends string = string> {
  value: T
  options: FilterOption<T>[]
  onChange: (value: T) => void
  label?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export default function UISelect<T extends string = string>({
  value,
  options,
  onChange,
  label,
  className = '',
  disabled = false,
  size = 'md',
}: UISelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : 'px-3.5 py-2 text-sm'

  return (
    <Field
      disabled={disabled}
      className={`inline-flex flex-col gap-1.5 ${className}`.trim()}
    >
      {label && (
        <Label className="text-xs font-semibold text-gray-400 tracking-wide">
          {label}
        </Label>
      )}
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          className={`relative w-full cursor-pointer rounded-lg border border-gray-700/60 bg-gray-900/60 ${sizeClasses} pr-8 text-left font-medium text-gray-200 shadow-xs transition-colors hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span className="block truncate">{selectedOption?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M6 8l4 4 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          modal={false}
          transition
          className="z-50 mt-1 max-h-60 w-(--button-width) overflow-auto rounded-lg border border-gray-700 bg-gray-900 py-1 text-sm shadow-xl focus:outline-none transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0 pointer-events-auto"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group relative cursor-pointer select-none py-2 px-3 text-gray-300 transition-colors data-focus:bg-blue-600 data-focus:text-white data-selected:font-semibold data-selected:text-blue-400 data-focus:data-selected:text-white"
            >
              <span className="block truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}

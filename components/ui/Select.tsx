'use client'

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export interface UISelectOption<T extends string = string> {
  value: T
  label: string
}

export interface UISelectProps<T extends string = string> {
  value: T
  options: UISelectOption<T>[]
  onChange: (value: T) => void
  label?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

const selectSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
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
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0]

  return (
    <Field
      disabled={disabled}
      className={`inline-flex flex-col gap-1.5 ${className}`.trim()}
    >
      {label ? (
        <Label className="label-form">
          {label}
        </Label>
      ) : null}
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          className={`relative w-full cursor-pointer rounded-control border border-border-default bg-canvas/80 ${selectSizes[size]} pr-8 text-left font-medium text-fg-primary shadow-xs transition-colors focus:outline-none data-hover:border-fg-muted/50 data-focus:border-brand data-focus:ring-2 data-focus:ring-brand/40 data-disabled:cursor-not-allowed data-disabled:opacity-50`}
        >
          <span className="block truncate">{selectedOption?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-fg-muted">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          modal={false}
          transition
          className="z-50 mt-1 max-h-60 w-(--button-width) overflow-auto rounded-control border border-border-default bg-surface py-1 text-sm shadow-xl focus:outline-none transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0 pointer-events-auto"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group relative cursor-pointer select-none py-2 px-3 text-fg-secondary transition-colors data-focus:bg-surface-hover data-focus:text-fg-primary data-selected:font-semibold data-selected:text-brand data-focus:data-selected:text-brand"
            >
              <span className="block truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}

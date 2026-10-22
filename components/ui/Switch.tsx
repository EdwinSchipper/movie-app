'use client'

import { Switch } from '@headlessui/react'

export default function UIswitch({
  checked = false,
  onChange,
  leftLabel = 'Day',
  rightLabel = 'Week',
}: {
  checked?: boolean
  onChange?: (checked: boolean) => void
  leftLabel?: string
  rightLabel?: string
}) {
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium select-none">
      <span
        onClick={() => onChange?.(false)}
        className={`cursor-pointer ${!checked ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
      >
        {leftLabel}
      </span>
      <Switch
        checked={checked}
        onChange={onChange}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 cursor-pointer"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
      <span
        onClick={() => onChange?.(true)}
        className={`cursor-pointer ${checked ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
      >
        {rightLabel}
      </span>
    </div>
  )
}
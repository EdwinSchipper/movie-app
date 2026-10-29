'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import type { TimeWindow } from '@/types'

export interface UISwitchProps<T extends string = TimeWindow> {
  value?: T
  options?: [T, T]
  labels?: [string, string]
  onChange?: (value: T) => void
}

export default function UISwitch<T extends string = TimeWindow>({
  value,
  options = ['day', 'week'] as unknown as [T, T],
  labels = ['Day', 'Week'],
  onChange,
}: UISwitchProps<T>) {
  const [internalValue, setInternalValue] = useState<T>(options[0])
  const currentValue = value !== undefined ? value : internalValue
  const isSecond = currentValue === options[1]

  const handleChange = (nextVal: T) => {
    if (value === undefined) {
      setInternalValue(nextVal)
    }
    onChange?.(nextVal)
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium select-none">
      <span
        onClick={() => handleChange(options[0])}
        className={`cursor-pointer ${!isSecond ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
      >
        {labels[0]}
      </span>
      <Switch
        checked={isSecond}
        onChange={(checked) => handleChange(checked ? options[1] : options[0])}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 cursor-pointer"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
      <span
        onClick={() => handleChange(options[1])}
        className={`cursor-pointer ${isSecond ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
      >
        {labels[1]}
      </span>
    </div>
  )
}

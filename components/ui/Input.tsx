import { Input } from '@headlessui/react'

export default function UIInput() {
  return (
    <Input
      type="text"
      name="full_name"
      className="border rounded px-3 py-1.5 text-sm data-focus:bg-blue-100 data-hover:shadow"
    />
  )
}
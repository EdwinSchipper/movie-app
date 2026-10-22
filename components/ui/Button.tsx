import { Button } from '@headlessui/react'

function UIButton() {
    return (
        <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-hover:bg-sky-500 data-hover:data-active:bg-sky-700">
            Save changes
        </Button>
    )
}

export default UIButton
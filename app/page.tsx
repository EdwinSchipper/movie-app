'use client'

import { UIButton, UIInput, UIswitch } from '@/components'

export default function Page() {
  return <div>




    <div className='container mx-auto p-10'>

      <div className="grid grid-cols-1 text-center md:grid-cols-3 space-x-14">

        <div className='col-span-3 pb-10'>
          <h1 className='text-left font-black'>Movie for Friends App</h1>
        </div>

        <div className=' bg-teal-200'>
          /Search
          <UIButton />
        </div>
        <div className=' bg-teal-200'>
          /Discover
          <UIButton />
        </div>
        <div className=' bg-teal-200'>
          /Find
          <UIButton />
        </div>
      </div>

    </div>







  </div>
}
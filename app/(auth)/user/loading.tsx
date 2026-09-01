import React from 'react'

export default function Loading() {
  return (
    <section className='w-full relative bg-white flex items-center justify-center h-[80vh]'>
      <div className='w-fit relative h-fit flex flex-col items-center justify-center gap-0 animate-pulse'>
        <h2 className='text-p40 text-primary font-semibold italic'>Markline</h2>
        <p className='text-bse font-medium text-primary self-end justify-self-end leading-[.1]'>Mark Your Way.</p>
      </div>
    </section>
  )
}

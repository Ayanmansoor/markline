import React from 'react'

function loading() {
    return (
        <section className='w-full relative bg-white flex items-center justify-center h-[80vh]'>
            <div className='w-fit relative h-fit flex flex-col items-center justify-center gap-0'>
                <h2 className='text-p40 text-primary font-semibold italic uppercase'>Markline</h2>
                <p className='text-bse font-medium text-primary self-end justify-self-end leading-[.1]'>Fashion</p>
            </div>
        </section>
    )
}

export default loading
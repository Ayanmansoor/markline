import React from 'react'

function ContactForm() {
  return (
    <form action="" className='w-full relative h-auto flex flex-col gap-1 '>
        <h2 className='text-2xl font-medium text-primary '>
            Contact Us
        </h2>
        <span className='w-full relative h-auto flex flex-col gap-1 '>
            <input type="text" className='w-full relative h-auto font-medium text-primary ' placeholder='Enter your Name' />
        </span>

    </form>
  )
}

export default ContactForm
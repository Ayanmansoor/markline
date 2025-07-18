'use client'
import React from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const subscribeSchema = z.object({
  email: z.string().email()
})

type subscribeSchemaInterface = z.infer<typeof subscribeSchema>;

function Subcribes () {

    
  const { executeRecaptcha } = useGoogleReCaptcha()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(subscribeSchema)
  })

  async function onSubmit({ email }: subscribeSchemaInterface) {
    if (!executeRecaptcha) {
      return null;
    }
    const token = await executeRecaptcha()
    const reponse = await axios.post("/api/subcribe", {
      email: email,
      token: token
    })
    reset()
    console.log(reponse,"this is response")

  }

  return (
    <section className='w-full  bg-black border-b border-white  flex items-center justify-center px-4 lg:px-10   '>

        <div className='relative h-auto  flex flex-col gap-4 w-full  lg:w-[50%] py-10 '>
                <h2 className='text-2xl font-semibold text-white uppercase text-center'>Stay in Style with Markline</h2>
                <form action=""   onSubmit={handleSubmit(onSubmit)} className='w-full relative h-auto flex items-center  justify-between gap-2'>
                    <span className='flex  gap-1 w-full flex-col items-center '>
                        <input type="text" className='text-base text-text px-5 py-2 border border-gray-200 w-full' placeholder='Enter Your Email' {...register('email')} />
                        {
                            errors.email &&
                                <p className='text-sm text-red-400'>{errors.email.message}</p>

                        }
                    </span>
                    <button className='text-base text-white bg-black border border-white  px-10 py-2 hover:bg-white hover:text-primary '>Submit</button>

                </form>
                <p className=' text-center font-medium text-white uppercase text-xs  '>
                  Be the first to know about exclusive launches, limited collections, and premium offers—delivered straight to your inbox.
                </p>
        </div>

    </section>
  )
}

export default Subcribes 
'use client'
import React, { useEffect, useRef } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { toast } from 'sonner'


const updateProfileSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().min(10, 'number should be minimum 10 digits')
})

type updateschema = z.infer<typeof updateProfileSchema>

interface userinterfce {
    email: string,
    phone: string,
    user_metadata: {
        email: string,
        email_verified: boolean,
        phone_verified: boolean
    }


}


function UserSheet() {
    const [currentuser, setUser] = useState<userinterfce>()
    const [isUpdating,setUpdating]=useState(false)
    const [open,setOpen]=useState(false)
    
    const message = useRef<HTMLParagraphElement>(null)

    const { register, reset,setValue, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(updateProfileSchema)
    })

async function onSubmit({ email, phone, name }: updateschema) {
  try {
    setUpdating(true);

        if (!phone.startsWith("+")) {
            phone = `+91${phone}`; 
        }

        const { data, error } = await mysupabase.auth.updateUser({
            data: {
                    phone,
                    name
                },
            email
        });

    if (error) {
      if (message.current) {
        message.current.innerText = "Profile is not updated. Try again later!";
      }
      console.log(error);
    } else {
      if (message.current) {
        message.current.innerText = "Profile is updated";
      }
      toast("Profile is updated.");
      setOpen(false);
    }
  } catch (error) {
    console.error(error);
    toast("Something went wrong. Try again later.");
  } finally {
    setUpdating(false);
  }
}

    useEffect(() => {
        async function getSupabaseUser() {
            const {
                data: { user },
                error,
            } = await mysupabase.auth.getUser();

            setValue("email",`${user?.email}`)
            setValue('phone',`${user?.user_metadata?.phone}`)
        }
        getSupabaseUser()
    }, [isUpdating])



    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className='w-fit h-fit relative justify-self-end '>
                <BsThreeDotsVertical className='text-primary bg-gray-200  rounded-md cursor-pointer w-fit text-[45px] py-3' />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='text-lg font-semibold text-primary'>
                        Edit Profile
                    </SheetTitle>

                    <form action="" onSubmit={handleSubmit(onSubmit)} className='w-full relative h-auto flex flex-col gap-3 py-10'>
                        <span className='w-full relative h-auto flex flex-col gap-1'>
                            <label htmlFor="" className='text-base font-medium text-primary'>
                                name
                            </label>
                            <input type="text" className='text-base border px-5 py-2 rounded-md  font-medium text-primary' placeholder='Enter Name' {...register('name')} />
                        </span>
                        <span className='w-full relative h-auto flex flex-col gap-1'>
                            <label htmlFor="" className='text-base font-medium text-primary'>
                                Email
                            </label>
                            <input type="text" className='text-base border px-5 py-2 rounded-md  font-medium text-primary' placeholder='Enter Email' {...register('email')} />
                        </span>
                        <span className='w-full relative h-auto flex flex-col gap-1'>
                            <label htmlFor="" className='text-base font-medium text-primary'>
                                Phone
                            </label>
                            <input type="text" className='text-base border px-5 py-2 rounded-md  font-medium text-primary' placeholder='Enter Phone'  {...register('phone')}  />
                        </span>



                        <SheetFooter className='w-full relative h-auto flex items-start '>
                            <button disabled={isUpdating} className='text-base px-5  md:px-7 py-2 md:py-3 font-medium text-white  bg-primary transition-all duration-75 hover:text-primary hover:bg-white  cursor-pointer hover:border-primary border'>{isUpdating ? "Updating..." : "Update"}</button>
                        </SheetFooter>

                    </form>


                    <p className='text-base font-medium text-primary' ref={message}>

                    </p>
                </SheetHeader>

            </SheetContent>
        </Sheet>
    )
}

export default UserSheet


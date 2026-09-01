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


function UserSheet({ user }: { user?: any }) {
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
        if (open && user) {
            reset({
                email: user.email || '',
                phone: user.user_metadata?.phone || user.phone || '',
                name: user.user_metadata?.name || ''
            });
        }
    }, [open, user, reset])



    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className='w-fit h-fit relative'>
                <div className='p-3 bg-gray-50 text-black hover:bg-black hover:text-white rounded-xl transition-all duration-300 shadow-sm'>
                    <BsThreeDotsVertical />
                </div>
            </SheetTrigger>
            <SheetContent className="border-l border-gray-100 sm:max-w-md">
                <SheetHeader className="space-y-6">
               

                    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-8 pt-10'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-bold text-gray-500'>Authorized Name</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-medium text-black focus:outline-none focus:ring-1 focus:ring-primary transition-all' 
                                    placeholder='Enter Authorized Name' 
                                    {...register('name')} 
                                />
                                {errors.name && <span className="text-xs font-medium text-red-500">{errors.name.message as string}</span>}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-bold text-gray-500'>Official Email</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-medium text-black focus:outline-none focus:ring-1 focus:ring-primary transition-all' 
                                    placeholder='Enter Official Email' 
                                    {...register('email')} 
                                />
                                {errors.email && <span className="text-xs font-medium text-red-500">{errors.email.message as string}</span>}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-bold text-gray-500'>Contact Line</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-medium text-black focus:outline-none focus:ring-1 focus:ring-primary transition-all' 
                                    placeholder='Enter Contact Line'  
                                    {...register('phone')}  
                                />
                                {errors.phone && <span className="text-xs font-medium text-red-500">{errors.phone.message as string}</span>}
                            </div>
                        </div>

                        <button 
                            disabled={isUpdating} 
                            className='w-full px-8 py-4 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-50'
                        >
                            {isUpdating ? "Processing Update..." : "Update Markline Identity"}
                        </button>
                    </form>

                    <p className='text-sm font-medium text-center' ref={message}></p>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default UserSheet


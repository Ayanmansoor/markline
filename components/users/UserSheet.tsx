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
                                <label className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Authorized Name</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-bold text-black focus:outline-none focus:ring-1 focus:ring-black transition-all' 
                                    placeholder='Enter Authorized Name' 
                                    {...register('name')} 
                                />
                                {errors.name && <span className="text-[10px] font-black text-red-500 uppercase">{errors.name.message as string}</span>}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Official Email</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-bold text-black focus:outline-none focus:ring-1 focus:ring-black transition-all' 
                                    placeholder='Enter Official Email' 
                                    {...register('email')} 
                                />
                                {errors.email && <span className="text-[10px] font-black text-red-500 uppercase">{errors.email.message as string}</span>}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>Contact Line</label>
                                <input 
                                    type="text" 
                                    className='text-sm bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl font-bold text-black focus:outline-none focus:ring-1 focus:ring-black transition-all' 
                                    placeholder='Enter Contact Line'  
                                    {...register('phone')}  
                                />
                                {errors.phone && <span className="text-[10px] font-black text-red-500 uppercase">{errors.phone.message as string}</span>}
                            </div>
                        </div>

                        <button 
                            disabled={isUpdating} 
                            className='w-full px-8 py-5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50'
                        >
                            {isUpdating ? "Processing Update..." : "Update Markline Identity"}
                        </button>
                    </form>

                    <p className='text-xs font-black uppercase tracking-widest text-center' ref={message}></p>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default UserSheet


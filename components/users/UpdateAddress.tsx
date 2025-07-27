'use client'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDailogprops } from '@/types/interfaces'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import {  updateCurrentUserAddress } from '@/Supabase/SupabaseApi'
import { Fullscreen } from 'lucide-react'
import { toast } from 'sonner'


const addressFromSchema = z.object({
    name: z.string().min(2, "Name is not valid "),
    state_name: z.string(),
    city: z.string(),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be valid"),
    is_selected: z.boolean().default(false).nullable(),
    full_address: z.string().min(8, "Address must be at required"),
    user_id:z.string(),
    id:z.number()   
})
type FormInputs = z.infer<typeof addressFromSchema>;

interface userprops{
    id:string,
    email:string,
    phone:string,

}


function UpdateAddress({children,currentaddress}:addressDailogprops) {
    const [isSubmitting,setSubmitting]=useState(false)
    const [open, setOpen] = useState(false)
    
const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, },
    setValue,
    setFocus,
    getValues,
    getFieldState
} = useForm({
    resolver: zodResolver(addressFromSchema),
    defaultValues: {
        name:currentaddress?.name,
        state_name:currentaddress?.state_name,
        city:currentaddress?.city,
        id:currentaddress?.id,
        user_id:currentaddress?.user_id,
        pin_code:currentaddress?.pin_code,
        is_selected:currentaddress?.is_selected,
        full_address:currentaddress?.full_address

    }
});

    const {executeRecaptcha}=useGoogleReCaptcha()
          

      
        async function onSubmit(data:FormInputs){

                try{
                    setSubmitting(true)
                    if(!executeRecaptcha){
                        console.log("error")
                        setSubmitting(false)
                        return; 
                    }
                    console.log(data,"this data i got")
                    const  recaptchaToken=await executeRecaptcha()
                    const response=await axios.post(`/api/update-address`,{
                        ...data,
                        recaptchaToken
                    })
                    // console.log(response,"tjusos [djfs;dfj")
                    toast("Address Update Successfully.")
                    setSubmitting(false)
                    setOpen(false)
                    reset()

                }
                catch(error){
                    toast("Something Strength Happend . Try Again Latter")
                    console.log(error,'this is repons value from api')
                    setSubmitting(false)
                }
        }       

  return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className='w-fit justify-self-end'>{children}</DialogTrigger>
                <DialogContent className='w-full max-w-[500px] bg-white '>
                        <h2 className='text-lg font-semibold text-primary border-b border-gray-200 pb-3'> Update Address</h2>
                        <form action="" onSubmit={handleSubmit(onSubmit)} className=' grid grid-cols-2 gap-2'>

                                <span className='flex flex-col gap-1 w-full  col-span-2'>
                                    <label htmlFor="" className='text-sm   font-medium text-gray-500'>Name</label>
                                    <input type="text" className='w-full relative h-auto px-3 py-1 rounded-md border border-gray-100 placeholder:text-xs placeholder:text-primary ' {...register('name')} placeholder={` ${currentaddress?.name ? currentaddress.name :"Enter  Name"} `} />
                                    {
                                        errors.name &&
                                        <p className='text-sm text-red-200 font-medium'> {errors.name.message} </p>
                                    }

                                </span>
                                <span className='flex flex-col gap-1 w-full '>
                                    <label htmlFor="" className='text-sm   font-medium text-gray-500'>State Name</label> 
                                    <input type="text" className='w-full relative h-auto px-3 py-1 rounded-md border border-gray-100 placeholder:text-xs placeholder:text-primary '  {...register('state_name')}  placeholder={` ${currentaddress?.name ? currentaddress.state_name :"Enter Site  Name"} `} />
                                    {
                                        errors.state_name &&
                                        <p className='text-sm text-red-200 font-medium'> {errors.state_name.message} </p>
                                    }
                                </span>
                                <span className='flex flex-col gap-1 w-full '>
                                    <label htmlFor="" className='text-sm   font-medium text-gray-500'>City Name</label>
                                    <input type="text" className='w-full relative h-auto px-3 py-1 rounded-md border border-gray-100 placeholder:text-xs  placeholder:text-primary '  {...register('city')}  placeholder={` ${currentaddress?.name ? currentaddress.city :"Enter  City Name"} `} />
                                    {
                                        errors.city &&
                                        <p className='text-sm text-red-200 font-medium'> {errors.city.message} </p>
                                    }
                                </span>
                                <span className='flex flex-col gap-1 w-full col-span-2'>
                                    <label htmlFor="" className='text-sm   font-medium text-gray-500'>Pincode</label>
                                    <input type="text" className='w-full relative h-auto px-3 py-1 rounded-md border border-gray-100 placeholder:text-xs  placeholder:text-primary'   {...register('pin_code')} placeholder={` ${currentaddress?.name ? currentaddress.pin_code :"Enter Pincode"} `} />
                                    {
                                        errors.pin_code &&
                                        <p className='text-sm text-red-200 font-medium'> {errors.pin_code.message} </p>
                                    }
                                </span>
                                <span className='flex flex-col gap-1 w-full col-span-2 '>
                                    <label htmlFor="" className='text-sm   font-medium text-gray-500'>
                                        Full Address
                                    </label>
                                    <textarea  id="" className='w-full  h-auto border border-gray-200 rounded-md bg-white p-3 placeholder:text-xs placeholder:text-primary'  {...register('full_address')} placeholder={` ${currentaddress?.name ? currentaddress.full_address :"Enter  Full Address"} `} ></textarea>
                                    {
                                        errors.full_address &&
                                        <p className='text-sm text-red-200 font-medium'> {errors.full_address.message} </p>
                                    }
                                </span>
                                <span className='flex items-center  gap-2 w-full col-span-2 '>
                                        <input type="checkbox"  id='checkbox' className='cursor-pointer' {...register("is_selected")}/>
                                        <label htmlFor='checkbox' className='text-base cursor-pointer font-meidum text-primary'>
                                            Use this address as default 
                                        </label>
                                </span>

                                <button disabled={isSubmitting} className='text-sm font-medium col-start-2 rounded-sm text-white bg-primary px-5 py-2 w-fit justify-self-end cursor-pointer'>{isSubmitting ? "Updating..." :  "Update Address"}</button>
                        </form>
                </DialogContent>
        </Dialog>
  )
}

export default UpdateAddress
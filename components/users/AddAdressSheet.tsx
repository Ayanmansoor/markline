'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressDailogprops, UserInterface } from '@/types/interfaces'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { mysupabase } from '@/Supabase/SupabaseConfig'
import { StateCombobox } from '../FormComponents/StateCombobox'
import { CityNameCombobox } from '../FormComponents/CityNameCombobox'
import { toast } from 'sonner'


const addressFromSchema = z.object({
    name: z.string().min(2, "Name is not valid "),
    state_name: z.string(),
    city: z.string(),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be valid"),
    isdefault: z.boolean().default(false),
    full_address: z.string().min(8, "Address must be at required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
})
type FormInputs = z.infer<typeof addressFromSchema>;




function AddAdressSheet({ children, handleperform }: addressDailogprops) {

    const [User, setUser] = useState<UserInterface>()
    const [open, setOpen] = useState(false)
    const [loadingPincode, setLoadingPincode] = useState(false)

    const { register, watch, handleSubmit, reset, formState: {
        errors
    }, setValue, setFocus, getValues, getFieldState } = useForm(
        {
            resolver: zodResolver(addressFromSchema)
        }
    )
    useEffect(() => {
        async function one() {
            const { data: { user } } = await mysupabase.auth.getUser()
            if (user) {
                setUser(user)
            }
        }
        one()
    }, [])

    function setStateValue(stateName) {
        setValue("state_name", stateName)
    }

    function setCityValue(cityname) {
        setValue("city", cityname)
    }
    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setValue("latitude", latitude);
                setValue("longitude", longitude);
                console.log("Captured Location:", latitude, longitude);
            },
            (error) => {
                console.warn("User denied location or error fetching location:", error);
            }
        );
    }, [setValue]);


    useEffect(() => {
        const fetchCityAndState = async () => {
            if (watch().pin_code && watch().pin_code.length === 6) {
                try {
                    setLoadingPincode(true);
                    const res = await axios.get(`https://api.postalpincode.in/pincode/${watch().pin_code}`);
                    const data = res.data[0];

                    if (data.Status === 'Success' && data.PostOffice && data.PostOffice.length > 0) {
                        const { District, State } = data.PostOffice[0];
                        setValue('city', District);
                        setValue('state_name', State);
                        toast.success(`Auto-filled city: ${District}, state: ${State}`);
                    } else {
                        toast.error('Invalid Pincode or no data found');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Failed to fetch location from pincode');
                } finally {
                    setLoadingPincode(false);
                }
            }
        };

        fetchCityAndState();
    }, [watch().pin_code, setValue]);

    async function onSubmit(data: FormInputs) {
        try {
            const response = await axios.post('/api/create-address',
                {
                    ...data,
                    user_id: User?.id
                }
            )
            setOpen(false)
            reset()
            handleperform && handleperform()
        }
        catch (error) {
            console.log(error, 'this is repons value from api')

        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger className='w-fit justify-self-end'>{children}</DialogTrigger>
            <DialogContent className='w-full max-w-[500px] bg-white '>
                <h2 className='text-lg font-semibold text-primary border-b border-gray-200 pb-3'>Add New Address</h2>
                <form action="" onSubmit={handleSubmit(onSubmit)} className=' grid grid-cols-2 gap-2'>

                    <span className='flex flex-col gap-1 w-full  col-span-2'>
                        <label htmlFor="" className='text-sm   font-medium text-gray-600 '>Name</label>
                        <input type="text" className='w-full relative h-auto px-3 py-1 rounded-md border border-gray-300 placeholder:text-xs ' placeholder='enter  name' {...register('name')} />
                        {
                            errors.name &&
                            <p className='text-sm text-red-600 font-medium'> {errors.name.message} </p>
                        }

                    </span>
                    <div className="w-full flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Pin code *</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            placeholder="Enter Your Pin Code"
                            {...register('pin_code')}
                        />
                        {loadingPincode && <p className="text-xs text-blue-400">Fetching location...</p>}
                        {errors?.pin_code && <p className="text-xs text-red-400">{errors.pin_code?.message}</p>}
                    </div>
                    <StateCombobox setStateValue={setStateValue} errormessage={errors.state_name && errors?.state_name.message || ""} selectedState={''} />
                    <CityNameCombobox setCityName={setCityValue} errormessage={errors.city && errors.city.message || ""} statename={watch().state_name} selectcity={''} />


                    <span className='flex flex-col gap-1 w-full col-span-2 '>
                        <label htmlFor="" className='text-sm   font-medium text-gray-600 '>
                            Full Address
                        </label>
                        <textarea id="" className='w-full  h-auto border border-gray-200 rounded-md bg-white p-3 placeholder:text-xs' placeholder='enter full address' {...register('full_address')} ></textarea>
                        {
                            errors.full_address &&
                            <p className='text-sm text-red-600 font-medium'> {errors.full_address.message} </p>
                        }
                    </span>
                    <span className='flex items-center  gap-2 w-full col-span-2 '>
                        <input type="checkbox" id='checkbox' className='cursor-pointer' {...register("isdefault")} />
                        <label htmlFor='checkbox' className='text-base cursor-pointer font-meidum text-primary'>
                            Use this address as default
                        </label>
                    </span>

                    <button className='text-sm font-medium col-start-2 rounded-sm text-white bg-primary px-5 py-2 w-fit justify-self-end cursor-pointer'>Add Address</button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddAdressSheet
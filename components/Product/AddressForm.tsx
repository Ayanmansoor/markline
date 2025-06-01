import React, { useState, useRef, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { submitOrders } from '@/Supabase/acceptOrderForm'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import LoadRazorpay from '@/utils/loadrazorpay'

// import emailjs from "emailjs-com"
// const envrecaptchaKey = import.meta.env.VITE_GOOGLE_SITE_KEY

// const serviceid = import.meta.env.VITE_SERVICE_ID
// const templateid = import.meta.env.VITE_TEMPLATE_ID
// const publicId = import.meta.env.VITE_PUBLIC_KEY



interface response {
    message: any;
    code: number;
    isOrder: boolean;
    data: any;
}

const addressFromSchema = z.object({
    name: z.string().min(2, "Name is not valid "),
    email: z.string().email('email must valid '),
    phone: z.string().regex(/^\d{10}$/, "Phone must be valid"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be valid"),
    state_name: z.string().min(2, "State name is required"),
    city: z.string().min(2, "City name is required"),
    full_address: z.string().min(5, "Address must be at required"),
})
import { AddressFromProps } from '@/types/interfaces'

type FormInputs = z.infer<typeof addressFromSchema>;


// import Razorpay from 'razorpay'

function AddressForm({ product, setConfirm, setOrderID }: AddressFromProps) {
    const { executeRecaptcha } = useGoogleReCaptcha()

    const { register, watch, handleSubmit, reset, formState: {
        errors
    }, setValue, setFocus, getValues, getFieldState } = useForm(
        {
            resolver: zodResolver(addressFromSchema)
        }
    )
      const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     console.log("trigger")
    // }, [])


    async function onSubmit(data: FormInputs) {

        


        try {

    
            if (!executeRecaptcha) {
                console.log("reCAPTCHA not yet available");
                return;
            }

            const recaptchaToken = await executeRecaptcha("submit_form");

            const final_price = Math.floor(
                product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
            );
            const discountPrice = product.price * ((product?.discounts?.discount_persent || 0) / 100);

            const orders = [
                {
                    ...data,
                    final_price,
                    quantity: product.quantity,
                    discount_amount: discountPrice,
                    product_key: product.id,
                    recaptchaToken
                }
            ];
            const responses = await submitOrders(orders);
            const orderIDs: string[] = [];
            responses.data?.forEach((ordersaved: any) => {
                if (ordersaved) {
                    // console.log("reponse product",ordersaved)
                    const id = ordersaved?.id
                    if (id) {
                        orderIDs.push(id);
                    }
                } else {
                    console.error("Order failed:", responses?.message);
                }
            });

            if (orderIDs.length > 0) {
                setOrderID({
                    orderID: orderIDs,
                    email: data.email,
                    username: data.name
                });
                setConfirm("password");

                const emailResponse = await fetch("/api/sendmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: data.email,
                        name: data.name,
                        phone:data.phone,
                        orderId: orderIDs[0],
                        productNames:""
                    })
                }); 

                console.log("email end")

                if (!emailResponse.ok) {
                    console.error("Failed to send confirmation emails");
                }

                reset();
                // clearCart(); 
            } else {
                console.error("No valid order ID returned.");
            }
        } catch (error: any) {
            console.error("Unexpected error:", error.message);
        }
    }


    return (
        <>
            <form action='' onSubmit={handleSubmit(onSubmit)} className='w-full relative h-auto grid grid-cols-2 items-start justify-start gap-y-2 gap-x-3 md:gap-x-5 '>
                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Name *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Name ' {...register("name")} />
                    {errors?.name &&
                        <p className='text-xs font-medium text-red-400'>{errors.name?.message}</p>}
                </div>
                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Email *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Email ' {...register("email")} />
                    {errors?.email &&
                        <p className='text-xs font-medium text-red-400'>{errors.email?.message}</p>}
                </div>
                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Phone *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Phone ' {...register("phone")} />
                    {errors?.phone &&
                        <p className='text-xs font-medium text-red-400'>{errors.phone?.message}</p>}
                </div>
                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Pin code *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Pin Code ' {...register("pin_code")} />
                    {errors?.pin_code &&
                        <p className='text-xs font-medium text-red-400'>{errors?.pin_code?.message}</p>}
                </div>

                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>State Name *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your State Name ' {...register("state_name")} />
                    {errors?.state_name &&
                        <p className='text-xs font-medium text-red-400'>{errors.state_name?.message}</p>}
                </div>

                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>City Name *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' {...register("city")} />
                    {errors?.city &&
                        <p className='text-xs font-medium text-red-400'>{errors.city?.message}</p>}
                </div>
                <div className='w-full relative h-auto flex flex-col gap-1 col-span-2'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Full Address *</label>
                    {/* <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' /> */}
                    <textarea rows={3} id="" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800 ' placeholder=' Enter Your City Name ' {...register("full_address")}></textarea>
                    {errors?.full_address &&
                        <p className='text-xs font-medium text-red-400'>{errors.full_address?.message}</p>}
                </div>
                <button className='w-full relative h-auto rounded-lg px-5 py-4 hover:bg-white hover:text-primary border  border-transparent hover:border-primary col-start-2  text-white  bg-primary '>Submit</button>

            </form>
        </>
    )
}

export default AddressForm
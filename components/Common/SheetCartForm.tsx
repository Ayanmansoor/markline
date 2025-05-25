import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import {  submitOrders } from '@/Supabase/acceptOrderForm'



import { useCart } from '@/Contexts/Cart.context'

// const serviceid = import.meta.env.VITE_SERVICE_ID
// const templateid = import.meta.env.VITE_TEMPLATE_ID
// const publicId = import.meta.env.VITE_PUBLIC_KEY

const addressFromSchema = z.object({
    name: z.string().min(2, "name must be greater then 2 Characters"),
    email: z.string().email('email must valid '),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
    state_name: z.string().min(2, "State name is required"),
    city: z.string().min(2, "City name is required"),
    full_address: z.string().min(5, "Address must be at least 5 characters"),
})


type orderForm = z.infer<typeof addressFromSchema>;

import { acceptorderProps, CartItem, SheetCartFormProps } from '@/types/interfaces'

function SheetCartForm({ setConfirm, setOrderID }: SheetCartFormProps) {
    const { cart, clearCart } = useCart()
    const [recaptchaKey, setRecaptchaKey] = useState()
    const { executeRecaptcha } = useGoogleReCaptcha()

    const { register, watch, handleSubmit, reset, formState: {
        errors
    }, setValue, setFocus, getValues, getFieldState } = useForm<orderForm>(
        {
            resolver: zodResolver(addressFromSchema)
        }
    )
    async function onSubmit(data: orderForm) {
        try {
            if (!executeRecaptcha) return;
    
            const recaptchaToken = await executeRecaptcha();
    
            const orders = cart?.map((product: CartItem) => {
                const final_price = Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)));
                const discountPrice = product?.price * (product?.discounts?.discount_persent / 100);
    
                return {
                    ...data,
                    final_price: final_price || product.price,
                    quantity: product?.quantity,
                    discount_amount: discountPrice || 0,
                    product_key: product?.productId,
                    recaptchaToken
                };
            });
    
            const response = await submitOrders(orders); 
    
            if (response?.isOrder && response?.data?.length === orders.length) {
                const orderids = response.data.map((item: any) => item.id);
    
                // console.log("All products saved:", orderids,"product response",response.data);
    
                setOrderID({
                    orderID: orderids,
                    email: data.email,
                    username: data.name
                });
    
                setConfirm("success");
                
                 const emailResponse = await fetch("/api/sendmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: data.email,
                        name: data.name,
                        phone:data.phone,
                        orderId: orderids,
                        productNames:""
                    })
                }); 

                console.log("email end")

                if (!emailResponse.ok) {
                    console.error("Failed to send confirmation emails");
                }

                reset();
                clearCart()

            } else {
                console.error("Some or all products were not saved.");
            }
    
        } catch (error: any) {
            console.error("Unexpected error:", error.message);
        }
    }
    return (
        <form action='' onSubmit={handleSubmit(onSubmit)} className='w-full relative h-auto grid grid-cols-2 items-start justify-start gap-y-2 gap-x-5 '>
            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>Name *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Name ' {...register("name")} />
                {
                    errors?.name &&
                    <p className='text-xs font-medium text-red-400'>{errors.name?.message}</p>
                }
            </div>
            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>Email *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Email ' {...register("email")} />
                {
                    errors?.email &&
                    <p className='text-xs font-medium text-red-400'>{errors.email?.message}</p>
                }
            </div>
            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>Phone *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Phone ' {...register("phone")} />
                {
                    errors?.phone &&
                    <p className='text-xs font-medium text-red-400'>{errors.phone?.message}</p>
                }
            </div>
            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>Pin code *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Pin Code ' {...register("pin_code")} />
                {
                    errors?.pin_code &&
                    <p className='text-xs font-medium text-red-400'>{errors?.pin_code?.message}</p>
                }
            </div>

            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>State Name *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your State Name ' {...register("state_name")} />
                {
                    errors?.state_name &&
                    <p className='text-xs font-medium text-red-400'>{errors.state_name?.message}</p>
                }
            </div>

            <div className='w-full relative h-auto flex flex-col gap-1'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>City Name *</label>
                <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' {...register("city")} />
                {
                    errors?.city &&
                    <p className='text-xs font-medium text-red-400'>{errors.city?.message}</p>
                }
            </div>
            <div className='w-full relative h-auto flex flex-col gap-1 col-span-2'>
                <label htmlFor="" className='text-sm font-medium text-gray-600'>Full Address *</label>
                {/* <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' /> */}
                <textarea rows={3} className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800 ' placeholder=' Enter Your City Name ' {...register("full_address")} ></textarea>
                {
                    errors?.full_address &&
                    <p className='text-xs font-medium text-red-400'>{errors.full_address?.message}</p>
                }
            </div>
            <button className='w-full relative h-auto rounded-lg px-4 py-2 col-start-2  text-white  bg-primary '>Submit</button>

        </form>
    )
}

export default SheetCartForm
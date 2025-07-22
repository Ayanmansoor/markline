'use client'
import React, { useState, useRef, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { submitOrders } from '@/Supabase/acceptOrderForm'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import LoadRazorpay from '@/utils/loadrazorpay'
import { mysupabase } from '@/Supabase/SupabaseConfig'

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
import { AddressFromProps, userinterfce } from '@/types/interfaces'
import { StateCombobox } from '../FormComponents/StateCombobox'
import { CityNameCombobox } from '../FormComponents/CityNameCombobox'

type FormInputs = z.infer<typeof addressFromSchema>;


// import Razorpay from 'razorpay'

function AddressForm({ product, setConfirm, setOrderID }: AddressFromProps) {
    const { executeRecaptcha } = useGoogleReCaptcha()

    const [currentuser, setUser] = useState<userinterfce >();
    
    
  useEffect(() => {
    async function getSupabaseUser() {
      const {
          data: { user },
          error,
      } = await mysupabase.auth.getUser();

      if (user) {
        setUser(user);
      }
    }
    getSupabaseUser()
  }, [])

    

    const { register, watch, handleSubmit, reset, formState: {
        errors
    }, setValue, setFocus, getValues, getFieldState } = useForm(
        {
            resolver: zodResolver(addressFromSchema)
        }
    )
    const [isLoading, setIsLoading] = useState(false);


    function setStateValue(stateName){
        setValue("state_name",stateName)
        console.log('this is state name' ,watch().state_name)
    }
    function setCityValue(cityname){
        setValue("city",cityname)
    }


    async function onSubmit(data: FormInputs) {
        const final_price = Math.floor(
            product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
        );

        const response = await axios.post('/api/create-order', {
            amount: final_price * 100,
        });

        const res = await LoadRazorpay();
        if (!res) {
            alert('Failed to load Razorpay SDK');
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            one_click_checkout: true,
            currency: response.data.currency,
            name: "Markline Fashion",
            description: "Order description",
            order_id: response.data.id,
            image: "https://res.cloudinary.com/demhgityh/image/upload/v1750353291/markline-checkout-logo_ukrvoi.png",
            handler: (response) => orderSubmition(response, data),
            prefill: {
                name: data.name,
                email: data.email,
                contact: data.phone,
            },
            theme: {
                color: "#084E10",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setConfirm("password");
        setIsLoading(false);
    }


    // save into my database along with payment data
    async function orderSubmition(response, fromdata: FormInputs) {
        try {
            if (!executeRecaptcha) {
                console.log("token is not generated");
                return;
            }

        
            const recaptchaToken = await executeRecaptcha()

            const final_price = Math.floor(
                product?.price - (product?.price * (product?.discounts?.discount_persent || 0) / 100)
            );
            const discountPrice = product.price * ((product?.discounts?.discount_persent || 0) / 100);
            const orders = [
                {
                    ...fromdata,
                    final_price,
                    quantity: product.quantity,
                    discount_amount: discountPrice,
                    product_key: product.id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    user_id:currentuser?.id,
                    recaptchaToken
                }
            ];


            const responses = await submitOrders(orders)

            // console.log(responses, 'response from from submition on supabase')


            const orderIDs: string[] = [];
            responses.data?.forEach((ordersaved: any) => {
                if (ordersaved) {

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
                    email: fromdata.email,
                    username: fromdata.name
                });



                const emailResponse: any = await axios.post('/api/sendmail',
                    {
                        email: fromdata.email,
                        name: fromdata.name,
                        phone: fromdata.phone,
                        orderId: orderIDs[0],
                        productNames: product.name,

                    }
                )

                if (!emailResponse.ok) {
                    console.error("Failed to send confirmation emails");
                }

                reset();
            } else {
                console.error("No valid order ID returned.");
            }

        }
        catch (error) {
            console.log(error)
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
                <StateCombobox setStateValue={setStateValue} errormessage={errors.state_name&&errors?.state_name.message||""}/>
                <CityNameCombobox setCityName={setCityValue} errormessage={errors.city&&errors.city.message||""} statename={watch().state_name}/> 
                <div className='w-full relative h-auto flex flex-col gap-1'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Pin code *</label>
                    <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your Pin Code ' {...register("pin_code")} />
                    {errors?.pin_code &&
                        <p className='text-xs font-medium text-red-400'>{errors?.pin_code?.message}</p>}
                </div>
                <div className='w-full relative h-auto flex flex-col gap-1 col-span-2'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Full Address *</label>
                    {/* <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' /> */}
                    <textarea rows={3} id="" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800 ' placeholder=' Enter Your City Name ' {...register("full_address")}></textarea>
                    {errors?.full_address &&
                        <p className='text-xs font-medium text-red-400'>{errors.full_address?.message}</p>}
                </div>
                <button className='w-full relative h-auto rounded-lg px-5 py-1.5 text-lg hover:bg-white hover:text-primary border  border-transparent hover:border-primary col-start-2  text-white  bg-primary '>Submit</button>

            </form>
        </>
    )
}

export default AddressForm
'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
// import { submitOrders } from '@/Supabase/acceptOrderForm'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import LoadRazorpay from '@/utils/loadrazorpay'
import SendMail from '@/lib/SendMailHelper'



interface response {
    message: any;
    code: number;
    isOrder: boolean;
    data: any;
}

const addressFromSchema = z.object({
    name: z.string().min(2, "Name is not valid"),
    email: z.string().email("Email must be valid"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be valid"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be valid"),
    state_name: z.string().min(2, "State name is required"),
    city: z.string().min(2, "City name is required"),
    full_address: z.string().min(5, "Address must be at least 5 characters"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

import { AddressFromProps, NewAddressFromProps, OrderProps, userinterfce } from '@/types/interfaces'
import { StateCombobox } from '../FormComponents/StateCombobox'
import { CityNameCombobox } from '../FormComponents/CityNameCombobox'
import { ordersprops } from '../users/OrderplacedSection'
import UpdateLocalstorageForOrder from '@/lib/UpdateLocalStorageForOrder'
import { toast } from 'sonner'

type FormInputs = z.infer<typeof addressFromSchema>;


// import Razorpay from 'razorpay'

function AddressForm({ product, setConfirm, setOrderID, variant, }: NewAddressFromProps) {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [isOrderSub, setOrderSub] = useState<boolean>(false)
    const [loadingPincode, setLoadingPincode] = useState(false)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormInputs>({
        resolver: zodResolver(addressFromSchema),
    })





    function setStateValue(stateName) {
        setValue("state_name", stateName)
        console.log('this is state name', watch().state_name)
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

    const { final_price, discountPrice } = useMemo(() => {
        const discountPercent = variant?.discounts?.discount_persent || 0;
        const discountPrice = variant?.price * (discountPercent / 100);
        const final_price = Math.floor(variant?.price - discountPrice);

        return { final_price, discountPrice };
    }, [product]);

    async function saveBeforePayment(data: FormInputs) {
        try {
            setOrderSub(true)

            if (!executeRecaptcha) {
                console.log("token is not generated");
                setOrderSub(false)

                return;
            }

            const recaptchaToken = await executeRecaptcha()


            const orders = {
                ...data,
                final_price,
                quantity: product.quantity,
                discount_amount: discountPrice,
                variant_id: variant.id,
                color: product.selectedColor,
                size: product.selectedSize,
                product_key: product.id,

            }


            console.log(orders, 'this is data  igoinh to save befor the payment')

            const response = await axios.post('/api/place-my-order', {
                orderdata: orders,
                recaptchaToken
            })

            await onSubmit(response.data.data)
        }
        catch (error) {
            toast("Something strength happend . try again later.")
            console.log(error, "this errror")
            setOrderSub(false)

        }
    }


    async function onSubmit(data: OrderProps) {


        const response = await axios.post('/api/create-order', {
            amount: final_price * 100,
        });

        const res = await LoadRazorpay();
        if (!res) {
            alert('Failed to load Razorpay SDK');
            setOrderSub(false)
            return;

        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            one_click_checkout: true,
            currency: response.data.currency,
            name: "Markline",
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
    }


    // save into my database along with payment data
    async function orderSubmition(razorpayresponse, SavedOrders: OrderProps) {


        try {
            const { data } = await axios.post(`/api/update-order`, {
                SavedOrders,
                user_id: "",
                razorpay_payment_id: razorpayresponse.razorpay_payment_id,
                razorpay_order_id: razorpayresponse.razorpay_order_id,
                razorpay_signature: razorpayresponse.razorpay_signature,
            });
            setOrderSub(false)
            await UpdateLocalstorageForOrder()
            // await SendMail({ data: [data.updated] });



        }
        catch (error) {
            toast(" Your Payment we received . We Cantact you Shortly .")
            setOrderSub(false)


        }
    }




    return (
        <>
            <form action='' className='w-full relative h-auto grid grid-cols-2 items-start justify-start gap-y-2 gap-x-3 md:gap-x-5 '>
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

                <StateCombobox setStateValue={setStateValue} errormessage={errors.state_name && errors?.state_name.message || ""} selectedState={watch().state_name} />
                <CityNameCombobox setCityName={setCityValue} errormessage={errors.city && errors.city.message || ""} statename={watch().state_name} selectcity={watch().city} />

                <div className='w-full relative h-auto flex flex-col gap-1 col-span-2'>
                    <label htmlFor="" className='text-sm font-medium text-gray-600'>Full Address *</label>
                    {/* <input type="text" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800  ' placeholder=' Enter Your City Name ' /> */}
                    <textarea rows={3} id="" className='w-full relative h-auto px-3 py-2 rounded-lg border text-sm font-normal text-gray-800 ' placeholder=' Enter Your City Name ' {...register("full_address")}></textarea>
                    {errors?.full_address &&
                        <p className='text-xs font-medium text-red-400'>{errors.full_address?.message}</p>}
                </div>
                <button className='w-full relative h-auto rounded-lg px-5 py-1.5 text-lg hover:bg-white hover:text-primary border  border-transparent hover:border-primary col-start-2  text-white  bg-primary ' disabled={isOrderSub} onClick={handleSubmit(saveBeforePayment)}>{isOrderSub ? "Submitting...." : "Submit"}</button>

            </form>
        </>
    )
}

export default AddressForm
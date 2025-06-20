'use client'

// import {useForm} from "react-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import React, { useState } from "react";

const feedbackSchema=z.object({
    message:z.string(),
    point:z.array(z.string())
})

type FormInputs = z.infer<typeof feedbackSchema>;

function FeedbackForm() {

    const [submitting,setSubmitting]=useState(false)

    const {executeRecaptcha}=useGoogleReCaptcha()

    const {register,handleSubmit ,setValue,getValues,formState:{errors}}=useForm(
            {
                resolver: zodResolver(feedbackSchema)
            }
        )

        async function onSubmit(data:FormInputs) {
            if(!executeRecaptcha){
                return ;
            }
            const token = await executeRecaptcha()
            setSubmitting(true)
            try{
                const reponse= await axios.post(`/api/feedbackform`,{
                    token:token,
                    message:data.message,
                    point:data.point
                })
                setSubmitting(false)
                
            }
            catch(error){
                console.log(error)
            }
        }

        

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full relative h-auto  flex gap-2 p-5 border  rounded-lg flex-col items-start"
        >
            <h2 className="text-2xl font-medium text-primary">Feedback Form</h2>
            <p className="text-fontPrimary font-medium ">
                Please use the form below to send us your comments and feedback. We
                appreciate you taking the time to provide us with your views so that we
                can best meet the needs of users.
            </p>

            <p className="text-base rounded-xl font-medium mt-4 text-foreground">
                Feedback Description *
            </p>
            <textarea
                {...register("message")}
                rows={3}
                className="w-full bg-transparent relative rounded-lg h-auto text-fontPrimary placeholder:text-fontprimary border p-3"
                id=""
                placeholder="Describe Your Feedback here ...."
            ></textarea>

            <p className="text-base font-medium  mt-4 text-foreground ">
                Please tell us what is your feedback related to*
            </p>
            <ul className="w-full relative mt-1 h-auto flex flex-col gap-3">
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="category"   value="category" {...register("point")} />
                    <label
                        htmlFor="category"
                        className="text-base font-medium text-fontprimary"
                    >
                        Category
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="payment"    value="payment" {...register("point")}  />
                    <label
                        htmlFor="payment"
                        className="text-base font-medium text-fontprimary"
                    >
                        Payment
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="delivary"   value="delivery"  {...register("point")} />
                    <label
                        htmlFor="delivary"
                        className="text-base font-medium text-fontprimary"
                    >
                        Delivery
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="products"   value="products"  {...register("point")} />
                    <label
                        htmlFor="products"
                        className="text-base font-medium text-fontprimary"
                    >
                        Products / Account related issues
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="others" value="others"  {...register("point")} />
                    <label
                        htmlFor="others"
                        className="text-base font-medium text-fontprimary"
                    >
                        Others
                    </label>
                </li>
            </ul>
            <button className=" w-full  relative h-auto px-5 py-1 text-center text-white bg-primary hover:text-primary hover:bg-transparent hover:border-primary border border-transparent rounded-md mt-3 ">
                {
                    submitting ? "Submitting..." : "Submit Feedback"
                }
                
            </button>

            {errors.point&&
                <p className='text-base font-meidum text-primary '>
                    {
                        errors.point.message
                    }
                </p>
            }

        </form>
    );
}

export default FeedbackForm;
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import z  from "zod"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRef } from 'react'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const loginSchema = z.object({
    email: z.string().email("enter valid email")
})

type loginschemadata = z.infer<typeof loginSchema>

function LoginModal({ children }: { children: React.ReactNode }) {

    const [isSending,setSending]=useState<boolean>(false)
    const { executeRecaptcha } = useGoogleReCaptcha()
    const message = useRef<HTMLParagraphElement>(null)

    const { register, reset, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema)
    })


        async function onSubmit({ email }: loginschemadata) {
        try {
            setSending(true);

            if(!executeRecaptcha){
                console.log("recaptcha is not refined")
                return ;
            }

            const token=await executeRecaptcha()
            const response = await axios.post("/api/login-user", {
                email,
                token,
            });

            if (response.data.success) {
            if (message.current) {
                message.current.innerText = "Check your email for the login link!";
            }
            } else {
            if (message.current) {
                message.current.innerText = response.data.error || "Something went wrong";
            }
            }
            } catch (error: any) {
                console.error("Client error:", error);
                if (message.current) {
                message.current.innerText = error.response?.data?.error || "Something went wrong";
                }
            } finally {
                setSending(false);
            }
        }


    return (


        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className=" max-w-[calc(100vw-20px)]  sm:max-w-[300px] p-3 md:p-5  md:max-w-[400px]">
                <form action="" onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-3'>
                    <h1 className='text-xl font-lg font-semibold border-b text-center border-primary pb-2  '>Login With Markline</h1>
                    <div className=' flex flex-col gap-2 mt-2 '>
                        <label htmlFor="email" className='text-base font-medium text-primary'>Enter Email *</label>
                        <input type="text" id="name" placeholder='Email ' className='w-full relative h-auto py-2 px-3 rounded-md bg-white border border-gray-300 ' {...register("email")} />
                    </div>
                    <button disabled={isSending} className='text-base rounded-lg w-fit text-white self-end  font-medium border bg-primary border-white text-primary cursor-pointer px-10 py-2 hover:bg-white hover:text-primary hover:border-primary transition-all duration-75'>
                        {isSending ? "Sending Mail..." : "Login"}
                    </button>
                    <p className="text-base font-medium text-primary "  ref={message} ></p>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
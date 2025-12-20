"use client"

import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import z from "zod";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const loginSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    email: z.string().email("Enter a valid email"),
});

type LoginSchemaData = z.infer<typeof loginSchema>;


interface LoginModalInterfce {
    children?: React.ReactDOM,
    isOpen: boolean,

}

function LoginModal({ children, isOpen,
    setIsOpen }: {
        children: React.ReactNode,
        isOpen: boolean,
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    }) {
    const [isSending, setSending] = useState<boolean>(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const message = useRef<HTMLParagraphElement>(null);

    const {
        register,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginSchemaData>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit({ email, phone }: LoginSchemaData) {
        try {
            setSending(true);

            if (!executeRecaptcha) {
                console.log("Recaptcha not ready");
                return;
            }

            const token = await executeRecaptcha();

            const response = await axios.post("/api/login-user", {
                email,
                phone,
                token,
            });

            if (response.data.success) {
                if (message.current) {
                    message.current.innerText = "Check your email for the login link!";
                }
            } else {
                if (message.current) {
                    message.current.innerText =
                        response.data.error || "Something went wrong";
                }
            }
        } catch (error: any) {
            console.error("Client error:", error);
            if (message.current) {
                message.current.innerText =
                    error.response?.data?.error || "Something went wrong";
            }
        } finally {
            setSending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-20px)] h-auto rounded-md lg:max-h-[500px] p-0 grid grid-cols-1 md:grid-cols-2 items-start gap-1 sm:max-w-[300px] md:max-w-[600px] xl:max-w-[700px]">
                {/* Left side: Swiper */}
                <section className="hidden md:block">
                    <Swiper
                        pagination={true}
                        className="mySwiper w-full relative max-h-[250px] md:max-h-full"
                    >
                        <SwiperSlide className="w-full relative h-auto p-1">
                            <Image
                                src="/markline-fashion.png"
                                alt=""
                                className="w-full relative h-full rounded-sm"
                                height={400}
                                width={400}
                            />
                        </SwiperSlide>
                        <SwiperSlide className="w-full relative h-auto p-1">
                            <Image
                                src="/markline-fashion.png"
                                alt=""
                                className="w-full relative h-full rounded-sm"
                                height={400}
                                width={400}
                            />
                        </SwiperSlide>
                    </Swiper>
                </section>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full py-5 px-5 h-full flex flex-col gap-3  "
                >
                    <h1 className="text-xl font-lg font-semibold border-b text-start border-primary pb-2">
                        Login With Markline
                    </h1>

                    <section className="w-full flex flex-col gap-3 mt-2 py-5 lg:py-10">

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="phone"
                                className="text-base font-medium text-primary"
                            >
                                Phone *
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Enter 10-digit phone number"
                                className="w-full py-2 px-3 rounded-md bg-white border border-gray-300"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-base font-medium text-primary"
                            >
                                Email *
                            </label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter your email"
                                className="w-full py-2 px-3 rounded-md bg-white border border-gray-300"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            disabled={isSending}
                            className="text-base rounded-lg w-full self-end font-medium border bg-primary text-white border-white cursor-pointer px-10 py-2 hover:bg-white hover:text-primary hover:border-primary transition-all duration-75"
                        >
                            {isSending ? "Sending Mail..." : "Continue"}
                        </button>

                        <p className="text-base font-medium text-primary" ref={message}></p>
                    </section>
                </form>


            </DialogContent>
        </Dialog>
    );
}

export default LoginModal;

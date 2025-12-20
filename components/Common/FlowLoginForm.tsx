"use client";

import React, { useRef, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Zod validation schema
const loginSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    email: z.string().email("Enter a valid email"),
});

type LoginSchemaData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isSending, setSending] = useState(false);
    const message = useRef<HTMLParagraphElement>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginSchemaData>({
        resolver: zodResolver(loginSchema),
    });

    // Submit handler
    async function onSubmit({ email, phone }: LoginSchemaData) {
        try {
            setSending(true);

            if (!executeRecaptcha) {
                return (message.current!.innerText = "Recaptcha not ready");
            }

            // recaptcha token
            const token = await executeRecaptcha();

            const response = await axios.post("/api/login-user", {
                email,
                phone,
                token,
            });

            if (response.data.success) {
                message.current!.innerText = "Check your email for the login link!";
            } else {
                message.current!.innerText =
                    response.data.error || "Something went wrong";
            }
        } catch (error: any) {
            message.current!.innerText =
                error.response?.data?.error || "Something went wrong";
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="flex items-center h-full justify-center ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4 px-10 h-full  rounded-lg max-w-[400px]    py-10 "
            >
                <h1 className="text-xl font-semibold text-primary">Login</h1>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="font-medium">
                        Phone *
                    </label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="Enter 10-digit phone number"
                        className="border rounded-md px-3 py-2"
                        {...register("phone")}
                    />
                    {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-medium">
                        Email *
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        className="border rounded-md px-3 py-2"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    disabled={isSending}
                    className="py-2 rounded-lg bg-primary text-white hover:bg-white hover:text-primary border border-primary transition"
                >
                    {isSending ? "Sending Mail..." : "Continue"}
                </button>

                <p ref={message} className="text-sm font-medium text-primary"></p>
            </form>
        </div>
    );
}

"use client";

import React, { useRef, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { toast } from "sonner";

// Validation schemas
const emailSchema = z.object({
    email: z.string().email("Enter a valid email"),
});

const otpSchema = z.object({
    otp: z.string().length(6, "Enter a 6-digit OTP code"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function LoginForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [isSending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
    const { executeRecaptcha } = useGoogleReCaptcha();

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    // Send OTP handler
    async function onSendOtp({ email }: EmailFormData) {
        try {
            setSending(true);
            setStatusMessage({ text: '', type: null });

            if (!executeRecaptcha) {
                toast.error("reCAPTCHA not ready. Please try again.");
                return;
            }

            const token = await executeRecaptcha();

            const response = await axios.post("/api/login-user", {
                email,
                token,
            });

            if (response.data.success) {
                setEmail(email);
                setStep(2);
                setStatusMessage({ text: "Code sent to your email.", type: 'success' });
            } else {
                setStatusMessage({ text: response.data.error || "Something went wrong", type: 'error' });
            }
        } catch (error: any) {
            console.error("Client error:", error);
            setStatusMessage({ text: error.response?.data?.error || "Connection error. Please try again.", type: 'error' });
        } finally {
            setSending(false);
        }
    }

    // Verify OTP handler
    async function onVerifyOtp({ otp }: OtpFormData) {
        try {
            setSending(true);
            setStatusMessage({ text: '', type: null });

            const { data, error } = await mysupabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });

            if (error) {
                setStatusMessage({ text: error.message || "Invalid or expired code", type: 'error' });
            } else if (data.user) {
                toast.success("Welcome back!");
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setStatusMessage({ text: "Verification failed. Try again.", type: 'error' });
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="w-full max-w-[400px] mx-auto bg-white p-8 rounded-2xl flex flex-col justify-center min-h-[380px] shadow-sm">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col flex-grow w-full"
                    >
                        <div className="flex flex-col gap-2 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 leading-none">Authentication</h2>
                            <p className="text-sm text-gray-400 font-medium">Enter your email to receive a secure login code</p>
                        </div>

                        <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition text-gray-900 placeholder:text-gray-400 text-sm"
                                        {...emailForm.register("email")}
                                    />
                                </div>
                                {emailForm.formState.errors.email && (
                                    <p className="text-xs font-medium text-red-500">{emailForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-black text-white h-12 rounded-xl font-semibold uppercase tracking-wider text-xs hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition flex items-center justify-center gap-2 group"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Sending Code
                                    </>
                                ) : (
                                    <>
                                        Get Access Code
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col flex-grow w-full"
                    >
                        <button
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-black transition mb-4 group/back"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Email
                        </button>

                        <div className="flex flex-col gap-2 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 leading-none">Verification</h2>
                            <p className="text-sm text-gray-400 font-medium">Enter the 6-digit code sent to <span className="text-black font-semibold">{email}</span></p>
                        </div>

                        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Passcode</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition text-gray-900 font-bold placeholder:font-normal placeholder:text-gray-400 tracking-[0.2em] text-lg"
                                        {...otpForm.register("otp")}
                                    />
                                </div>
                                {otpForm.formState.errors.otp && (
                                    <p className="text-xs font-medium text-red-500">{otpForm.formState.errors.otp.message}</p>
                                )}
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-black text-white h-12 rounded-xl font-semibold uppercase tracking-wider text-xs hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition flex items-center justify-center gap-2 group"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Verifying
                                    </>
                                ) : (
                                    <>
                                        Sign In Now
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Messages */}
            {statusMessage.text && (
                <div
                    className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                        statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                >
                    <p className="leading-relaxed">{statusMessage.text}</p>
                </div>
            )}
        </div>
    );
}

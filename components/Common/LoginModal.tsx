"use client"

import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import z from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowRight, Loader2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { toast } from "sonner";

const emailSchema = z.object({
    email: z.string().email("Enter a valid email"),
});

const otpSchema = z.object({
    otp: z.string().length(6, "Enter a 6-digit OTP code"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface LoginModalProps {
    children?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: () => void;
}

function LoginModal({ children, isOpen, setIsOpen, onSuccess }: LoginModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [isSending, setSending] = useState<boolean>(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });
    
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

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
                toast.success("Welcome back to Markline!");
                setIsOpen(false);
                // Reset form state for next time
                setStep(1);
                setEmail("");
                otpForm.reset();
                emailForm.reset();
                onSuccess?.();
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setStatusMessage({ text: "Verification failed. Try again.", type: 'error' });
        } finally {
            setSending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[450px] md:max-w-[800px] p-0 overflow-hidden border border-zinc-200/80 rounded-2xl shadow-2xl bg-white">
                <div className="flex flex-col md:flex-row h-full min-h-[420px] md:min-h-[480px]">

                    {/* Visual Side (Hidden on Mobile) */}
                    <section className="hidden md:block w-1/2 relative bg-zinc-100 overflow-hidden">
                        <Image
                            src="/markline-fashion.png"
                            alt="Markline Fashion"
                            className="w-full h-full object-cover"
                            fill
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <h3 className="text-white text-2xl font-bold tracking-tight mb-1">Markline</h3>
                            <p className="text-zinc-300 text-xs font-medium tracking-wider uppercase">Handcrafted Footwear</p>
                        </div>
                    </section>

                    {/* Form Side */}
                    <section className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-center relative">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col flex-grow justify-center"
                                >
                                    <div className="flex flex-col gap-1.5 mb-8">
                                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Sign In</h2>
                                        <p className="text-xs text-zinc-500 font-normal">Enter your email to receive a secure login code</p>
                                    </div>

                                    <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="flex flex-col gap-6">
                                        {/* Email Field */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-zinc-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                <input
                                                    type="email"
                                                    placeholder="you@email.com"
                                                    className="w-full pl-9 pr-4 py-3 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors text-zinc-900 font-medium placeholder:text-zinc-400 text-sm"
                                                    {...emailForm.register("email")}
                                                />
                                            </div>
                                            {emailForm.formState.errors.email && (
                                                <p className="text-xs font-medium text-red-500">{emailForm.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <button
                                            disabled={isSending}
                                            className="w-full bg-zinc-900 text-white h-11 rounded-xl font-semibold tracking-wider uppercase text-xs hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSending ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Sending Code
                                                </>
                                            ) : (
                                                <>
                                                    Get Login Code
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col flex-grow justify-center"
                                >
                                    <button
                                        onClick={() => setStep(1)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors mb-6"
                                    >
                                        <ArrowLeft size={14} />
                                        Back to Email
                                    </button>

                                    <div className="flex flex-col gap-1.5 mb-8">
                                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Enter Code</h2>
                                        <p className="text-xs text-zinc-500 font-normal">Enter the 6-digit code sent to <span className="text-zinc-900 font-semibold">{email}</span></p>
                                    </div>

                                    <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="flex flex-col gap-6">
                                        {/* OTP Field */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-zinc-700">Verification Code</label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="000 000"
                                                    maxLength={6}
                                                    className="w-full pl-9 pr-4 py-3 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors text-zinc-900 font-bold placeholder:font-normal placeholder:text-zinc-400 tracking-[0.3em] text-lg text-center"
                                                    {...otpForm.register("otp")}
                                                />
                                            </div>
                                            {otpForm.formState.errors.otp && (
                                                <p className="text-xs font-medium text-red-500">{otpForm.formState.errors.otp.message}</p>
                                            )}
                                        </div>

                                        <button
                                            disabled={isSending}
                                            className="w-full bg-zinc-900 text-white h-11 rounded-xl font-semibold tracking-wider uppercase text-xs hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSending ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Verifying
                                                </>
                                            ) : (
                                                <>
                                                    Verify & Sign In
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Message Footer */}
                        <AnimatePresence>
                            {statusMessage.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`absolute bottom-8 left-8 right-8 p-4 rounded-2xl flex items-center gap-3 z-10 ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                                >
                                    <div className="shrink-0 bg-white/50 p-1.5 rounded-full">
                                        {statusMessage.type === 'success' ? <ShieldCheck size={18} /> : <ArrowRight size={18} className="rotate-45" />}
                                    </div>
                                    <p className="text-[10px] font-black  tracking-wider leading-relaxed">{statusMessage.text}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default LoginModal;



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

function LoginModal({ children, isOpen, setIsOpen }: {
    children: React.ReactNode,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
            <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[450px] md:max-w-[850px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
                <div className="flex flex-col md:flex-row h-full min-h-[400px] md:min-h-[500px]">

                    {/* Visual Side (Hidden on Mobile) */}
                    <section className="hidden md:block w-1/2 relative bg-gray-50 overflow-hidden">
                        <Image
                            src="/markline-fashion.png"
                            alt="Markline Fashion"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                            fill
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                            <h3 className="text-white text-3xl font-black tracking-tighter mb-2  italic">Elite Couture</h3>
                            <p className="text-gray-300 text-xs font-bold tracking-[0.3em] ">Private Shopping Access</p>
                        </div>
                    </section>

                    {/* Form Side */}
                    <section className="w-full md:w-1/2 bg-white p-8 lg:p-12 flex flex-col relative">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col flex-grow h-full"
                                >
                                    <div className="flex flex-col gap-2 mb-10">
                                        <h2 className="text-3xl font-black text-primary  tracking-tighter leading-none">Authentication</h2>
                                        <p className="text-sm text-gray-400 font-medium tracking-wide">Enter your email to receive a secure code</p>
                                    </div>

                                    <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="flex flex-col gap-8 flex-grow">
                                        {/* Email Field */}
                                        <div className="flex flex-col gap-3 group">
                                            <label className="text-[10px] font-black  tracking-[0.2em] text-gray-400 text-primary transition-colors">Identification</label>
                                            <div className="relative">
                                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 text-primary transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="MARKLINE@EMAIL.COM"
                                                    className="w-full pl-8 pr-4 py-4 border-b border-gray-100 border-primary outline-none transition-all text-primary font-bold placeholder:font-bold placeholder:text-gray-400  tracking-widest text-sm"
                                                    {...emailForm.register("email")}
                                                />
                                            </div>
                                            {emailForm.formState.errors.email && (
                                                <p className="text-[10px] font-bold text-red-500  tracking-wider">{emailForm.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-col gap-6">
                                            <button
                                                disabled={isSending}
                                                className="w-full bg-black text-white h-16 rounded-2xl font-black  tracking-[0.2em] text-xs hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center justify-center gap-3 group"
                                            >
                                                {isSending ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        Sending Code
                                                    </>
                                                ) : (
                                                    <>
                                                        Get Access Code
                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col flex-grow h-full"
                                >
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 text-[10px] font-black  tracking-[0.2em] text-gray-300 hover:text-primary transition-colors mb-6 group/back"
                                    >
                                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        Back to Email
                                    </button>

                                    <div className="flex flex-col gap-2 mb-10">
                                        <h2 className="text-3xl font-black text-primary  tracking-tighter leading-none">verification</h2>
                                        <p className="text-sm text-gray-400 font-medium tracking-wide">Enter the 6-digit code sent to <span className="text-primary font-bold">{email}</span></p>
                                    </div>

                                    <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="flex flex-col gap-8 flex-grow">
                                        {/* OTP Field */}
                                        <div className="flex flex-col gap-3 group">
                                            <label className="text-[10px] font-black  tracking-[0.2em] text-gray-400 text-primary transition-colors">Passcode</label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="000 000"
                                                    maxLength={6}
                                                    className="w-full pl-8 pr-4 py-4 border-b border-gray-100 border-primary outline-none transition-all text-primary font-black placeholder:font-black placeholder:text-gray-400  tracking-[0.5em] text-2xl"
                                                    {...otpForm.register("otp")}
                                                />
                                            </div>
                                            {otpForm.formState.errors.otp && (
                                                <p className="text-[10px] font-bold text-red-500  tracking-wider">{otpForm.formState.errors.otp.message}</p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-col gap-6">
                                            <button
                                                disabled={isSending}
                                                className="w-full bg-black text-white h-16 rounded-2xl font-black  tracking-[0.2em] text-xs hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center justify-center gap-3 group"
                                            >
                                                {isSending ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        Verifying
                                                    </>
                                                ) : (
                                                    <>
                                                        Sign In Now
                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
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



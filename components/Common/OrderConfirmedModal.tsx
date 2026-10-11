"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface OrderConfirmedModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderDetails?: {
        orderId?: string;
        totalAmount?: number;
        address?: any;
    };
}

export default function OrderConfirmedModal({
    isOpen,
    onClose,
    orderDetails
}: OrderConfirmedModalProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowContent(false);
            const timer = setTimeout(() => setShowContent(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-none shadow-2xl">
                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Animated Checkmark Circle */}
                    <div className="relative my-6 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white z-10"
                        >
                            <svg className="w-12 h-12 stroke-current" viewBox="0 0 50 50">
                                <motion.path
                                    fill="none"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 27 l8 8 l16 -16"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                />
                            </svg>
                        </motion.div>

                        {/* Celebration Rings */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.4, opacity: [0, 0.4, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                            className="absolute inset-0 rounded-full border-2 border-emerald-400"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.8, opacity: [0, 0.2, 0] }}
                            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
                            className="absolute inset-0 rounded-full border border-emerald-300"
                        />
                    </div>

                    <AnimatePresence>
                        {showContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-full space-y-4"
                            >
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Order Confirmed
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                        Thank You For Your Order!
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">
                                        Your order has been placed successfully and is now being crafted with care.
                                    </p>
                                </div>

                                {orderDetails && (
                                    <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100 text-xs text-gray-700">
                                        {orderDetails.orderId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-medium">Order ID</span>
                                                <span className="font-mono font-bold text-gray-900">{orderDetails.orderId}</span>
                                            </div>
                                        )}
                                        {orderDetails.totalAmount !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-medium">Total Paid</span>
                                                <span className="font-bold text-gray-900">₹{orderDetails.totalAmount}</span>
                                            </div>
                                        )}
                                        {orderDetails.address && (
                                            <div className="pt-2 border-t border-gray-200/60">
                                                <span className="text-gray-400 font-medium block mb-0.5">Delivering to</span>
                                                <span className="font-semibold text-gray-800 line-clamp-1">
                                                    {orderDetails.address.recipientName || orderDetails.address.name || orderDetails.address.full_name || "Saved Address"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Continue Shopping
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}

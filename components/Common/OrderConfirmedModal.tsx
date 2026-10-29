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
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-2xl border border-zinc-200/80 shadow-2xl">
                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Compact Refined Confirmation Badge - no oversized bouncing icon */}
                    <div className="my-3 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-12 h-12 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-lg shadow-zinc-950/15"
                        >
                            <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {showContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full space-y-4"
                            >
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-semibold tracking-wider uppercase mb-1">
                                        <Sparkles className="w-3 h-3 text-zinc-600" />
                                        Order Confirmed
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                                        Thank You For Your Order
                                    </h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                                        Your order has been placed successfully and is being prepared for dispatch.
                                    </p>
                                </div>

                                {orderDetails && (
                                    <div className="bg-zinc-50 rounded-xl p-4 text-left space-y-2 border border-zinc-200/60 text-xs text-zinc-600">
                                        {orderDetails.orderId && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400 font-medium">Order ID</span>
                                                <span className="font-mono font-semibold text-zinc-900">{orderDetails.orderId}</span>
                                            </div>
                                        )}
                                        {orderDetails.totalAmount !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400 font-medium">Total Paid</span>
                                                <span className="font-semibold text-zinc-900">₹{orderDetails.totalAmount}</span>
                                            </div>
                                        )}
                                        {orderDetails.address && (
                                            <div className="pt-2 border-t border-zinc-200/60">
                                                <span className="text-zinc-400 font-medium block mb-0.5">Delivering to</span>
                                                <span className="font-semibold text-zinc-800 line-clamp-1">
                                                    {orderDetails.address.recipientName || orderDetails.address.name || orderDetails.address.full_name || "Saved Address"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2"
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

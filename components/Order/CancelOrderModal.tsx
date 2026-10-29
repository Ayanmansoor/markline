'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { AlertTriangle, Loader2, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { mysupabase } from '@/Supabase/SupabaseConfig'

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    userEmail?: string;
    userName?: string;
    onSuccess?: () => void;
}

const CANCEL_REASONS = [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Delivery address needs to be changed",
    "Item will not arrive in time",
    "Decided to buy a different item",
    "Other reason"
];

export function CancelOrderModal({
    isOpen,
    onClose,
    orderId,
    userEmail: propEmail,
    userName: propName,
    onSuccess
}: CancelOrderModalProps) {
    const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
    const [customNote, setCustomNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancelOrder = async () => {
        if (!orderId) {
            console.error("[CancelOrderModal] No orderId provided");
            return;
        }

        console.log(`[CancelOrderModal] Starting cancellation for orderId: ${orderId}`);
        setIsSubmitting(true);

        try {
            const finalReason = selectedReason === "Other reason"
                ? (customNote.trim() ? `Other: ${customNote.trim()}` : "Other reason")
                : selectedReason;

            // Get access token & user email synchronously
            let token: string | null = null;
            let userSessionEmail: string | null = propEmail || null;
            let userSessionName: string | null = propName && !["Home", "Office", "Work"].includes(propName) ? propName : null;

            try {
                const { data: sessionData } = await mysupabase.auth.getSession();
                const session = sessionData?.session;
                if (session) {
                    token = session.access_token || null;
                    if (session.user) {
                        userSessionEmail = userSessionEmail || session.user.email || null;
                        userSessionName = userSessionName || session.user.user_metadata?.full_name || session.user.user_metadata?.name || null;
                    }
                }
            } catch (authErr) {
                console.warn("[CancelOrderModal] getSession error:", authErr);
            }

            if (!userSessionEmail) {
                try {
                    const { data: userData } = await mysupabase.auth.getUser();
                    if (userData?.user?.email) {
                        userSessionEmail = userData.user.email;
                        userSessionName = userSessionName || userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || null;
                    }
                } catch (uErr) {
                    console.warn("[CancelOrderModal] getUser error:", uErr);
                }
            }

            console.log("[CancelOrderModal] Token status:", token ? "Token present" : "No token", "Email:", userSessionEmail, "Name:", userSessionName);

            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const payload = {
                orderId,
                reason: finalReason,
                cancel_reason: finalReason,
                cancellation_reason: finalReason,
                cancelReason: finalReason,
                cancellationReason: finalReason,
                remarks: finalReason,
                note: finalReason,
                customer_note: finalReason,
                userEmail: userSessionEmail,
                userName: userSessionName,
            };

            let responseData: any = null;

            // 1. Call Next.js proxy route first
            try {
                console.log(`[CancelOrderModal] Calling /api/user/order/cancel with reason: "${finalReason}"`);
                const res = await axios.post(
                    "/api/user/order/cancel",
                    payload,
                    { headers, timeout: 8000 }
                );
                responseData = res.data;
                console.log("[CancelOrderModal] Proxy route response:", responseData);
            } catch (proxyErr: any) {
                console.warn("[CancelOrderModal] Proxy route error:", proxyErr?.response?.data || proxyErr?.message);

                // 2. Direct call to CMS API as fallback
                const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || 'http://192.168.0.107:3000';
                const cmsUrl = `${cmsBaseUrl}/api/orders/${orderId}/cancel`;
                console.log(`[CancelOrderModal] Fallback direct call to: ${cmsUrl}`);

                try {
                    const directRes = await axios.post(
                        cmsUrl,
                        payload,
                        { headers, timeout: 8000 }
                    );
                    responseData = directRes.data;
                    console.log("[CancelOrderModal] Direct POST response:", responseData);
                } catch (directPostErr: any) {
                    if (directPostErr?.response?.status === 405) {
                        console.log("[CancelOrderModal] POST 405, retrying with PUT...");
                        const directPutRes = await axios.put(
                            cmsUrl,
                            payload,
                            { headers, timeout: 8000 }
                        );
                        responseData = directPutRes.data;
                        console.log("[CancelOrderModal] Direct PUT response:", responseData);
                    } else {
                        throw directPostErr;
                    }
                }
            }

            if (responseData && (responseData.success !== false && (responseData.success || responseData.status === "success" || responseData.message || responseData.msg))) {
                toast.success(responseData.message || responseData.msg || "Order cancelled successfully");
                onSuccess?.();
                onClose();
            } else {
                toast.error(responseData?.error || responseData?.message || "Failed to cancel order");
            }
        } catch (error: any) {
            console.error("[CancelOrderModal Error]:", error);
            const errMsg = error?.response?.data?.error || error?.response?.data?.message || error?.response?.data?.msg || error?.message || "Order cancellation failed. Please try again.";
            toast.error(errMsg);
        } finally {
            console.log("[CancelOrderModal] Resetting isSubmitting state");
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-2xl">
                <DialogHeader className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/60">
                            <AlertTriangle size={16} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-zinc-900 tracking-tight">
                                Cancel Order
                            </DialogTitle>
                            <DialogDescription className="text-xs text-zinc-500 font-normal mt-0.5">
                                Order ID: <span className="font-mono font-semibold text-zinc-800">#Ord-{orderId.slice(0, 8).toUpperCase()}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-700">
                            Reason for Cancellation *
                        </label>
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                        >
                            {CANCEL_REASONS.map((reason, idx) => (
                                <option key={idx} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedReason === "Other reason" && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-zinc-700">
                                Please specify details
                            </label>
                            <textarea
                                rows={3}
                                value={customNote}
                                onChange={(e) => setCustomNote(e.target.value)}
                                placeholder="Enter cancellation details..."
                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors resize-none"
                            />
                        </div>
                    )}

                    <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-xs text-amber-900 font-normal leading-relaxed">
                        Note: Once cancelled, this order cannot be restored. Any payments processed will be refunded according to our refund policy.
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-10 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                        Keep Order
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={isSubmitting}
                        className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            <span>Confirm Cancellation</span>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

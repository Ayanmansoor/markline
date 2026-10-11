'use client'
import React from 'react'
import { Check, Package, Cog, Truck, Home, XCircle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react'

interface OrderStatusProps {
    status?: string;
    fulfillment_status?: string;
    payment_status?: string;
    return_status?: string;
    cancel_reason?: string | null;
    created_at?: string;
    updated_at?: string;
}

const steps = [
    { id: 'PENDING', label: 'Order Placed', desc: 'Order confirmed', icon: Package },
    { id: 'PROCESSING', label: 'Processing', desc: 'Preparing item', icon: Cog },
    { id: 'SHIPPED', label: 'In Transit', desc: 'Handed to courier', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', desc: 'Delivered to recipient', icon: Home },
]

export function OrderStatus({
    status,
    fulfillment_status,
    payment_status,
    return_status,
    cancel_reason,
    created_at,
    updated_at
}: OrderStatusProps) {
    // Determine normalized fulfillment status
    const rawFulfillment = (fulfillment_status || status || 'PENDING').toString().toUpperCase();

    const isCancelled = rawFulfillment === 'CANCELLED';
    const isReturned = return_status && return_status.toLowerCase() !== 'none';

    // Map status string to index
    let currentStepIndex = steps.findIndex(step => step.id === rawFulfillment);
    if (currentStepIndex === -1) {
        if (rawFulfillment.includes('DELIVER')) {
            currentStepIndex = 3;
        } else if (
            rawFulfillment.includes('TRANSIT') ||
            rawFulfillment.includes('DESTINATION') ||
            rawFulfillment.includes('OUT FOR DELIVERY') ||
            rawFulfillment.includes('SHIP')
        ) {
            currentStepIndex = 2;
        } else if (
            rawFulfillment.includes('PICK') ||
            rawFulfillment.includes('PROCESS')
        ) {
            currentStepIndex = 1;
        } else {
            currentStepIndex = 0;
        }
    }

    if (isCancelled) {
        return (
            <div className="w-full flex flex-col gap-4 p-5 bg-red-50/60 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <XCircle size={22} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm md:text-base font-bold text-red-800 tracking-tight">
                                Order Cancelled
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                                Cancelled
                            </span>
                        </div>
                        <p className="text-xs text-red-600 font-medium">
                            {cancel_reason ? `Reason: ${cancel_reason}` : 'This order has been cancelled.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-black" />
                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                        Live Tracking &amp; Status
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {payment_status && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${payment_status.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            payment_status.toLowerCase() === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            Payment: {payment_status}
                        </span>
                    )}

                    {isReturned && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                            <RotateCcw size={12} /> Return: {return_status}
                        </span>
                    )}
                </div>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="py-2">
                {/* Desktop Horizontal View */}
                <div className="hidden md:flex items-start justify-between relative w-full max-w-3xl mx-auto px-6">
                    {/* Background Progress Bar */}
                    <div className="absolute top-5 left-12 right-12 h-[2px] bg-gray-200 z-0" />
                    <div
                        className="absolute top-5 left-12 h-[2px] bg-black z-0 transition-all duration-700 ease-in-out"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 84}%` }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[130px] group">
                                <div className={`
                                    w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-xs
                                    ${isCompleted
                                        ? 'bg-black text-white ring-4 ring-black/10'
                                        : 'bg-white border-2 border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'scale-105 shadow-md' : ''}
                                `}>
                                    {isCompleted && index < currentStepIndex ? (
                                        <Check className="w-5 h-5 stroke-[2.5]" />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="flex flex-col items-center gap-0.5 mt-3">
                                    <span className={`text-xs font-bold tracking-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                    <span className="text-[11px] text-gray-500 font-medium leading-tight">
                                        {step.desc}
                                    </span>
                                    {isCurrent && (
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                                            Current Step
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile Vertical View */}
                <div className="flex md:hidden flex-col gap-6 pl-2">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex items-start gap-3.5 relative">
                                {index < steps.length - 1 && (
                                    <div className={`
                                        absolute left-4 top-10 w-[2px] h-9 transition-all duration-500
                                        ${index < currentStepIndex ? 'bg-black' : 'bg-gray-200'}
                                    `} />
                                )}

                                <div className={`
                                    w-9 h-9 rounded-full flex items-center justify-center relative z-10 shrink-0
                                    ${isCompleted ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'ring-4 ring-black/10' : ''}
                                `}>
                                    {isCompleted && index < currentStepIndex ? (
                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="flex flex-col pt-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                                        {step.desc}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


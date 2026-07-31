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
    { id: 'PENDING', label: 'Order Placed', desc: 'Manifest registered in system', icon: Package },
    { id: 'PROCESSING', label: 'Processing', desc: 'Preparing & quality inspection', icon: Cog },
    { id: 'SHIPPED', label: 'In Transit', desc: 'Handed to premium courier', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', desc: 'Parcel safely delivered', icon: Home },
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
        if (rawFulfillment.includes('DELIVER')) currentStepIndex = 3;
        else if (rawFulfillment.includes('SHIP')) currentStepIndex = 2;
        else if (rawFulfillment.includes('PROCESS')) currentStepIndex = 1;
        else currentStepIndex = 0;
    }

    if (isCancelled) {
        return (
            <div className="w-full flex flex-col gap-6 p-6 bg-red-50/50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <XCircle size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm md:text-base font-black text-red-700  tracking-tight">
                                Order Cancelled
                            </h3>
                            <span className="text-[9px] font-black   bg-red-100 text-red-700 px-3 py-1 rounded-md">
                                Status: Cancelled
                            </span>
                        </div>
                        <p className="text-xs text-red-600 font-medium leading-relaxed">
                            {cancel_reason ? `Reason: ${cancel_reason}` : 'This acquisition request was voided and terminated.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black   text-gray-600">
                        Live Tracking Manifest
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {payment_status && (
                        <span className={`text-sm font-black   px-3 py-1 rounded-full border ${payment_status.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            payment_status.toLowerCase() === 'failed' ? 'bg-red-50 text-red-600 border-red-200' :
                                'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                            Payment: {payment_status}
                        </span>
                    )}

                    {isReturned && (
                        <span className="text-xs font-black   px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1">
                            <RotateCcw size={10} /> Return: {return_status}
                        </span>
                    )}
                </div>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="py-4">
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
                                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm
                                    ${isCompleted
                                        ? 'bg-black text-white ring-4 ring-black/10'
                                        : 'bg-white border-2 border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'scale-110 shadow-lg' : ''}
                                `}>
                                    {isCompleted && index < currentStepIndex ? (
                                        <Check className="w-5 h-5 stroke-[2.5]" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>

                                <div className="flex flex-col items-center gap-1 mt-4">
                                    <span className={`text-sm font-black  tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                    <span className="text-xs text-gray-400 font-semibold leading-tight line-clamp-2">
                                        {step.desc}
                                    </span>
                                    {isCurrent && (
                                        <span className="text-xs font-black   text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 animate-pulse">
                                            Current Status
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile Vertical View */}
                <div className="flex md:hidden flex-col gap-6 pl-4">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex items-start gap-4 relative">
                                {index < steps.length - 1 && (
                                    <div className={`
                                        absolute left-5 top-11 w-[2px] h-10 transition-all duration-500
                                        ${index < currentStepIndex ? 'bg-black' : 'bg-gray-200'}
                                    `} />
                                )}

                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center relative z-10 shrink-0
                                    ${isCompleted ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-300'}
                                    ${isCurrent ? 'ring-4 ring-black/10' : ''}
                                `}>
                                    {isCompleted && index < currentStepIndex ? (
                                        <Check className="w-5 h-5 stroke-[2.5]" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>

                                <div className="flex flex-col pt-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black  tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[8px] font-black  tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
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

'use client'
import React from 'react'
import { Check, Package, Truck, Home } from 'lucide-react'

interface OrderStatusProps {
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
}

const steps = [
    { id: 'PENDING', label: 'Ordered', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: Home },
]

export function OrderStatus({ status }: OrderStatusProps) {
    const currentStepIndex = steps.findIndex(step => step.id === status)

    return (
        <div className="w-full py-8 ">
            {/* Desktop Horizontal View */}
            <div className="hidden md:flex items-center justify-between relative w-full max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-0 h-[1px] bg-black -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col   py-2 px-3 rounded-lg border border-gray-300 items-center gap-3">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center border border-gray-200 justify-center transition-all duration-500
                                ${isCompleted ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-400'}
                            `}>
                                {isCompleted && index < currentStepIndex ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Mobile Vertical View */}
            <div className="flex md:hidden flex-col gap-8 pl-4">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="flex items-start gap-4 relative">
                            {index < steps.length - 1 && (
                                <div className={`
                                    absolute left-5 top-10 w-[1px] h-8 transition-all duration-1000
                                    ${index < currentStepIndex ? 'bg-black' : 'bg-gray-100'}
                                `} />
                            )}

                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center relative z-10
                                ${isCompleted ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-400'}
                            `}>
                                {isCompleted && index < currentStepIndex ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>

                            <div className="flex flex-col pt-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                                {isCompleted && (
                                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">
                                        {index === currentStepIndex ? 'In Progress' : 'Completed'}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

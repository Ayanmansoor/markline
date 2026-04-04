import React from 'react'
import { Skeleton } from '../ui/skeleton'

function CartSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-4 border border-gray-100 rounded-2xl w-full bg-white shadow-sm shadow-gray-50/50">
            {/* Product Image Skeleton */}
            <Skeleton className="w-full sm:w-32 h-40 sm:h-32 rounded-xl shrink-0 bg-gray-100" />

            {/* Product Details */}
            <div className="flex-1 flex flex-col gap-3 w-full">
                <div className='flex justify-between items-start gap-4'>
                    <Skeleton className="h-6 w-2/3 bg-gray-100 rounded-lg" />
                    <Skeleton className="h-8 w-8 bg-gray-100 rounded-lg" />
                </div>
                
                <div className='flex gap-3'>
                    <Skeleton className="h-4 w-20 bg-gray-100 rounded-full" />
                    <Skeleton className="h-4 w-20 bg-gray-100 rounded-full" />
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2'>
                    <Skeleton className="h-8 w-24 bg-gray-100 rounded-lg" />
                    <div className='flex items-center gap-3'>
                        <Skeleton className="h-9 w-20 bg-gray-100 rounded-lg" />
                        <Skeleton className="h-9 w-24 bg-gray-100 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSkeleton
import React from 'react'
import { Skeleton } from '../ui/skeleton'

function CartSkeleton() {
    return (
        <div className="flex items-center p-4 border rounded-lg w-full">
            {/* Product Image Skeleton */}
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-md flex-shrink-0  bg-gray-200" />

            {/* Product Details */}
            <div className="flex flex-col flex-grow ml-4 space-y-2">
                {/* Product Name Skeleton */}
                <Skeleton className="h-6 w-3/4 sm:w-2/3 bg-gray-200" />
                {/* Product Attributes Skeleton */}
                <Skeleton className="h-4 w-full sm:w-1/2 bg-gray-200" />
            </div>



        </div>
    )
}

export default CartSkeleton
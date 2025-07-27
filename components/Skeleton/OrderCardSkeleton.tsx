import React from 'react'
import { Skeleton } from '../ui/skeleton'

function OrderCardSkeleton() {
  return (
        <>
      {/* Product List Item Skeleton */}
      <div className="w-full  bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
        {/* Product Image Skeleton */}
        <div className="relative w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          <Skeleton className="w-full h-full" />
          {/* Optional: Image carousel dots skeleton if applicable */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="flex-grow flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-2 flex-grow">
            {/* Product Name Skeleton */}
            <Skeleton className="h-5 w-64 rounded-md" />
            {/* Quantity Skeleton (if '1' is a quantity) */}
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>

          {/* Price Skeleton */}
          <Skeleton className="h-6 w-20 rounded-md" />

          {/* Status Badge Skeleton */}
          <Skeleton className="h-7 w-24 rounded-full" />

          {/* Ellipsis Menu Skeleton */}
          <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
        </div>
      </div>
      </>
  )
}

export default OrderCardSkeleton
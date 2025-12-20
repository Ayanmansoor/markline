import React from 'react'
import ContentLoader from 'react-content-loader';
import { Skeleton } from '../ui/skeleton';

function MegaManuCarSkeleton() {
    return (
  
      <div className="w-full max-w-[300px] bg-white rounded-lg shadow-sm  flex flex-col items-start">
        {/* Product Image Skeleton */}
        <div className="relative w-full aspect-square bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mb-3">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Product Name Skeleton */}
        <Skeleton className="h-3 w-full rounded-md mb-2" />
        <Skeleton className="h-3 w-1/2 rounded-md mb-3" />

        {/* Price Skeleton */}
        <Skeleton className="h-2 w-20 rounded-md" />
      </div>
    )
}

export default MegaManuCarSkeleton
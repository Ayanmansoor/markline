import React from 'react';
import { Skeleton } from '../ui/skeleton';

function ProductCardSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-gray-200/80 p-2 sm:p-2.5 shadow-xs animate-pulse">
      {/* Product Image Skeleton */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Product Details Skeleton */}
      <div className="flex flex-col flex-grow justify-between pt-2.5 sm:pt-3 px-1 sm:px-1.5 gap-2">
        {/* Category & Color Swatches Skeleton */}
        <div className="flex items-center justify-between gap-2 min-h-[18px]">
          <Skeleton className="h-2.5 w-14 rounded" />
          <div className="flex gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
          </div>
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-4 w-4/5 rounded" />

        {/* Price & Add Button Skeleton */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
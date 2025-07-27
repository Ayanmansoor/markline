import React from 'react'

import ContentLoader from 'react-content-loader';
import { Skeleton } from '../ui/skeleton';


function ProductCardSkeleton() {

    return (
   <>

      {/* Product Card Skeleton */}
      <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden">
        {/* Product Image Skeleton */}
        <div className="relative w-full aspect-[4/3] bg-gray-200 flex items-center justify-center p-4">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        {/* Image Carousel Dots Skeleton (if applicable) */}
        <div className="flex justify-center space-x-2 py-3">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
        </div>

        {/* Product Details Skeleton */}
        <div className="p-4 flex flex-col gap-3">
          {/* Product Title Skeleton */}
          <Skeleton className=" h-2 lg:h-6 w-full rounded-md" />
          <Skeleton className="h-2 lg:h-6 w-3/4 rounded-md" />

          {/* Price Skeleton */}
          <Skeleton className=" h-2 md:h-4 lg:h-7 w-24 rounded-md mt-2" />

          {/* Add to Cart Button Skeleton */}
          <div className="flex items-center space-x-3 mt-4">
            <Skeleton className="flex-grow h-2 lg:h-6 xl:h-12 rounded-lg" />
            {/* Wishlist Icon Skeleton */}
            <Skeleton className="w-12 h-2 lg:h-6 xl:h-12  rounded-lg" />
          </div>
        </div>
      </div>
      </>
    )

}

export default ProductCardSkeleton
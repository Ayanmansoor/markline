'use client'
import React from 'react'
import ContentLoader from 'react-content-loader'
import { Skeleton } from '../ui/skeleton'

function ProductPageSkeleton() {
    return (
      
      <div className=" mx-auto  px-4 py-12 md:py-16 lg:py-10 w-full">
        {/* Product Grid Layout: Two columns on large screens, stacked on small screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Column: Product Image Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            {/* Main Product Image Skeleton */}
            <Skeleton className="relative w-full aspect-square rounded-xl shadow-lg" />

            {/* Thumbnail Images Grid Skeleton */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <Skeleton className="relative w-full aspect-square rounded-lg" />
              <Skeleton className="relative w-full aspect-square rounded-lg" />
              <Skeleton className="relative w-full aspect-square rounded-lg" />
              {/* Add more thumbnail skeletons if needed */}
            </div>
          </div>

          {/* Right Column: Product Details and Actions Skeleton */}
          <div className="flex flex-col gap-6 p-4 md:p-0">
            {/* Product Category Skeleton */}
            <Skeleton className="h-4 w-24 rounded-md" />

            {/* Product Title Skeleton */}
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-10 w-1/2 rounded-md" /> {/* Second line for title */}

            {/* Price Section Skeleton */}
            <div className="flex items-baseline space-x-3">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>

            {/* Color Selection Skeleton */}
            <div>
              <Skeleton className="h-5 w-20 mb-2 rounded-md" />
              <div className="flex space-x-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
              </div>
            </div>

            {/* Size Selection Skeleton */}
            <div>
              <Skeleton className="h-5 w-28 mb-2 rounded-md" />
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-w-lg">
                {[...Array(7)].map((_, i) => ( // Create 7 size button skeletons
                  <Skeleton key={i} className="w-full h-10 rounded-md" />
                ))}
              </div>
            </div>

            {/* Stock Status Badge Skeleton */}
            <Skeleton className="h-7 w-28 rounded-full" />

            {/* Quantity Selector Skeleton */}
            <div>
              <Skeleton className="h-5 w-24 mb-2 rounded-md" />
              <Skeleton className="w-[120px] h-10 rounded-md" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <Skeleton className="flex-1 w-full sm:w-auto h-14 rounded-lg" />
              <Skeleton className="flex-1 w-full sm:w-auto h-14 rounded-lg" />
              <Skeleton className="w-14 h-14 rounded-lg" /> {/* Wishlist button skeleton */}
            </div>

            {/* Delivery Information Section Skeleton */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
              <div className="flex items-center">
                <Skeleton className="w-6 h-6 mr-3 rounded-full" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-6 h-6 mr-3 rounded-full" />
                <Skeleton className="h-5 w-full rounded-md" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-6 h-6 mr-3 rounded-full" />
                <Skeleton className="h-5 w-5/6 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ProductPageSkeleton

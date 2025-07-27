import React from 'react'
import { Skeleton } from '../ui/skeleton'

function UserSkeleton() {
  return (
    
    <>
      {/* User Profile Card Skeleton */}
      <div className="w-full max-f-full container bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
        {/* Avatar Skeleton */}
        <Skeleton className="h-12 w-12 rounded-full" />

        {/* Email Skeleton */}
        <div className="flex-grow">
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>

        {/* Ellipsis Menu Skeleton */}
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      </>
  )
}

export default UserSkeleton
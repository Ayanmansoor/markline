'use client'
import React from 'react'
import Link from 'next/link'
import { newCollectionCardProps, ProductsDataProps } from '@/types/interfaces'
function MiniCollectionCard({ collections, url }: newCollectionCardProps) {



    const images = collections.image_urls?.map((obj: any, index: number) => JSON.parse(obj));


    return (
        <Link href={`/collections/${url}/${collections.slug}`} className='  w-[190px] lg:w-[200px] overflow-hidden  max-h-[260px]      cursor-pointer relative group  flex flex-col items-start justify-center gap-4 p-1 md:p-3     '>
            {images?.map((item, index) => (
                <img
                    key={index}
                    src={item?.image_url || "/dummy-image.jpg"}
                    alt={item?.name || "No Image"}
                    className='w-full border h-[180px] lg:h-[200px] relative rounded-md object-cover hover:scale-[1.010] transition-all duration-100'
                    loading='lazy'
                    height={300}
                    width={300}
                />
            ))}
            <h2 className=' text-sm md:text-base  lg:text-lg font-medium  bottom-3 line-clamp-1  text-center w-full  duration-500     z-10   text-primary uppercase px-3 '>
                {collections.name}
            </h2>
        </Link>
    )
}

export default MiniCollectionCard
'use client'
import React from 'react'
import Link from 'next/link'
import { newCollectionCardProps, ProductsDataProps } from '@/types/interfaces'
function CollectionCard({collections,url}:newCollectionCardProps) {


    
    const images = collections.image_urls?.map((obj:any, index: number) => JSON.parse(obj));


    return (
        <Link href={`/${url}/${collections.slug}`} className='w-full overflow-hidden      cursor-pointer relative group  flex flex-col items-start justify-start p-1 md:p-3  h-[300px] md:h-[450px] lg:h-[550px] xl:h-[600px] 2xl:h-[700px]   '>
            {
                images?.map((item, index) => (
                    <img src={`${item.image_url}`} alt={item.name || ""} className=' w-full  border  relative h-full  object-cover hover:scale-[1.010] transition-all duration-100 ' key={index}  loading='lazy' height={300} width={300} />
                ))
            }
            <h2 className='text-base font-medium absolute bottom-3 line-clamp-1 capitalize text-start left-2  group-hover:left-4 transition-all duration-500   bg-black  z-10   text-white px-3 '>
                {collections.name}
            </h2>
        </Link>
    )
}

export default CollectionCard
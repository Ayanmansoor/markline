'use client'
import React from 'react'
import Link from 'next/link'
import { newCollectionCardProps, ProductsDataProps } from '@/types/interfaces'
function CollectionCard({collections,url}:newCollectionCardProps) {


    
    const images = collections.image_urls?.map((obj:any, index: number) => JSON.parse(obj));


    return (
        <Link href={`/${url}/${collections.slug}`} className='w-full overflow-hidden max-h-[350px] lg:max-h-[470px] h-full      cursor-pointer relative group  flex flex-col items-start justify-center gap-4 p-1 md:p-3     '>
            {
                images?.map((item, index) => (
                    <img src={`${item.image_url}`} alt={item.name || ""} className=' w-full  border h-[250px] md:h-[300px]   relative  rounded-md  object-cover hover:scale-[1.010] transition-all duration-100 ' key={index}  loading='lazy' height={300} width={300} />
                ))
            }
            <h2 className=' text-xs sm:text-sm md:text-base lg:text-lg font-semibold sm:font-medium  bottom-3 line-clamp-1  text-center w-full  duration-500     z-10   text-primary uppercase px-3 '>
                {collections.name}
            </h2>
        </Link>
    )
}

export default CollectionCard
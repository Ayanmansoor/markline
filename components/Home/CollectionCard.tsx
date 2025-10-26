'use client'
import React from 'react'
import Link from 'next/link'
import { newCollectionCardProps, ProductsDataProps } from '@/types/interfaces'
function CollectionCard({ collections, url, className, imageClass }: newCollectionCardProps) {



    const images = collections.image_urls?.map((obj: any, index: number) => JSON.parse(obj));


    return (
        <Link href={`/${url}/${collections.slug}`} className={`   ${className ? className : "w-full overflow-hidden max-h-[260px] lg:max-h-[470px] h-full      cursor-pointer relative group  flex flex-col items-start justify-center gap-4 p-1 md:p-3"}  `}>
            {
                images?.map((item, index) => (
                    <img src={`${item.image_url}`} alt={item.name || ""} className={` ${imageClass ? imageClass :  "w-full  border h-full object-cover   relative  rounded-md   transition-all duration-100 "}  `} key={index} loading='lazy' height={300} width={300} />
                ))
            }
            <h2 className={`  text-xs sm:text-sm md:text-base h-fit lg:text-lg font-semibold sm:font-medium   line-clamp-1  text-center w-full  duration-500      relative   text-primary uppercase px-3 `}>
                {collections.name}
            </h2>
        </Link>
    )
}

export default CollectionCard
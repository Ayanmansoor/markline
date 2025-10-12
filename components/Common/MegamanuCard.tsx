import React from 'react'
import Link from 'next/link'
import { ProductsDataProps, ProductVariant } from '@/types/interfaces'

interface Megamanudata{
    product:ProductVariant,
    slug:string
    name:string
}

function MegamanuCard({product,slug,name}:Megamanudata) {

    const productImage:any = product?.image_url?.map((image:any) => JSON.parse(image))
    return (
        <Link href={`/product/${slug}`} className=' border border-gray-200 max-w-fit relative h-auto flex flex-col  items-center gap-1 p-2 bg-gray-50 rounded-md '>
            {
                <img src={productImage[1]?.image_url} alt={name} height={400} width={500} className='h-[130px] w-[300px] rounded-md border' loading='lazy'/>
            }

            <p className='text-sm text-start font-medium text-primary line-clamp-2'>{name}</p>
            <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                <p className='text-sm font-medium text-primary'>
                    ₹
                    {
                        product?.price
                    }
                </p>
                {
                    product?.discounts?.discount_persent
                    &&
                    <p className='text-sm  text-red-400 font-medium line-through '>{product?.discounts?.discount_persent}%</p>
                }
            </div>
        </Link>
    )
}

export default MegamanuCard
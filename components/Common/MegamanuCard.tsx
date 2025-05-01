import React from 'react'
import Link from 'next/link'
import { ProductsDataProps } from '@/types/interfaces'

function MegamanuCard({product}:ProductsDataProps) {

    const productImage:any = product?.image_url?.map((image:any) => JSON.parse(image))
    return (
        <Link href={`/products/${product?.slug}`} className=' max-w-fit relative h-auto flex flex-col  items-center gap-1 p-2 bg-gray-50 rounded-md '>
            {
                <img src={productImage[1]?.image_url} alt={product.name} height={400} width={500} className='h-[100px] w-[300px] rounded-md border' />

            }

            <p className='text-sm text-start font-medium text-primary line-clamp-2'>{product.name}</p>
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
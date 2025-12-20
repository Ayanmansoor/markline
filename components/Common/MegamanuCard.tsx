import React from 'react'
import Link from 'next/link'
import { ProductsDataProps, ProductVariant } from '@/types/interfaces'

interface Megamanudata {
    product: ProductVariant,
    slug: string
    name: string
    className?: string
}

function MegamanuCard({ product, slug, name, className }: Megamanudata) {

    const productImage: any = product?.image_url?.map((image: any) => JSON.parse(image))
    return (
        <Link href={`/product/${slug}`} className={` border border-gray-200  relative h-auto flex flex-col  items-center gap-1 p-2 bg-gray-50 rounded-md ${className} `}>
            {
                <img src={`${productImage[1]?.image_url}` || "/"} alt={name} height={400} width={500} className='h-[170px] w-[260px] rounded-md border' loading='lazy' />
            }

            {
                <p className='text-xs font-normal text-white bg-red-400 px-3 py-[3px] rounded-full flex items-center justify-center absolute right-[13px] z-10  top-[15px]  '>
                    Sale
                </p>
            }


            <p className='text-sm text-start font-medium text-primary line-clamp-2'>{name}</p>
            <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                {/* <p className='text-sm font-medium text-primary'>
                    {
                        product?.discounts?.discount_persent &&
                        <div className=' flex items-center justify-center gap-2'>
                            <p className='text-base  font-medium  !line-clamp-3   flex items-center gap-1 uppercase  text-black'>₹{
                                Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}
                            </p>
                            <p className='  font-normal text-red-500  line-through text-nowrap  text-sm '>₹ {product?.price}</p>
                        </div>
                    }
                </p>
             */}
            </div>
        </Link>
    )
}

export default MegamanuCard
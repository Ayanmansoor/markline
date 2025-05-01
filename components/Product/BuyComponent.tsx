import { Images, ProductsDataProps } from '@/types/interfaces'
import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


function BuyComponent({ product }: ProductsDataProps | any) {

    const productImages = product?.image_url?.map((obj:any) => JSON.parse(obj))

    return (
        <section className='w-full relative flex flex-col gap-1 h-full'>
            <div className='w-full relative grid grid-cols-[.5fr_2fr] gap-1 px-2 py-2 border bg-gray-50 border-gray-300 rounded-md'>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper  w-full relative h-auto "
                >
                    {
                        productImages?.map((item:Images, index:number) => (
                            <SwiperSlide className='min-w-[100px] relative h-auto  ' key={index}>
                                <img src={item.image_url} alt={item.name} height={400} width={500} className=' min-w-[100px] md:w-full border border-gray relative h-[100px] object-cover rounded-md ' />
                            </SwiperSlide>
                        ))

                    }


                </Swiper>

                <div className='flex  flex-col sm:flex-row items-start justify-between '>
                    <span className='flex items-start flex-col  '>
                        <h2 className='text-lg font-medium  text-black line-clamp-1'>{product.name}</h2>
                        <span className='text-[13px]  flex items-center  gap-2 text-normal text-black'>Quantity :  <p className='text-base relative font-semibold text-black'>{product.quentity}</p> </span>
                        <span className='text-[13px] flex items-center gap-2 text-normal text-black'>Color :  <p className='text-base relative font-semibold text-black'>{product?.colors?.name}</p> </span>
                    </span>
                    <span className='flex items-start flex-col '>
                        <span className='text-[13px]  flex items-center  gap-2 text-normal text-black'>Size :  <p className='text-base relative font-semibold text-black'>{product.sizes.size}</p> </span>
                        {
                            !product?.discounts?.discount_persent &&
                            <span className='text-[15px] font-medium flex mt-5 items-center gap-1 text-black '>Price : <p className='text-base relative font-semibold text-black'>₹{product.price}</p> </span>

                        }

                        {
                            product?.discounts?.discount_persent &&
                            <>

                                <span className='text-[15px] font-medium flex mt-5 items-center gap-1 text-black '>Price : <p className='text-base relative font-semibold text-black'>₹{
                                    Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p> </span>
                                <span className='text-[13px]  flex items-center  gap-2 text-normal text-red-400'>Discount :  <p className='text-sm relative font-semibold text-red-400 line-through'>{product?.discounts?.discount_persent} %</p> </span>
                            </>
                        }

                    </span>
                </div>
            </div>
            <div className='w-full relative h-full flex items-start flex-col gap-1 '>

                <div className='w-full relative bg-gray-100 py-1 text-balck  grid grid-cols-2  px-10 '>
                    <p className='text-p18 font-medium text-black '>Amount :</p>
                    <p className='text-p18 font-medium text-black '>₹{product?.price}</p>
                </div>
                {
                    product?.discounts?.discount_persent && product?.discounts?.name &&
                    <div className='w-full relative  py-1 text-balck  bg-green-50 grid grid-cols-2 items-center  px-10 '>
                        <p className='text-sm font-medium text-green-800 '>Discount name :</p>
                        <p className='text-base leading-[1.3] flex items-center gap-4 font-medium text-green-800 '>{product?.discounts?.name}

                            <p className='text-red-400 line-through'>{product?.discounts?.discount_persent}%</p>
                        </p>
                    </div>

                }
                {
                    product?.discounts?.discount_persent &&
                    < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                        <p className='text-sm font-medium text-black '>Total :</p>
                        <p className='text-p18 font-medium text-black '>₹{Math.floor(product?.price - (product?.price * (product?.discounts?.discount_persent / 100)))}</p>
                    </div>
                }

                {
                    !product?.discounts?.discount_persent &&

                    < div className='w-full relative  py-1 text-balck  bg-gray-100 items-center grid grid-cols-2  px-10 '>
                        <p className='text-sm font-medium text-black '>Total :</p>
                        <p className='text-p18 font-medium text-black '>₹{product?.price}</p>
                    </div>
                }
            </div>
        </section >
    )
}

export default BuyComponent
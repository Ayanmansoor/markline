'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';



import { SpotlightInterfce } from '@/types/interfaces';

function Discount({title,description,url,images}:SpotlightInterfce) {
    return (
        <>
            <section className='w-full mb-10 relative h-auto bg-black  py-5 md:py-10 border px-3 lg:px-5 '>
                <section className='w-full   relative min-h-[200px]  bg-black 
                grid grid-cols-1    md:gap-0 md:grid-cols-[2fr_1.5fr]  gap-10 '>

                    <div className='w-full relative h-full flex items-start container  justify-center flex-col gap-1 px-3 md:px-5    '>
                        <h2 className='text-h1 capitalize font-semibold text-white '>{title}</h2>
                        <p className=' text-sm md:text-sm font-normal w-full md:w-4/5 text-white '>{description}</p>
                        <Link href={`${url}`|| ""} className='w-fit mt-5 cursor-pointer text-base gap-1 group text-white relative h-fit flex flex-col  items-start '>Shop Now
                            <hr className='w-1/2 group-hover:w-full transition-all duration-500 text-white bg-white' />
                        </Link>
                    </div>

                    <Link href={url||""}>
                        <Swiper
                            slidesPerView={'auto'}
                            effect='fade'
                            speed={3000}
                            loop={true}
                            autoplay={{
                                delay: 1000,
                            }}
                            modules={[Autoplay]}
                            className="mySwiper w-full border bg-black border-black relative h-full flex"
                        >
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/discount-image.jpeg" height={400} width={400} className='w-full cursor-pointer relative h-full object-cover ' alt="Markline || markline fashion || buy online" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/silver-embellished-wedge-heel-Thongs sandels-for-women-2.jpeg" height={400} width={400} className='w-full relative h-full cursor-pointer object-cover ' alt="Markline || markline fashion || buy online" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/block-heel-mules-for-women-5.jpeg" height={400} width={400} className='w-full relative h-full object-cover cursor-pointer ' alt="Markline || markline fashion || buy online" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/balck-embellished-flip-flops-for-women-5.jpeg" height={400} width={400} className='w-full relative h-full object-cover cursor-pointer ' alt="Markline || markline fashion || buy online" loading='lazy' />
                            </SwiperSlide>
                        </Swiper>
                    </Link>


                </section>
            </section>

        </>
    )
}

export default Discount
'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';


function Discount( ) {
    return (
        <>
            <section className='w-full mb-10 relative h-auto bg-black  py-5 md:py-10 border '>
                <section className='w-full md:container md:px-20 relative min-h-[200px]  bg-black 
                grid grid-cols-1    md:gap-0 md:grid-cols-[2fr_1.5fr]  gap-10 '>

                    <div className='w-full relative h-full flex items-start container  justify-center flex-col gap-1   '>
                        <h2 className='text-h1 font-semibold text-white '>Steal the Spotlight</h2>
                        <p className=' text-sm md:text-lg font-normal w-full md:w-4/5 text-white '>Make a bold entrance with our best styles—now at limited-time prices.</p>
                        <Link href={"/products"} className='w-fit mt-5 cursor-pointer text-base gap-1 group text-white relative h-fit flex flex-col  items-start '>Shop Now
                            <hr className='w-1/2 group-hover:w-full transition-all duration-500 text-white bg-white' />
                        </Link>
                    </div>

                    <Link href="/products">
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
                                <img src="/air-force.png" height={400} width={400} className='w-full cursor-pointer relative h-full object-cover ' alt="Nike Shope" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/air-force.png" height={400} width={400} className='w-full relative h-full cursor-pointer object-cover ' alt="Nike Shope" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/court-vision.png" height={400} width={400} className='w-full relative h-full object-cover cursor-pointer ' alt="Nike Shope" loading='lazy' />
                            </SwiperSlide>
                            <SwiperSlide className='max-w-[200px] h-full relative flex items-center justify-center'>
                                <img src="/sabrina-2-mirrored.png" height={400} width={400} className='w-full relative h-full object-cover cursor-pointer ' alt="Nike Shope" loading='lazy' />
                            </SwiperSlide>
                        </Swiper>
                    </Link>


                </section>
            </section>

        </>
    )
}

export default Discount
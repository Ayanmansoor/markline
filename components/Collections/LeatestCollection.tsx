'use client '
import React from 'react'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoArrowUpRight } from "react-icons/go";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';


function LeatestCollection({ url }: { url: string }) {
    return (
        <section className='w-full relative flex flex-col max-h-fit    gap-4 py-10  px-3 md:px-5   '>
            <div className='w-full relative h-auto flex items-center justify-between'>
                <h2 className='w-full relative h-auto flex items-start text-h1 font-medium text-black uppercase'>new Collections</h2>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-base lg:text-lg  font-medium text-foreground flex items-center gap-1 capitalize' >{url} <GoArrowUpRight className='text-[20px] ' /> </Link>

                }
            </div>
            <section className='w-full relative h-auto  pb-10    grid   '>



                <Swiper
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        300: {
                            slidesPerView: 2,
                        },
                        499: {
                            slidesPerView: 2,
                        },
                        999: {
                            slidesPerView: 3,
                        }
                    }}
                    modules={[Pagination]}
                    className="mySwiper w-full relative h-full"
                >
                    <SwiperSlide className=' max-w-full relative h-full px-1 '>
                        <Link href={'/collection/women/mule'} className='w-full relative h-full '>
                            <video src="/advertise-one.mp4" className='w-full relative h-full object-contain object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                    
                    <SwiperSlide className='max-w-full relative h-full    px-1'>
                        <Link href={'/collection/men'}  className='w-full relative h-full '>
                            <video src="/men-product.mp4" className='w-full relative h-full object-contain object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className='max-w-full relative h-full  px-1 hidden md:block '>
                        <Link href={'/collection/women/mule'}  className='w-full relative h-full '>

                            <video src="/advertise-one.mp4" className='w-full relative h-full object-contain object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                </Swiper>

            </section>
        </section>
    )
}

export default LeatestCollection
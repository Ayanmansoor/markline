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
        <section className='w-full relative flex flex-col max-h-fit    gap-4 py-10   md:px-5  px-5 lg:px-10 xl:px-20 2xl:px-40 '>
            <div className='w-full relative h-auto flex items-center justify-between  pb-3 '>
                <h2 className='w-full relative h-auto flex items-start text-base md:text-lg lg:text-3xl font-semibold text-primary uppercase'>new Collections</h2>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-sm md:text-base lg:text-lg  font-medium text-foreground  text-[#128C7E] flex items-center gap-1 capitalize' >{url} <GoArrowUpRight className='text-[20px] ' /> </Link>

                }
            </div>
            <section className='w-full relative h-auto  pb-10    grid '>



                <Swiper
                    style={{
                            "--swiper-pagination-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                            "--swiper-pagination-bullet-inactive-opacity": "1",
                            "--swiper-pagination-bullet-size": "7px",
                            "--swiper-pagination-bullet-horizontal-gap": "6px"
                          } as React.CSSProperties & Record<string, string>}
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
                            slidesPerView: 6,
                        }
                    }}
                    modules={[Pagination]}
                    className="mySwiper w-full relative h-full"
                >
                    <SwiperSlide className=' max-w-full relative h-full px-1 '>
                        <Link href={'/collections/women'} className='w-full relative h-full '>
                            <video src="/advertise-one.mp4" className='w-full relative h-full object-contain object-bottom' poster='' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                    
                    <SwiperSlide className='max-w-full relative h-full    px-1'>
                        <Link href={'/collections/men'}  className='w-full relative h-full '>
                            <video src="/men-product.mp4" className='w-full relative h-full object-contain object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className='max-w-full relative h-full  px-1 hidden md:block '>
                        <Link href={'/collections/women'}  className='w-full relative h-full '>

                            <video src="/advertise-one.mp4" className='w-full relative h-full object-contain object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                </Swiper>

            </section>
        </section>
    )
}

export default LeatestCollection
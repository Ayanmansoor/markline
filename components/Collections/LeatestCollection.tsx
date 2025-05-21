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
        <section className='w-full relative flex flex-col  container gap-4 px-5 py-10  sm:px-10 md:px-20'>
            <div className='w-full relative h-auto flex items-center justify-between'>
                <h2 className='w-full relative h-auto flex items-start text-h1 font-medium text-black uppercase'>new Collections</h2>
                {
                    url &&
                    <Link href={`/${url}`} className=' text-base lg:text-lg  font-medium text-foreground flex items-center gap-1 capitalize' >{url} <GoArrowUpRight className='text-[20px] ' /> </Link>

                }
            </div>
            <section className='w-full relative  pb-10  max-h-[800px] h-full grid grid-cols-3  '>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                    effect='fade'
                    autoplay={{
                        delay: 2000,
                    }}
                    speed={2000}
                    loop={true}
                    modules={[Pagination, EffectFade, Autoplay]}
                    className="mySwiper w-full relative h-full "
                >
                    <SwiperSlide className='w-full relative h-full border '>
                        <Link href='/collections/mule' className='w-full h-full relative'>
                            <video src="/advertise-one.mp4" className='w-full relative h-full object-cover object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>
                </Swiper>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                    effect='fade'
                    autoplay={{
                        delay: 2000,
                    }}
                    speed={2000}
                    loop={true}
                    modules={[Pagination, EffectFade, Autoplay]}
                    className="mySwiper w-full relative h-full "
                >
                    <SwiperSlide className='w-full relative h-full border  '>
                        {/* <img src="/login-model (5).jpeg" alt="product image" height={300} width={300} className='w-full relative h-full object-cover object-bottom'  loading='lazy' /> */}
                        <Link href={"/products"}  className='w-auto h-auto'>

                        <video src="/advertise-one.mp4" className='w-full relative h-full object-cover object-bottom' autoPlay loop muted ></video>
                        </Link>

                    </SwiperSlide>

                </Swiper>
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                    effect='fade'
                    autoplay={{
                        delay: 2000,
                    }}
                    speed={2000}
                    loop={true}
                    modules={[Pagination, EffectFade, Autoplay]}
                    className="mySwiper w-full relative h-full "
                >
                    <SwiperSlide className='w-full relative h-full border  '>
                        <Link href={"/products"}  className='w-auto h-auto'>
                            {/* <img src="/login-model (5).jpeg" alt="product image" height={300} width={300} className='w-full relative h-full object-cover object-bottom'  loading='lazy' /> */}
                            <video src="/advertise-one.mp4" className='w-full relative h-full object-cover object-bottom' autoPlay loop muted ></video>
                        </Link>
                    </SwiperSlide>

                </Swiper>
            </section>
        </section>
    )
}

export default LeatestCollection
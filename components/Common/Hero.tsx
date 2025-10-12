'use client'

import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, EffectFade } from 'swiper/modules';
import { HeroData } from '@/types/interfaces';

function Hero({ bannerImages, css }: HeroData) {



    return (
        <>

            <section className={`w-full relative ${css ? css : " h-[40vh] sm:h-[100vh]"}  `}>

                <Swiper
                    modules={[Autoplay, EffectFade]}
                    loop={true}
                    effect={'fade'}
                    fadeEffect={{
                        crossFade: true,
                    }}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }} className="mySwiper h-full w-full relative bg-secondary ">

                    {
                        bannerImages.length > 0 &&
                        bannerImages?.map((images, index) => (

                            <SwiperSlide className='h-full w-full relative ' key={index}>
                                <Link href={`${images?.url}`}>
                                    <Image src={`${images?.image_url}`} loading='eager' priority={true} alt={images?.name} height={2000} width={2500} className='w-full h-full object-cover object-bottom relative ' />
                                </Link>
                            </SwiperSlide>

                        ))}



                </Swiper>
            </section>
        </>


    )
}

export default Hero
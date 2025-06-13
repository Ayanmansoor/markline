'use client'
import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { L2DataProps } from '@/types/interfaces';

function L2Banner({ data }: L2DataProps) {
    return (
        <section className='w-full relative h-[400px] bg-black mb-10  '>
            <Swiper pagination={true}
                modules={[ Autoplay]}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }} className="mySwiper h-full w-full relative bg-secondary ">
                {
                    data &&
                    data?.map((item, index) => (
                        <SwiperSlide className='h-full w-full relative ' key={index} >
                            <Link href="">
                                <Image src={item.image_url} alt={item.name} height={1500} width={1900} className='w-full h-full object-cover object-bottom relative ' />
                            </Link>
                        </SwiperSlide>

                    ))
                }




            </Swiper>
        </section>
    )
}

export default L2Banner
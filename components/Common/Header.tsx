'use client'
import React from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Autoplay } from 'swiper/modules';
function Header() {
    return (
        <section className='w-full center justify-center items-center bg-black py-1 px-3'>


            <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                direction="horizontal"
                modules={[Autoplay]}

                className="mySwiper w-full reltive h-full "
            >


                <SwiperSlide className=' w-full  h-full relative rounded-lg bg-transparent text-center   '  >
                    <span className='  text-xs md:text-sm font-medium text-white '>buy onelinr</span>
                </SwiperSlide>

            </Swiper>


        </section>
    )
}

export default Header
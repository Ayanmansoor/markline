'use client'
import React from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Autoplay } from 'swiper/modules';
function Header() {
    return (
        <section className='w-full relative bg-primary h-auto py-2 px-5 lg:px-10 flex items-center justify-between font-medium text-base'>


            <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                direction="horizontal"
                modules={[Autoplay]}

                className="mySwiper w-full reltive h-fit "
            >


                <SwiperSlide className=' max-w-fit  h-full relative rounded-lg bg-transparent text-center   '  >
                    <span className='text-xs md:text-sm font-medium text-white '>buy onelinr</span>
                </SwiperSlide>

            </Swiper>

            <ul className='text-base font-medium text-primary flex items-center justify-end  gap-5 w-full'>
                <Link href="/about" className=' text-xs md:text-sm cursor-pointer hover:underline font-medium text-white '>About</Link>
                <Link href="/makline-order-tracker" className='text-xs md:text-sm cursor-pointer hover:underline font-medium text-white '>Order Tracker</Link>
            </ul>

        </section>
    )
}

export default Header
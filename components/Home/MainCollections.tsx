import React from 'react'
import { HiChevronDown } from "react-icons/hi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import Link from 'next/link';

function Filter() {
    return (
        <section className=' w-full relative bg-secondary container  h-auto  items-center justify-center  px-2  md:px-10   xl:px-20 pt-3    '>


            <Swiper
                slidesPerView={'auto'}

                modules={[Pagination]}
                className="mySwiper w-full relative "
            >

                <SwiperSlide className='max-w-fit relative h-auto px-1 md:px-2'>
                    <Link href="/gender/MEN">
                        <img src="/forhim.png" height={500} width={500} className='w-full border relative max-h-[250px]  md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image"  loading='lazy' />
                    </Link>
                </SwiperSlide>

                <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                    <Link href="/gender/WOMEN">
                        <img src="/forher.png" height={500} width={500} className='w-full border relative  max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image" loading='lazy' />
                    </Link>
                </SwiperSlide>
                <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                    <Link href={'/gender/KIDS'}>
                        <img src="/forKids.png" height={500} width={500} className='w-full border relative  max-h-[250px]  md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image"  loading='lazy'/>
                    </Link>
                </SwiperSlide>

            </Swiper>






        </section>
    )
}

export default Filter
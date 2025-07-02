import React from 'react'
import { HiChevronDown } from "react-icons/hi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import Link from 'next/link';
import Image from 'next/image';

function Filter() {
    return (
        <>
            <section className=' w-full relative bg-secondary gap-2 container  h-auto   items-center hidden md:grid grid-cols-3 justify-center   pt-3    '>
                <Link href={'/collections/men'}>
                    <Image src={"/forhim.png"} alt="" height={500} width={500} className='w-full hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href="/collections/women">
                    <Image src={"/forher.png"} alt="Women" height={500} width={500} className='w-full   hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href={"/collections/kids"}>
                    <Image src={"/forKids.png"} alt="" height={500} width={500} className='w-full relative h-auto  hover:scale-[1.01] transition-all duration-100 object-contain' />
                </Link>
            </section>
            <section className=' w-full relative bg-secondary container  h-auto  items-center justify-center flex  md:hidden px-2  md:px-10   xl:px-20 pt-3    '>


                <Swiper
                    slidesPerView={'auto'}

                    modules={[Pagination]}
                    className="mySwiper w-full relative "
                >

                    <SwiperSlide className='max-w-fit relative h-auto px-1 md:px-2'>
                        <Link href="/gender/men">
                            <img src="/forhim.png" height={500} width={500} className='w-full border relative max-h-[250px]  md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image" loading='lazy' />
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                        <Link href="/gender/women">
                            <img src="/forher.png" height={500} width={500} className='w-full border relative  max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image" loading='lazy' />
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                        <Link href={'/gender/kids'}>
                            <img src="/forKids.png" height={500} width={500} className='w-full border relative  max-h-[250px]  md:max-h-[300px] lg:max-h-[350px] object-cover' alt="category image" loading='lazy' />
                        </Link>
                    </SwiperSlide>

                </Swiper>






            </section>
        </>
    )
}

export default Filter
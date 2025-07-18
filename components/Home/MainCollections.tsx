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
            <section className=' w-full relative bg-secondary gap-2  px-3 md:px-5 lg:px-10  h-auto   items-center hidden md:grid grid-cols-3 justify-center   pt-3    '>
                <Link href={'/collections/men'} className='w-full relative h-full group '>
                     <div className='flex flex-col gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className=' text-2xl md:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HIM
                        </h2>
                        <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>
                    </div>
                    <Image src={"/menimage.jpg"} alt="for him" height={500} width={500} className='w-full group-hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href="/collections/women" className='w-full relative h-full  group overflow-hidden'>
                    <div className='flex flex-col gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-2xl md:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HER
                        </h2>
                          <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>

                    </div>
                    <Image src={"/forwomen.png"} alt="Women" height={500} width={500} className='w-full   group-hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href={"/collections/kids"} className='relative h-full w-full group overflow-hidden'>
                         <div className='flex flex-col gap-2 items-center  z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-2xl md:text-3xl xl:text-6xl font-semibold text-white group-hover:uppercase'>
                            KIDS
                        </h2>
                        <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>

                    </div>
                    <Image src={"/kids.jpg"} alt="" height={500} width={500} className='w-full relative h-auto  group-hover:scale-[1.01] transition-all duration-100 object-contain' />
                </Link>
            </section>
            <section className=' w-full relative bg-secondary container  h-auto  items-center justify-center flex  md:hidden px-2  md:px-10   xl:px-20 pt-3    '>


                <Swiper
                    slidesPerView={'auto'}

                    modules={[Pagination]}
                    className="mySwiper w-full relative "
                >

                    <SwiperSlide className='max-w-fit relative h-auto px-1 md:px-2'>
                                      <Link href={'/collections/men'} className='w-full relative h-full group '>
                     <div className='flex flex-col gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className=' text-2xl md:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HIM
                        </h2>
                        <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>
                    </div>
                    <Image src={"/menimage.jpg"} alt="for him" height={500} width={500} className='w-full group-hover:scale-[1.01] transition-all duration-100 relative max-h-[500px] object-contain' />
                </Link>
                    </SwiperSlide>

                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                       <Link href="/collections/women" className='w-full relative h-full  group overflow-hidden'>
                    <div className='flex flex-col gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-2xl md:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HER
                        </h2>
                          <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>

                    </div>
                    <Image src={"/forwomen.png"} alt="Women" height={500} width={500} className='w-full   group-hover:scale-[1.01] transition-all duration-100 relative max-h-[500px] object-contain' />
                </Link>
                    </SwiperSlide>
                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                        <Link href={"/collections/kids"} className='relative h-full w-full group overflow-hidden'>
                         <div className='flex flex-col gap-2 items-center  z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-2xl md:text-3xl xl:text-6xl font-semibold text-white group-hover:uppercase'>
                            KIDS
                        </h2>
                        <Link href={''} className='text-xl  group-hover:underline font-medium text-white '>
                            View All
                        </Link>

                    </div>
                    <Image src={"/kids.jpg"} alt="" height={500} width={500} className='w-full relative max-h-[500px] group-hover:scale-[1.01] transition-all duration-100 object-contain' />
                </Link>
                    </SwiperSlide>

                </Swiper>






            </section>
        </>
    )
}

export default Filter
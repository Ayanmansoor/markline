'use client'
import React from 'react'
import { HiChevronDown } from "react-icons/hi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { getAllCollectionWithProducts } from '@/Supabase/SupabaseApi';


function Filter() {

    const { data: audiances = [], isLoading: audianceLoading, isError: audianceError } = useQuery<any>({
        queryKey: ["audiances"],
        queryFn: () => getAllCollectionWithProducts("MEN"),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    return (
        <>
            <section className=' w-full relative bg-secondary gap-2  px-3 md:px-5 lg:px-10  h-auto   items-center hidden md:grid grid-cols-3 justify-center   pt-12   '>
                <Link href={'/collections/men'} className='w-full relative h-full group '>
                    <div className='flex flex-col gap-1 md:gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className=' text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HIM
                        </h2>
                        <Link href={''} className=' text-xsmd:text-sm lg:text-lg  group-hover:underline font-medium text-white '>
                            View All
                        </Link>
                    </div>
                    <Image src={"/menimage.jpg"} alt="for him" height={500} width={500} className='w-full group-hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href="/collections/women" className='w-full relative h-full  group overflow-hidden'>
                    <div className='flex flex-col gap-1 md:gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                            HER
                        </h2>
                        <Link href={''} className=' text-xsmd:text-sm lg:text-lg  group-hover:underline font-medium text-white '>
                            View All
                        </Link>

                    </div>
                    <Image src={"/forwomen.png"} alt="Women" height={500} width={500} className='w-full   group-hover:scale-[1.01] transition-all duration-100 relative h-auto object-contain' />
                </Link>
                <Link href={"/collections/kids"} className='relative h-full w-full group overflow-hidden'>
                    <div className='flex flex-col gap-1 md:gap-2 items-center  z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                        <h2 className='text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white group-hover:uppercase'>
                            KIDS
                        </h2>
                        <Link href={''} className=' text-xsmd:text-sm lg:text-lg  group-hover:underline font-medium text-white '>
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
                            <div className='flex flex-col gap-1 md:gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                                <h2 className=' text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                                    HIM
                                </h2>
                                <Link href={''} className=' text-xs md:text-sm lg:text-lg  group-hover:underline font-medium text-white '>
                                    View All
                                </Link>
                            </div>
                            <Image src={"/menimage.jpg"} alt="for him" height={500} width={500} className='w-full group-hover:scale-[1.01] transition-all duration-100 relative max-h-[250px] md:max-h-[400px] lg:max-h-[500px] object-contain' />
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                        <Link href="/collections/women" className='w-full relative h-full  group overflow-hidden'>
                            <div className='flex flex-col gap-1 md:gap-2 items-center z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                                <h2 className='text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white uppercase'>
                                    HER
                                </h2>
                                <Link href={''} className=' text-xs md:text-sm lg:text-lg   group-hover:underline font-medium text-white '>
                                    View All
                                </Link>

                            </div>
                            <Image src={"/forwomen.png"} alt="Women" height={500} width={500} className='w-full   group-hover:scale-[1.01] transition-all duration-100 relative max-h-[250px] md:max-h-[400px] lg:max-h-[500px]  object-contain' />
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className='max-w-fit relative h-auto  px-1 md:px-2'>
                        <Link href={"/collections/kids"} className='relative h-full w-full group overflow-hidden'>
                            <div className='flex flex-col gap-1 md:gap-2 items-center  z-10 justify-center  absolute top-0 h-full bg-black/20 py-3 px-3 w-full '>
                                <h2 className='text-lg md:text-2xl lg:text-3xl xl:text-6xl font-semibold text-white group-hover:uppercase'>
                                    KIDS
                                </h2>
                                <Link href={''} className=' text-xs md:text-sm lg:text-lg  group-hover:underline font-medium text-white '>
                                    View All
                                </Link>

                            </div>
                            <Image src={"/kids.jpg"} alt="" height={500} width={500} className='w-full relative max-h-[250px] md:max-h-[400px] lg:max-h-[500px]  group-hover:scale-[1.01] transition-all duration-100 object-contain' />
                        </Link>
                    </SwiperSlide>

                </Swiper>






            </section>
        </>
    )
}

export default Filter
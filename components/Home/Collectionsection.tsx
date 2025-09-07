'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { CollectionCardProps, CollectionsDataProps } from '@/types/interfaces'
import { Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import CollectionCard from './CollectionCard';
import { IoMdArrowBack } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
function Collectionsection({ url, collections }: CollectionsDataProps) {
    const swiperRef = useRef<any>(null);
    return (
        <section className='w-full relative h-auto flex flex-col gap-5 '>
            <div className='w-full relative h-auto flex gap-3 justify-end'>
                <span
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="bg-gray-300 rounded-full p-2 lg:p-3 cursor-pointer hover:bg-gray-400 transition"
                >
                    <IoMdArrowBack className=" text-[15px] lg:text-[20px] text-primary" />
                </span>
                <span
                    onClick={() => swiperRef.current?.slideNext()}
                    className="bg-gray-300 rounded-full p-2 lg:p-3 cursor-pointer hover:bg-gray-400 transition"
                >
                    <IoMdArrowForward className=" text-[15px] lg:text-[20px] text-primary" />
                </span>
            </div>
            <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                direction="horizontal"
                modules={[Autoplay]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}

                className="mySwiper w-full reltive h-fit "
            >
                {
                    collections?.map((item: CollectionCardProps, index: number) => (
                        <SwiperSlide className=' max-w-[250px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[300px] xl:max-w-[300px] h-full relative rounded-lg bg-secondary border border-gray-300     ' key={index} >
                            <CollectionCard collections={item} url={url} />
                        </SwiperSlide>
                    ))
                }

            </Swiper>
        </section>

    )
}

export default Collectionsection
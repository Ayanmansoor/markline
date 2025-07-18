'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { CollectionCardProps, CollectionsDataProps } from '@/types/interfaces'
import { Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import CollectionCard from './CollectionCard';

function    Collectionsection({ url, collections }: CollectionsDataProps) {
    return (
        <Swiper
            slidesPerView={"auto"}
            direction={"horizontal"}
            speed={4000}
            loop={true}
            autoplay={{
             delay: 1000,
            }}
            modules={[Autoplay]}
            breakpoints={{
                200: {
                    slidesPerView: 1,
                },
                300: {
                    slidesPerView: 1.010,
                },
                400: {
                    slidesPerView: 1.010,
                },
                500: {
                    slidesPerView: 2,
                },
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2,
                },
                900: {
                    slidesPerView:2,
                },
                1024: {
                    slidesPerView: 2.2,
                },
                1124: {
                    slidesPerView: 2.2 ,
                },
            }}

           

            className="mySwiper w-full reltive h-fit "
        >
            {
                collections?.map((item: CollectionCardProps, index: number) => (
                    <SwiperSlide className='  w-full h-full relative bg-secondary border border-gray-300     ' key={index} >
                        <CollectionCard collections={item} url={url} />
                    </SwiperSlide>
                ))
            }

        </Swiper>
    )
}

export default Collectionsection
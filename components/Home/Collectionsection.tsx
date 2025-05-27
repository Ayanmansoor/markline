'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { CollectionCardProps, CollectionsDataProps } from '@/types/interfaces'
import { Pagination, Scrollbar } from 'swiper/modules';
import CollectionCard from './CollectionCard';

function Collectionsection({ url, collections }: CollectionsDataProps) {
    return (
        <Swiper
            slidesPerView={"auto"}
            direction={"horizontal"}
            breakpoints={{
                200: {
                    slidesPerView: 1.5,
                },
                300: {
                    slidesPerView: 1.5,
                },
                400: {
                    slidesPerView: 2,
                },
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2,
                },
                900: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2.5,
                },
                1124: {
                    slidesPerView: 3,
                },
            }}

           

            className="mySwiper w-full reltive h-fit "
        >
            {
                collections?.map((item: CollectionCardProps, index: number) => (
                    <SwiperSlide className='  w-full h-full relative bg-secondary' key={index} >
                        <CollectionCard collections={item} url={url} />
                    </SwiperSlide>
                ))
            }

        </Swiper>
    )
}

export default Collectionsection
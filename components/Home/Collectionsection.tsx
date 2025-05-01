'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { CollectionCardProps, CollectionsDataProps } from '@/types/interfaces'
import { Scrollbar } from 'swiper/modules';
import CollectionCard from './CollectionCard';

function Collectionsection({ url, collections }: CollectionsDataProps) {
    return (
        <Swiper
            slidesPerView={"auto"}
            direction={"horizontal"}
            breakpoints={{
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
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 'auto',
                },
            }}

            scrollbar={{
                hide: true,
            }}
            modules={[Scrollbar]}
            className="mySwiper w-full reltive h-auto"
        >
            {
                collections?.map((item: CollectionCardProps, index: number) => (
                    <SwiperSlide className=' max-w-[23  0px]  md:max-w-[230px] h-full relative bg-secondary' key={index} >
                        <CollectionCard collections={item} url={url} />
                    </SwiperSlide>
                ))
            }

        </Swiper>
    )
}

export default Collectionsection
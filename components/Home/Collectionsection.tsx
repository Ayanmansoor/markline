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
            spaceBetween={10}
            direction={"horizontal"}
            speed={4000}
            loop={true}
            autoplay={{
             delay: 1000,
            }}
            modules={[Autoplay]}
           

           

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
    )
}

export default Collectionsection
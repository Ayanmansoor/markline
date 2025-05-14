'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard from '../Common/ProductCard';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { trendingProductsProps } from '@/types/interfaces';

function TrendingCarousels({ data }: trendingProductsProps) {


  return (
    <section className='relative w-full h-auto bg-black  '>
      <div className='container  mx-auto reltive h-fit w-full flex flex-col gap-5   text-secondary pt-5 pb-10 px-2  md:px-10   xl:px-20'>
        <h2 className='text-h1 font-medium text-white pt-5  uppercase'> best-selling womens footwear</h2>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          grabCursor={true}

          autoplay={{
            delay: 500,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            300: {
              slidesPerView: 1.8,
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

          modules={[Pagination, Autoplay]}
          className="mySwiper w-full h-full relative py-5 "
        >
          {data?.map((item, index) => (
            <SwiperSlide className='h-auto  w-[260px]   sm:max-w-[260px] bg-slate-50 overflow-hidden relative transition-all duration-500 text-third group' key={index}>
              <ProductCard product={item.products} url='products' />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  )
}

export default TrendingCarousels
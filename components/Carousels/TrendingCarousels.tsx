'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard from '../Common/ProductCard';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { trendingProductsProps } from '@/types/interfaces';

function TrendingCarousels({ data ,productsCardCss }: trendingProductsProps) {


  return (
    <section className='relative w-full h-auto bg-black  '>
      <div className='  mx-auto reltive h-fit w-full flex flex-col gap-5   text-secondary pt-5 pb-10 px-3 md:px-5 lg:px-10 '>
        <span className='flex flex-col gap-1'>
          <h2 className='  text-base md:text-2xl lg:text-3xl font-medium text-white pt-5  uppercase'>Best-Selling Footwear  Customer Favorites at Markline</h2>
          <p className=' text-xs md:text-base font-medium text-white italic'>Explore the top-rated, most-loved shoes our customers can&apos;t stop talking about.</p>
        </span>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          grabCursor={true}

          autoplay={{
            delay: 800,
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
              slidesPerView: 4 ,
            },
          }}

          modules={[Pagination, Autoplay]}
          className="mySwiper w-full h-full relative py-5 "
        >
          {data?.map((item, index) => (
            <SwiperSlide className='    sm:max-w-[500px] h-full  bg-slate-50 overflow-hidden relative transition-all duration-500 text-third group' key={index}>
              <ProductCard product={item.products} url='product' className={productsCardCss} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  )
}

export default TrendingCarousels
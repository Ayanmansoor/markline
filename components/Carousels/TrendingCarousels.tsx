'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard from '../Common/ProductCard';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { trendingProductsProps } from '@/types/interfaces';

function TrendingCarousels({ data, productsCardCss, title, discription }: trendingProductsProps) {


  return (
    <section className='relative w-full h-auto bg-black  '>
      <div className='  mx-auto reltive h-fit w-full flex flex-col gap-5   text-secondary pt-5 pb-10 px-3 md:px-5 lg:px-10 '>
        <span className='flex flex-col gap-1'>
          <h2 className='  text-base md:text-2xl xl:text-3xl font-medium text-white pt-5  uppercase'>{title}</h2>
          <p className=' text-xs md:text-base font-medium text-white italic'></p>
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


          modules={[Pagination, Autoplay]}
          className="mySwiper w-full h-full relative py-5 "
        >
          {data?.map((item, index) => (
            <SwiperSlide className='  max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-full relative bg-secondary ' key={index}>
              <ProductCard product={item.product} url='product' className={productsCardCss} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  )
}

export default TrendingCarousels
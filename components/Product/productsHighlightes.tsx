import React, { useRef } from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';



import { Swiper, SwiperSlide } from 'swiper/react';
import { NEwProductsHighlightesDataProps } from '@/types/interfaces';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';





function ProductsHighlightes({ data, productsCardCss }: NEwProductsHighlightesDataProps) {

  const swiperRef = useRef<any>(null);

  console.log(data ,"lldsfklsdfsldf")

  return (
    <section className='w-full relative h-auto bg-secondary  '>

      <div className='w-full relative h-auto flex gap-3 justify-end'>
        <span
          onClick={() => swiperRef.current?.slidePrev()}
          className="bg-gray-300 rounded-full p-3 cursor-pointer hover:bg-gray-400 transition"
        >
          <IoMdArrowBack className="text-[20px] text-primary" />
        </span>
        <span
          onClick={() => swiperRef.current?.slideNext()}
          className="bg-gray-300 rounded-full p-3 cursor-pointer hover:bg-gray-400 transition"
        >
          <IoMdArrowForward className="text-[20px] text-primary" />
        </span>
      </div>
      <div className='  mx-auto h-auto  '>

        <Swiper
          slidesPerView={"auto"}
          direction={"horizontal"}
          spaceBetween={10}



          modules={[Autoplay, Mousewheel, Pagination]}
          className="mySwiper h-full w-full  relative"
        >

          {data?.map((item, index: number) => (
            <SwiperSlide className='  max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full relative bg-secondary ' key={index} >
              <ProductCard product={item.product  } url='product' className={productsCardCss} />
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </section>
  )
}

export default ProductsHighlightes
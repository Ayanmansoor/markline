import React, { useRef } from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';



import { Swiper, SwiperSlide } from 'swiper/react';
import { newCarouselProductProps, } from '@/types/interfaces';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';





function CarouselProduct({ url, product, css, productsCardCss }: newCarouselProductProps) {

    const swiperRef = useRef<any>(null);


    return (
        <section className='w-full relative h-auto bg-secondary  '>
            <div className='w-full relative h-auto flex gap-3 justify-end mb-3'>
                <span
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="bg-gray-300 rounded-full p-2 xl:p-3 cursor-pointer hover:bg-gray-400 transition"
                >
                    <IoMdArrowBack className=" text-[15px] xl:text-[20px] text-primary" />
                </span>
                <span
                    onClick={() => swiperRef.current?.slideNext()}
                    className="bg-gray-300 rounded-full p-2 xl:p-3 cursor-pointer hover:bg-gray-400 transition"
                >
                    <IoMdArrowForward className="text-[15px] xl:text-[20px] text-primary" />
                </span>
            </div>

            <div className='  mx-auto h-auto  '>

                <Swiper
                    slidesPerView={"auto"}
                    direction={"horizontal"}
                    spaceBetween={10}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    modules={[Autoplay, Mousewheel, Pagination]}
                    className="mySwiper h-full w-full  relative"
                >
                    {product?.map((product: any, index: number) => (
                        <SwiperSlide className={`max-w-[250px] md:max-w-[250px] lg:max-w-[300px] h-full relative bg-secondary `} key={index} >
                            <ProductCard url={url} product={product} className={productsCardCss} />
                        </SwiperSlide>
                    ))}


                </Swiper>
            </div>
        </section>
    )
}

export default CarouselProduct
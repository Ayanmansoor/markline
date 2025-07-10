import React from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';



import { Swiper, SwiperSlide } from 'swiper/react';
import { CarouselProductProps, ProductsProps } from '@/types/interfaces';





function CarouselProduct({ url, product ,css }: CarouselProductProps) {



    return (
        <section className='w-full relative h-auto bg-secondary  '>


            <div className='  mx-auto h-auto  '>

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

                    modules={[Autoplay, Mousewheel, Pagination]}
                    className="mySwiper h-full w-full  relative"
                >

                    {product?.map((product:any, index: number) => (
                        <SwiperSlide className={` ${css ? css : "w-[320px]   sm:max-w-[320px]"} h-full relative bg-secondary px-0 md:px-3`} key={index} >
                            <ProductCard  url={url} product={product} />
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </section>
    )
}

export default CarouselProduct
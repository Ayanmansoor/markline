import React from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';



import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductsHighlightesDataProps, ProductsHighlightesProps } from '@/types/interfaces';





function ProductsHighlightes({data}:ProductsHighlightesDataProps) {
   



    return (
        <section className='w-full relative h-auto bg-secondary  '>


            <div className='  mx-auto h-auto  '>

                <Swiper
                    slidesPerView={"auto"}
                    direction={"horizontal"}
                    
                    breakpoints={{
                        300: {
                          slidesPerView: 1.8,
                          spaceBetween:10
                        },
                        400: {
                          slidesPerView: 2,
                          spaceBetween:10
                        },
                        640: {
                          slidesPerView: 2,
                          spaceBetween:10
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween:10
                        },
                        1024: {
                          slidesPerView: 'auto',
                          spaceBetween:10
                        },
                      }}
                  
                    modules={[Autoplay, Mousewheel, Pagination]}
                    className="mySwiper h-full w-full  relative"
                >

                    {data?.map((item, index:number) => (
                        <SwiperSlide className='  w-[400px]   sm:max-w-[360px] h-full relative bg-secondary ' key={index} >
                            <ProductCard product={item.product} url='product' />
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </section>
    )
}

export default ProductsHighlightes
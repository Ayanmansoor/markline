import React from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';



import { Swiper, SwiperSlide } from 'swiper/react';
import { NEwProductsHighlightesDataProps, ProductsHighlightesDataProps, ProductsHighlightesProps } from '@/types/interfaces';





function ProductsHighlightes({data ,productsCardCss}:NEwProductsHighlightesDataProps) {
   



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
                          slidesPerView: 4,
                          spaceBetween:10
                        },
                      }}
                  
                    modules={[Autoplay, Mousewheel, Pagination]}
                    className="mySwiper h-full w-full  relative"
                >

                    {data?.map((item, index:number) => (
                        <SwiperSlide className='  sm:max-w-[500px] h-full relative bg-secondary ' key={index} >
                            <ProductCard product={item.product} url='product' className={productsCardCss} />
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </section>
    )
}

export default ProductsHighlightes
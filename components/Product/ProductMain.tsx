import React, { useState, useEffect } from 'react'

import Image from 'next/image';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductsDataProps, Images } from '@/types/interfaces';


function ProductMain({ product }: ProductsDataProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    const [side, setSide] = useState<'vertical' | 'horizontal'>('vertical');

    useEffect(() => {
        const handleResize = () => {
            setSide(window.innerWidth < 766 ? "horizontal" : "vertical");
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [Images, setImage] = useState<Images[]>([])

    useEffect(() => {
        const productImage = product?.image_url?.map((image: any) => JSON.parse(image))
        setImage(productImage || [])
    }, [product])


    return (
        <>
{/* md:grid  sm:grid-cols-[.2fr_1fr] */}
            {
                product?.discounts?.discount_persent &&
                <p className='text-xs font-medium text-white bg-red-500 px-1 py-[3px] absolute top-5 right-5 z-40 '>-{product?.discounts?.discount_persent}%</p>
            }
            <section className='w-full relative h-fit flex flex-col-reverse  gap-2 md:hidden'>


                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={20}
                    slidesPerView={"auto"}
                    direction={ side ? side : "vertical"}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    breakpoints={{
                        499: {
                            slidesPerView: 3,
                            spaceBetween: 10
                        },
                        700: {
                            slidesPerView: 3,
                            spaceBetween: 0
                        },
                        899: {
                            slidesPerView: 4,
                            spaceBetween: 10
                        }
                    }}
                    className="mySwiper relative  h-full w-full  "
                >

                    {
                        Images?.map((item, index) => (
                            <SwiperSlide key={index} className='max-w-fit  relative max-h-fit md:max-h-[130px]  border  overflow-hidden'>
                                <img src={`${item?.image_url}` || ""} alt={item.name} height={500} width={500} className='    max-w-[100px] md:max-w-full  max-h-[140px] lg:max-h-[140px] relative object-cover '  loading='lazy' />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    thumbs={{ swiper: thumbsSwiper }}
                    grabCursor={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2  h-full  relative w-full "
                >
                    {
                        Images?.map((item, index) => (
                            <SwiperSlide key={index} className='max-w-full   relative  max-h-fit border '>
                                <img src={`${item?.image_url}` || ""} alt={`${item.name}`} height={500} width={500} className='w-full relative grid max-h-[550px] md:max-h-[600px] lg:max-h-[700px]  object-cover sm:object-contain  sm:object-bottom '  loading='lazy' />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>
            



                    <section className='w-full relative h-auto hidden md:grid grid-cols-2 gap-3'>
                        {
                            Images.map((item,index)=>(
                                <img src={`${item?.image_url}` || ""} alt={`${item.name}`} height={400} width={400} className='w-full max-h-[600px] object-cover cursor-pointer border hover:scale-[1.01] transition-all duration-100 '  key={index}/>
                            ))
                        }
                    </section>
 
        </>
    )
}

export default ProductMain 
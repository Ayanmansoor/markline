'use client'
import React from 'react'
import { SecondHeroProps } from '@/types/interfaces'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

function SecondHero({ categoryName, data }: SecondHeroProps) {


    const firstdata = data && data[0]
    const firstsection: any = data && data[0]?.image_url?.map((image: any) => JSON.parse(image))

    const seconddata = data && data[1]
    const secondsection: any = data && data[1]?.image_url?.map((image: any) => JSON.parse(image))

    const thirddata = data && data[2]
    const thirdsection: any = data && data[2]?.image_url?.map((image: any) => JSON.parse(image))


    const fourthdata = data && data[3]
    const fourthsection: any = data && data[3]?.image_url?.map((image: any) => JSON.parse(image))

    const fivthdata = data && data[4]
    const fivthsection: any = data && data[4]?.image_url?.map((image: any) => JSON.parse(image))







    return (
        <section className='w-full h-auto bg-secondary relative'>
            <div className=' grid-cols-3 lg:grid-cols-4 md:grid hidden h-[300px] w-full  relative    sm:h-[350px] md:h-[500px]  '>
                {
                    firstdata && firstsection &&

                    <Link href={`/products/${firstdata?.slug}`} className='col-start-1  col-end-3 row-start-1 border border-[#ebeeef] row-end-3 relative   overflow-hidden'>
                        <Swiper
                            style={{
                                "--swiper-pagination-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-opacity": "1",
                                "--swiper-pagination-bullet-size": "6px",
                                "--swiper-pagination-bullet-horizontal-gap": "6px"
                            }}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full h-full "
                        >
                            {
                                firstsection.map((item: any, index: number) => (
                                    <SwiperSlide key={index} className='w-full relative h-full'>
                                        <img src={` ${item?.image_url} `} alt={`${item.name}`} className='h-full relative w-full object-contain  ' height={400} width={400} loading='lazy' />
                                    </SwiperSlide>
                                ))
                            }

                        </Swiper>
                    </Link>

                }

                {
                    seconddata && secondsection &&
                    <Link href={`/products/${seconddata?.slug}`} className=' relative border  border-[#ebeeef] overflow-hidden ' >
                        <Swiper
                            style={{
                                "--swiper-pagination-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-opacity": "1",
                                "--swiper-pagination-bullet-size": "6px",
                                "--swiper-pagination-bullet-horizontal-gap": "6px"
                            }}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full h-full "
                        >
                            {
                                secondsection?.map((item: any, index: number) => (
                                    <SwiperSlide key={index} className='w-full relative h-full'>
                                        <img src={` ${item?.image_url} `} alt={`${item?.name}`} className=' h-full relative w-full object-cover   overflow-hidden' height={400} width={400} loading='lazy' />
                                    </SwiperSlide>
                                ))
                            }


                        </Swiper>
                    </Link>
                }

                {
                    thirddata && thirddata &&
                    <Link href={`/products/${thirddata?.slug}`} className=' relative border  border-[#ebeeef] overflow-hidden ' >
                        <Swiper
                            style={{
                                "--swiper-pagination-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-color": "#0c0c0c",
                                "--swiper-pagination-bullet-inactive-opacity": "1",
                                "--swiper-pagination-bullet-size": "6px",
                                "--swiper-pagination-bullet-horizontal-gap": "6px"
                            }}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full h-full "
                        >
                            {
                                thirdsection?.map((item: any, index: number) => (
                                    <SwiperSlide key={index} className='w-full relative h-full'>
                                        <img src={` ${item?.image_url} `} alt={`${item?.name}`} className=' h-full relative w-full object-cover   overflow-hidden' height={400} width={400} loading='lazy' />
                                    </SwiperSlide>
                                ))
                            }


                        </Swiper>
                    </Link >
                }


                {
                    fourthdata && fourthsection &&
                    <Link href={`/products/${fourthsection?.slug}`} className=' hidden lg:block relative border  border-[#ebeeef] overflow-hidden ' >
                        <Swiper
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full h-full "
                        >
                            {
                                fourthsection?.map((item: any, index: number) => (
                                    <SwiperSlide key={index} className='w-full relative h-full'>
                                        <img src={` ${item?.image_url}`} alt={`${item?.name}`} className=' h-full relative w-full object-cover   overflow-hidden' height={400} width={400} loading='lazy' />
                                    </SwiperSlide>
                                ))
                            }


                        </Swiper>
                    </Link>
                }

                {
                    fivthdata && fivthsection &&
                    <Link href={`/products/${fivthsection?.slug}`} className=' hidden lg:block relative border  border-[#ebeeef] overflow-hidden ' >
                        <Swiper
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full h-full "
                        >
                            {
                                fivthsection?.map((item: any, index: number) => (
                                    <SwiperSlide key={index} className='w-full relative h-full'>
                                        <img src={` ${item?.image_url} `} alt={`${item?.name}`} className=' h-full relative w-full object-cover   overflow-hidden' height={400} width={400} loading='lazy' />

                                    </SwiperSlide>
                                ))
                            }


                        </Swiper>
                    </Link >
                }


            </div>

            <section className='w-full relative h-auto md:hidden block '>
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={10}
                    className="mySwiper w-full relative "
                >
                    {
                        data && data?.map((item: any, index: number) => (

                            <SwiperSlide className='max-w-fit h-auto relative  ' key={index}>
                                <Link href={`products/${item.slug}`} className=' max-w-[200px] md:max-w-[270px]  border  relative max-h-fit md:max-h-[450px] group flex flex-col  '>
                                    <img src={`${JSON.parse(item?.image_url[0]).image_url}`} alt={`${JSON.parse(item?.image_url[0]).name}`} height={400} loading='lazy' width={400} className='h-[200px] relative w-[200px] md:w-[270px] object-cover ' />
                                    <div className='w-full relative h-auto bg-white flex flex-col gap-1 py-3 px-2'>
                                        <h2 className='text-base font-semibold font-primary line-clamp-2  '>{item?.name}</h2>
                                        <p className='text-sm text-primary font-medium line-clamp-1 ' >{item.description}</p>
                                        <p className='w-fit relative h-auto px-5 py-1 text-white mt-1 bg-primary border-white'>Buy Now</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))
                    }


                </Swiper>
            </section>

        </section>

    )
}

export default SecondHero
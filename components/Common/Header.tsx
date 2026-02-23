'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Autoplay } from 'swiper/modules';
import { useQuery } from 'react-query';
import { getAllHeader } from '@/Supabase/SupabaseApi';
function Header() {

    const [color, setColor] = useState()



    const { data: header = [], isLoading: isHeaderLoading, isError: isHeaderError } = useQuery<any>({
        queryKey: ["header"],
        queryFn: getAllHeader,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        setColor(header?.[0]?.color)
        // console.log(header, "this is hearder", header?.[0]?.color)

    }, [header])

    return (
        <section className={`w-full center justify-center items-center py-1 px-3`}
            style={{ backgroundColor: color || "#014d01" }}>


            <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                direction="horizontal"
                modules={[Autoplay]}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}

                className="mySwiper w-full reltive h-full "
            >


                {header?.map((item: any, index: number) => {
                    return (
                        <SwiperSlide className="w-full h-full relative rounded-lg bg-transparent text-center" key={index}>
                            <Link href={`${item?.url}` || ""} className="text-xs md:text-sm font-medium text-white">
                                {item?.text}
                            </Link>
                        </SwiperSlide>
                    )
                })}


            </Swiper>


        </section>
    )
}

export default Header
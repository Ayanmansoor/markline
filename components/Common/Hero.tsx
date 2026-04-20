'use client'

import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

import { Autoplay, Pagination } from 'swiper/modules'
import { HeroData } from '@/types/interfaces'

function Hero({ bannerImages, css }: HeroData) {
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile width
    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth <= 768)
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])


    // Filter images based on device type
    let filteredBanners = (bannerImages || []).filter((banner: any) => {
        const flag = banner?.isMobile ?? banner?.is_mobile;
        return flag === isMobile;
    });

    // Fallback: If no banners match the current device type but there are banners, show them all anyway
    if (filteredBanners.length === 0 && (bannerImages || []).length > 0) {
        filteredBanners = bannerImages || [];
    }

    return (
        <section
            className={`w-full relative border-2 border-green-500 ${css ? css : 'h-[500px] sm:h-[780px]'}`}
        >
            {bannerImages && bannerImages.length > 0 && filteredBanners.length === 0 && (
                <div className="absolute top-0 left-0 bg-red-500 text-white p-2 z-[999] text-xs">
                    DEBUG: {bannerImages.length} banners found, 0 matched isMobile={String(isMobile)}
                </div>
            )}
            <Swiper
                modules={[Autoplay, Pagination]}
                loop={filteredBanners.length > 1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="mySwiper h-full w-full relative "
            >
                {filteredBanners.length > 0 ? (
                    filteredBanners.map((banner, index) => (
                        <SwiperSlide className="h-full w-full relative" key={index}>
                            <Link href={banner.url || '#'}>
                                <img
                                    src={banner.image_url}
                                    loading="eager"
                                    // unoptimized={true}
                                    // priority
                                    alt={banner.name || "Banner"}
                                    height={2000}
                                    width={2500}
                                    className="w-full h-full object-cover object-bottom "
                                />
                            </Link>
                        </SwiperSlide>
                    ))
                ) : (
                    // Fallback (if no matching banners)
                    <div className="flex flex-col items-center justify-center h-full bg-gray-200 text-gray-500 border-2 border-dashed border-gray-400">
                        <p className="font-bold">No banners available</p>
                        <p className="text-xs">Prop bannerImages length: {(bannerImages || []).length}</p>
                    </div>
                )}
            </Swiper>
        </section>
    )
}

export default Hero

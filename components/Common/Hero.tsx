'use client'

import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/pagination'

import { Autoplay, EffectFade } from 'swiper/modules'
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
    const filteredBanners = bannerImages.filter(
        (banner: any) => banner?.isMobile === isMobile
    )

    console.log(filteredBanners, 'filtered banner data')

    return (
        <section
            className={`w-full relative ${css ? css : 'h-[40vh] sm:h-[100vh]'}`}
        >
            <Swiper
                modules={[Autoplay, EffectFade]}
                loop={true}
                effect={'fade'}
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="mySwiper h-full w-full relative bg-secondary"
            >
                {filteredBanners.length > 0 ? (
                    filteredBanners.map((banner, index) => (
                        <SwiperSlide className="h-full w-full relative" key={index}>
                            <Link href={banner.url || '#'}>
                                <Image
                                    src={banner.image_url}
                                    loading="eager"
                                    priority
                                    alt={banner.name}
                                    height={2000}
                                    width={2500}
                                    className="w-full h-full object-cover object-bottom"
                                />
                            </Link>
                        </SwiperSlide>
                    ))
                ) : (
                    // Fallback (if no matching banners)
                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                        No banners available
                    </div>
                )}
            </Swiper>
        </section>
    )
}

export default Hero

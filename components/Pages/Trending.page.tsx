'use client'
import React from 'react'

import CategoriesSection from '../Common/CategoriesSection'
import Hero from '../Common/Hero'
import Discount from '../Discounts/Discount'
import GridRroduct from '../Home/GridRroduct'
import CarouselProduct from '../Product/CarouselProduct'

function TrendingPage() {
    const num = [1, 2, 4, 5, 6, 7, 6, 8]
    const data = {
        title: "Tranding Products",
        products: [
            {
                imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/308383/01/sv01/fnd/IND/fmt/png/Mercedes-AMG-Petronas-F1%C2%AE-CA-Pro-Crush-Unisex-Motorsport-Sneakers",
                name: 'tranding Product',
                id: 1,
            },
            {
                imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/308383/01/sv01/fnd/IND/fmt/png/Mercedes-AMG-Petronas-F1%C2%AE-CA-Pro-Crush-Unisex-Motorsport-Sneakers",
                name: 'tranding Product',
                id: 1,
            }
            ,
            {
                imageUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/308383/01/sv01/fnd/IND/fmt/png/Mercedes-AMG-Petronas-F1%C2%AE-CA-Pro-Crush-Unisex-Motorsport-Sneakers",
                name: 'tranding Product',
                id: 1,
            }
        ]
    }
    return (
        <section className='realtive w-full bg-secondary h-auto'>
            <Hero bannerImages={[]}  />

            <CategoriesSection title={"Top Deal On Fasion "} url='product' >
                <GridRroduct data={[]} url={'product'} />
            </CategoriesSection>

            <CategoriesSection title={"title comes here"} url="" >
                <CarouselProduct url={''} product={[]} />
            </CategoriesSection>

            {/* <ModernCarousel apiData={data} /> */}

            <Discount />

        </section>
    )
}

export default TrendingPage
'use client'
import React from 'react'

import CategoriesSection from '../Common/CategoriesSection'
import Hero from '../Common/Hero'
import Discount from '../Discounts/Discount'
import GridRroduct from '../Home/GridRroduct'
import CarouselProduct from '../Product/CarouselProduct'
import { useQuery } from 'react-query'
import { getAllCollectionBanner, getAllTrendingProducts } from '@/Supabase/SupabaseApi'
import ProductCard from '../Common/ProductCard'

function TrendingPage() {

    const { data: collectionBanner = [], isLoading: bannerloading, isError: bannererror } = useQuery({
        queryKey: ["collectionBanner"],
        queryFn: getAllCollectionBanner,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    const { data: trending, isLoading: trendingloading, isError: trendingerror } = useQuery<any>({
        queryKey: ["trendingproducts"],
        queryFn: getAllTrendingProducts,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
        
    return (
        <section className='realtive w-full bg-secondary h-auto'>
            {
                collectionBanner &&
                <Hero bannerImages={collectionBanner} css='h-[500px]' />
            }


            <section className='container sm:h-[400px] relative flex flex-col-reverse sm:grid py-5 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 sm:gap-10 md:px-10 px-3    xl:px-20'>
                <div className='w-full relative flex flex-col justify-center items-start gap-1'>

                    <h2 className='text-2xl font-semibold '>New Arrivals – Crafted for the Moment</h2>
                    <p className='text-base font-medium '>Step into the season with Markline’s latest arrivals—where modern sophistication meets timeless craftsmanship. Each new piece is designed to keep you effortlessly stylish while reflecting the unmatched quality and detail we’re known for .</p>
                </div>
                <div className='w-full relative h-full '>
                    <img src="/collectionsection.png" alt="" className='w-full relative sm:absolute  h-full object-cover ' height={400} width={400} loading='lazy' />
                </div>
            </section>


            <CategoriesSection title={"Top Deal On Fasion "} url='' >
                <div className={` w-full   h-auto grid grid-cols-2   sm:grid-cols-[repeat(auto-fill,minmax(230px,auto))]   bg-secondary   `}>
                    {trending?.map((product, index: number) => (
                        <ProductCard  url='product'  key={index} product={product.products} />
                    ))}
                </div>
            </CategoriesSection>



            <Discount />

        </section>
    )
}

export default TrendingPage
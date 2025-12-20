'use client'
import React from 'react'
import Discount from '@/components/Discounts/Discount'
import Link from 'next/link'
import CarouselProduct from '@/components/Product/CarouselProduct'
import CategoriesSection from '@/components/Common/CategoriesSection'
import { useQuery } from 'react-query'
import { getAllNewArrivalProducts, getAllProductsWithVariants } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import SecondHero from '../Common/SecondHero'
import { NewProductProps } from '@/types/interfaces'




function NewArrival() {

    const {
        data: allproducts = { data: [] },
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
    } = useQuery<{ data: NewProductProps[] }>({
        queryKey: ["products"],
        queryFn: getAllProductsWithVariants,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return (
        <>

            {/* <section className='w-full relative h-auto flex items-start bg-black  '>
                <video src="/" className='w-full relative h-[250px] md:h-[350px] lg:h-[500px] '></video>
            </section> */}

            <section className=' sm:h-[500px] px-5  lg:px-10   relative flex flex-col-reverse sm:grid py-5  lg:py-10 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 sm:gap-1 px-3 lg:px-5'>
                <div className='w-full relative h-full '>
                    <img src="/collectionsection.png" alt="" className='w-full relative sm:absolute  max-h-full object-cover ' height={500} width={400} loading='lazy' />
                </div>
                <div className='w-full relative flex flex-col justify-center items-start gap-5 px-2 md:px-5 lg:px-10'>
                    <h2 className=' text-lg lg:text-xl xl:text-2xl font-semibold'>Experience True Craftsmanship</h2>
                    <p className=' text-sm md:text-base font-medium '>Discover Markline’s exceptional collection where every piece is a testament to precision and elegance. Meticulously crafted to elevate your personal style, our designs are made for those who value artistry, detail, and distinction in every step.</p>
                </div>
            </section>


            {
                isLoadingProducts ?
                    <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  items-start justify-start gap-3 px-5  lg:px-10   ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
                    :
                    allproducts.data &&
                        allproducts.data.length > 0 ?
                        <CategoriesSection title={"New In – Fresh Picks for You"} url='' >
                            <CarouselProduct url={'product'} product={allproducts.data} css='grid-cols-2 md:grid-cols-3  lg:grid-cols-4 bg-gray-200 ' productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
                        </CategoriesSection>
                        :
                        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start justify-start gap-3 px-5  lg:px-10   ">
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />

                        </div>
            }


            <section className=' sm:h-[500px] relative flex flex-col-reverse sm:grid py-5 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 sm:gap-10 px-3 lg:px-5 '>
                <div className='w-full relative flex flex-col justify-center items-start gap-1'>
                    {/* <p className='text-[16px] font-medium text-primary'>Running</p> */}
                    <h2 className='text-lg lg:text-xl xl:text-2xl font-semibold '>New Arrivals – Crafted for the Moment</h2>
                    <p className='text-sm md:text-base font-medium '>Step into the season with Markline’s latest arrivals—where modern sophistication meets timeless craftsmanship. Each new piece is designed to keep you effortlessly stylish while reflecting the unmatched quality and detail we’re known for .</p>
                </div>
                <div className='w-full relative h-full '>
                    <img src="/collectionsection.png" alt="" className='w-full relative sm:absolute  h-full object-cover ' height={400} width={400} loading='lazy' />
                </div>
            </section>


        </>
    )
}

export default NewArrival
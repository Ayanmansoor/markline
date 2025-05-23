'use client'
import React from 'react'
import Discount from '@/components/Discounts/Discount'
import Link from 'next/link'
import CarouselProduct from '@/components/Product/CarouselProduct'
import CategoriesSection from '@/components/Common/CategoriesSection'
import { useQuery } from 'react-query'
import { getAllNewArrivalProducts } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import SecondHero from '../Common/SecondHero'




function NewArrival() {

    const { data: products = [], isLoading, isError } = useQuery<any>({
        queryKey: ["newArrivalProduct"], // Cache per collection
        queryFn: getAllNewArrivalProducts,
        staleTime: Infinity,        
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false, 
    });

  

    return (
        <>

            <section className='w-full relative h-auto flex items-start bg-black  '>
                <video src="/" className='w-full relative h-[250px] md:h-[350px] lg:h-[500px] '></video>
            </section>

            <section className='container sm:h-[350px]   relative flex flex-col-reverse sm:grid py-5  lg:py-10 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 sm:gap-1 px-3 md:px-10   xl:px-20'>
                <div className='w-full relative h-full '>
                    <img src="/collectionsection.png" alt="" className='w-full relative sm:absolute  h-full object-cover ' height={500} width={400} loading='lazy'/>
                </div>
                <div className='w-full relative flex flex-col justify-center items-start gap-1 px-2 md:px-5 lg:px-10'>
                    {/* <p className='text-[16px] font-medium text-primary'>Running</p> */}
                    <h2 className='text-2xl font-semibold'>Experience True Craftsmanship</h2>
                    <p className='text-base font-medium '>Discover Markline’s exceptional collection where every piece is a testament to precision and elegance. Meticulously crafted to elevate your personal style, our designs are made for those who value artistry, detail, and distinction in every step.</p>
                </div>

            </section>


            {
                isLoading ?
                    <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
                    :
                    products &&
                        products.length > 0 ?
                        <CategoriesSection title={"New In – Fresh Picks for You"} url='products' >
                            <CarouselProduct url={'products'} product={products} />
                        </CategoriesSection>
                        :
                        <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </div>
            }


            <section className='container sm:h-[350px] relative flex flex-col-reverse sm:grid py-5 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 sm:gap-1 md:px-10 px-3    xl:px-20'>
                <div className='w-full relative flex flex-col justify-center items-start gap-1'>
                    {/* <p className='text-[16px] font-medium text-primary'>Running</p> */}
                    <h2 className='text-2xl font-semibold '>New Arrivals – Crafted for the Moment</h2>
                    <p className='text-base font-medium '>Step into the season with Markline’s latest arrivals—where modern sophistication meets timeless craftsmanship. Each new piece is designed to keep you effortlessly stylish while reflecting the unmatched quality and detail we’re known for .</p>
                </div>
                <div className='w-full relative h-full '>
                    <img src="https://images.unsplash.com/photo-1734942416345-ed84ae363c5e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='w-full relative sm:absolute  h-full object-cover ' height={400} width={400} loading='lazy' />
                </div>
            </section>

            {
                products &&
                <CategoriesSection title={"Latest at Markline"} url="new-arrivals" >
                    <SecondHero categoryName={"Shoes"} data={products} />
                </CategoriesSection>
            }

            <Discount />
        </>
    )
}

export default NewArrival
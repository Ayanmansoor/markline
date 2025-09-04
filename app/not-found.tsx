'use client'
import React from 'react'
import Image from 'next/image'
import ProductCardSkeleton from '@/components/Skeleton/ProductCardSkeleton'
import CategoriesSection from '@/components/Common/CategoriesSection'
import CarouselProduct from '@/components/Product/CarouselProduct'
import {  getAllProductsWithVariants } from '@/Supabase/SupabaseApi'
import { useQuery } from 'react-query'
function NotFound() {

     const {
            data: allproducts = [],
            isLoading: isLoadingProducts,
            isError: isErrorProducts,
        } = useQuery<any>({
            queryKey: ["products"],
            queryFn: getAllProductsWithVariants,
            staleTime: Infinity,
            refetchOnMount: false,      
            refetchOnWindowFocus: false, 
            refetchOnReconnect: false,
        });

  return (
    <section className='w-full relative flex flex-col gap-5 '>
        <div className='w-full relative h-auto flex items-center justify-center flex-col xl:flex-row gap-5 xl:gap-1'>
            <Image src="/404-error-rafiki.svg" alt='404 page' height={400} width={400} className='max-w-[500px] max-h-[400px] object-cover relative '/>
            <h1 className='text-3xl  font-medium text-primary '>Oops Page Not Found</h1>
        </div>

      {
        isLoadingProducts ?
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 lg:px-20 ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
          :
          allproducts.length>0 ?
            <CategoriesSection title={"You May Explore This"} url={'products/women'} urltext='products' >
              <CarouselProduct url={'product'} product={allproducts.slice(0,5)}  productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
            </CategoriesSection >
            :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-20 ">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
      }

    </section>
  )
}

export default NotFound
'use client'
import React, { useState } from 'react'

import { useQuery } from 'react-query'
import { getAllCollections, getAllNewArrivalProducts, getAllProducts } from '@/Supabase/SupabaseApi'
import CategoriesSection from '../Common/CategoriesSection'
import Discount from '../Discounts/Discount'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import SecondHero from '../Common/SecondHero'
function CollcetionPage() {

  // const { data : collectionBanner, isLoading, isError } = useQuery({
  //   queryKey: ["collectionBanner"],
  //   queryFn: getCollectionBanner,
  //   staleTime: 10 * 60 * 1000, // 10 minutes (600,000 ms)
  //   cacheTime: 15 * 60 * 1000, // 15 minutes (900,000 ms)
  // });

  const { data: products, isLoading: productloading, isError: producterror } = useQuery<any>({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, // Data remains fresh for 10 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 15 minutes
  });

  const { data: collections, isLoading: collectionloading, isError: collectionerror } = useQuery<any>({
    queryKey: ["collections"],
    queryFn: getAllCollections,
    staleTime: 10 * 60 * 1000, // Data remains fresh for 10 minutes
    cacheTime: 15 * 60 * 1000, // Data stays in cache for 15 minutes
  });


  const { data: newArrivals, isLoading, isError } = useQuery<any>({
    queryKey: ["newarrivals"],
    queryFn: getAllNewArrivalProducts,
    staleTime: 10 * 60 * 1000, 
    cacheTime: 15 * 60 * 1000, 
  });





  return (
    <>

      {/* <Hero bannerImages={heroimage} /> */}
      {/* <Navdiscount /> */}

      {/* <SecondHero categoryName={"category"} /> */}


      {collections?.length ? <CategoriesSection title={"Our Collection of Elegents"} url={''} >
        <Collectionsection collections={collections} url={'collections'} />
      </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

      </div>}
      <section className='container bg-white sm:h-[350px] relative flex flex-col-reverse sm:grid py-5 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 px-3 sm:gap-1 md:px-10   xl:px-20'>
        <div className='w-full relative flex flex-col justify-center items-start gap-1'>
          <p className='text-[16px] font-medium text-primary'>Running</p>
          <h2 className='text-p20 font-medium '>Experience True Craftsmanship</h2>
          <p className='text-[16px] font-normal '>Explore our exclusive categories where every piece is a reflection of superior craftsmanship and timeless style. From elegant silhouettes to modern essentials, Markline offers collections designed to elevate your wardrobe with purpose and precision.</p>
          {/* #<Link href="" className=' w-fti transition-all duration-300 relative h-auto px-4 py-1 text-white hover:bg-white border border-transparent  hover:border-primary hover:text-primary  rounded-full bg-primary mt-2 sm:mt-5'>Buy Now</Link> */}
        </div>
        <div className='w-full relative h-full ' >
          <img src="https://images.unsplash.com/photo-1734942416345-ed84ae363c5e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='w-full relative sm:absolute  h-full object-cover ' />
        </div>

      </section>


      {/* {
        products?.length > 0 && (

          <CategoriesSection title={"Collections Products "} url={''} >
            <CarouselProduct  url='' product={products} />
          </CategoriesSection >
        )
      } */}




      {

        products?.length > 0 ? <CategoriesSection title={"Best Deals On All Products"} url={''} >
          <GridRroduct data={products} url={'products'} />
        </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

        </div>
      }



      <Discount />

      {
        newArrivals &&
        <CategoriesSection title={"Latest at Markline"} url="newarrivals" >
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      }


      {/* <CategoriesSection title={"Products"} >
        <CarouselProduct data={{ categoryName: "all" }} />
      </CategoriesSection> */}


    </>
  )
}

export default CollcetionPage
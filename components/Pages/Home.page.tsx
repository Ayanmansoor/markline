'use client'
import React from 'react'
import { useQuery } from 'react-query'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import GridRroduct from '../Home/GridRroduct'
import TrendingCarousels from '../Carousels/TrendingCarousels'
import SecondHero from '../Common/SecondHero'
import Discount from '../Discounts/Discount'
import LeatestCollection from '../Collections/LeatestCollection'
import Image from 'next/image'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import MainCollections from '../Home/MainCollections'

import {
  getAllTrendingProducts,
  getAllNewArrivalProducts,
  getAllCollectionWithProducts,
  getAllBanner,
  getAllCollectionOccuation
} from '@/Supabase/SupabaseApi'
import CarouselProduct from '../Product/CarouselProduct'

function HomePage() {


  const { data: homebanners = [], isLoading: isHomebanners } = useQuery<any>({
    queryKey: ["homebanners"],
    queryFn: getAllBanner,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })




  const { data: trendingProducts = [], isLoading: isTrendingLoading } = useQuery<any>({
    queryKey: ["trendingProducts"],
    queryFn: getAllTrendingProducts,
    staleTime: Infinity
  })

  const { data: newArrivals = [], isLoading: isNewArrivalLoading } = useQuery<any>({
    queryKey: ["newArrivals"],
    queryFn: getAllNewArrivalProducts,
    staleTime: Infinity
  })



  const { data: occasional = [] } = useQuery<any>({
    queryKey: ["occasionalcollection"],
    queryFn: () => getAllCollectionOccuation(),
    staleTime: Infinity
  })

  console.log("occational product", occasional)




  const { data: collectionWithWomenProducts = [], isLoading: collectionAlongWithLoading, isError: collectionerrorLoading } = useQuery<any>({
    queryKey: ["collectionWithMenProducts", "WOMEN"], // you can also pass the gender as part of the key
    queryFn: () => getAllCollectionWithProducts("WOMEN"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: collectionWithMenProducts = [], isLoading: collectionWithMenLoading, isError: collectionWithMenError } = useQuery<any>({
    queryKey: ["collectionWithMenProducts", "MEN"], // you can also pass the gender as part of the key
    queryFn: () => getAllCollectionWithProducts("MEN"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: collectionWithKidsProducts = [], isLoading: collectionWithKidsLoading, isError: collectionWithKidsError } = useQuery<any>({
    queryKey: ["collectionWithMenProducts", "KIDS"], // you can also pass the gender as part of the key
    queryFn: () => getAllCollectionWithProducts("KIDS"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });





  return (
    <>
      <Hero bannerImages={homebanners} />
      <MainCollections />



      {occasional?.length > 0 &&
        occasional.map((item, index) => {
          return (
            <CategoriesSection title={item.name} url={`shop-by/occasion/${item.slug}`} urltext='Explore' key={index}>
              <CarouselProduct url={'product'} product={item.product} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
            </CategoriesSection>
          )
        })
      }

      {collectionAlongWithLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : collectionWithWomenProducts?.length > 0 ? (
        collectionWithWomenProducts.slice(0, 1).map((item, index) => (
          item?.product?.length > 0 &&
          <CategoriesSection
            title={`Women’s Footwear – ${item.name}`}
            subtitle="Elegant Sandals • Chic Heels • Everyday Flats"
            url="products/women"
            urltext="Women's products"
            key={index}
          >
            <CarouselProduct url="product" product={item.product.slice(0, 10)} css=" sm:max-w-[500px]" productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )}

      {
        collectionWithMenProducts.length > 0 &&
        <section className=' h-[300px] lg:h-[400px] w-full relative '>
          <Image src={"/home-banner-for-collection.webp"} alt='women banner' height={500} width={500} className='w-full h-full object-cover ' />
        </section>
      }



      {/* MEN Products */}
      {collectionWithMenLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : collectionWithMenProducts?.length > 0 ? (
        collectionWithMenProducts.slice(0, 1).map((item, index) => (
          item?.product?.length > 0 &&
          <CategoriesSection
            title={`Men’s Footwear – ${item.name} `}
            subtitle="Sneakers • Loafers • Formal & Casual Shoes for Men"
            url="products/men"
            urltext="Men's products"
            key={index}
          >
            <CarouselProduct url="product" product={item.product.slice(0, 10)} css=" sm:max-w-[500px]" productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )}


      {
        collectionWithKidsProducts.length > 0 &&
        <section className=' h-[300px] lg:h-[400px] w-full relative '>
          <Image src={"/home-banner-for-collection.webp"} alt='women banner' height={500} width={500} className='w-full h-full object-cover ' />
        </section>
      }

      {collectionWithKidsProducts?.length > 0 ? (
        collectionWithKidsProducts.map((item, index) => (
          <CategoriesSection
            title={`Kids – ${item.name}`}
            url="products/kids"
            urltext="kid's products"
            key={index}
          >
            <CarouselProduct url="product" product={item.product.slice(0, 10)} css=" sm:max-w-[300px]" productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )}

      {/* Trending */}
      {trendingProducts?.length > 0 && (
        <TrendingCarousels title='Best-Selling Footwear  Customer Favorites at Markline' discription='Explore the top-rated, most-loved shoes our customers can&apos;t stop talking about.' data={trendingProducts} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
      )}



      <Discount
        title={'Step into the Season'}
        description={'From chic everyday picks to head-turning highlights, explore MarkLine’s most eye-catching footwear. Curated for bold fashion lovers, this section showcases the must-have designs that steal attention and define trends.'}
        url={'/products/women'}
        images={[]}
      />

      {/* New Arrivals */}
      {isNewArrivalLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10" >
          <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : newArrivals?.length > 0 && (
        <CategoriesSection title={"Step into the Season's Newest Trends"} url="new-arrivals" urltext='new-arrivals'>
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      )}

      <LeatestCollection url={'collections'} />
    </>
  )
}

export default HomePage

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
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import {
  getAllTrendingProducts,
  getAllNewArrivalProducts,
  getAllCollectionWithProducts,
  getAllBanner,
  getAllCollectionOccuation,
  getAllCollections,
  fetchGroupOfProducts
} from '@/Supabase/SupabaseApi'
import CarouselProduct from '../Product/CarouselProduct'
import MiniCollectionCard from '../Home/MiniCellectionCard'
import KeyMatric from '../Common/KeyMatric'
import { newProductsProps } from '@/types/interfaces'

function HomePage() {


  const { data: homebanners = [], isLoading: isHomebanners } = useQuery<any>({
    queryKey: ["homebanners"],
    queryFn: getAllBanner,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })




  // const { data: trendingProducts = [], isLoading: isTrendingLoading } = useQuery<any>({
  //   queryKey: ["trendingProducts"],
  //   queryFn: getAllTrendingProducts,
  //   staleTime: Infinity
  // })

  // const { data: newArrivals = [], isLoading: isNewArrivalLoading } = useQuery<any>({
  //   queryKey: ["newArrivals"],
  //   queryFn: getAllNewArrivalProducts,
  //   staleTime: Infinity
  // })







  const { data: allcollection = { data: [] }, isLoading: allCollectionLoading, isError: allCollectionError } = useQuery<{ data: any[] }>({
    queryKey: ["allcollection"],
    queryFn: () => getAllCollections("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const { data: groupOfProducts = { data: [] }, isLoading: isLoading, isError: iserror } = useQuery<{ data: newProductsProps[] }>({
    queryKey: ["groupOfProducts"],
    queryFn: () => fetchGroupOfProducts(),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });





  return (
    <>
      <Hero bannerImages={homebanners} />

      <KeyMatric />


      <section className='w-full relative flex-col  gap-5 lg:gap-10 items-start px-3 md:px-5 lg:px-10  mt-8  h-auto flex  pb-3  '>
        <h1 className=' text-lg md:text-2xl xl:text-3xl font-meidum text-primary '>Shop By Collections</h1>
        <Swiper
          slidesPerView={'auto'}
          className="mySwiper w-full  relative h-auto  "
        >
          {
            allcollection?.data.length > 0 &&
            allcollection?.data?.map((collec) => (
              <SwiperSlide className='max-w-fit  border h-auto text-base   ' key={collec.slug}>
                <MiniCollectionCard collections={collec} url={`collections/`} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </section>

      <MainCollections />



      {/* {occasional?.length > 0 &&
        occasional.map((item, index) => {
          return (
            <CategoriesSection title={item.name} url={`shop-by/occasion/${item.slug}`} urltext='Explore' key={index}>
              <CarouselProduct url={'product'} product={item.product} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
            </CategoriesSection>
          )
        })
      } */}

      {/* {collectionAlongWithLoading ? (
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
            <CarouselProduct url="product" product={item.product.slice(0, 10)} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )} */}





      {isLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : groupOfProducts?.data?.length > 0 ? (
        groupOfProducts?.data?.slice(0, 2)?.map((item: any, index: number) => (
          item.products?.length > 0 &&
          <CategoriesSection
            title={`${item?.heading} `}
            subtitle={`${item?.discription}`}
            url={`${item?.url}`}
            urltext={`${item?.urlText}`}
            key={index}
          >
            <CarouselProduct url="product" product={item.products.slice(0, 10)} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )}


      {isLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : groupOfProducts?.data?.length > 0 ? (
        groupOfProducts?.data?.slice(2, 4)?.map((item: any, index: number) => (
          item.products?.length > 0 &&
          <CategoriesSection
            title={`${item?.heading} `}
            subtitle={`${item?.discription}`}
            url={`${item?.url}`}
            urltext={`${item?.urlText}`}
            key={index}
          >
            <CarouselProduct url="product" product={item.products.slice(0, 10)} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
          </CategoriesSection>
        ))
      ) : (
        <></>
      )}



      {/* Trending */}
      {/* {trendingProducts?.length > 0 && (
        <TrendingCarousels title='Best-Selling Footwear  Customer Favorites at Markline' discription='Explore the top-rated, most-loved shoes our customers can&apos;t stop talking about.' data={trendingProducts} productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
      )} */}



      <Discount
        title={'Step into the Season'}
        description={'From chic everyday picks to head-turning highlights, explore MarkLine’s most eye-catching footwear. Curated for bold fashion lovers, this section showcases the must-have designs that steal attention and define trends.'}
        url={'/products/women'}
        images={[]}
      />

      {/* New Arrivals */}
      {/* {isNewArrivalLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10" >
          <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : newArrivals?.length > 0 && (
        <CategoriesSection title={"Step into the Season's Newest Trends"} url="new-arrivals" urltext='new-arrivals'>
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      )} */}

      <LeatestCollection url={'collections'} />
    </>
  )
}

export default HomePage

'use client'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import Discount from '../Discounts/Discount'
import LeatestCollection from '../Collections/LeatestCollection'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import MainCollections from '../Home/MainCollections'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import {
  getAllBanner,
  getAllCollections,
  fetchGroupOfProducts
} from '@/Supabase/SupabaseApi'
import CarouselProduct from '../Product/CarouselProduct'
import MiniCollectionCard from '../Home/MiniCellectionCard'
import KeyMatric from '../Common/KeyMatric'
import { newProductsProps } from '@/types/interfaces'
import CollectionCard from '../Home/CollectionCard'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';




function HomePage() {

  const [selected, setSelected] = useState("women")

  const handleSelect = (option: string) => {
    setSelected(option)
  }


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
    queryFn: () => fetchGroupOfProducts("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });



  console.log(groupOfProducts, "this is gruop of product")

  return (
    <>



      <section className='w-full   relative gap-2 items-center px-3 md:px-5 lg:px-10   py-3  h-auto  flex lg:hidden border-b border-gray-400   '>

        <Swiper
          slidesPerView={'auto'}
          spaceBetween={12}

          className="mySwiper w-full  relative  "
        >

          <SwiperSlide className='max-w-fit  border h-auto text-base border-black  rounded-full overflow-hidden ' >
            <Link href={'/collections/men'}>
              <img src="/block-heel-mules-for-women-5.jpeg" alt="Men collection" height={200} width={200} className='max-h-[70px] max-w-[70px]  border border-gray-100' />
            </Link>

          </SwiperSlide>

          <SwiperSlide className='max-w-fit  border h-auto text-base border-black  rounded-full overflow-hidden ' >
            <Link href={'/collections/women'}>
              <img src="/court-vision.png" alt="Men collection" height={200} width={200} className='max-h-[70px] max-w-[70px]  border border-gray-100' />
            </Link>
          </SwiperSlide>
          <SwiperSlide className='max-w-fit  border h-auto text-base border-black  rounded-full overflow-hidden ' >
            <Link href={'/collections/kids'}>
              <img src="/court-vision.png" alt="kids collection" height={200} width={200} className='max-h-[70px] max-w-[70px] rounded-full border border-gray-100' />
            </Link>
          </SwiperSlide>
          <SwiperSlide className='max-w-fit  border h-auto text-base border-black  rounded-full overflow-hidden ' >
            <Link href={'/collections/best-seller'}>
              <img src="/court-vision.png" alt=" markline best seller" height={200} width={200} className='max-h-[70px] max-w-[70px] rounded-full border border-gray-100' />
            </Link>
          </SwiperSlide>


        </Swiper>
      </section >


      <Hero bannerImages={homebanners} />

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


      <section className='w-full  relative flex-col gap-5  2xl:gap-10 items-start px-3 md:px-5 lg:px-10 mt-7 lg:mt-10 h-auto flex pb-3'>
        <h1 className='text-lg md:text-2xl xl:text-3xl font-semibold text-primary'>
          Shop By Collections
        </h1>

        <div className='flex self-center justify-self-center rounded-md w-fit gap-2 items-center justify-center relative'>
          {["women", "men", "kids"].map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={` px-4 md:px-4 py-1 lg:px-8 lg:py-2 rounded-full border-2 font-medium transition-all ${selected === option
                ? "bg-foreground text-background border-foreground"
                : "border-foreground text-foreground hover:bg-muted"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        <section className='w-full relative h-auto gap-3 md:gap-5 xl:gap-5 2xl:gap-5 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {allcollection?.data?.length > 0 ? (
            allcollection.data
              .filter((col) => col?.gender?.toLowerCase() === selected.toLowerCase()).slice(0, 6)
              .map((collec, index) => (
                <CollectionCard
                  key={collec.id || index}
                  collections={collec}
                  url='collections/'
                  imageClass='    md:h-[280px] lg:h-[300px] xl:h-[380px] w-full border object-cover relative rounded-md transition-all duration-100'
                  className='relative h-auto xl:h-[400px] w-full rounded-md bg-gray-200 cursor-pointer group flex flex-col items-start justify-center gap-4 p-1 md:p-3'
                />
              ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
              Loading collections...
            </div>
          )}

          {/* Fallback if selected tab has no results */}
          {allcollection?.data?.filter(
            (col) => col?.gender?.toLowerCase() === selected.toLowerCase()
          ).length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No collections found for <strong>{selected}</strong>.
              </div>
            )}


        </section>
        <Link href={"/collections"} className=' text-xs md:text-base px-3 md:px-5  py-1 lg:py-3 rounded-full self-center justify-self-center relative font-medium text-white flex items-center justify-center gap-2 bg-primary cursor-pointer'>View  <ArrowUpRight className='text-white  text-[10px] md:text-[20px]' /></Link>

      </section>
      <MainCollections />



      {
        isLoading ? (
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
              <CarouselProduct url="product" product={item.products.slice(0, 10)} productsCardCss=' h-[200px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' />
            </CategoriesSection>
          ))
        ) : (
          <></>
        )
      }

      <KeyMatric />

      {
        isLoading ? (
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
        )
      }



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

'use client'
import React from 'react'
import { useQuery } from 'react-query'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import TrendingCarousels from '../Carousels/TrendingCarousels'
import SecondHero from '../Common/SecondHero'
import Discount from '../Discounts/Discount'
import LeatestCollection from '../Collections/LeatestCollection'
import Image from 'next/image'
import Link from 'next/link'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import ProductsHighlightes from '../Product/productsHighlightes'
import MainCollections from '../Home/MainCollections'
import { CollectionCardProps, NewProductProps } from '@/types/interfaces'

import {
  getAllCollections,
  getAllProductsWithVariants,
  getAllTrendingProducts,
  getAllNewArrivalProducts,
  getAllNewCollections,
  getHighlighteProducts,
  getAllCollectionWithProducts
} from '@/Supabase/SupabaseApi'

const homebanners = [
  {
    image_url: "/banner-ballerina-with-oxford-shoe.png",
    url: "collections/women/ballerinas",
    id: 0,
    name: "",
    gender: ""
  },
  {
    image_url: "/home-banner-for-collection.webp",
    url: "/collections/women",
    id: 0,
    name: "",
    gender: ""
  }
]

function HomePage() {
  // --- Queries ---
  // const { data: collections = [], isLoading: isCollectionsLoading } = useQuery<CollectionCardProps[]>({
  //   queryKey: ["allCollections"],
  //   queryFn: getAllCollections,
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false
  // })



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

  // const { data: newCollection = [] } = useQuery<any>({
  //   queryKey: ["newCollections"],
  //   queryFn: getAllNewCollections,
  //   staleTime: Infinity
  // })

  const { data: casuals = [] } = useQuery<any>({
    queryKey: ["casualsHighlights"],
    queryFn: () => getHighlighteProducts("casuals"),
    staleTime: Infinity
  })

  const { data: wedding = [] } = useQuery<any>({
    queryKey: ["weddingHighlights"],
    queryFn: () => getHighlighteProducts("wedding"),
    staleTime: Infinity
  })


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
    
      {/* WOMEN Products */}
      {collectionAlongWithLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 gap-3 px-5 lg:px-10">
          <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
        </div>
      ) : (
        collectionWithWomenProducts.slice(0, 1).map((item,index)=>(
        <CategoriesSection
          title={`Women’s Footwear – ${item.name}`}
          subtitle='Elegant Sandals • Chic Heels • Everyday Flats'
          url="products/women"
          urltext="Women's products"
          key={index}
        >
          <GridRroduct
            data={item.product?.slice(0, 10)}
            url={'product'}
            css='grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            productsCardCss={"h-[200px] sm:h-[350px] md:h-[400px] lg:h-[350px] xl:h-[350px] 2xl:h-[450px]"}
          />
        </CategoriesSection>
        ))
      )}

      <section className=' h-[300px] lg:h-[400px] w-full relative '>
        <Image src={"/home-banner-for-collection.webp"} alt='women banner' height={500} width={500}  className='w-full h-full object-cover '/>

      </section>

      {/* MEN Products */}
      {collectionWithMenLoading ? (
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-5 lg:px-10" >
          <ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton /><ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : (

        collectionWithMenProducts.slice(0,1).map((item,index)=>(
        <CategoriesSection
          title={"Men’s Footwear – Stylish, Comfortable & Durable"}
          subtitle='Sneakers • Loafers • Formal & Casual Shoes for Men'
          url="products/men"
          urltext="Men's products"
          key={index}
        >
          <GridRroduct
            data={item.product?.slice(0, 10)}
            url={'product'}
            css='grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            productsCardCss={"h-[200px] sm:h-[350px] md:h-[400px] lg:h-[350px] xl:h-[350px] 2xl:h-[450px]"}
          />
        </CategoriesSection>
        ))
      )}

      
      <section className=' h-[300px] lg:h-[400px] w-full relative '>
        <Image src={"/home-banner-for-collection.webp"} alt='women banner' height={500} width={500}  className='w-full h-full object-cover '/>

      </section>

      {/* Kids Section */}
      {collectionWithKidsProducts.length > 0 && (
        collectionWithKidsProducts.map((item,index)=>(
        <CategoriesSection title={"Kids – Comfort Meets Style"} url="products/kids" urltext="kid's products" key={index}>
          <GridRroduct
            data={item.product}
            url={'product'}
            css='grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            productsCardCss={"h-[200px] sm:h-[350px] md:h-[400px] lg:h-[350px] xl:h-[350px] 2xl:h-[450px]"}
          />
        </CategoriesSection>
        ))
      )}

      {/* Trending */}
      {trendingProducts?.length > 0 && (
        <TrendingCarousels data={trendingProducts} productsCardCss={"h-[200px] sm:h-[350px] md:h-[400px] lg:h-[350px] xl:h-[350px] 2xl:h-[450px]"} />
      )}

      {/* Casual Highlights */}
      {casuals?.length > 0 && (
        <CategoriesSection title={"Everyday Essentials Women's Casual Footwear"}  url={''}>
          <ProductsHighlightes data={casuals} productsCardCss={"h-[280px] sm:h-[300px] md:h-[280px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
        </CategoriesSection>
      )}

      {/* Wedding Highlights */}
      {wedding?.length > 0 && (
        <CategoriesSection title={"Markline Collections Products"} url=''>
          <ProductsHighlightes data={wedding} productsCardCss={"h-[280px] sm:h-[300px] md:h-[280px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
        </CategoriesSection>
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

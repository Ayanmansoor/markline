'use client'
import React, { useEffect, useState } from 'react'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import TrendingCarousels from '../Carousels/TrendingCarousels'
import SecondHero from '../Common/SecondHero'
import Discount from '../Discounts/Discount'
import LeatestCollection from '../Collections/LeatestCollection'
import Image from 'next/image'


import axios from 'axios'
import { useQuery } from 'react-query'
import { getAllBanner, getAllCollections, getAllProducts, getAllTrendingProducts, getAllNewArrivalProducts, getAllNewCollections, getHighlighteProducts } from '@/Supabase/SupabaseApi'
import MainCollections from '../Home/MainCollections'
import CarouselProduct from '../Product/CarouselProduct'
import ProductsHighlightes from '../Product/productsHighlightes'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import Link from 'next/link'
import { CollectionCardProps, ProductsProps } from '@/types/interfaces'
import Subcribes from '../Common/Subcribes '

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

  const [currentproducts, setCurrentProducts] = useState<ProductsProps[]>([])
  const [collections, setCollections] = useState<CollectionCardProps[]>([])
  const [trendingProducts, setTrendingProducts] = useState<any>()
  const [HomeBanner, sethomeBanner] = useState<any>()
  const [newArrivals, setNewarrival] = useState<any>()
  const [newCollection, setNewCollection] = useState<any>()
  const [casuals, setCasuals] = useState<any>()
  const [wedding, setWedding] = useState<any>()




  async function fetchData() {
    try {
      const results: PromiseSettledResult<any>[] = await Promise.allSettled([
        // getAllBanner(),
        getAllCollections(),
        getAllProducts(),
        getAllTrendingProducts(),
        getAllNewArrivalProducts(),
        getAllNewCollections(),
        getHighlighteProducts("casuals"),
        getHighlighteProducts("wedding")
      ]).catch((error: any) => {
        console.log(error);
        return [];
      });

      // Extract results safely
      // const homebannervalue: any[] = results[0]?.status === "fulfilled" ? results[0].value : [];
      const collectionsvalue: any[] = results[0]?.status === "fulfilled" ? results[0].value : [];
      const productsvalue: any[] = results[1]?.status === "fulfilled" ? results[1].value : [];
      const trendingsvalue: any[] = results[2]?.status === "fulfilled" ? results[2].value : [];
      const newArrivalvalue: any[] = results[3]?.status === "fulfilled" ? results[3].value : [];
      const newCollectionvalue: any[] = results[4]?.status === "fulfilled" ? results[4].value : [];
      const casualsHighlightes: any[] = results[5]?.status === "fulfilled" ? results[5].value : [];
      const weddingHighlightes: any[] = results[6]?.status === "fulfilled" ? results[6].value : [];

      // Set state safely without breaking the app if one fails
      setCurrentProducts([...productsvalue]);
      setCollections([...collectionsvalue]);
      setTrendingProducts([...trendingsvalue]);
      // sethomeBanner([...homebannervalue]);
      setNewarrival([...newArrivalvalue]);
      setNewCollection([...newCollectionvalue]);
      setCasuals([...casualsHighlightes])
      setWedding([...weddingHighlightes])


    } catch (error: any) {
      console.error("Unexpected error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>
      <Hero bannerImages={homebanners} />


      <section className='w-full relative bg-secondary  '>
        <h1 className='  text-base md:text-2xl lg:text-3xl font-medium px-3 md:px-5 lg:px-10      mx-auto pt-10 bg-secondary uppercase'>Find the Perfect Fit Footwear for Men, Women & Kids</h1>
      </section>

      <MainCollections />

      {

        currentproducts?.length > 0 ?
          <CategoriesSection title={"Women's Footwear Collections – Sandals, Flats, Heels & More"} subtitle='' url="collections" urltext='collections'>
            <Collectionsection collections={collections.filter((item) => item.gender == 'WOMEN')} url={'collections/women'} />
          </CategoriesSection>
          :
          <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container  ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
      }

      {
// sm:grid-cols-[repeat(auto-fill,minmax(230px,auto))]  lg:grid-cols-[repeat(auto-fill,minmax(360px,auto))]
        currentproducts?.length > 0 ?
          <CategoriesSection title={" Women’s Footwear – Stylish, Comfortable & On-Trend"} subtitle='Elegant Sandals • Chic Heels • Everyday Flats' url="products/women" urltext="Women's products">
            <GridRroduct data={currentproducts?.slice(0, 10).filter((item) => item.gender == 'WOMEN')} url={'product'} css='  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'   productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
          </CategoriesSection>
          :
          <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
      }

      {
        currentproducts?.length > 0 ?
          <CategoriesSection title={" Men’s Footwear – Stylish, Comfortable & Durable"} subtitle='Sneakers • Loafers • Formal & Casual Shoes for Men' url="products/men" urltext="Men's products">
            <GridRroduct data={currentproducts?.slice(0, 10).filter((item) => item.gender == 'MEN')} url={'product'} css='  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
          </CategoriesSection>
          :
          <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
      }


      {
        currentproducts?.slice(0, 10).filter((item) => item.gender == 'KIDS').length > 0 &&
        <CategoriesSection title={" Kids – Comfort Meets Style"} url="products/kids" urltext="kid's products">
          <GridRroduct data={currentproducts?.slice(0, 10).filter((item) => item.gender == 'KIDS')} url={'product'} css='  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
        </CategoriesSection>
      } 



      {
        trendingProducts?.length &&
        <TrendingCarousels data={trendingProducts} productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
      }

      {
        casuals?.length > 0 &&
        <CategoriesSection title={"Everyday Essentials  Women's Casual Footwear "} url={''} >
          <ProductsHighlightes data={casuals}  productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"}/>
        </CategoriesSection >
      }

      <section className='w-full relative py-5 md:py-10      h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1  '>
        <Link href='/collections/women/wedding-specials' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/markline-fashion.png" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative  object-cover ' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-1 md:gap-3'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Bride</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline  font-medium text-white'>Women</p>
            </span>
          </div>
        </Link>
        <Link href='/collections/men/men-loafer' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/marklineman.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative  object-cover ' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-1 md:gap-3'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Groom</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-center font-medium text-white'>Man</p>
            </span>
          </div>
        </Link>
        <Link href='/collections/men/men-loafer' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/marklineman.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-1 md:gap-3'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Groom</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-center font-medium text-white'>Man</p>
            </span>
          </div>
        </Link>
      </section>


      {
        wedding?.length > 0 &&
        <CategoriesSection title={"Markline  Collections Products"} url={''} >
          <ProductsHighlightes data={wedding} productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[350px] 2xl:h-[450px]"} />
        </CategoriesSection >

      }


      <Discount title={' Step into the Season'} description={'From chic everyday picks to head-turning highlights, explore MarkLine’s most eye-catching footwear. Curated for bold fashion lovers, this section showcases the must-have designs that steal attention and define trends.'} url={'/products/women'} images={[]} />
      {/* 
      <section className='w-full relative h-auto flex '>

     <section className='w-full relative py-5 md:py-10 container px-5 md:px-10 lg:px-20 h-auto grid grid-cols-2 gap-1'>
        <Link href='/collections/wedding-specials' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/markline-fashion.png" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Wedding</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-end font-medium text-white'>Women</p>
            </span>
          </div>
        </Link>
       <Link href='/men' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/marklineman.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Wedding</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-end font-medium text-white'>Man</p>
            </span>
          </div>
        </Link>
      </section>

</section> */}

      {
        newArrivals?.length > 0 &&
        <CategoriesSection title={"Step into the Season's Newest Trends"} url="new-arrivals" urltext='new-arrivals' >
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      }




      <LeatestCollection url={'collections'} />





    </>
  )
}

export default HomePage
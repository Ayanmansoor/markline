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

const homebanners = [
  {
    image_url: "/homebanner2.webp",
    url: "/products",
    id: 0,
    name: "",
    slug: ""
  },
  {
    image_url: "/homebnaner.webp",
    url: "collections",
    id: 0,
    name: "",
    slug: ""
  }
]

function HomePage() {

  const [currentproducts, setCurrentProducts] = useState<any>()
  const [collections, setCollections] = useState<any>()
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
        <h1 className='text-h1 font-medium container     px-2  md:px-10   xl:px-20  mx-auto pt-10 bg-secondary uppercase'>Find the Perfect Fit – For Him, Her & Kids </h1>
      </section>

      <MainCollections />

      {

        currentproducts?.length > 0 ?
          <CategoriesSection title={"Women's footwear collections"} url="collections">
            <Collectionsection collections={collections} url={'collections'} />
          </CategoriesSection>
          :
          <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 xl:px-20 ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
      }

      {

        currentproducts?.length > 0 ?
          <CategoriesSection title={"women's footwear "} url="products">
            <GridRroduct data={currentproducts?.slice(0, 10)} url={'products'} />
          </CategoriesSection>
          :
          <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 xl:px-20  ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
      }

      {
        trendingProducts?.length &&
        <TrendingCarousels data={trendingProducts} />
      }

      {
        casuals?.length > 0 &&
        <CategoriesSection title={"Everyday Essentials  Women's Casual Footwear "} url={''} >
          <ProductsHighlightes data={casuals} />
        </CategoriesSection >
      }

      <section className='w-full relative py-5 md:py-10  container   px-5 md:px-10 lg:px-20 h-auto grid grid-cols-2 gap-1'>
        <Link href='/collections/wedding-specials' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/markline-fashion.png" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Bride</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-end font-medium text-white'>Women</p>
            </span>
          </div>
        </Link>
       <Link href='/men' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/marklineman.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col'>
              <h2 className=' text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-white'>For Groom</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-end font-medium text-white'>Man</p>
            </span>
          </div>
        </Link>
      </section>


      {
        wedding?.length > 0 &&
        <CategoriesSection title={"Markline  Collections Products "} url={''} >
          <ProductsHighlightes data={wedding} />
        </CategoriesSection >

      }


      <Discount />
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
        <CategoriesSection title={"Step into the Season's Newest Trends"} url="new-arrivals" >
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      }




      <LeatestCollection url={'collection'} />






    </>
  )
}

export default HomePage
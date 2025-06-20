'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useQuery } from 'react-query'
import { getAllCollections, getAllNewArrivalProducts, getAllProducts, getAllCollectionBanner, getCollectionBannerBaseOnGender } from '@/Supabase/SupabaseApi'
import CategoriesSection from '../Common/CategoriesSection'
import Discount from '../Discounts/Discount'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import SecondHero from '../Common/SecondHero'
import { useWishlists } from '@/Contexts/wishlist'
import WihlistCardSection from '../Product/WihlistCardSection'
import Hero from '../Common/Hero'
function CollcetionPage() {

  const { wishlist } = useWishlists()

  const { data: collectionBanner = [], isLoading: bannerloading, isError: bannererror } = useQuery({
    queryKey: ["collectionBanner"],
    queryFn: getAllCollectionBanner,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: products, isLoading: productloading, isError: producterror } = useQuery<any>({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: collections, isLoading: collectionloading, isError: collectionerror } = useQuery<any>({
    queryKey: ["collections"],
    queryFn: getAllCollections,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const { data: newArrivals, isLoading, isError } = useQuery<any>({
    queryKey: ["newarrivals"],
    queryFn: getAllNewArrivalProducts,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });




  return (
    <>
      {
        collectionBanner &&
        <Hero bannerImages={collectionBanner} css='h-[500px]' />
      }


      {collections?.length ? <CategoriesSection title={"Women's Footwear Collections – Sandals, Flats, Heels & More"} subtitle='Discover elegant sandals, comfy flats, chic heels & stylish mules' url={''} >
        <Collectionsection collections={collections.filter((item) => item.gender == 'WOMEN')} url={'collections/women'} />
      </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

      </div>}
      <section className='bg-white py-10'>
        <div className='  container sm:h-[350px] relative flex flex-col-reverse sm:grid py-5  lg:py-10 grid-cols-1 sm:grid-cols-[1fr_1fr]  gap-3 px-3 sm:gap-1 md:px-10   xl:px-20'>
          <div className='w-full relative flex flex-col justify-center items-start gap-1'>
            <p className='text-base font-medium text-primary'>Running</p>
            <h2 className='text-2xl font-semibold '>Experience True Craftsmanship</h2>
            <p className='text-base font-medium '>Explore our exclusive categories where every piece is a reflection of superior craftsmanship and timeless style. From elegant silhouettes to modern essentials, Markline offers collections designed to elevate your wardrobe with purpose and precision.</p>
            {/* #<Link href="" className=' w-fti transition-all duration-300 relative h-auto px-4 py-1 text-white hover:bg-white border border-transparent  hover:border-primary hover:text-primary  rounded-full bg-primary mt-2 sm:mt-5'>Buy Now</Link> */}
          </div>
          <div className='w-full relative h-full ' >
            <img src="/collectionsection.png" alt="" className='w-full relative sm:absolute  h-full object-cover ' height={500} width={400} loading='lazy' />
          </div>

        </div>
      </section>






      {

        products?.length > 0 ? <CategoriesSection title={"Shop Women's Favorites"} subtitle='Uncover standout styles handpicked for women—elegant, comfortable, and always in fashion.' url={''} >
          <GridRroduct data={products.filter((product) => product.gender == 'WOMEN')} url={'product'} css='sm:grid-cols-[repeat(auto-fill,minmax(250px,auto))] ' />
        </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

        </div>
      }

      <section className='w-full relative py-5 md:py-10  container   px-5 md:px-10 lg:px-20 h-auto grid grid-cols-2 md:grid-cols-3 gap-1'>
        <Link href='/collections/men' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/men-collection.jpeg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-3'>
              <h2 className=' text-base sm:text-xl md:text-xl lg:text-[40px] font-medium text-white'>MEN&apos;S</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-center font-medium text-white'></p>

            </span>
          </div>
        </Link>
        <Link href='/collections/women' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/women-collection.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-2'>
              <h2 className=' text-base sm:text-xl md:text-xl lg:text-[40px] font-medium text-white'>WOMEN&apos;S</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-center font-medium text-white'></p>
            </span>
          </div>
        </Link>
        <Link href='/collections/kids' className='w-full relative h-auto flex group overflow-hidden '>
          <Image src="/kids-collection.jpg" alt='wedding ready women collection ' height={400} width={500} className='border group-hover:scale-[1.01] duration-75 transition-all ease-in-out  w-full relative h-full' />
          <div className='flex flex-col items-center justify-center bg-black/30 gap-1 h-full w-full absolute z-20 '>
            <span className='w-fit relative h-auto flex flex-col items-center gap-2'>
              <h2 className=' text-base sm:text-xl md:text-xl lg:text-[40px] font-medium text-white'>KID&apos;S</h2>
              <p className=' text-xs sm:text-sm md:text-base   lg:text-lg underline self-center font-medium text-white'></p>
            </span>
          </div>
        </Link>
      </section>


      {collections?.length ? <CategoriesSection title={"Crafted for the Modern Gentleman"} subtitle='Discover Markline’s timeless collection of men’s footwear — combining style, comfort, and unmatched craftsmanship for every occasion.' url={''} >
        <Collectionsection collections={collections.filter((item) => item.gender == 'MEN')} url={'collections/men'} />
      </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

      </div>}
      {
        products?.length > 0 ? <CategoriesSection title={"Finely Crafted Footwear for the Modern Gentleman"} url={''} subtitle="Explore our premium selection of men's shoes—from polished oxfords and sleek loafers to rugged boots and smart sneakers—designed to elevate every step with timeless sophistication." >
          <GridRroduct data={products.filter((product) => product.gender == 'MEN')} url={'product'} css='sm:grid-cols-[repeat(auto-fill,minmax(250px,auto))] ' />
        </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">
        </div>
      }



      {collections?.filter((item) => item.gender == 'KIDS')?.length ? <CategoriesSection title={"Kids Footwear Collection for Comfort & Style"} subtitle='From playful sneakers and durable school shoes to cute sandals and fun slip-ons, Markline’s kids collection blends comfort and vibrant design, trusted by parents for every big and small step.' url={''} >
        <Collectionsection collections={collections.filter((item) => item.gender == 'KIDS')} url={'collections'} />
      </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">

      </div>}
      {
        products?.filter((product) => product.gender == 'KIDS')?.length > 0 ? <CategoriesSection title={"Kids’ Footwear Collection for Play, Comfort & Growth"} subtitle='Explore durable sneakers, school shoes, sandals, and slip-ons designed for active kids—each pair offering breathable support, flexible soles, and fun designs that parents trust.' url={''} >
          <GridRroduct data={products.filter((product) => product.gender == 'KIDS')} url={'product'} css='sm:grid-cols-[repeat(auto-fill,minmax(250px,auto))] ' />
        </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">
        </div>
      }


      {
        wishlist.length > 0 &&
        <CategoriesSection title={"Your Whishlist Products "} url={'products'} >
          <WihlistCardSection url={'products'} />
        </CategoriesSection >
      }


      <Discount title='Spotlight on Style' description='Step into the spotlight with Markline’s curated highlights—handpicked just for you. From sleek sandals and elegant flats to chic heels and playful toe-rings, our featured collection combines comfort, design, and everyday flair. Shop standout styles that elevate every outfit with effortless grace.' url='/' />

      {
        newArrivals &&
        <CategoriesSection title={"Latest at Markline"} url="newarrivals" >
          <SecondHero categoryName={"Shoes"} data={newArrivals} />
        </CategoriesSection>
      }
      <section className='w-full relative flex flex-col gap-5 container px-5 md:px-10 lg:px-20  py-10'>
        <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

        {/* Gender-Based Links */}
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
          <div className='w-full flex flex-wrap items-center gap-2'>
            <Link href='/gender/men' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Men Shoes</Link>
            <Link href='/gender/women' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Shoes</Link>
            <Link href='/gender/kids' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Kids Shoes</Link>
            <Link href='/gender/girls' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Girls Shoes</Link>
          </div>
        </div>

        {/* Shoe Type Links */}
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
          <div className='w-full flex flex-wrap items-center gap-2'>
            <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Wedding Specials</Link>
            <Link href='/collections/sandals' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Sandals</Link>
            <Link href='/collections/flats' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Flats</Link>
            <Link href='/collections/thongs' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Thongs</Link>
            <Link href='/collections/ballerinas' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Ballerinas</Link>
            <Link href='/collections/mules' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Mules</Link>
          </div>
        </div>

        {/* Women-Specific Types */}
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop By Women Shoe Type</p>
          <div className='w-full flex flex-wrap items-center gap-2'>
            <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Wedding Specials</Link>
            <Link href='/collections/sandals' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Sandals</Link>
            <Link href='/collections/flats' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Flats</Link>
            <Link href='/collections/thongs' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Thongs</Link>
            <Link href='/collections/ballerinas' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Ballerinas</Link>
            <Link href='/collections/mules' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Mules</Link>
          </div>
        </div>

        {/* Informational Sections */}
        <div className=' py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto '>
          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Explore Footwear for Everyone</h2>
            <p className='text-gray-700'>
              From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women,
              our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends
              to create a seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Types of Footwear by Gender</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li><strong>For Men:</strong> Versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers for every occasion.</li>
              <li><strong>For Women:</strong> Elegant heels, trendy flats, ethnic Kolhapuris, and comfy slip-ons—where style meets comfort.</li>
              <li><strong>For Kids:</strong> Fun, flexible, and durable shoes like velcro sneakers and sporty sandals built for adventure.</li>
              <li><strong>For GenZ:</strong> Bold, expressive picks—chunky sneakers, graphic slip-ons, and trend-driven sandals.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>How to Choose the Right Shoes</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li><strong>Age & Style:</strong> Opt for designs that fit the age group—playful for kids, expressive for GenZ, versatile for adults.</li>
              <li><strong>Occasion:</strong> Match your footwear to your lifestyle—casual, formal, or festive.</li>
              <li><strong>Fit & Comfort:</strong> Use sizing guides and reviews. Look for arch support and padded soles.</li>
              <li><strong>Material:</strong> Leather for durability, mesh for breathability, synthetics for lightweight comfort.</li>
              <li><strong>Wear Frequency:</strong> Durable shoes for daily wear; lightweight styles for occasional flair.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Footwear Trends for All</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li><strong>Bold Soles:</strong> Platforms and thick soles dominate the streets and runways.</li>
              <li><strong>Pastel Tones & Neutrals:</strong> Understated hues that work across outfits and age groups.</li>
              <li><strong>Retro Revivals:</strong> Mary Janes, moccasins, and high-tops making a bold comeback.</li>
              <li><strong>Tech Comfort:</strong> Cushioned insoles and lightweight builds for all-day support.</li>
              <li><strong>Ethnic Fusion:</strong> Classic Indian silhouettes blended with modern designs.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Why Quality Footwear Matters</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li><strong>Comfort:</strong> Well-made shoes reduce fatigue and make walking a breeze.</li>
              <li><strong>Durability:</strong> Quality craftsmanship means less frequent replacements.</li>
              <li><strong>Foot Health:</strong> Good fit and cushioning prevent heel pain and blisters.</li>
              <li><strong>Confidence:</strong> When your shoes feel good, you walk with confidence and style.</li>
            </ul>
          </section>
        </div>
      </section>

      {/* <CategoriesSection title={"Products"} >
        <CarouselProduct data={{ categoryName: "all" }} />
      </CategoriesSection> */}


    </>
  )
}

export default CollcetionPage
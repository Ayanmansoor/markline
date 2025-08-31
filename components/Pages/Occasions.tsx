'use client'
import React, { useEffect, useState } from 'react'
import CategoriesSection from '../Common/CategoriesSection'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import GridRroduct from '../Home/GridRroduct'
import Discount from '../Discounts/Discount'
import { getCollectionBaseOnTypeAndOccuation, } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import Link from 'next/link'
import { getAllCollectionsBaseOnType } from '@/Supabase/SupabaseApi'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import Image from 'next/image'

function Occasions() {

  const { collection } = useParams()
  const occasionslug = Array.isArray(collection) ? collection[0] : collection;
  const [productRangevalue, setPRoductRange] = useState(5000)



  const { data: occasionsCollection = [], isLoading: isOccationloading, isError: isOccationerror } = useQuery<any>({
    queryKey: ["occasionslug", occasionslug],
    enabled: !!occasionslug,
    queryFn: () => getAllCollectionsBaseOnType('occasion', occasionslug),
    staleTime: Infinity,
    refetchOnMount: false,      // don't refetch when remounting
    refetchOnWindowFocus: false, // don't refetch when window gains focus
    refetchOnReconnect: false,
  });

  const { data: productbaseOnOccasion = [], isLoading: productbaseOnOccasionLoading, isError: productbaseOnOccasionError } = useQuery<any>({
    queryKey: ["getProductsBaseOnTypeAndOccuation", occasionslug],
    queryFn: () => getCollectionBaseOnTypeAndOccuation('occasion', occasionslug),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  console.log(occasionsCollection, "this is data of ",)



  return (
    <>


      {occasionsCollection.length >= 0 && occasionsCollection[0]?.banner_image &&
        <section className='w-full relative h-[450px] md:h-[500px] lg:h-[600px] 2xl:h-[calc(100vh-100px)] '>
          <Image src={`${occasionsCollection[0]?.banner_image}`} alt={`${occasionslug}`} height={1300} width={1500} className='w-full relative  h-full object-cover' />
        </section>
      }

      <Breadcrumb className='w-full relative  md:px-5 lg:px-10 pt-3'>
        <BreadcrumbList className='w-full relative h-auto flex items-center py-5 rounded-lg px-3 '>
          <BreadcrumbItem >
            <BreadcrumbLink href="/Home" className=' text-sm md:text-base lg:text-xl text-primary cursor-pointer'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/collections/shop-by`} className=' text-sm sm:text-base md:text-xl lg:text-2xl text-primary cursor-pointer'>Shop By</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='text-sm sm:text-base md:text-xl lg:text-2xl text-primary cursor-pointer capitalize'>{`${occasionslug}`.split('-').join(' ')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="w-full min-h-[300px]  relative  gap-10  bg-gray-200  ">


        <div className="w-full gap-5  relative flex flex-col  px-3   ">
          {
            isOccationloading ?
              <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 items-start justify-start gap-3 px-5  lg:px-10   ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
              :
              productbaseOnOccasion?.length &&
              productbaseOnOccasion.map((item, index) => (
                <CategoriesSection title={item?.name} subtitle={item?.description} url={''} key={index} isH1={true}>

                  <GridRroduct data={item.product} url={'product'} css='grid-cols-2 md:grid-cols-3  lg:grid-cols-4 bg-gray-200 ' key={index} />
                </CategoriesSection>
              ))
          }


          <section className='w-full relative h-auto flex items-end justify-end pt-10 '>
            {/* {
              products?.length >= productShow && <button className='w-fit relative h-auto text-base font-medium border cursor-pointer px-3 py-2  bg-primary text-white ' onClick={showMoreProducts}>
                Show More
              </button>
            } */}

          </section>

        </div>
      </section>



      <Discount title={`Spotlight ${occasionslug} Footwear: Featured Styles You'll Love`} description={`Explore our top picks from the ${occasionslug} collection—curated for quality, comfort, and on‑trend appeal. Whether it's chic sandals, cozy sneakers, or elegant dress shoes, these standout styles are designed to elevate your everyday wardrobe.`} url='' />
      <section className='w-full relative flex flex-col gap-5  px-3 lg:px-5  pb-10'>
        <h2 className='text-xl font-semibold text-primary'>POPULAR SEARCHES</h2>

        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-semibold text-primary'>Shop Shoes By Gender</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href={'/collections/men'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Men Shoes</Link>
            <Link href={'/collections/women'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Women Shoes</Link>
            <Link href={'/collections/kids'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
            <Link href={'/collections/girls'} className='text-sm font-semibold text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
          </div>
        </div>
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-semibold text-primary'>Shop By Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            {
              occasionsCollection &&
              occasionsCollection.map((item, index) => (
                <Link href={`/collections/${item.gender}/${item.slug}`} className='text-sm font-semibold text-orange-600  border-l text-primary  px-3 border-primary' key={index}>{item.name}</Link>
              ))
            }

          </div>
        </div>

        <div className='w-full relative h-auto flex flex-col gap-2'>
          <p className='text-base font-semibold text-primary'>Shop By Women Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href='/collections/women/wedding-specials' className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Wedding Specials</Link>
            <Link href={"/collections/women/sandals"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Sandals</Link>
            <Link href={'/collections/women/flats'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Flats</Link>
            <Link href={"/collections/women/Thongs sandels"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Thongs sandels</Link>
            <Link href={"/collections/women/ballerinas"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Ballerinas</Link>
            <Link href={"/collections/women/mules"} className='text-sm font-semibold text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Mule</Link>
          </div>
        </div>

        <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          <section>
            <h2 className=" text-lg lg:text-xl  font-semibold mb-4">Explore Footwear for Everyone</h2>
            <p className="text-gray-700 text-base">
              From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women, our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends to create a seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Types of Footwear by Gender</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
              <li><strong>For Men:</strong> Discover versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers designed for daily grind and weekend style.</li>
              <li><strong>For Women:</strong> Choose from elegant heels, trendy flats, ethnic kolhapuris, and comfy slip-ons—perfectly balancing fashion and comfort.</li>
              <li><strong>For Kids:</strong> Fun, flexible, and durable shoes tailored for growing feet. Explore velcro sneakers, sandals, and colorful sports shoes that keep up with their energy.</li>
              <li><strong>For GenZ:</strong> Bold, expressive footwear like chunky sneakers, graphic slip-ons, and trend-led sandals that match their ever-evolving fashion sense.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl font-semibold mb-4">How to Choose the Right Shoes</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
              <li><strong>Age & Style:</strong> Select age-appropriate designs—functional and playful for kids, expressive for GenZ, and versatile for adults.</li>
              <li><strong>Occasion:</strong> From casual outings to formal events, choose shoes that match your lifestyle and schedule.</li>
              <li><strong>Fit & Comfort:</strong> Always check sizing charts and customer reviews. Comfort features like arch support and padded soles are a must.</li>
              <li><strong>Material:</strong> Leather for durability, mesh for breathability, and canvas or synthetics for affordability and flair.</li>
              <li><strong>Wear Frequency:</strong> For frequent use, invest in supportive, durable shoes. For style rotation, consider lighter designs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Footwear Trends for All</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
              <li><strong>Bold Soles:</strong> Platform sneakers and boots are popular across ages and genders.</li>
              <li><strong>Pastel Tones & Neutrals:</strong> Universally flattering hues dominating this season.</li>
              <li><strong>Retro Revivals:</strong> Styles like Mary Janes and high-top sneakers are making a fashionable comeback.</li>
              <li><strong>Tech Comfort:</strong> Cushioned footbeds and lightweight designs for all-day wear.</li>
              <li><strong>Ethnic Fusion:</strong> Traditional designs reimagined for modern wardrobes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Why Quality Footwear Matters</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
              <li><strong>Comfort:</strong> Supportive construction makes walking and standing easier for all ages.</li>
              <li><strong>Durability:</strong> Long-lasting shoes reduce waste and frequent replacement costs.</li>
              <li><strong>Foot Health:</strong> Proper fit and cushioning prevent common issues like heel pain and blisters.</li>
              <li><strong>Confidence:</strong> Stylish shoes that feel good can uplift your entire outfit and mood.</li>
            </ul>
          </section>
        </div>

      </section>

    </>


  )
}

export default Occasions
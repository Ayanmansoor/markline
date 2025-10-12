'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useQuery } from 'react-query'
import { getAllCollections, getAllNewArrivalProducts, getAllCollectionBanner, getAllCollectionWithProducts, getAllProductsWithVariants } from '@/Supabase/SupabaseApi'
import CategoriesSection from '../Common/CategoriesSection'
import Discount from '../Discounts/Discount'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import SecondHero from '../Common/SecondHero'
import { useWishlists } from '@/Contexts/wishlist'
import WihlistCardSection from '../Product/WihlistCardSection'
import Hero from '../Common/Hero'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import ProductFilter from '../Common/ProductFilter'
import { Colors, NewProductProps, ProductsDataProps, ProductVariant, Sizes } from '@/types/interfaces'
import { selectColorAndSizesProps } from '../Products/Products.page'
import MainCollections from '../Home/MainCollections'
function CollcetionPage() {

  const [productRangevalue, setPRoductRange] = useState(5000)
  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>()

  const [selectColorAndSizes, setSelectColorAndSizes] = useState<selectColorAndSizesProps>({
    color: [],
    size: []
  })



  const { data: collectionBanner = [], isLoading: bannerloading, isError: bannererror } = useQuery({
    queryKey: ["collectionBanner"],
    queryFn: getAllCollectionBanner,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // const { data: products = { data: [] }, isLoading: productloading, isError: producterror } = useQuery<{ data: NewProductProps[] }>({
  //   queryKey: ["products"],
  //   queryFn: getAllProductsWithVariants,
  //   staleTime: Infinity,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  // });

  const { data: collections = { data: [] }, isLoading: collectionloading, isError: collectionerror } = useQuery<{ data: any }>({
    queryKey: ["collections"],
    queryFn: () => getAllCollections("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });



  // useEffect(() => {
  //   if (!products.data) return;

  //   const filtered = products?.data?.filter((product: NewProductProps) => {
  //     const variants = product?.product_variants || [];

  //     // --- PRICE check ---
  //     const lowestPrice = variants.length
  //       ? Math.min(...variants.map(variant => variant.price || 0))
  //       : 0;
  //     const matchPrice = lowestPrice <= productRangevalue;



  //     // --- COLOR check ---
  //     const matchColor =
  //       !selectColorAndSizes.color?.length ||
  //       variants.some(variant => {
  //         let colorArray: Colors[] = [];
  //         if (typeof variant.colors === "string") {
  //           try {
  //             const parsed = JSON.parse(variant.colors);
  //             colorArray = Array.isArray(parsed) ? parsed : [parsed];
  //           } catch {
  //             return false;
  //           }
  //         } else if (Array.isArray(variant.colors)) {
  //           colorArray = variant.colors.map(c =>
  //             typeof c === "string" ? JSON.parse(c) : c
  //           );
  //         }

  //         return colorArray.some(c =>
  //           selectColorAndSizes.color?.includes(c.name)
  //         );
  //       });

  //     // --- SIZE check ---
  //     const matchSize =
  //       !selectColorAndSizes.size?.length ||
  //       variants.some(variant => {
  //         let sizeArray: Sizes[] = [];
  //         if (typeof variant.sizes === "string") {
  //           try {
  //             const parsed = JSON.parse(variant.sizes);
  //             sizeArray = Array.isArray(parsed) ? parsed : [parsed];
  //           } catch {
  //             return false;
  //           }
  //         } else if (Array.isArray(variant.sizes)) {
  //           sizeArray = variant.sizes.map(s =>
  //             typeof s === "string" ? JSON.parse(s) : s
  //           );
  //         }

  //         return sizeArray.some(s =>
  //           selectColorAndSizes.size?.includes(s.size)
  //         );
  //       });

  //     return matchPrice && matchColor && matchSize;
  //   });

  //   setFilterProducts(filtered);
  // }, [productRangevalue, products, selectColorAndSizes]);


  // const { allColors, allSizes } = useMemo(() => {
  //   const colorMap = new Map<string, Colors>();
  //   const sizeMap = new Map<string, Sizes>();

  //   products?.data.forEach((product: NewProductProps) => {
  //     product?.product_variants?.forEach((variant: ProductVariant) => {
  //       let colorArray: Colors[] = [];
  //       let sizeArray: Sizes[] = [];

  //       // normalize colors
  //       if (Array.isArray(variant.colors)) {
  //         colorArray = variant.colors.map((item) =>
  //           typeof item === "string" ? JSON.parse(item) : item
  //         );
  //       } else if (typeof variant.colors === "string") {
  //         try {
  //           const parsed = JSON.parse(variant.colors);
  //           colorArray = Array.isArray(parsed) ? parsed : [parsed];
  //         } catch {
  //           colorArray = [];
  //         }
  //       }

  //       // normalize sizes
  //       if (Array.isArray(variant.sizes)) {
  //         sizeArray = variant.sizes.map((item) =>
  //           typeof item === "string" ? JSON.parse(item) : item
  //         );
  //       } else if (typeof variant.sizes === "string") {
  //         try {
  //           const parsed = JSON.parse(variant.sizes);
  //           sizeArray = Array.isArray(parsed) ? parsed : [parsed];
  //         } catch {
  //           sizeArray = [];
  //         }
  //       }

  //       // add unique colors
  //       colorArray.forEach((color) => {
  //         if (color?.name && !colorMap.has(color.name)) {
  //           colorMap.set(color.name, color);
  //         }
  //       });

  //       // add unique sizes
  //       sizeArray.forEach((size) => {
  //         if (size?.size && !sizeMap.has(size.size)) {
  //           sizeMap.set(size.size, size);
  //         }
  //       });
  //     });
  //   });

  //   return {
  //     allColors: Array.from(colorMap.values()),
  //     allSizes: Array.from(sizeMap.values()),
  //   };
  // }, [products]);






  return (
    <>
      {
        collectionBanner &&
        <Hero bannerImages={collectionBanner} css=' h-auto h-[250px]  lg:h-[400px] xl:h-[100vh]' />
      }
      
      <MainCollections />

      {collections?.data?.length ?
        <CategoriesSection title={"Women's Footwear Collections – Sandals, Flats, Heels & More"} subtitle='Discover elegant sandals, comfy flats, chic heels & stylish mules' url={''} >
          <Collectionsection collections={collections?.data?.filter((item) => item.gender == 'WOMEN')} url={'collections/women'} />
        </CategoriesSection> :
        <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4   xl:grid-cols-5 items-start justify-start gap-3 px-5  lg:px-10   ">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      }




      {/* <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200  ">
        <span className=' z-20 bg-gray-200 flex items-center border-b border-white w-full justify-between h-fit sticky top-12   py-5 px-3 md:px-5 lg:px-10 '>
          <ProductFilter collection={[]} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} colors={allColors} sizes={allSizes} SetselectColorAndSizes={setSelectColorAndSizes} />
        </span>

        <div className="w-full gap-5  relative flex flex-col  px-3 md:px-5 lg:px-10  py-5 lg:py-10 ">
          {
            productloading ?
              <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10   ">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
              :
              products?.data?.length ?
                <GridRroduct data={filterProducts ? filterProducts : products.data} url={'product'} css=' grid-cols-2 md:grid-cols-3  xl:grid-cols-4 bg-gray-200 ' productsCardCss=' h-[220px]  sm:h-[290px] md:h-[300px] lg:h-[350px]' /> :
                <div className="grid grid-cols-2 py-5 lg:py-10 sm:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-5  lg:px-10   ">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
          }




        </div>
      </section> */}





      <Discount title='Spotlight on Style' description='Step into the spotlight with Markline’s curated highlights—handpicked just for you. From sleek sandals and elegant flats to chic heels and playful toe-rings, our featured collection combines comfort, design, and everyday flair. Shop standout styles that elevate every outfit with effortless grace.' url='/' />



      <section className='w-full relative flex flex-col gap-5    py-10  px-3 lg:px-10'>
        <h2 className='     text-lg  font-medium text-primary'>POPULAR SEARCHES</h2>

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
            <Link href='/collections/Thongs sandels' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Thongs sandels</Link>
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
            <Link href='/collections/Thongs sandels' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Thongs sandels</Link>
            <Link href='/collections/ballerinas' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Ballerinas</Link>
            <Link href='/collections/mules' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Mules</Link>
          </div>
        </div>

        {/* Informational Sections */}
        <div className=' py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto '>
          <section>
            <h2 className='text-base sm:text-lg font-semibold mb-4'>Explore Footwear for Everyone</h2>
            <p className='text-gray-700 text-sm'>
              From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women,
              our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends
              to create a seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className='text-base sm:text-lg font-semibold mb-4'>Types of Footwear by Gender</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm'>
              <li><strong>For Men:</strong> Versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers for every occasion.</li>
              <li><strong>For Women:</strong> Elegant heels, trendy flats, ethnic Kolhapuris, and comfy slip-ons—where style meets comfort.</li>
              <li><strong>For Kids:</strong> Fun, flexible, and durable shoes like velcro sneakers and sporty sandals built for adventure.</li>
              <li><strong>For GenZ:</strong> Bold, expressive picks—chunky sneakers, graphic slip-ons, and trend-driven sandals.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-base sm:text-lg font-semibold mb-4'>How to Choose the Right Shoes</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm'>
              <li><strong>Age & Style:</strong> Opt for designs that fit the age group—playful for kids, expressive for GenZ, versatile for adults.</li>
              <li><strong>Occasion:</strong> Match your footwear to your lifestyle—casual, formal, or festive.</li>
              <li><strong>Fit & Comfort:</strong> Use sizing guides and reviews. Look for arch support and padded soles.</li>
              <li><strong>Material:</strong> Leather for durability, mesh for breathability, synthetics for lightweight comfort.</li>
              <li><strong>Wear Frequency:</strong> Durable shoes for daily wear; lightweight styles for occasional flair.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-base sm:text-lg font-semibold mb-4'>Footwear Trends for All</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm'>
              <li><strong>Bold Soles:</strong> Platforms and thick soles dominate the streets and runways.</li>
              <li><strong>Pastel Tones & Neutrals:</strong> Understated hues that work across outfits and age groups.</li>
              <li><strong>Retro Revivals:</strong> Mary Janes, moccasins, and high-tops making a bold comeback.</li>
              <li><strong>Tech Comfort:</strong> Cushioned insoles and lightweight builds for all-day support.</li>
              <li><strong>Ethnic Fusion:</strong> Classic Indian silhouettes blended with modern designs.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-base sm:text-lg font-semibold mb-4'>Why Quality Footwear Matters</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm'>
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
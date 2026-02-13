'use client'
import React, { useEffect, useMemo, useState } from 'react'
import CategoriesSection from '../Common/CategoriesSection'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import GridRroduct from '../Home/GridRroduct'
import Discount from '../Discounts/Discount'
import { fetchGroupOfProducts, getAllCollections, getCollectionBaseOnTypeAndOccuation, } from '@/Supabase/SupabaseApi'
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
import { Colors, NewProductProps, newProductsProps, Sizes } from '@/types/interfaces'
import CarouselProduct from '../Product/CarouselProduct'
import { selectColorAndSizesProps } from '../Products/Products.page'
import ProductFilter from '../Common/ProductFilter'

function Occasions() {
  const [productRangevalue, setPRoductRange] = useState(5000)
  const [filterProducts, setFilterProducts] = useState<NewProductProps[]>()

  const [selectColorAndSizes, setSelectColorAndSizes] = useState<selectColorAndSizesProps>({
    color: [],
    size: []
  })

  const { occasion } = useParams()
  const occasionslug = Array.isArray(occasion) ? occasion[0] : occasion;



  const { data: occasionsCollection = { data: [] }, isLoading: isOccationloading, isError: isOccationerror } = useQuery<{ data: any[] }>({
    queryKey: ["occasionslug", occasionslug],
    enabled: !!occasionslug,
    queryFn: () => getAllCollections("ALL"),
    staleTime: Infinity,
    refetchOnMount: false,      // don't refetch when remounting
    refetchOnWindowFocus: false, // don't refetch when window gains focus
    refetchOnReconnect: false,
  });

  const { data: groupOfProducts = { data: [] }, isLoading: isLoading, isError: iserror } = useQuery<{ data: any[] }>({
    queryKey: ["groupOfProducts"],
    queryFn: () => fetchGroupOfProducts("BEST_SELLER"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });




  const flatProducts = useMemo(() => {
    const groups = groupOfProducts?.data || [];
    const allProducts: NewProductProps[] = [];

    groups.forEach(group => {
      group.products.forEach(product => {
        allProducts.push(product);
      });
    });

    return allProducts;
  }, [groupOfProducts]);
  useEffect(() => {
    if (!flatProducts) return;

    const filtered = flatProducts.filter((product: NewProductProps) => {
      const variants = product?.product_variants || [];

      // PRICE
      const lowestPrice = variants.length
        ? Math.min(...variants.map(variant => variant.price || 0))
        : 0;
      const matchPrice = lowestPrice <= productRangevalue;


      // COLOR
      const matchColor =
        !selectColorAndSizes.color?.length ||
        variants.some(variant => {
          let colorArray: Colors[] = [];

          if (typeof variant.colors === "string") {
            try {
              const parsed = JSON.parse(variant.colors);
              colorArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return false;
            }
          } else if (Array.isArray(variant.colors)) {
            colorArray = variant.colors.map(c =>
              typeof c === "string" ? JSON.parse(c) : c
            );
          }

          return colorArray.some(c =>
            selectColorAndSizes.color?.includes(c.name)
          );
        });

      // SIZE
      const matchSize =
        !selectColorAndSizes.size?.length ||
        variants.some(variant => {
          let sizeArray: Sizes[] = [];

          if (typeof variant.sizes === "string") {
            try {
              const parsed = JSON.parse(variant.sizes);
              sizeArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return false;
            }
          } else if (Array.isArray(variant.sizes)) {
            sizeArray = variant.sizes.map(s =>
              typeof s === "string" ? JSON.parse(s) : s
            );
          }

          return sizeArray.some(s =>
            selectColorAndSizes.size?.includes(s.size)
          );
        });

      return matchPrice && matchColor && matchSize;
    });

    setFilterProducts(filtered);
  }, [flatProducts, productRangevalue, selectColorAndSizes]);
  const { allColors, allSizes } = useMemo(() => {
    const colorMap = new Map<string, Colors>();
    const sizeMap = new Map<string, Sizes>();

    flatProducts.forEach(product => {
      product.product_variants?.forEach(variant => {
        let colorArray: Colors[] = [];
        let sizeArray: Sizes[] = [];

        // COLORS
        if (Array.isArray(variant.colors)) {
          colorArray = variant.colors.map(item =>
            typeof item === "string" ? JSON.parse(item) : item
          );
        } else if (typeof variant.colors === "string") {
          try {
            const parsed = JSON.parse(variant.colors);
            colorArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            colorArray = [];
          }
        }

        // SIZES
        if (Array.isArray(variant.sizes)) {
          sizeArray = variant.sizes.map(item =>
            typeof item === "string" ? JSON.parse(item) : item
          );
        } else if (typeof variant.sizes === "string") {
          try {
            const parsed = JSON.parse(variant.sizes);
            sizeArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            sizeArray = [];
          }
        }

        // Add to maps
        colorArray.forEach(color => {
          if (color?.name && !colorMap.has(color.name)) {
            colorMap.set(color.name, color);
          }
        });

        sizeArray.forEach(size => {
          if (size?.size && !sizeMap.has(size.size)) {
            sizeMap.set(size.size, size);
          }
        });
      });
    });

    return {
      allColors: Array.from(colorMap.values()),
      allSizes: Array.from(sizeMap.values()),
    };
  }, [flatProducts]);


  return (
    <>


      {/* {occasionsCollection?.data?.length >= 0 && occasionsCollection?.data[0]?.banner_image &&
        <section className='w-full relative h-[450px] md:h-[500px] lg:h-[600px] 2xl:h-[calc(100vh-100px)] '>
          <Image src={`${occasionsCollection.data[0]?.banner_image}`} alt={`${occasionslug}`} height={1300} width={1500} className='w-full relative  h-full object-cover' />
        </section>
      } */}

      <Breadcrumb className='w-full relative  px-2 lg:px-10 xl:px-20 2xl:px-40 '>
        <BreadcrumbList className='w-full relative h-auto flex items-center py-4 rounded-lg px-3 '>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/collections/shop-by`} className=' text-sm sm:text-base  text-primary cursor-pointer'>Shop By</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='text-sm sm:text-base text-primary cursor-pointer capitalize'>{`${occasionslug}`.split('-').join(' ')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>



      <section className="w-full min-h-[300px] mt-1 relative  gap-10  bg-gray-200  ">
        <span className=' flex items-center border-b border-white w-full justify-between h-fit sticky top-14 z-30 bg-gray-200   py-5 px-3 md:px-5 lg:px-10 xl:px-20 2xl:px-40      '>
          <ProductFilter
            gender={''}
            collection={[]}
            productRangevalue={productRangevalue}
            setPRoductRange={setPRoductRange}
            slug={""}
            colors={allColors}
            sizes={allSizes}
            SetselectColorAndSizes={setSelectColorAndSizes}
          />

        </span>
        {isLoading ? (
          <div className="grid grid-cols-2 py-5  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-2 md:px-5 lg:px-10 xl:px-20 2xl:px-40   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : groupOfProducts?.data?.length > 0 ? (
          groupOfProducts?.data?.map((item: any, index: number) => (
            item.products?.length > 0 &&
            <GridRroduct data={item.products} url={'product'} css='grid-cols-2 md:grid-cols-3 px-3 md:px-5 md:px-10 py-5 md:py-10  gap-3 md:gap-5 lg:grid-cols-4 bg-gray-200 lg:px-10 xl:px-20 2xl:px-40     ' productsCardCss=' h-[170px] object-cover  sm:h-[300px] md:h-[350px] lg:h-[350px] xl:h-[400px]' key={index} />
          ))
        ) : (
          <></>
        )}

      </section >


      <Discount title={`Spotlight ${occasionslug} Footwear: Featured Styles You'll Love`} description={`Explore our top picks from the ${occasionslug} collection—curated for quality, comfort, and on‑trend appeal. Whether it's chic sandals, cozy sneakers, or elegant dress shoes, these standout styles are designed to elevate your everyday wardrobe.`} url='' />
      <section className='w-full relative flex flex-col gap-5  px-3 lg:px-5  pb-10'>


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
        <h2 className='text-xl font-semibold text-primary'>POPULAR SEARCHES</h2>

        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-semibold text-primary'>Shop Shoes By Gender</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href={'/collections/women'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Women Shoes</Link>
          </div>
        </div>
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-semibold text-primary'>Shop By Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            {
              occasionsCollection.data &&
              occasionsCollection.data.map((item, index) => (
                <Link href={`/collections/${item.gender}/${item.slug}`} className='text-sm font-semibold text-orange-600  border-l text-primary  px-3 border-primary' key={index}>{item.name}</Link>
              ))
            }

          </div>
        </div>
      </section>

    </>


  )
}

export default Occasions
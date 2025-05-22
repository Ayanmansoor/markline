'use client'
import CategoriesSection from '@/components/Common/CategoriesSection'
import CarouselProduct from '@/components/Product/CarouselProduct'
import ProductAbout from '@/components/Product/ProductAbout'
import ProductMain from '@/components/Product/ProductMain'
import Specification from '@/components/Product/Specification'
import React from 'react'
import Link from 'next/link'
import ProductPageSkeleton from '../Skeleton/ProductPageSkeleton'




import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { getProductData, getAllProducts, getRelatedProducts } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'

function ProductPage() {

  const { slug } = useParams()
  const productslug = Array.isArray(slug) ? slug[0] : slug;

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", productslug],
    queryFn: () => getProductData(productslug),
    enabled: !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,      // don't refetch when remounting
    refetchOnWindowFocus: false, // don't refetch when window gains focus
    refetchOnReconnect: false,
  });

  const {
    data: relatedProducts = [],
    isLoading: newloading,
    isError: newError,
    error: err,
  } = useQuery({
    queryKey: ["relatedProducts", product, productslug],
    queryFn: () => getRelatedProducts(product, productslug),
    enabled: !!product && !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,      // don't refetch when remounting
    refetchOnWindowFocus: false, // don't refetch when window gains focus
    refetchOnReconnect: false,
  });



  if (isLoading) {
    return <div className='w-full relative h-fit'>
      <ProductPageSkeleton />
    </div>;
  }

  if (isError) {
    return <div>Error: </div>;
  }





  return (
    <>

      <section className=' relative bg-secondary h-auto  pb-4 mt-1 '>

        {
          isLoading ?
            <section className='container px-5 md:px-10 h-[50vh] lg:px-20'>
              <ProductPageSkeleton />
            </section>
            :
            product ?
              <div className='w-full mx-auto h-full container px-3 relative  flex flex-col justify-between gap-2 bg-secondary md:flex-row  md:px-10   xl:px-20  '>
                <div className='  md:max-h-fit   w-full  relative lg:sticky lg:top-5 p-1 md:h-full  md:w-[60%] lg:w-[55%] '>
                  <ProductMain product={product} />
                </div>
                <ProductAbout product={product} />
              </div>
              :
              <section className='container px-5 h-[50vh] md:px-10 lg:px-20'>
                <ProductPageSkeleton />
              </section>
        }

      </section>

      <Specification product={product} />

      {
        newloading ?
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 lg:px-20 ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
          :
          relatedProducts ?
            <CategoriesSection title={"You may also like  "} url={'products'} >
              <CarouselProduct url={'products'} product={relatedProducts} />
            </CategoriesSection >
            :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-20 ">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
      }

      <section className='w-full relative flex flex-col gap-5 container px-5 md:px-10 lg:px-20  pb-10'>
        <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href={'/collections/men'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Mans Shoes</Link>
            <Link href={'/collections/women'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Womens Shoes</Link>
            <Link href={'/collections/kids'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
            <Link href={'/collection/girls'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
          </div>
        </div>
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-r border-l text-primary  px-3 border-primary'>Wedding Specials</Link>
            <Link href={"/collections/sandals"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Sandals</Link>
            <Link href={'/collections/flats'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Flats</Link>
            <Link href={"/collections/thongs"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Thongs</Link>
            <Link href={"/collections/ballerinas"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Ballerinas</Link>
            <Link href={"/collections/mules"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Mules</Link>
          </div>
        </div>

        <div className='w-full relative h-auto flex flex-col gap-2'>
          <p className='text-base font-medium text-primary'>Shop By Women Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Wedding Specials</Link>
            <Link href={"/collections/sandals"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Sandals</Link>
            <Link href={'/collections/flats'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Flats</Link>
            <Link href={"/collections/thongs"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Thongs</Link>
            <Link href={"/collections/ballerinas"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Ballerinas</Link>
            <Link href={"/collections/mules"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Mule</Link>
          </div>
        </div>

        <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Explore Footwear for Everyone</h2>
            <p className="text-gray-700">
              From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women, our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends to create a seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Types of Footwear by Gender</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>For Men:</strong> Discover versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers designed for daily grind and weekend style.</li>
              <li><strong>For Women:</strong> Choose from elegant heels, trendy flats, ethnic kolhapuris, and comfy slip-ons—perfectly balancing fashion and comfort.</li>
              <li><strong>For Kids:</strong> Fun, flexible, and durable shoes tailored for growing feet. Explore velcro sneakers, sandals, and colorful sports shoes that keep up with their energy.</li>
              <li><strong>For GenZ:</strong> Bold, expressive footwear like chunky sneakers, graphic slip-ons, and trend-led sandals that match their ever-evolving fashion sense.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">How to Choose the Right Shoes</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Age & Style:</strong> Select age-appropriate designs—functional and playful for kids, expressive for GenZ, and versatile for adults.</li>
              <li><strong>Occasion:</strong> From casual outings to formal events, choose shoes that match your lifestyle and schedule.</li>
              <li><strong>Fit & Comfort:</strong> Always check sizing charts and customer reviews. Comfort features like arch support and padded soles are a must.</li>
              <li><strong>Material:</strong> Leather for durability, mesh for breathability, and canvas or synthetics for affordability and flair.</li>
              <li><strong>Wear Frequency:</strong> For frequent use, invest in supportive, durable shoes. For style rotation, consider lighter designs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Footwear Trends for All</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Bold Soles:</strong> Platform sneakers and boots are popular across ages and genders.</li>
              <li><strong>Pastel Tones & Neutrals:</strong> Universally flattering hues dominating this season.</li>
              <li><strong>Retro Revivals:</strong> Styles like Mary Janes and high-top sneakers are making a fashionable comeback.</li>
              <li><strong>Tech Comfort:</strong> Cushioned footbeds and lightweight designs for all-day wear.</li>
              <li><strong>Ethnic Fusion:</strong> Traditional designs reimagined for modern wardrobes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Why Quality Footwear Matters</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Comfort:</strong> Supportive construction makes walking and standing easier for all ages.</li>
              <li><strong>Durability:</strong> Long-lasting shoes reduce waste and frequent replacement costs.</li>
              <li><strong>Foot Health:</strong> Proper fit and cushioning prevent common issues like heel pain and blisters.</li>
              <li><strong>Confidence:</strong> Stylish shoes that feel good can uplift your entire outfit and mood.</li>
            </ul>
          </section>
        </div>

      </section>

      {/* <CarouselProduct>
        {content.map((elem, index) => (
          <CarouselItem className="basis-[250px]">
            <ProductCard value={{ imege: "url", Name: "Sony Head phone", price: "9047", descrip: "Brand new Sony head phone", rating: "", ProductID: "", Isproduct: true, ind: index }} />
          </CarouselItem>
        ))}
      </CarouselProduct>

      <CategoriesSection title={"Best Deals On All Products"} >
        <GridRroduct data={{ categoryName: "category", name: "Others also bought", url: 'product' }} />
      </CategoriesSection > */}

      {/* {

        allproducts?.length > 0 ?
          <CategoriesSection title={"Best Deals On All Products"} url="products" >
            <GridRroduct data={{ categoryName: "", url: "product", products: allproducts }} />
          </CategoriesSection> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 container px-20">
            {Array.from({ length: 6 }).map((_, index) => (
              <ContentLoader
                key={index}
                speed={2}
                width={200}
                height={320}
                viewBox="0 0 200 320"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                className="w-full"
              >
                <rect x="10" y="10" rx="10" ry="10" width="180" height="180" />

                <rect x="10" y="10" rx="4" ry="4" width="40" height="20" />

                <rect x="10" y="200" rx="4" ry="4" width="160" height="15" />
                <rect x="10" y="220" rx="4" ry="4" width="100" height="15" />

                <rect x="10" y="250" rx="4" ry="4" width="70" height="15" />
                <rect x="90" y="250" rx="4" ry="4" width="50" height="15" />

                <rect x="10" y="280" rx="4" ry="4" width="120" height="12" />
              </ContentLoader>
            ))}
          </div>
      }
 */}


    </>
  )
}

export default ProductPage
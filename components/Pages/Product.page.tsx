'use client'
import CategoriesSection from '@/components/Common/CategoriesSection'
import CarouselProduct from '@/components/Product/CarouselProduct'
import ProductAbout from '@/components/Product/ProductAbout'
import ProductMain from '@/components/Product/ProductMain'
import Specification from '@/components/Product/Specification'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductPageSkeleton from '../Skeleton/ProductPageSkeleton'
// import WihlistCardSection from '../Product/WihlistCardSection'
import Image from 'next/image'


import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { getProductData, getRelatedProducts } from '@/Supabase/SupabaseApi'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import { useWishlists } from '@/Contexts/wishlist'
import OrderConfirmed from '../Common/OrderConfirm'
import { Images, ProductVariant } from '@/types/interfaces'

function ProductPage() {

  const [stringifyImages, setStringifyImages] = useState<any[]>([]); // default to empty array
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(); // initially null

  const { slug } = useParams();
  const productslug = Array.isArray(slug) ? slug[0] : slug;

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productslug],
    queryFn: () => getProductData(productslug),
    enabled: !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Always use useEffect to update selectedVariant after product fetch
  useEffect(() => {
    if (product?.product_variants?.length > 0) {
      setSelectedVariant(product.product_variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (!selectedVariant?.image_url) return;

    try {
      const parsedImages: Images[] = Array.isArray(selectedVariant.image_url)
        ? selectedVariant.image_url.map((item: string) => JSON.parse(item))
        : [];

      setStringifyImages(parsedImages);
    } catch (error) {
      console.error("Failed to parse variant images:", error);
    }
  }, [selectedVariant]);

  // Safe conditional rendering (no hook inside this)


  const {
    data: relatedProducts = [],
    isLoading: newloading,
    isError: newError,
    error: err,
  } = useQuery({
    queryKey: [
      "relatedProducts",
      product?.brand_key,
      product?.collection_key,
      productslug,
    ],
    queryFn: () => getRelatedProducts(product, productslug),
    enabled: !!product && !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  if (isLoading) {
    return (
      <div className="w-full relative h-fit">
        <ProductPageSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return <div>Error loading product.</div>;
  }
  return (
    <>

      <section className=' relative bg-secondary min-h-[700px]  pb-4 mt-1 '>

        {
          isLoading ?
            <section className=' h-auto '>
              <ProductPageSkeleton />
            </section> : product ?
              <div className='w-full mx-auto h-full  relative  flex flex-col justify-between  bg-secondary md:flex-row  px-3 lg:px-10  '>
                <div className='  md:max-h-fit   w-full  relative lg:sticky lg:top-5 p-1 md:h-full  md:w-[60%] lg:w-[60%] '>
                  <ProductMain variant={selectedVariant} />
                </div>
                {
                  selectedVariant &&
                <ProductAbout product={product} variant={selectedVariant} onVariantChange={(variant) => setSelectedVariant(variant)} />
                }
              </div> : <section className='container  h-[700px] '>
                <ProductPageSkeleton />
              </section>
        }
      </section>
      <Specification product={product} />


      {/* <section className='w-full relative container h-auto flex flex-col  gap-5'>

          <div className='w-full relative grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 mt-10 mb-5'>
              <Image src="/collectionsection.png" alt="products image" height={500} width={500} className="w-full relative md:row-start-1 md:row-end-4 rounded-xl"/>
              <Image src="/collectionsection.png" alt="products image" height={500} width={500} className="w-full relative md:row-start-1 md:row-end-2 object-cover rounded-xl border"/>
              <Image src="/collectionsection.png" alt="products image" height={500} width={500} className="w-full relative md:row-start-2 md:row-end-3 object-cover rounded-xl border"/>
          </div>

      </section> */}


      {
        newloading ?
          <div className="grid grid-cols-2 py-10 lg:py-20 px-5 lg:px-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3   ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
          :
          relatedProducts.length>0 ?
            <CategoriesSection title={"You may also like  "}  url={'products/women'} urltext='products' >
              <CarouselProduct url={'product'} product={relatedProducts}  css=' sm:max-w-[500px]' />
            </CategoriesSection >
            :
            <div className="grid grid-cols-2 py-10 lg:py-20 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3   px-5 lg:px-10  ">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
      }

      {/* 
      {
        wishlist.length > 0 &&
        <CategoriesSection title={"Your Wishlist Products "} url={'products'} >
          <CarouselProduct url={'products'} product={wishlist} />
        </CategoriesSection >
      } */}
      {/* {
      wishlist.length > 0 &&
      <CategoriesSection title={"Your Whishlist Products "} url={'products'} >
        <WihlistCardSection url={'products'} />
      </CategoriesSection >
    }
       */}

      <section className='w-full relative flex flex-col gap-5  px-3 lg:px-10  pb-10'>
        <h2 className=' text-lg lg:text-xl font-semibold lg:font-medium text-primary'>POPULAR SEARCHES</h2>

        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href={'/gender/men'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Mans Shoes</Link>
            <Link href={'/gender/women'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Womens Shoes</Link>
            <Link href={'/gender/kids'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
            <Link href={'/gender/girls'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
          </div>
        </div>
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-r border-l text-primary  px-3 border-primary'>Wedding Specials</Link>
            <Link href={"/collections/sandals"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Sandals</Link>
            <Link href={'/collections/flats'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Flats</Link>
            <Link href={"/collections/Thongs sandels"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Thongs sandels</Link>
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
            <Link href={"/collections/Thongs sandels"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Thongs sandels</Link>
            <Link href={"/collections/ballerinas"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Ballerinas</Link>
            <Link href={"/collections/mules"} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Mule</Link>
          </div>
        </div>

        <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto ">
          <section>
            <h2 className=" text-lg lg:text-xl xl:text-2xl  font-semibold mb-4">Explore Footwear for Everyone</h2>
            <p className="text-gray-700  text-sm lg:text-base">
              From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women, our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends to create a seamless experience for every step of life.
            </p>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">Types of Footwear by Gender</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li className=' text-sm sm:text-base'><strong>For Men:</strong> Discover versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers designed for daily grind and weekend style.</li>
              <li className=' text-sm sm:text-base'><strong>For Women:</strong> Choose from elegant heels, trendy flats, ethnic kolhapuris, and comfy slip-ons—perfectly balancing fashion and comfort.</li>
              <li className=' text-sm sm:text-base'><strong>For Kids:</strong> Fun, flexible, and durable shoes tailored for growing feet. Explore velcro sneakers, sandals, and colorful sports shoes that keep up with their energy.</li>
              <li className=' text-sm sm:text-base'><strong>For GenZ:</strong> Bold, expressive footwear like chunky sneakers, graphic slip-ons, and trend-led sandals that match their ever-evolving fashion sense.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">How to Choose the Right Shoes</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li className=' text-sm sm:text-base'><strong>Age & Style:</strong> Select age-appropriate designs—functional and playful for kids, expressive for GenZ, and versatile for adults.</li>
              <li className=' text-sm sm:text-base'><strong>Occasion:</strong> From casual outings to formal events, choose shoes that match your lifestyle and schedule.</li>
              <li className=' text-sm sm:text-base'><strong>Fit & Comfort:</strong> Always check sizing charts and customer reviews. Comfort features like arch support and padded soles are a must.</li>
              <li className=' text-sm sm:text-base'><strong>Material:</strong> Leather for durability, mesh for breathability, and canvas or synthetics for affordability and flair.</li>
              <li className=' text-sm sm:text-base'><strong>Wear Frequency:</strong> For frequent use, invest in supportive, durable shoes. For style rotation, consider lighter designs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">Footwear Trends for All</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li className=' text-sm sm:text-base'><strong>Bold Soles:</strong> Platform sneakers and boots are popular across ages and genders.</li>
              <li className=' text-sm sm:text-base'><strong>Pastel Tones & Neutrals:</strong> Universally flattering hues dominating this season.</li>
              <li className=' text-sm sm:text-base'><strong>Retro Revivals:</strong> Styles like Mary Janes and high-top sneakers are making a fashionable comeback.</li>
              <li className=' text-sm sm:text-base'><strong>Tech Comfort:</strong> Cushioned footbeds and lightweight designs for all-day wear.</li>
              <li className=' text-sm sm:text-base'><strong>Ethnic Fusion:</strong> Traditional designs reimagined for modern wardrobes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">Why Quality Footwear Matters</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base ">
              <li className=' text-sm sm:text-base'><strong>Comfort:</strong> Supportive construction makes walking and standing easier for all ages.</li>
              <li className=' text-sm sm:text-base'><strong>Durability:</strong> Long-lasting shoes reduce waste and frequent replacement costs.</li>
              <li className=' text-sm sm:text-base'><strong>Foot Health:</strong> Proper fit and cushioning prevent common issues like heel pain and blisters.</li>
              <li className=' text-sm sm:text-base'><strong>Confidence:</strong> Stylish shoes that feel good can uplift your entire outfit and mood.</li>
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
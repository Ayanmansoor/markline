'use client'
import CategoriesSection from '@/components/Common/CategoriesSection'
import CarouselProduct from '@/components/Product/CarouselProduct'
import ProductAbout from '@/components/Product/ProductAbout'
import ProductMain from '@/components/Product/ProductMain'
import Specification from '@/components/Product/Specification'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductPageSkeleton from '../Skeleton/ProductPageSkeleton'
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
    queryFn: () => getProductData(productslug || ""),
    enabled: !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });



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
    queryFn: () => getRelatedProducts(product, productslug || ""),
    enabled: !!product && !!productslug,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  console.log(product, "this is product data ")


  if (isLoading) {
    return (
      <div className="w-full relative h-fit">
        <ProductPageSkeleton />
      </div>
    );
  }


  return (
    <>

      <section className=' relative bg-secondary min-h-[700px]  pb-4 mt-1 '>

        {
          isLoading ?
            <section className=' h-auto '>
              <ProductPageSkeleton />
            </section> : product ?
              <div className='w-full mx-auto h-full  relative  flex flex-col justify-between  bg-secondary md:flex-row  px-5 lg:px-10 xl:px-20 2xl:px-40   '>
                <div className='  md:max-h-fit   w-full  relative lg:sticky lg:top-5 p-1 md:h-full  md:w-[65%] lg:w-[65%] '>
                  <ProductMain variant={selectedVariant} />
                </div>
                {
                  selectedVariant &&
                  <ProductAbout product={product} variant={selectedVariant} onVariantChange={(variant) => setSelectedVariant(variant)} />
                }
              </div> :
              <section className='container  h-[700px] '>
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
          <div className="grid grid-cols-2 py-10 lg:py-20 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3   px-5 lg:px-10 xl:px-20 2xl:px-40  ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
          :
          relatedProducts.length > 0 ?
            <CategoriesSection title={"You may also like  "} url={'products/women'} urltext='products' >
              <CarouselProduct url={'product'} product={relatedProducts} css=' sm:max-w-[500px]' productsCardCss=" h-[170px] aspect-square md:aspect-auto  sm:h-[350px] md:h-[350px] xl:[300px] 2xl:h-[320px] 3xl:h-[350px]" />
            </CategoriesSection >
            :
            <div className="grid grid-cols-2 py-10 lg:py-20 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3  px-5 lg:px-10 xl:px-20 2xl:px-40   ">
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

      <section className='w-full relative flex flex-col gap-5 px-5 lg:px-10 xl:px-20 2xl:px-40 pb-10'>


        {/* ------- PRODUCT PAGE SEO CONTENT ------- */}
        <div className=" flex flex-col gap-10 no-scrollbar overflow-y-auto">

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">
              Buy {product?.title} Online in India
            </h2>
            <p className="text-gray-700 text-sm lg:text-base">
              Experience comfort, style, and everyday usability with the {product?.title}.
              Designed for Indian lifestyle and daily wear needs, this {product?.category} offers
              a lightweight feel, cushioned support, and durable build—perfect for casual outings,
              office wear, travel, festive occasions, and daily routine. If you are looking for
              comfortable, stylish, and long-lasting footwear, the {product?.title} is a perfect pick.
            </p>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">
              Who Should Buy the {product?.title}?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li><strong>Daily Wear Users:</strong> Perfect for regular use with soft cushioning and relaxed fit.</li>
              <li><strong>Fashion Lovers:</strong> Stylish design that matches Indian outfits, western wear, and casual looks.</li>
              <li><strong>Office & Travel Users:</strong> Lightweight and supportive for long walking and standing.</li>
              <li><strong>Festive & Occasion Wear:</strong> Works well for weddings, celebrations, and special events.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">
              Key Features of {product?.title}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li><strong>Comfort First:</strong> Soft footbed, cushioned sole, and relaxed fit.</li>
              <li><strong>Durable Quality:</strong> Designed to last longer with strong material and build.</li>
              <li><strong>Lightweight Feel:</strong> Comfortable for all-day wear without heaviness.</li>
              <li><strong>Stylish Look:</strong> Trend-led design that blends fashion with everyday usability.</li>
              <li><strong>Perfect Fit:</strong> Designed to match Indian sizing and comfort expectations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-4">
              Why Choose Markline Footwear
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
              <li><strong>All-Day Comfort:</strong> Built for walking, standing, and daily movement.</li>
              <li><strong>Quality You Can Trust:</strong> Reliable workmanship and premium finishing.</li>
              <li><strong>Stylish Yet Practical:</strong> Looks great while staying comfortable.</li>
              <li><strong>Made for India:</strong> Designed for Indian weather, roads, and lifestyle needs.</li>
            </ul>
          </section>

        </div>


        <h2 className='text-lg lg:text-xl font-semibold lg:font-medium text-primary'>POPULAR SEARCHES</h2>

        {/* Gender */}
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href={'/collections/men'} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Men Shoes</Link>
            <Link href={'/collections/women'} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Women Shoes</Link>
            <Link href={'/collections/kids'} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Kids Shoes</Link>
            <Link href={'/collections/girls'} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Girls Shoes</Link>
          </div>
        </div>

        {/* Shoe Types */}
        <div className='w-full relative h-auto flex flex-col gap-4'>
          <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
          <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
            <Link href='/collections/women/wedding-specials' className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Wedding Specials</Link>
            <Link href={"/collections/women/sandals"} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Sandals</Link>
            <Link href={'/collections/women/flats'} className='text-sm font-medium text-orange-600 border-r border-l px-3 border-primary'>Flats</Link>
          </div>
        </div>

        {/* Women Shoe Types */}


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
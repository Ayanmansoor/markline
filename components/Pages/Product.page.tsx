'use client'
import CategoriesSection from '@/components/Common/CategoriesSection'
import CarouselProduct from '@/components/Product/CarouselProduct'
import ProductAbout from '@/components/Product/ProductAbout'
import ProductMain from '@/components/Product/ProductMain'
import Specification from '@/components/Product/Specification'
import React from 'react'
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
    staleTime: 1000 * 60 * 10, 
    retry: 3, 
    refetchOnWindowFocus: true, 
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
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });



  if (isLoading) {
    return <div className='w-full relative container px-5  md:px-10   xl:px-20   '>

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
            <section className='container px-5 md:px-10 lg:px-20'>
              <ProductPageSkeleton />
            </section>
            :
            product ?
              <div className='w-full mx-auto h-full container px-3 relative  flex flex-col justify-between gap-2 bg-secondary md:flex-row  md:px-10   xl:px-20  '>
                <div className='  md:max-h-auto  w-full relative p-1 md:h-full  md:w-[60%] lg:w-[55%] '>
                  <ProductMain product={product} />
                </div>
                <ProductAbout product={product} />
              </div>
              :
              <section className='container px-5 md:px-10 lg:px-20'>
                <ProductPageSkeleton />
              </section>
        }

      </section>

      <Specification product={product} />

      {
        newloading ?
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-20 ">
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
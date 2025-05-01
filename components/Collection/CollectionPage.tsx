'use client'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Hero from '../Common/Hero'
import GridRroduct from '../Home/GridRroduct'
import ProductFilter from '../Common/ProductFilter'
import MobFilterSheet from '../Products/MobFilterSheet'
import { IoFilterOutline } from 'react-icons/io5'
import { getProductBaseOnCollection, getAllCollections, getAllBanner, getcollection } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { ProductsProps } from '@/types/interfaces'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'





function CategoryL2page() {
    const { slug } = useParams()
    const [productShow, setProductShow] = useState(20)
    const [productRangevalue, setPRoductRange] = useState(2000)
    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const nslug = Array.isArray(slug) ? slug[0] : slug;


    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", slug],
        enabled: !!slug,
        queryFn: () => getProductBaseOnCollection(nslug),
        staleTime: 10 * 60 * 1000, // 2 minutes caching
    });

   

    const {
        data: allcollection = [],
        isLoading: isLoadingCollections,
        isError: isErrorCollections,
    } = useQuery<any>({
        queryKey: ["collections"],
        queryFn: getAllCollections,
        staleTime: 1000 * 60 * 10,
        retry: 2,
    });
    const {
        data: HomeBanner = [],
        isLoading: bannerLoading,
        isError: isErrorOnBanner,
    } = useQuery<any>({
        queryKey: ["collectionbanner"],
        queryFn: getAllBanner,
        staleTime: 1000 * 60 * 10,
        retry: 2,
    });

   

    
    // const { data: collectiondata , isLoading:collectionLoading, isError:collectionError } = useQuery<any>({
    //     queryKey: ["collection", slug],
    //     enabled: !!slug,
    //     queryFn: () => getcollection(nslug),
    //     staleTime: 10 * 60 * 1000, // 2 minutes caching
    // });


    // console.log(collectiondata,'Collection Data meigth be single')



    useEffect(() => {

        const filterproduct = products?.filter((product) => {
            return product?.price <= productRangevalue
        })
        setFilterProducts(filterproduct)
    },[products,productRangevalue])

    function showMoreProducts() {
        if (products?.length >= 20) {
            setProductShow((prev) => prev += 20)
        }
    }

    return (
        <>
            <Hero bannerImages={HomeBanner} css={" h-[40vh] sm:h-[60vh]"} />

            {/* <SecondHero categoryName={"category"} /> */}

            {/* <CarouselProduct data={{ categoryName: "all" }} />


            <GridRroduct data={{ categoryName: "category", name: "Top Deal On Fasion " }} />

            <CarouselProduct data={{ categoryName: "all" }} /> */}


            {/* <Discount categoryName={"shoes"} /> */}
            <section className="w-full relative grid grid-cols-1 mt-5 md:mt-10 container lg:grid-cols-[1fr_3fr] 2xl:grid-cols-[0.6fr_auto] px-0  md:px-10   xl:px-20 ">
                <span className=' hidden h-fit sticky top-20 lg:block'>
                    <ProductFilter collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} />
                </span>

                <div className="w-full gap-5 pb-10 relative flex flex-col px-5 md:px-10 xl:px-10">
                    <div className="w-full h-auto flex items-center bg-secondary border-b border-gray-300 py-2 justify-between ">
                        <h1 className="text-lg font-medium text-primary">Total Products ( {products?.length} )</h1>
                        <span className=' block  lg:hidden'>
                            <MobFilterSheet collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} >
                                <IoFilterOutline className='text-[20px] text-foreground cursor-pointer ' />
                            </MobFilterSheet>
                        </span>
                    </div>


                    {
                        isLoading ?
                            <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                            </div>
                            :
                            products?.length ?
                                <GridRroduct data={filterProducts ? filterProducts : products} url={'products'} css='sm:grid-cols-[repeat(auto-fill,minmax(204px,auto))] ' /> :
                                <div className="grid grid-cols-2 md:grid-cols-3  gap-3 ">
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                </div>
                    }


                    <section className='w-full relative h-auto flex items-end justify-end pt-10 '>
                        {
                            products?.length >= productShow && <button className='w-fit relative h-auto text-base font-medium border cursor-pointer px-3 py-2  bg-primary text-white ' onClick={showMoreProducts}>
                                Show More
                            </button>
                        }

                    </section>

                </div>
            </section>

        </>
    )
}

export default CategoryL2page
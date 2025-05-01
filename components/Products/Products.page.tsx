'use client'
import React, { useState, useEffect } from 'react'
import { isError, useQuery } from 'react-query'
// import ProductCard from '@/component/ForHome/ProductCard'
import Link from 'next/link'
import { IoFilterOutline } from "react-icons/io5";
import MobFilterSheet from './MobFilterSheet';
import { getAllProducts, getAllCollections } from '@/Supabase/SupabaseApi'
import ProductFilter from '../Common/ProductFilter';
import GridRroduct from '../Home/GridRroduct';
import Discount from '../Discounts/Discount';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';
import { ProductsProps } from '@/types/interfaces';


function Productspage() {
    const [productRangevalue, setPRoductRange] = useState(2400)
    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const {
        data: allproducts = [],
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
    } = useQuery<any>({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 1000 * 60 * 10, // Keep fresh for 2 minutes
        retry: 1,
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

    useEffect(() => {
        const filterproduct = allproducts?.filter((product: ProductsProps) => {
            return product?.price <= productRangevalue
        })
        setFilterProducts(filterproduct)
    }, [productRangevalue,allproducts])




    if (isLoadingProducts || isLoadingCollections) return <div className='w-full relative h-[60vh] container  py-10  px-5  md:px-10   xl:px-20'></div>;
    if (isErrorProducts || isErrorCollections) return <p>Error fetching data</p>;
    return (
        <>
            {/* <Hero categoryName={"category"} /> */}
            {/* <SecondHero categoryName={"category"} /> */}

            {/* <CarouselProduct data={{ categoryName: "all" }} />


            <GridRroduct data={{ categoryName: "category", name: "Top Deal On Fasion " }} />

            <CarouselProduct data={{ categoryName: "all" }} /> */}


            <section className="w-full min-h-[300px] relative grid grid-cols-1 container lg:grid-cols-[1fr_3fr] 2xl:grid-cols-[0.6fr_auto] px-2  md:px-10   xl:px-20 ">
                {
                    isErrorCollections ?
                        <div className='text-center text-sm font-medium'>
                            Filter Data not Availble
                        </div>
                        :
                        <span className=' hidden sticky top-20  h-fit  lg:block'>
                            <ProductFilter collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} />
                        </span>

                }

                <div className="w-full gap-5 pb-10 relative flex flex-col px-0 md:px-10 xl:px-10">
                    <div className="w-full h-auto flex items-center bg-secondary border-b border-gray-300 py-2 justify-between ">
                        <h1 className="text-lg font-medium text-primary w-full">Total Products ( {allproducts && allproducts?.length} )</h1>
                        <span className=' block  lg:hidden'>
                            <MobFilterSheet collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange}>
                                <IoFilterOutline className='text-[20px] text-foreground cursor-pointer ' />
                            </MobFilterSheet>
                        </span>

                    </div>
                    {
                        isLoadingProducts ?

                            <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                            </div>
                            :
                            allproducts.length > 0 || filterProducts && filterProducts?.length > 0 ?
                                <GridRroduct data={filterProducts ? filterProducts : allproducts} url={'products'} css='sm:grid-cols-[repeat(auto-fill,minmax(204px,auto))] ' />
                                :
                                <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                </div>
                    }


                </div>
            </section>
            <Discount />


        </>
    )
}

export default Productspage
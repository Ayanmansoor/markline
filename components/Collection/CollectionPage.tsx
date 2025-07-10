'use client'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Hero from '../Common/Hero'
import GridRroduct from '../Home/GridRroduct'
import ProductFilter from '../Common/ProductFilter'
import MobFilterSheet from '../Products/MobFilterSheet'
import { IoFilterOutline } from 'react-icons/io5'
import { getProductBaseOnCollection, getAllCollections, getAllBanner, getcollection, getAllCollectionsBaseOnGender } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { ProductsProps } from '@/types/interfaces'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import Link from 'next/link'
import L2Banner from '../Common/L2Banner'
import { FreeMode, Pagination } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';



import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

function CategoryL2page() {
    const { collection,gender } = useParams()
    const [productShow, setProductShow] = useState(20)
    const [productRangevalue, setPRoductRange] = useState(5000)
    const [description, setDescription] = useState<string>("")
    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const nslug = Array.isArray(collection) ? collection[0] : collection;
    const gslug = Array.isArray(gender) ? gender[0] : gender;

    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", collection],
        enabled: !!collection,
        queryFn: () => getProductBaseOnCollection(nslug),
        staleTime: Infinity,        // never becomes stale
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false,   // don't refetch on reconnect
    });

    // console.log(products, "collection product data")

    // const {
    //     data: allcollection = [],
    //     isLoading: isLoadingCollections,
    //     isError: isErrorCollections,
    // } = useQuery<any>({
    //     queryKey: ["collections"],
    //     queryFn: getAllCollections,
    //     staleTime: Infinity,
    //     refetchOnMount: false,      // don't refetch when remounting
    //     refetchOnWindowFocus: false, // don't refetch when window gains focus
    //     refetchOnReconnect: false,
    // });

  const {
        data: allcollection = [],
        isLoading: isLoadingCollections,
        isError: isErrorCollections,
    } = useQuery<any>({
        queryKey: ["collections",gender],
        enabled: !!gender,
        queryFn: () => getAllCollectionsBaseOnGender(gslug),
        staleTime: Infinity,
        refetchOnMount: false,      
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    const {
        data: HomeBanner = [],
        isLoading: bannerLoading,
        isError: isErrorOnBanner,
    } = useQuery<any>({
        queryKey: ["collectionbanner"],
        queryFn: getAllBanner,
        staleTime: Infinity,
        refetchOnMount: false,      
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
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

    }, [productRangevalue])

    function showMoreProducts() {
        if (products?.length >= 20) {
            setProductShow((prev) => prev += 20)
        }
    }

    return (
        <>
            <L2Banner data={HomeBanner} />


                <div className='flex flex-col gap-1 w-fit container border-gray-300 pb-5 border-b '>
                            <h1 className=" text-base md:text-2xl font-semibold h-auto text-primary capitalize">
                                {` ${collection} `.split('-').join(' ')}  – Trendy & Comfortable Footwear for Every Step
                            </h1>
                            <p className=' text-sm md:text-base line-clamp-3 font-medium text-primary '>
                                Step into style with our latest range of {` ${collection} `.split('-').join(' ')}  at Markline Fashion. Our {` ${collection} `.split('-').join(' ')} are crafted to provide the perfect blend of fashion and comfort, ensuring you look and feel great all day long. Whether you&apos;re heading to a casual outing or a formal event, our {` ${collection} `.split('-').join(' ')}  are designed to complement every occasion.
                            </p>

                </div>

            <section className="w-full relative grid grid-cols-1  md:mt-10 container lg:grid-cols-[1fr_3fr] 2xl:grid-cols-[0.8fr_3fr] px-3 lg:px-5 ">
                <span className=' hidden h-fit sticky top-20 lg:block bg-white '>
                    <ProductFilter gender={gslug} collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} />
                </span>

                <div className="w-full gap-5 pb-10 relative flex flex-col  px-3 lg:px-5">
                     
                    <section className='w-full relative gap-2 items-center  h-auto flex md:hidden '>
                        <span className='  items-center gap-2  lg:hidden '>
                            <MobFilterSheet collection={[]} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} >
                                <HiMiniAdjustmentsHorizontal className='text-[37px] text-foreground cursor-pointer border px-2 rounded-md ' />
                            </MobFilterSheet>
                        </span>

                            <Swiper
                                spaceBetween={3}
                                slidesPerView={'auto'}
                                className="mySwiper w-full  relative h-auto "
                            >
                                {
                                    allcollection.map((collec) => (
                                        <SwiperSlide className='max-w-fit  border  px-3 py-1.5   h-auto text-base font-medium rounded-sm' key={collec.slug}>
                                            <Link href={`${collec.slug}`} className='text-sm max-w-fit  relative  font-medium text-primary'>{collec.name}</Link>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                    </section>


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
                                <GridRroduct data={filterProducts ? filterProducts : products} url={'product'} css='sm:grid-cols-[repeat(auto-fill,minmax(250px,auto))] ' /> :
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
            <section className='w-full relative flex flex-col gap-5 container  px-3 lg:px-5   py-10'>
                <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop Footwear By Gender Online</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        <Link href={'/gender/men'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Man Shoes</Link>
                        <Link href={'/gender/women'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Women Shoes</Link>
                        <Link href={'/gender/kids'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
                        <Link href={'/gender/girls'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
                    </div>
                </div>
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop By Shoe Type Online</p>
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

                <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto h-auto">
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

        </>
    )
}

export default CategoryL2page
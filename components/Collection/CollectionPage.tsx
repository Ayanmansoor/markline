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
import Link from 'next/link'
import L2Banner from '../Common/L2Banner'





function CategoryL2page() {
    const { slug } = useParams()
    const [productShow, setProductShow] = useState(20)
    const [productRangevalue, setPRoductRange] = useState(5000)
    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const nslug = Array.isArray(slug) ? slug[0] : slug;

    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", slug],
        enabled: !!slug,
        queryFn: () => getProductBaseOnCollection(nslug),
        staleTime: Infinity,        // never becomes stale
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false,   // don't refetch on reconnect
      });


    const {
        data: allcollection = [],
        isLoading: isLoadingCollections,
        isError: isErrorCollections,
    } = useQuery<any>({
        queryKey: ["collections"],
        queryFn: getAllCollections,
        staleTime: Infinity,        
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
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
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
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
            {/* <Hero bannerImages={HomeBanner} css={" h-[40vh] sm:h-[60vh]"} /> */}
            <L2Banner data={HomeBanner} />

            {/* <SecondHero categoryName={"category"} /> */}

            {/* <CarouselProduct data={{ categoryName: "all" }} />


            <GridRroduct data={{ categoryName: "category", name: "Top Deal On Fasion " }} />

            <CarouselProduct data={{ categoryName: "all" }} /> */}


            {/* <Discount categoryName={"shoes"} /> */}
            <section className="w-full relative grid grid-cols-1 mt-5 md:mt-10 container lg:grid-cols-[1fr_3fr] 2xl:grid-cols-[0.6fr_3fr] px-0  md:px-10   xl:px-20 ">
                <span className=' hidden h-fit sticky top-20 lg:block'>
                    <ProductFilter collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} />
                </span>

                <div className="w-full gap-5 pb-10 relative flex flex-col px-5 md:px-10 xl:px-10">
                    <div className="w-full h-auto flex items-center bg-secondary border-b border-gray-300 py-2 justify-between ">
                        <h1 className="text-lg font-medium text-primary capitalize">Buy   { ` ${slug} `.split('-').join(' ') } Online ( {products?.length} ) </h1>
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
            <section className='w-full relative flex flex-col gap-5 container px-20 py-10'>
                <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop Footwear By Gender Online</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        <Link href={'/collections/MEN'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Men Shoes</Link>
                        <Link href={'/collections/WOMEN'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Women Shoes</Link>
                        <Link href={'/collections/KIDS'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
                        <Link href={'/collection/GIRLS'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
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

                <div className="container py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto h-[400px]">
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
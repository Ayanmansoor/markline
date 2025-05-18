'use client'
import React, { useState, useEffect } from 'react'
import { isError, useQuery } from 'react-query'
// import ProductCard from '@/component/ForHome/ProductCard'
import Link from 'next/link'
import { IoFilterOutline } from "react-icons/io5";
import MobFilterSheet from './MobFilterSheet';
import { getAllProducts, getAllCollections, getBannerBaseonSlug } from '@/Supabase/SupabaseApi'
import ProductFilter from '../Common/ProductFilter';
import GridRroduct from '../Home/GridRroduct';
import Discount from '../Discounts/Discount';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';
import { ProductsProps } from '@/types/interfaces';
import CarouselProduct from '../Product/CarouselProduct';
import L2Banner from '../Common/L2Banner';


function Productspage() {
    const [productRangevalue, setPRoductRange] = useState(5000)
    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const {
        data: allproducts = [],
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
    } = useQuery<any>({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: Infinity,
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false,
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
        data: banner = [],
        isLoading: bannerLoading,
        isError: bannerErorr
    } = useQuery<any>({
        queryKey: ["dynamicBanner"],
        queryFn: () => getBannerBaseonSlug('product'),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    useEffect(() => {
        const filterproduct = allproducts?.filter((product: ProductsProps) => {
            return product?.price <= productRangevalue
        })
        setFilterProducts(filterproduct)
    }, [productRangevalue, allproducts])




    if (isLoadingProducts || isLoadingCollections) return <div className='w-full relative h-[60vh] container  py-10  px-5  md:px-10   xl:px-20'></div>;
    if (isErrorProducts || isErrorCollections) return <p>Error fetching data</p>;
    return (
        <>
            {/* <Hero categoryName={"category"} /> */}
            {/* <SecondHero categoryName={"category"} /> */}
            {/* <CarouselProduct data={{ categoryName: "all" }} />
            <GridRroduct data={{ categoryName: "category", name: "Top Deal On Fasion " }} />
            */}

            <L2Banner data={banner} />

            <section className="w-full min-h-[300px] relative grid grid-cols-1 container lg:grid-cols-[1fr_3fr] 2xl:grid-cols-[0.6fr_3fr] px-2  md:px-10   xl:px-20 ">
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
                        {/* <h1 className="text-lg font-medium text-primary w-full"> Total Products ( {allproducts && allproducts?.length} ) </h1> */}
                        <div className='flex flex-col gap-1 w-fit'>
                            <h1 className="text-2xl font-medium text-primary capitalize">
                                Explore Our Complete Footwear Collection
                            </h1>
                            <p className='text-base line-clamp-3 font-medium text-primary '>
                               Welcome to Markline Fashion&apos;s comprehensive footwear collection, where style meets comfort for every step of life. Our curated selection features a diverse array of shoes for women, kids, and men, including elegant heels, trendy sandals, durable sneakers, and more. Whether youre preparing for a special occasion or seeking everyday essentials, find the perfect pair to match your style and needs. Enjoy seamless shopping with free shipping across India.
                            </p>

                        </div>
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


            <section className='w-full relative flex flex-col gap-5 container px-20 py-10'>
                <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

                {/* Gender-Based Links */}
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        <Link href='/collections/MEN' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Men Shoes</Link>
                        <Link href='/collections/WOMEN' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Shoes</Link>
                        <Link href='/collections/KIDS' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Kids Shoes</Link>
                        <Link href='/collections/GIRLS' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Girls Shoes</Link>
                    </div>
                </div>

                {/* Shoe Type Links */}
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        <Link href='/collections/wedding-specials' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Wedding Specials</Link>
                        <Link href='/collections/sandals' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Sandals</Link>
                        <Link href='/collections/flats' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Flats</Link>
                        <Link href='/collections/thongs' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Thongs</Link>
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
                        <Link href='/collections/thongs' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Thongs</Link>
                        <Link href='/collections/ballerinas' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Ballerinas</Link>
                        <Link href='/collections/mules' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Mules</Link>
                    </div>
                </div>

                {/* Informational Sections */}
                <div className='container py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto h-[400px]'>
                    <section>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Explore Footwear for Everyone</h2>
                        <p className='text-gray-700'>
                            From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women,
                            our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends
                            to create a seamless experience for every step of life.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Types of Footwear by Gender</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2'>
                            <li><strong>For Men:</strong> Versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers for every occasion.</li>
                            <li><strong>For Women:</strong> Elegant heels, trendy flats, ethnic Kolhapuris, and comfy slip-ons—where style meets comfort.</li>
                            <li><strong>For Kids:</strong> Fun, flexible, and durable shoes like velcro sneakers and sporty sandals built for adventure.</li>
                            <li><strong>For GenZ:</strong> Bold, expressive picks—chunky sneakers, graphic slip-ons, and trend-driven sandals.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4'>How to Choose the Right Shoes</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2'>
                            <li><strong>Age & Style:</strong> Opt for designs that fit the age group—playful for kids, expressive for GenZ, versatile for adults.</li>
                            <li><strong>Occasion:</strong> Match your footwear to your lifestyle—casual, formal, or festive.</li>
                            <li><strong>Fit & Comfort:</strong> Use sizing guides and reviews. Look for arch support and padded soles.</li>
                            <li><strong>Material:</strong> Leather for durability, mesh for breathability, synthetics for lightweight comfort.</li>
                            <li><strong>Wear Frequency:</strong> Durable shoes for daily wear; lightweight styles for occasional flair.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Footwear Trends for All</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2'>
                            <li><strong>Bold Soles:</strong> Platforms and thick soles dominate the streets and runways.</li>
                            <li><strong>Pastel Tones & Neutrals:</strong> Understated hues that work across outfits and age groups.</li>
                            <li><strong>Retro Revivals:</strong> Mary Janes, moccasins, and high-tops making a bold comeback.</li>
                            <li><strong>Tech Comfort:</strong> Cushioned insoles and lightweight builds for all-day support.</li>
                            <li><strong>Ethnic Fusion:</strong> Classic Indian silhouettes blended with modern designs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Why Quality Footwear Matters</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2'>
                            <li><strong>Comfort:</strong> Well-made shoes reduce fatigue and make walking a breeze.</li>
                            <li><strong>Durability:</strong> Quality craftsmanship means less frequent replacements.</li>
                            <li><strong>Foot Health:</strong> Good fit and cushioning prevent heel pain and blisters.</li>
                            <li><strong>Confidence:</strong> When your shoes feel good, you walk with confidence and style.</li>
                        </ul>
                    </section>
                </div>
            </section>

            <Discount />



        </>
    )
}

export default Productspage
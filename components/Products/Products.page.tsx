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
import CategoriesSection from '../Common/CategoriesSection';
import WihlistCardSection from '../Product/WihlistCardSection';
import { useWishlists } from '@/Contexts/wishlist';
import SecondHero from '../Common/SecondHero';
import { useParams } from 'next/navigation';


import { FreeMode, Pagination } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";



const data = [
    {
        title: "Shop Women’s Formal Shoes, Heels & Sandals  Markline  Footwear",
        discription: "Discover Markline’s women’s formal shoes collection featuring elegant heels, sophisticated sandals & stylish workwear footwear. Shop premium leather designs crafted for timeless comfort and free shipping across India.",
        slug: "women"
    },
    {
        title: "Shop Men’s Formal Shoes, Oxfords & Loafers  Markline Classic Footwear",
        discription: "Discover Markline’s men’s formal shoe collection featuring premium leather oxfords, loafers & dress shoes. Handcrafted elegance meets comfort—free shipping across India.",
        slug: "men"
    },
    {
        title: "Buy Kids’ School Shoes & Formal Footwear  Markline Kids",
        discription: "Explore Markline Kids’ footwear: durable school shoes, formal pairs & comfortable everyday styles. Designed for growing feet, free shipping across India.",
        slug: "kids"
    }
]



function    Productspage() {
    const [productRangevalue, setPRoductRange] = useState(5000)
    const { slug } = useParams()
    const productslug = Array.isArray(slug) ? slug[0] : slug;

    const [filterProducts, setFilterProducts] = useState<ProductsProps[]>()
    const {
        data: allproducts = [],
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
    } = useQuery<any>({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: Infinity,
        refetchOnMount: false,      
        refetchOnWindowFocus: false,
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
        refetchOnMount: false,      
        refetchOnWindowFocus: false,
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
        if (productslug) {
            const filterproduct = allproducts?.filter((product: ProductsProps) => {
                return product?.price <= productRangevalue && product.gender == productslug.toUpperCase()
            })
            setFilterProducts(filterproduct)
        }
        else {
            const filterproduct = allproducts?.filter((product: ProductsProps) => {
                return product?.price <= productRangevalue
            })
            setFilterProducts(filterproduct)
        }
    }, [productRangevalue, allproducts])




    if (isLoadingProducts || isLoadingCollections) return <div className='w-full relative h-[60vh] container  py-10  '></div>;
    if (isErrorProducts || isErrorCollections) return <p>Error fetching data</p>;
    return (
        <>
            {/* <Hero categoryName={"category"} /> */}
            {/* <CarouselProduct data={{ categoryName: "all" }} />
            <GridRroduct data={{ categoryName: "category", name: "Top Deal On Fasion " }} />
            */}

            <L2Banner data={banner} />

            <div className='w-full relative h-auto flex flex-col  pb-5 mb-6 border-b border-gray-300 px-3 md:px-5 lg:px-10'>
                {
                            productslug ?
                                data.map((item, index) => (
                                    item.slug == productslug &&
                                    <div className='flex flex-col gap-1 w-fit' key={index}>
                                        <h1 className=" text-xl
                                          lg:text-2xl text-semibold lg:font-medium text-primary capitalize">
                                            {item.title}
                                        </h1>
                                        <p className=' text-sm  line-clamp-3 font-medium text-primary '>
                                            {item.discription}
                                        </p>
                                    </div>
                                ))
                                :
                                <div className='flex flex-col gap-1 w-fit' >
                                    <h1 className=" text-xl  lg:text-2xl  font-semibold lg:font-medium text-primary capitalize">
                                        Shop Men’s, Women’s & Kids’ Formal Footwear – Markline Premium Shoes
                                    </h1>
                                    <p className='text-sm  line-clamp-3 font-medium text-primary '>
                                        Explore Markline’s premium formal footwear for men, women & kids. Discover handcrafted oxfords, elegant heels & durable school shoes—all with free shipping across India.
                                    </p>
                                </div>
                }    
            </div>    

            <section className="w-full min-h-[300px] relative grid grid-cols-1  lg:grid-cols-[.7fr_3fr] 2xl:grid-cols-[0.8fr_3fr] gap-5 px-3 md:px-5 lg:px-5 ">
                {
                    isErrorCollections ?
                        <div className='text-center text-sm font-medium'>
                            Filter Data not Availble
                        </div>
                        :
                        <span className=' hidden sticky top-20  h-fit  lg:block bg-white border border-gray-200 p-2 rounded-md'>
                            <ProductFilter gender={productslug} collection={productslug ? allcollection.filter((item) => item.gender == productslug.toUpperCase()) : allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} />
                        </span>

                }

                <div className="w-full gap-5 pb-10 relative flex flex-col ">
                        {/* <h1 className="text-lg font-medium text-primary w-full"> Total Products ( {allproducts && allproducts?.length} ) </h1> */}
                    
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
                        isLoadingProducts ?

                            <div className="grid grid-cols-2 md:grid-cols-3  gap-3  ">
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                            </div>
                            :
                            allproducts.length > 0 || filterProducts && filterProducts?.length > 0 ?
                                <GridRroduct data={filterProducts ? filterProducts : allproducts} url={'product'} css=' sm:grid-cols-[repeat(auto-fill,minmax(230px,auto))]  lg:grid-cols-[repeat(auto-fill,minmax(270px,auto))]  xl:grid-cols-[repeat(auto-fill,minmax(300px,auto))] 2xl:grid-cols-[repeat(auto-fill,minmax(350px,auto))] '  productsCardCss={" h-[220px] sm:h-[300px] md:h-[250px] lg:h-[300px] xl:h-[400px]"}/>
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

            {/* {
                wishlist.length > 0 &&
                <CategoriesSection title={"Your Whishlist Products "} url={'products'} >
                    <WihlistCardSection url={'products'} />
                </CategoriesSection >
            } */}



            <section className='w-full relative flex flex-col gap-5   py-10 px-3 lg:px-10'>
                <h2 className=' text-base md:text-xl font-semibold md:font-medium text-primary'>POPULAR SEARCHES</h2>

                {/* Gender-Based Links */}
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className=' text-base font-semibold md:font-medium text-primary'>Shop Shoes By Gender</p>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        <Link href='/collections/men' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Men Shoes</Link>
                        <Link href='/collections/women' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Women Shoes</Link>
                        <Link href='/collections/kids' className='text-sm font-medium text-orange-600 border-x px-3 border-primary'>Kids Shoes</Link>
                    </div>
                </div>

                {/* Shoe Type Links */}
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className=' text-base font-semibold md:font-medium  text-primary'>Shop By Shoe Type</p>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        {
                          allcollection.map((item,index)=>(
                            item.gender==`${productslug}`.toUpperCase() &&
                            <Link href={`/collections/${`${item.gender}`.toLowerCase()}/${item.slug}`} className='text-sm font-medium text-orange-600 border-x px-3 border-primary' key={index}>{item.name}</Link>
                          ))  
                        }
                       
                    </div>
                </div>

                {/* Women-Specific Types */}
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className=' text-base font-semibold md:font-medium  text-primary capitalize'>Shop By {productslug} Shoe Type</p>
                    <div className='w-full flex flex-wrap items-center gap-2'>
                        {
                          allcollection.map((item,index)=>(
                            item.gender==`${productslug}`.toUpperCase() &&
                            <Link href={`/collections/${`${item.gender}`.toLowerCase()}/${item.slug}`} className='text-sm font-medium text-orange-600 border-x px-3 border-primary' key={index}>{item.name}</Link>
                          ))  
                        }
                    </div>
                </div>

                {/* Informational Sections */}
                <div className=' py-10 flex flex-col gap-10 no-scrollbar px-3   overflow-y-auto  lg:px-10'>
                    <section>
                        <h2 className=' text-base  font-semibold mb-4'>Explore Footwear for Everyone</h2>
                        <p className='text-gray-700 text-sm '>
                            From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women,
                            our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends
                            to create a seamless experience for every step of life.
                        </p>
                    </section>

                    <section>
                        <h2 className=' text-base  font-semibold mb-4'>Types of Footwear by Gender</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm  '>
                            <li><strong>For Men:</strong> Versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers for every occasion.</li>
                            <li><strong>For Women:</strong> Elegant heels, trendy flats, ethnic Kolhapuris, and comfy slip-ons—where style meets comfort.</li>
                            <li><strong>For Kids:</strong> Fun, flexible, and durable shoes like velcro sneakers and sporty sandals built for adventure.</li>
                            <li><strong>For GenZ:</strong> Bold, expressive picks—chunky sneakers, graphic slip-ons, and trend-driven sandals.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className=' text-base  font-semibold mb-4'>How to Choose the Right Shoes</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm '>
                            <li><strong>Age & Style:</strong> Opt for designs that fit the age group—playful for kids, expressive for GenZ, versatile for adults.</li>
                            <li><strong>Occasion:</strong> Match your footwear to your lifestyle—casual, formal, or festive.</li>
                            <li><strong>Fit & Comfort:</strong> Use sizing guides and reviews. Look for arch support and padded soles.</li>
                            <li><strong>Material:</strong> Leather for durability, mesh for breathability, synthetics for lightweight comfort.</li>
                            <li><strong>Wear Frequency:</strong> Durable shoes for daily wear; lightweight styles for occasional flair.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className=' text-base  font-semibold mb-4'>Footwear Trends for All</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm '>
                            <li><strong>Bold Soles:</strong> Platforms and thick soles dominate the streets and runways.</li>
                            <li><strong>Pastel Tones & Neutrals:</strong> Understated hues that work across outfits and age groups.</li>
                            <li><strong>Retro Revivals:</strong> Mary Janes, moccasins, and high-tops making a bold comeback.</li>
                            <li><strong>Tech Comfort:</strong> Cushioned insoles and lightweight builds for all-day support.</li>
                            <li><strong>Ethnic Fusion:</strong> Classic Indian silhouettes blended with modern designs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className=' text-base  font-semibold mb-4'>Why Quality Footwear Matters</h2>
                        <ul className='list-disc list-inside text-gray-700 space-y-2 text-sm '>
                            <li><strong>Comfort:</strong> Well-made shoes reduce fatigue and make walking a breeze.</li>
                            <li><strong>Durability:</strong> Quality craftsmanship means less frequent replacements.</li>
                            <li><strong>Foot Health:</strong> Good fit and cushioning prevent heel pain and blisters.</li>
                            <li><strong>Confidence:</strong> When your shoes feel good, you walk with confidence and style.</li>
                        </ul>
                    </section>
                </div>
            </section>





        </>
    )
}

export default Productspage
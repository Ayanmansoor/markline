'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import GridRroduct from '../Home/GridRroduct'
import ProductFilter from '../Common/ProductFilter'
import { getProductBaseOnCollection, getAllCollections, getAllBanner, getcollection, getAllCollectionsBaseOnGender } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { Colors, Images, NewProductProps, ProductsProps, ProductVariant, Sizes } from '@/types/interfaces'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import Link from 'next/link'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { selectColorAndSizesProps } from '../Products/Products.page'




function CategoryL2page() {
    const { collection, group } = useParams()
    const [productShow, setProductShow] = useState(20)
    const [productRangevalue, setPRoductRange] = useState(5000)
    const [filterProducts, setFilterProducts] = useState<NewProductProps[]>()
    const nslug = Array.isArray(collection) ? collection[0] : collection;
    const gslug = Array.isArray(group) ? group[0] : group;
    const [selectColorAndSizes, setSelectColorAndSizes] = useState<selectColorAndSizesProps>({
        color: [],
        size: []
    })

    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", nslug],
        enabled: !!collection,
        queryFn: () => getProductBaseOnCollection(nslug),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


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
        queryKey: ["collections", gslug],
        enabled: !!group,
        queryFn: () => getAllCollectionsBaseOnGender(gslug),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    // const {
    //     data: HomeBanner = [],
    //     isLoading: bannerLoading,
    //     isError: isErrorOnBanner,
    // } = useQuery<any>({
    //     queryKey: ["collectionbanner"],
    //     queryFn: getAllBanner,
    //     staleTime: Infinity,
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: false,
    // });




    // const { data: collectiondata , isLoading:collectionLoading, isError:collectionError } = useQuery<any>({
    //     queryKey: ["collection", slug],
    //     enabled: !!slug,
    //     queryFn: () => getcollection(nslug),
    //     staleTime: 10 * 60 * 1000, // 2 minutes caching
    // });


    // console.log(collectiondata,'Collection Data meigth be single')

    useEffect(() => {
        if (!products) return;

        const filtered = products.filter((product: NewProductProps) => {
            const variants = product?.product_variants || [];

            // --- PRICE check ---
            const lowestPrice = variants.length
                ? Math.min(...variants.map(variant => variant.price || 0))
                : 0;
            const matchPrice = lowestPrice <= productRangevalue;

            // --- GENDER check ---
            const matchGender = gslug
                ? product.gender === gslug.toUpperCase()
                : true;

            // --- COLOR check ---
            const matchColor =
                !selectColorAndSizes.color?.length ||
                variants.some(variant => {
                    let colorArray: Colors[] = [];
                    if (typeof variant.colors === "string") {
                        try {
                            const parsed = JSON.parse(variant.colors);
                            colorArray = Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            return false;
                        }
                    } else if (Array.isArray(variant.colors)) {
                        colorArray = variant.colors.map(c =>
                            typeof c === "string" ? JSON.parse(c) : c
                        );
                    }

                    return colorArray.some(c =>
                        selectColorAndSizes.color?.includes(c.name)
                    );
                });

            // --- SIZE check ---
            const matchSize =
                !selectColorAndSizes.size?.length ||
                variants.some(variant => {
                    let sizeArray: Sizes[] = [];
                    if (typeof variant.sizes === "string") {
                        try {
                            const parsed = JSON.parse(variant.sizes);
                            sizeArray = Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            return false;
                        }
                    } else if (Array.isArray(variant.sizes)) {
                        sizeArray = variant.sizes.map(s =>
                            typeof s === "string" ? JSON.parse(s) : s
                        );
                    }

                    return sizeArray.some(s =>
                        selectColorAndSizes.size?.includes(s.size)
                    );
                });

            return matchPrice && matchGender && matchColor && matchSize;
        });

        setFilterProducts(filtered);
    }, [products, productRangevalue, gslug, selectColorAndSizes]);


    function showMoreProducts() {
        if (products?.length >= 20) {
            setProductShow((prev) => prev += 20)
        }
    }

    const { allColors, allSizes } = useMemo(() => {
        const colorMap = new Map<string, Colors>();
        const sizeMap = new Map<string, Sizes>();

        products?.forEach((product: any) => {
            product.product_variants?.forEach((variant: ProductVariant) => {
                let colorArray: Colors[] = [];
                let sizeArray: Sizes[] = [];

                // normalize colors
                if (Array.isArray(variant.colors)) {
                    colorArray = variant.colors.map((item) =>
                        typeof item === "string" ? JSON.parse(item) : item
                    );
                } else if (typeof variant.colors === "string") {
                    try {
                        const parsed = JSON.parse(variant.colors);
                        colorArray = Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        colorArray = [];
                    }
                }

                // normalize sizes
                if (Array.isArray(variant.sizes)) {
                    sizeArray = variant.sizes.map((item) =>
                        typeof item === "string" ? JSON.parse(item) : item
                    );
                } else if (typeof variant.sizes === "string") {
                    try {
                        const parsed = JSON.parse(variant.sizes);
                        sizeArray = Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        sizeArray = [];
                    }
                }

                // add unique colors
                colorArray.forEach((color) => {
                    if (color?.name && !colorMap.has(color.name)) {
                        colorMap.set(color.name, color);
                    }
                });

                // add unique sizes
                sizeArray.forEach((size) => {
                    if (size?.size && !sizeMap.has(size.size)) {
                        sizeMap.set(size.size, size);
                    }
                });
            });
        });

        return {
            allColors: Array.from(colorMap.values()),
            allSizes: Array.from(sizeMap.values()),
        };
    }, [products]);




    return (
        <>
            {/* <L2Banner data={HomeBanner} />/ */}


            <Breadcrumb className='w-full relative  md:px-5 lg:px-10'>
                <BreadcrumbList className='w-full relative h-auto flex items-center py-5 rounded-lg px-3 '>
                    <BreadcrumbItem >
                        <BreadcrumbLink href="/Home" className=' text-sm md:text-base lg:text-xl text-primary cursor-pointer'>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/collections/${gslug}`} className=' text-sm sm:text-base md:text-xl lg:text-2xl text-primary cursor-pointer'>{gslug}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className='text-sm sm:text-base md:text-xl lg:text-2xl text-primary cursor-pointer'>{nslug.split('-').join(' ')}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className=' text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary capitalize px-3 md:px-5 lg:px-10 '>{nslug.split('-').join(' ')} {`[${products ? products.length : ""}]`}  </h1>


            <section className='w-full relative gap-2 items-center px-3 md:px-5 lg:px-10  mt-5  h-auto flex border-b border-gray-400 pb-3  '>

                <Swiper
                    slidesPerView={'auto'}
                    className="mySwiper w-full  relative h-auto "
                >
                    {
                        allcollection.map((collec) => (
                            <SwiperSlide className='max-w-fit  border   px-1  h-auto text-base font-medium rounded-sm' key={collec.slug}>
                                <Link href={`${collec.slug}`} className={`  ${nslug == collec.slug ? " text-white bg-black " : "bg-white text-primary"} text-sm max-w-fit  relative  px-5 rounded-lg py-3 font-medium `}>{collec.name}</Link>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>


            <section className="w-full min-h-[300px] mt-5 relative  gap-10  bg-gray-200  ">
                <span className=' flex items-center border-b border-white w-full justify-between h-fit sticky top-20   py-5 px-3 md:px-5 lg:px-10 '>
                    <ProductFilter gender={gslug} collection={allcollection} productRangevalue={productRangevalue} setPRoductRange={setPRoductRange} slug={nslug} colors={allColors} sizes={allSizes} SetselectColorAndSizes={setSelectColorAndSizes } />
                </span>

                <div className="w-full gap-5  relative flex flex-col  px-3 md:px-5 lg:px-10  pt-10 ">
                    {
                        isLoading ?
                            <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3  lg:grid-cols-4  items-start justify-start gap-3 px-5  lg:px-10   ">
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                                <ProductCardSkeleton />
                            </div>
                            :
                            products?.length ?
                                <GridRroduct data={filterProducts ? filterProducts : products} url={'product'} css='grid-cols-2 md:grid-cols-3  lg:grid-cols-4 bg-gray-200 '  productsCardCss=' h-[250px]  sm:h-[300px] md:h-[350px] lg:h-[400px]' /> :
                                <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3  lg:grid-cols-4   items-start justify-start gap-3 px-5  lg:px-10   ">
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

            <section className='w-full relative flex flex-col gap-5   px-3 lg:px-10   py-10'>
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
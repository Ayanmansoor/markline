'use client'
import React from 'react'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import Discount from '../Discounts/Discount'
import { getCollectionBaseOnGender, getAllBanner, getProductBaseOnCollection, } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { CldImage } from 'next-cloudinary';
import Link from 'next/link'


function GenderPage() {

    const { slug } = useParams()
    const nslug = Array.isArray(slug) ? slug[0] : slug;
    const finalslug = nslug.toUpperCase()
    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", slug],
        enabled: !!slug,
        queryFn: () => getProductBaseOnCollection(finalslug),
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

    const { data: genderCollection, isLoading: isGenderLoading, isError: isGenderDataerror } = useQuery<any>({
        queryKey: ["gendercollection", slug],
        enabled: !!slug,
        queryFn: () => getCollectionBaseOnGender(finalslug),
        staleTime: Infinity,
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false,
    });



    return (
        <>
            <Hero bannerImages={HomeBanner} css={" h-[40vh] sm:h-[60vh]"} />

            {/* <CldImage
                src="https://res.cloudinary.com/demhgityh/image/upload/v1746551239/black-embellished-flip-flops-for-women-2_niiqb7.jpg" 
                width={600}
                height={600}
                alt="Premium Shoe"
                crop="fill"
            /> */}

            {

                genderCollection?.length > 0 ?
                    <CategoriesSection title={"Women's Collection"} url="collections">
                        <Collectionsection collections={genderCollection} url={'collections'} />
                    </CategoriesSection>
                    :
                    <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 xl:px-20 ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
            }

            {
                products?.length > 0 ?
                    <CategoriesSection title={"Shop for Women's Collection Online"} url="products">
                        <GridRroduct data={products?.slice(0, 10)} url={'products'} />
                    </CategoriesSection>
                    :
                    <div className="grid grid-cols-2 py-5 lg:py-10 md:grid-cols-3 lg:grid-cols-4 items-start justify-start gap-3 container px-5 md:px-10 xl:px-20  ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
            }

            <Discount />
            <section className='w-full relative flex flex-col gap-5 container px-5 md:px-10 lg:px-20  pb-10'>
                <h2 className='text-xl font-medium text-primary'>POPULAR SEARCHES</h2>

                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop Shoes By Gender</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        <Link href={'/collections/MEN'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Men Shoes</Link>
                        <Link href={'/collections/WOMEN'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Women Shoes</Link>
                        <Link href={'/collections/KIDS'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
                        <Link href={'/collection/GIRLS'} className='text-sm font-medium text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
                    </div>
                </div>
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-medium text-primary'>Shop By Shoe Type</p>
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

                <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto h-[400px]">
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

export default GenderPage
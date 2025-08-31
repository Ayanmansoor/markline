'use client'
import React from 'react'
import Hero from '../Common/Hero'
import CategoriesSection from '../Common/CategoriesSection'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'
import Collectionsection from '../Home/Collectionsection'
import GridRroduct from '../Home/GridRroduct'
import Discount from '../Discounts/Discount'
import { getCollectionBaseOnGender, getAllBanner, getProductBaseOnCollection, getAllCollectionWithProducts, } from '@/Supabase/SupabaseApi'
import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { CldImage } from 'next-cloudinary';
import Link from 'next/link'


function GenderPage() {

    const { group } = useParams()
    const nslug = Array.isArray(group) ? group[0] : group;
    const finalslug = nslug.toUpperCase()

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

    const { data: genderCollection, isLoading: isGenderLoading, isError: isGenderDataerror } = useQuery<any>({
        queryKey: ["gendercollection", group],
        enabled: !!group,
        queryFn: () => getCollectionBaseOnGender(finalslug),
        staleTime: Infinity,
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false,
    });

  const { data: collectionAlongWithProducts = [], isLoading: collectionAlongWithLoading, isError: collectionerrorLoading } = useQuery<any>({
    queryKey: ["collectionAlongWithProducts", "WOMEN"], // you can also pass the gender as part of the key
    queryFn: () => getAllCollectionWithProducts(`${finalslug}`.toUpperCase()),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

    return (
        <>
            <Hero bannerImages={HomeBanner} css={" h-[40vh] sm:h-[60vh]"} />

      
            {

                genderCollection?.length > 0 ?
                    <CategoriesSection title={` ${nslug} Footwear Collection, Style, Comfort & Quality`} subtitle={`Explore our curated ${nslug} footwear .`} isH1={true} url="collections" urltext='collections'> 
                        <Collectionsection collections={genderCollection} url={`collections/${group}`} />
                    </CategoriesSection>
                    :
                    <div className="grid py-5 lg:py-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start justify-start gap-3  px-3 lg:px-5 ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
            }

            {
                collectionAlongWithProducts?.length > 0 ?
                collectionAlongWithProducts.map((item,index)=>(
                    <CategoriesSection title={`${item.name} Footwear Collection for Comfort and Style`} subtitle={`Browse our curated ${nslug} shoes .`} url="products"  urltext={` ${nslug} products`} key={index}>
                        <GridRroduct data={item.products} url={'product'}  css=' grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'  productsCardCss={" h-[280px] sm:h-[300px] md:h-[350px] lg:h-[390px] xl:h-[450px]"} />
                    </CategoriesSection>
                    ))
                    :
                    <div className="grid  py-5 lg:py-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  items-start justify-start gap-3  px-3 lg:px-5  ">
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </div>
            }

            <Discount title={`Spotlight ${nslug} Footwear: Featured Styles You'll Love`} description={`Explore our top picks from the ${nslug} collection—curated for quality, comfort, and on‑trend appeal. Whether it's chic sandals, cozy sneakers, or elegant dress shoes, these standout styles are designed to elevate your everyday wardrobe.`} url='' />
            <section className='w-full relative flex flex-col gap-5  px-3 lg:px-5  pb-10'>
                <h2 className='text-xl font-semibold text-primary'>POPULAR SEARCHES</h2>

                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-semibold text-primary'>Shop Shoes By Gender</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        <Link href={'/collections/men'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Men Shoes</Link>
                        <Link href={'/collections/women'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Women Shoes</Link>
                        <Link href={'/collections/kids'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary '>Kids Shoes</Link>
                        <Link href={'/collections/girls'} className='text-sm font-semibold text-orange-600 border-r border-l text-primary   px-3 border-primary '>Grils Shoes</Link>
                    </div>
                </div>
                <div className='w-full relative h-auto flex flex-col gap-4'>
                    <p className='text-base font-semibold text-primary'>Shop By Shoe Type</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        {
                            genderCollection &&
                            genderCollection.map((item,index)=>(
                            <Link href={`/collections/${item.gender}/${item.slug}`} className='text-sm font-semibold text-orange-600  border-l text-primary  px-3 border-primary' key={index}>{item.name}</Link>
                            ))
                        }
                        
                    </div>
                </div>

                <div className='w-full relative h-auto flex flex-col gap-2'>
                    <p className='text-base font-semibold text-primary'>Shop By Women Shoe Type</p>
                    <div className='w-full relative h-auto flex flex-wrap items-center gap-2'>
                        <Link href='/collections/women/wedding-specials' className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Wedding Specials</Link>
                        <Link href={"/collections/women/sandals"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Sandals</Link>
                        <Link href={'/collections/women/flats'} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Flats</Link>
                        <Link href={"/collections/women/Thongs sandels"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Thongs sandels</Link>
                        <Link href={"/collections/women/ballerinas"} className='text-sm font-semibold text-orange-600  border-l text-primary   px-3 border-primary'>Women Ballerinas</Link>
                        <Link href={"/collections/women/mules"} className='text-sm font-semibold text-orange-600 border-r border-l text-primary   px-3 border-primary'>Women Mule</Link>
                    </div>
                </div>

                <div className=" py-10 flex flex-col gap-10 no-scrollbar overflow-y-auto ">
                    <section>
                        <h2 className=" text-lg lg:text-xl  font-semibold mb-4">Explore Footwear for Everyone</h2>
                        <p className="text-gray-700 text-base">
                            From playful kicks for kids to fashion-forward styles for GenZ, timeless classics for men, and elegant essentials for women, our diverse collection ensures that everyone finds their perfect fit. We combine comfort, quality, and the latest trends to create a seamless experience for every step of life.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Types of Footwear by Gender</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
                            <li><strong>For Men:</strong> Discover versatile lace-ups, loafers, ethnic mojaris, and street-ready sneakers designed for daily grind and weekend style.</li>
                            <li><strong>For Women:</strong> Choose from elegant heels, trendy flats, ethnic kolhapuris, and comfy slip-ons—perfectly balancing fashion and comfort.</li>
                            <li><strong>For Kids:</strong> Fun, flexible, and durable shoes tailored for growing feet. Explore velcro sneakers, sandals, and colorful sports shoes that keep up with their energy.</li>
                            <li><strong>For GenZ:</strong> Bold, expressive footwear like chunky sneakers, graphic slip-ons, and trend-led sandals that match their ever-evolving fashion sense.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">How to Choose the Right Shoes</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
                            <li><strong>Age & Style:</strong> Select age-appropriate designs—functional and playful for kids, expressive for GenZ, and versatile for adults.</li>
                            <li><strong>Occasion:</strong> From casual outings to formal events, choose shoes that match your lifestyle and schedule.</li>
                            <li><strong>Fit & Comfort:</strong> Always check sizing charts and customer reviews. Comfort features like arch support and padded soles are a must.</li>
                            <li><strong>Material:</strong> Leather for durability, mesh for breathability, and canvas or synthetics for affordability and flair.</li>
                            <li><strong>Wear Frequency:</strong> For frequent use, invest in supportive, durable shoes. For style rotation, consider lighter designs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Footwear Trends for All</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
                            <li><strong>Bold Soles:</strong> Platform sneakers and boots are popular across ages and genders.</li>
                            <li><strong>Pastel Tones & Neutrals:</strong> Universally flattering hues dominating this season.</li>
                            <li><strong>Retro Revivals:</strong> Styles like Mary Janes and high-top sneakers are making a fashionable comeback.</li>
                            <li><strong>Tech Comfort:</strong> Cushioned footbeds and lightweight designs for all-day wear.</li>
                            <li><strong>Ethnic Fusion:</strong> Traditional designs reimagined for modern wardrobes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Why Quality Footwear Matters</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
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
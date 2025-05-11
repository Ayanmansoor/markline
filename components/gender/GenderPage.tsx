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


function GenderPage() {

    const { slug } = useParams()
    const nslug = Array.isArray(slug) ? slug[0] : slug;

    const { data: products, isLoading, isError } = useQuery<any>({
        queryKey: ["collectiondatabaseonslug", slug],
        enabled: !!slug,
        queryFn: () => getProductBaseOnCollection(nslug),
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
        queryFn: () => getCollectionBaseOnGender(nslug),
        staleTime: Infinity,        
        refetchOnMount: false,      // don't refetch when remounting
        refetchOnWindowFocus: false, // don't refetch when window gains focus
        refetchOnReconnect: false, 
    });
    console.log(genderCollection, 'gender colection')



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
                    <CategoriesSection title={"Styles Made for You"} url="collections">
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
                    <CategoriesSection title={"Styles Made for You"} url="products">
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


        </>
    )
}

export default GenderPage
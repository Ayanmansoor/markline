'use client'
import React, { useEffect, useState } from 'react'

import MegamanuCard from './MegamanuCard';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useQuery } from 'react-query';
import { getAllCollections, getProductBaseOnCollection } from '@/Supabase/SupabaseApi';
import Link from 'next/link';
import MegaManuCarSkeleton from '../Skeleton/MegaManuCarSkeleton';
import { NewProductProps, ProductVariant } from '@/types/interfaces';
import { Skeleton } from '../ui/skeleton';


function MegaManu({ children }: { children: React.ReactNode }) {

    const [slug, setslug] = useState('')
    const [gender, setGender] = useState('WOMEN')
    const [selectProducts, setProducts] = useState<NewProductProps>()
    const [allGenderProducts, setGenderProducts] = useState<any>()


    const { data: collections = [], isLoading: collectionloading, isError: collectionerror } = useQuery({
        queryKey: ["megamanucollections"],
        queryFn: getAllCollections,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (Array.isArray(collections)) {
            if (collections?.length > 0) {
                const firstSlug = collections[0]?.slug;
                if (firstSlug && firstSlug !== slug) {
                    setslug(firstSlug);
                }
            }
        }
    }, [collections,slug]); // removed slug and gender from here

    useEffect(() => {
        if (Array.isArray(collections)) {
            const filtercollection = collections.filter((item) => item.gender === gender);
            setGenderProducts(filtercollection);
        }
    }, [ collections,gender]);


    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ["megamanuslugdata", slug],
        enabled: !!slug,
        queryFn: () => getProductBaseOnCollection(slug),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    useEffect(() => {
        if (products && products.length > 0) {
            if (selectProducts?.id !== products[0].id) {
                setProducts(products[0]);
            }
        }
    }, [products, selectProducts]);

    function selectProductBaseOnCategory(slug: string) {
        const p = products?.find((product) => {
            if (product.slug == slug) return product;
        })
        setProducts(p)
    }

    // useEffect(()=>{

    //     const  filterCollection =collections?.filter((item:any,index)=>{
    //         console.log(item,"this is gender value")
    //         return item.gender==gender
    //     })
    //     setGenderProducts(filterCollection)
    //     console.log(filterCollection)

    // },[collections])


    return (

        <>
            <li className="relative group  py-2">
                <button
                    className=" bg-transparent font-normal text-black p-0 text-lg flex items-center  "
                    aria-haspopup="true"
                >
                    {children}
                    <MdKeyboardArrowDown className='text-[20px] ' />
                </button>
                <div
                    className="absolute -left-[400px] 2xl:-left-[500px]  top-3 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[1000px] 2xl:min-w-[1200px] flex flex-col gap-5 transform"

                >
                    <div
                        className="relative top-6 p-6 bg-white rounded-xl shadow-xl w-full"
                    >
                        <div
                            className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 translate-x-0 transition-transform group-hover:translate-x-[25rem] 2xl:group-hover:translate-x-[32rem] duration-500 ease-in-out rounded-sm"
                        ></div>
                        <div className="relative z-10 flex flex-col gap-10">
                            <div className="grid grid-cols-[.7fr_.7fr_.7fr_2fr]  gap-6 w-full ">
                                <div>
                                    <p
                                        className="uppercase tracking-wider text-primary font-medium border-b py-3 text-[13px] "
                                    >
                                        Product For
                                    </p>
                                    <ul className="mt-3 w-full realtive h-[300px] flex flex-col gap-1  overflow-hidden overflow-y-auto items-start justify-start   " id='style-4'>
                                        <li className={`text-sm  capitalize font-medium hover:bg-gray-100 w-full cursor-pointer  py-1 px-2 flex items-center gap-1 ${gender == "WOMEN" && " bg-gray-100 "}`} onMouseEnter={() => setGender("WOMEN")}>WOMEN</li>
                                        <li className={`text-sm  capitalize font-medium hover:bg-gray-100  w-full  cursor-pointer  py-1 px-2 flex items-center gap-1 ${gender == "MEN" && "bg-gray-100 "}`} onMouseEnter={() => setGender("MEN")}>MEN</li>
                                        <li className={`text-sm  capitalize font-medium hover:bg-gray-100  w-full  cursor-pointer  py-1 px-2 flex items-center gap-1 ${gender == "KIDS" && "bg-gray-100 "}`} onMouseEnter={() => setGender("KIDS")}>KIDS</li>
                                    </ul>
                                </div>
                                <div>
                                    <p
                                        className="uppercase tracking-wider text-primary font-medium border-b pb-2 text-[13px] "
                                    >
                                        Our Collection
                                    </p>
                                    <ul className="mt-3 w-full realtive h-[300px] flex flex-col gap-1  overflow-hidden overflow-y-auto   " id='style-4'>
                                        {
                                            Array.isArray(allGenderProducts) && allGenderProducts?.map((item, index) => (
                                                <Link href={`/collections/${`${item.gender}`.toLowerCase()}/${item?.slug}`} className={`text-sm  capitalize font-medium hover:bg-gray-100  cursor-pointer  py-1 px-2 flex items-center gap-1 ${item.slug == slug ? "bg-gray-200" : "bg-transparent"} `} onMouseEnter={() => setslug(item?.slug)} key={index} >
                                                    {item.name}
                                                </Link>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <p
                                        className="uppercase tracking-wider line-clamp-1 text-primary font-medium border-b pb-2 text-[13px]"
                                    >
                                        Products - {slug}
                                    </p>
                                    <ul className="mt-3 w-full realtive h-[300px] flex flex-col gap-1  overflow-hidden overflow-y-auto  " id='style-4'>
                                        {
                                            products &&
                                                products?.length > 0 ?
                                                products?.map((item, index) => (
                                                    <Link href={`/product/${item.slug}`.toLowerCase()} className={`text-sm  capitalize font-medium hover:bg-gray-100  cursor-pointer  py-1 px-2 flex items-center gap-1 ${selectProducts?.slug == item.slug ? "bg-gray-100" : "bg-transparent"} `} key={index} onMouseEnter={() => selectProductBaseOnCategory(item.slug)} >
                                                        {item.name}
                                                    </Link>
                                                ))
                                                :
                                                <Skeleton className="h-5   max-w-full " />

                                        }
                                    </ul>
                                </div>
                                <div>
                                    <p
                                        className="uppercase tracking-wider text-primary font-medium border-b pb-2 text-[13px]"
                                    >
                                        Products
                                    </p>

                                    <ul className="mt-4 text-[15px] grid grid-cols-3 xl:grid-cols-3 h-[300px] gap-2  items-start justify-start overflow-hidden overflow-y-auto">
                                        {
                                            isLoading ?
                                                <>
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />

                                                </>
                                                :
                                                products && products?.length > 0 ?
                                                    selectProducts?.product_variants?.map((product: ProductVariant, index) => (
                                                        <MegamanuCard product={product} key={index} slug={selectProducts.slug} name={selectProducts.slug} />
                                                    ))
                                                    :
                                                    <>
                                                        <MegaManuCarSkeleton />
                                                        <MegaManuCarSkeleton />
                                                        <MegaManuCarSkeleton />
                                                        <MegaManuCarSkeleton />
                                                    </>
                                        }

                                    </ul>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}

export default MegaManu
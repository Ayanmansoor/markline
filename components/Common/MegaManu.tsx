'use client'
import React, { useEffect, useState } from 'react'

import MegamanuCard from './MegamanuCard';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useQuery } from 'react-query';
import { fetchGroupOfProducts, getAllCollections, getProductBaseOnCollection } from '@/Supabase/SupabaseApi';
import Link from 'next/link';
import MegaManuCarSkeleton from '../Skeleton/MegaManuCarSkeleton';
import { NewProductProps, newProductsProps, ProductVariant } from '@/types/interfaces';
import { Skeleton } from '../ui/skeleton';


function MegaManu({ children }: { children: React.ReactNode }) {

    const [slug, setslug] = useState('')
    const [gender, setGender] = useState('WOMEN')
    const [selectProducts, setProducts] = useState<NewProductProps>()
    const [allGenderProducts, setGenderProducts] = useState<any>()


    const { data: collections = { data: [] }, isLoading: collectionloading, isError: collectionerror } = useQuery<{ data: any[] }>({
        queryKey: ["megamanucollections"],
        queryFn: () => getAllCollections('ALL'),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (Array.isArray(collections.data)) {
            if (collections?.data?.length > 0) {
                const firstSlug = collections.data[0]?.slug;
                if (firstSlug) {
                    setslug(firstSlug);
                }
            }
        }
    }, [collections, slug]); // removed slug and gender from here

    useEffect(() => {
        if (Array.isArray(collections.data)) {
            const filtercollection = collections.data.filter((item) => item.gender === gender);
            setGenderProducts(filtercollection);
        }
    }, [gender, slug]);


    // const { data: products = [], isLoading, isError } = useQuery({
    //     queryKey: ["megamanuslugdata", slug],
    //     enabled: !!slug,
    //     queryFn: () => getProductBaseOnCollection(slug),
    //     staleTime: Infinity,
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: false,
    // });




    // useEffect(() => {
    //     if (products && products.length > 0) {
    //         if (selectProducts?.id !== products[0].id) {
    //             setProducts(products[0]);
    //         }
    //     }
    // }, [products, selectProducts]);

    // function selectProductBaseOnCategory(slug: string) {
    //     const p = products?.find((product) => {
    //         if (product.slug == slug) return product;
    //     })
    //     setProducts(p)
    // }


    const { data: groupOfProducts = { data: [] }, isLoading: isLoading, isError: iserror } = useQuery<{ data: newProductsProps[] }>({
        queryKey: ["groupOfProducts"],
        queryFn: () => fetchGroupOfProducts("BEST_SELLER"),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });


    console.log(groupOfProducts.data, "thjs is ")


    return (

        <>
            <li className="relative group  py-2">
                <button
                    className=" bg-transparent font-normal text-black p-0 text-lg flex items-center  "
                    aria-haspopup="true"
                >
                    {children}

                </button>
                <div
                    className="absolute  -left-36 top-5 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[calc(100vw-100px)] 2xl:min-w-[calc(100vw-100px)] flex flex-col gap-5 transform"

                >
                    <div
                        className="relative top-6 p-6 bg-white rounded-xl shadow-xl w-full"
                    >
                        <div
                            className="w-10 h-5 bg-white transform rotate-45 absolute top-0 z-0 translate-x-0 transition-transform group-hover:translate-x-[14rem] 2xl:group-hover:translate-x-[14rem] duration-500 ease-in-out rounded-sm"
                        ></div>
                        <div className="relative z-10 flex flex-col gap-10">
                            <div className="grid grid-cols-[.7fr_.7fr_2fr] items-start justify-start gap-6 w-full ">
                                <div>
                                    <p
                                        className="uppercase tracking-wider text-primary font-medium border-b py-3 text-[13px] "
                                    >
                                        Product For
                                    </p>
                                    <ul className=" w-full realtive h-[300px] flex flex-col gap-1  overflow-hidden overflow-y-auto items-start justify-start   " id='style-4'>
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
                                        className="uppercase w-full relative tracking-wider text-primary font-medium border-b pb-2 text-[13px]"
                                    >
                                        Best Seller&apos;s
                                    </p>

                                    <ul className="mt-4 text-[15px] w-full relative grid grid-cols-3 2xl:grid-cols-5 h-[300px] gap-2  items-start justify-start overflow-hidden overflow-y-auto">
                                        {
                                            isLoading ?
                                                <>
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />
                                                    <MegaManuCarSkeleton />

                                                </>
                                                :
                                                groupOfProducts?.data?.length > 0 ? (
                                                    groupOfProducts?.data?.map((item: any, index: number) => (
                                                        item.products?.length > 0 &&
                                                        item.products.map((product: any, index) => (
                                                            <MegamanuCard
                                                                product={product.product_variants[0]}
                                                                key={`${index}`}
                                                                slug={product.slug}
                                                                name={product.name}
                                                            />
                                                        ))


                                                    ))
                                                )




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
            </li >
        </>
    )
}

export default MegaManu

//  
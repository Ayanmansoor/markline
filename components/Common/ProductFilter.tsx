'use client'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import Link from 'next/link'
import { ProdcutFilterProps } from '@/types/interfaces'
import { Slider } from '../ui/slider'

function ProductFilter({ collection, productRangevalue, setPRoductRange ,gender }: ProdcutFilterProps) {

    function changeFilterRangeValue(newValue: any) {
        setPRoductRange(newValue)
    }

    return (
   
            <div className='w-full relative  flex h-fit bg-transparent flex-col items-start  lg:px-2'>
                <Accordion type="single" collapsible className='w-full relative h-auto bg-transparent'>
                    <AccordionItem value="item-1" className="w-full relative h-auto" >
                        {
                            collection.length > 0 &&
                            (

                                <><AccordionTrigger className="w-full relative h-auto py-2 text-base font-semibold  px-4">
                                    <span>
                                        Collections
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="w-full relative h-auto py-2 text-base font-semibold  px-4 flex flex-wrap gap-2 ">
                                        {collection?.map((item, index) => (
                                            <Link href={`/collections/${gender}/${item.slug}`} className='text-base font-medium text-black border border-black px-3 py-1' key={index}>{item.name}</Link>
                                        ))}
                                    </AccordionContent></>
                            )
                        }
                    </AccordionItem>
                    <AccordionItem value="item-2" className="w-full relative h-auto">
                        <AccordionTrigger className="w-full relative h-auto py-2 text-base font-semibold  px-4">
                            <span>
                                Sizes
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="w-full relative h-auto py-2 text-base font-medium flex flex-wrap gap-2 px-4 ">
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>5</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>6</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>7</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>8</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>9</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>10</span>
                            <span className='text-base font-medium text-black border border-black px-3 py-1'>11</span>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="w-full relative h-auto">
                        <AccordionTrigger className="w-full relative h-auto py-2 text-base font-semibold  px-4">
                            <span>
                                Price
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="w-full relative h-auto py-2 text-base  flex flex-wrap  font-medium px-4 ">
                            <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                                <span className=' text-xs  sm:text-sm md:text-base px-1 md:px-2 rounded-full  font-medium text-primary border bg-transparent border-primary'>Minimum</span>
                                <span className='text-xs  sm:text-sm md:text-base font-medium text-primary border bg-transparent border-primary rounded-full px-1 md:px-2 '>maximum</span>
                            </div>
                            <div className='w-full relative h-auto  flex flex-col gap-2'>
                                <Slider className="mt-4 max-w-full" defaultValue={[productRangevalue]}
                                    max={5000}
                                    step={1}
                                    onValueChange={changeFilterRangeValue}

                                />
                                <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                                    <span className='text-sm px-2 rounded-full  font-medium text-primary border bg-transparent border-primary'>₹{productRangevalue}</span>
                                    <span className='text-sm font-medium text-primary border bg-transparent border-primary rounded-full px-2 '>₹5000</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="w-full relative h-auto">
                        <AccordionTrigger className="w-full relative h-auto py-2 text-base font-semibold  px-4">
                            <span>
                                Genders
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="w-full relative h-auto py-2 text-base  flex flex-wrap gap-2 font-medium px-4 ">
                            <Link href={"/products/men"} className='text-base font-medium text-black border border-black px-3 py-1' >MEN</Link>
                            <Link href={"/products/women"} className='text-base font-medium text-black border border-black px-3 py-1' >WOMEN</Link>
                            <Link href={"/products/kids"} className='text-base font-medium text-black border border-black px-3 py-1' >KIDS</Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
    )
}

export default ProductFilter
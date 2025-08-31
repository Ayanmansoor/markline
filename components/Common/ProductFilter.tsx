'use client'
import React, { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import Link from 'next/link'
import { ProdcutFilterProps } from '@/types/interfaces'
import { Slider } from '../ui/slider'


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { MdKeyboardArrowDown } from 'react-icons/md'


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


function ProductFilter({ collection, productRangevalue, setPRoductRange, gender, slug, colors, sizes, SetselectColorAndSizes }: ProdcutFilterProps) {

    const [selectedColor, setSelectedColor] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])

    function changeFilterRangeValue(newValue: any) {
        setPRoductRange(newValue)
    }

    function selectColor(color: string) {
        setSelectedColor(prev => {
            const newColors = prev.includes(color)
                ? prev.filter(c => c !== color) // toggle
                : [...prev, color];

            SetselectColorAndSizes((prevState: any) => ({
                ...prevState,
                color: newColors,
            }));

            return newColors;
        });
    }

    function selectSizes(size: string) {
        setSelectedSizes(prev => {
            const newSizes = prev.includes(size)
                ? prev.filter(s => s !== size) // toggle
                : [...prev, size];

            SetselectColorAndSizes((prevState: any) => ({
                ...prevState,
                size: newSizes,
            }));

            return newSizes;
        });
    }
    return (

        <div className='w-fit relative   flex h-fit bg-transparent  gap-10 items-start    lg:px-2'>
            <Swiper
                slidesPerView={'auto'}
                className="mySwiper w-full  relative h-auto "
            >
                <SwiperSlide className=' max-w-fit relative h-auto px-1 lg:px-2'>
                    <Popover>
                        <PopoverTrigger className=' text-sm md:text-base font-medium text-primary cursor-pointer  flex items-center gap-2'>Prices
                            <MdKeyboardArrowDown className=" text-[15px] md:text-[20px] text-primary" />
                        </PopoverTrigger>
                        <PopoverContent className=' max-w-[250px] md:max-w-[300px] relative h-auto bg-white px-6 py-6 rounded-md flex flex-col gap-3 '>
                            <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                                <span className='text-sm px-2 rounded-full  font-medium text-primary border bg-transparent border-primary'>₹{productRangevalue}</span>
                                <span className='text-sm font-medium text-primary border bg-transparent border-primary rounded-full px-2 '>₹5000</span>
                            </div>
                            <Slider className=" max-w-full" defaultValue={[productRangevalue]}
                                max={5000}
                                step={1}
                                onValueChange={changeFilterRangeValue}
                            />
                            <div className='w-full relative h-auto flex items-center justify-between gap-1'>
                                <span className=' text-sm   px-1 md:px-2 rounded-full  font-medium text-primary  bg-transparent border-primary'>Minimum</span>
                                <span className='text-sm   font-medium text-primary  bg-transparent border-primary rounded-full px-1 md:px-2 '>maximum</span>
                            </div>
                        </PopoverContent>
                    </Popover>
                </SwiperSlide>
                <SwiperSlide className=' max-w-fit relative h-auto px-1 lg:px-2'>
                    <Popover>
                        <PopoverTrigger className='text-sm md:text-base font-medium text-primary cursor-pointer  flex items-center gap-2'>Sizes
                            <MdKeyboardArrowDown className=" text-[15px] md:text-[20px] text-primary" />
                        </PopoverTrigger>

                        <PopoverContent className={` max-w-[250px] md:max-w-[300px] relative h-auto bg-white rounded-md `} >
                            <ul className='w-full relative h-auto grid grid-cols-2 md:grid-cols-3 gap-2 '>
                                {
                                    sizes.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`px-3 md:px-5 py-2 text-center cursor-pointer border 
                                          ${selectedSizes.includes(item.size) ? "border-blue-500" : "border-gray-200"}`}
                                            onClick={() => selectSizes(item.size)}
                                        >
                                            {item.size}{item.unit}
                                        </li>
                                    ))
                                }
                            </ul>
                        </PopoverContent>

                    </Popover>
                </SwiperSlide>
                <SwiperSlide className=' max-w-fit relative h-auto px-1 lg:px-2'>

                    <Popover>
                        <PopoverTrigger className='text-sm md:text-base font-medium text-primary cursor-pointer  flex items-center gap-2'>Colors
                            <MdKeyboardArrowDown className=" text-[15px] md:text-[20px] text-primary" />
                        </PopoverTrigger>
                        <PopoverContent className=' max-w-[250px] md:max-w-[300px] relative h-auto bg-white rounded-md'>
                            <ul className='w-full relative h-auto grid grid-cols-2 md:grid-cols-3 gap-2 '>
                                {
                                    colors.map((item, index) => (
                                        <li
                                            key={index}

                                            className={`px-5 py-4 cursor-pointer border 
                                            ${selectedColor.includes(item.name) ? "border-blue-500" : "border-gray-200"}`}
                                            onClick={() => selectColor(item.name)}
                                            style={{ background: `${item.hex}` }}
                                        />
                                    ))
                                }
                            </ul>
                        </PopoverContent>
                    </Popover>
                </SwiperSlide>
                <SwiperSlide className='  max-w-fit relative h-auto px-1 lg:px-2'>
                    <Popover >
                        <PopoverTrigger className='text-sm md:text-base font-medium text-primary cursor-pointer   items-center gap-2  hidden md:flex'>Discounts
                            <MdKeyboardArrowDown className=" text-[15px] md:text-[20px] text-primary" />
                        </PopoverTrigger>
                        <PopoverContent className=' max-w-[250px] md:max-w-[300px] relative h-auto bg-white px-5 py-2 rounded-md'>
                            Pink color
                        </PopoverContent>
                    </Popover>

                </SwiperSlide>
            </Swiper>



        </div>
    )
}

export default ProductFilter
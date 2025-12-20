'use client'
import React, { useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { RiArrowRightSLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
function SideBarNew() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <li className='h-fit w-fit relative block lg:hidden  rounded-sm p-[1px]  ' onClick={() => setOpen(true)}>
                    <RxHamburgerMenu className='text-primary text-[30px]' />
                </li>
            </SheetTrigger>

            <SheetContent className='p-0  ' >
                <SheetTitle className='text-2xl font-semibold text-primary  italic px-2  border-b  py-2 '>MARKLINE</SheetTitle>
                <ul className='w-full relative flex flex-col gap-2 items-start py-10 justify-start px-2 h-[100vh]'>
                    <Link href="/" onClick={handleClose} className="text-xl px-2 py-1 cursor-pointer text-primary font-medium border   flex items-center justify-between gap-0 w-full">Home
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <span className='w-full relative border  px-2 py-1'>
                        <Accordion type="single" collapsible className='w-full relative h-auto '>
                            <AccordionItem value="item-1" className='w-full relative h-auto'>
                                <AccordionTrigger className="text-xl px-2 py-1 cursor-pointer text-primary font-medium    flex items-center justify-between gap-0 w-full">
                                    Collections
                                </AccordionTrigger>
                                <AccordionContent className='w-full relative flex flex-col gap-2 items-start py-5 justify-start px-1 h-fit'>
                                    <Link href="/collections/women" onClick={handleClose} className="text-lg cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Women&apos;s
                                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                                    </Link>
                                    <Link href="/collections/mens" onClick={handleClose} className="text-lg cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Men&apos;s
                                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                                    </Link>
                                    <Link href="/collections/kids" onClick={handleClose} className="text-lg cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Kids
                                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                                    </Link>
                                    <Link href="/collections/best-sellers" onClick={handleClose} className="text-xl cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Best Sellers
                                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </span>
                    <Link href="/products/women" onClick={handleClose} className="text-xl cursor-pointer px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">Products
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/new-arrivals" onClick={handleClose} className="text-xl cursor-pointer  px-2 py-1 text-primary font-medium border   flex items-center justify-between gap-0 w-full">New Arrivals
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/trending" onClick={handleClose} className="text-xl cursor-pointer text-primary px-2 py-1 font-medium border   flex items-center justify-between gap-0 w-full">Trending
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1' />
                    </Link>
                    <Link href="/about-us" onClick={handleClose} className="text-xl cursor-pointer text-primary font-medium border px-2 py-1   flex items-center justify-between gap-0 w-full">About us
                        <RiArrowRightSLine className='text-[40px] text-primary cursor-pointer border-l  px-1 py-1 ' />
                    </Link>
                </ul>
            </SheetContent>
        </Sheet>
    );
}

export default SideBarNew;
